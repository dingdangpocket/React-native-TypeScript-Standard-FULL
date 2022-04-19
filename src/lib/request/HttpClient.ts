import { CacheService } from '@euler/lib/services';
import { joinPath } from '@euler/utils';
import extend from 'extend';
import qs from 'qs';
import { Middleware } from './Middleware';
import { RequestBuilder } from './RequestBuilder';
import {
  Params,
  RequestContext,
  RequestOptions,
  ResponseContext,
} from './types';
import {
  fetchWithUploadProgressListener,
  makeRequestError,
  resolveContentTypeHeader,
} from './util';

interface HttpClientOptions {
  endPoint?: string;
  prefix?: { url: string; params?: Params };
  timeout?: number;
  middlewares?: Middleware[];
}

export class HttpClient {
  static readonly DefaultRequestTimeout = 60;

  private readonly middlewares: Middleware[] = [];

  constructor(
    private readonly cache: CacheService,
    private readonly options: HttpClientOptions = {},
  ) {
    if (options.middlewares) {
      this.middlewares.push(...options.middlewares);
    }
  }

  withMiddleware(...middlewares: Middleware[]): this {
    this.middlewares.push(...middlewares);
    return this;
  }

  /**
   * GET request.
   * @returns {RequestBuilder}
   */
  get(): RequestBuilder {
    return new RequestBuilder(this, 'GET');
  }

  /**
   * POST request.
   * @returns {RequestBuilder}
   */
  post(): RequestBuilder {
    return new RequestBuilder(this, 'POST');
  }

  /**
   * PUT request.
   * @returns {RequestBuilder}
   */
  put(): RequestBuilder {
    return new RequestBuilder(this, 'PUT');
  }

  /**
   * PATCH request.
   * @returns {RequestBuilder}
   */
  patch(): RequestBuilder {
    return new RequestBuilder(this, 'PATCH');
  }

  /**
   * DELETE request.
   * @returns {RequestBuilder}
   */
  delete() {
    return new RequestBuilder(this, 'DELETE');
  }

  /**
   * Build api request url.
   * @param {String} pathOrUrl the relative path or url.
   * @param {Object} [args] parameters to set for the `path`.
   * @param {String} userApiEndPoint user supplied api endpoint.
   * @return {String} the final url to send request for
   * @desc variables like `:param` in `path` will replaced by
   *   values given in `args`, other values will be appended to
   *   the final url as query parameters.
   */
  url(pathOrUrl: string, args?: Params, userApiEndPoint?: string): string {
    const url = this._url(pathOrUrl, args);

    const endPoint =
      userApiEndPoint ??
      (typeof this.options.endPoint === 'string' ? this.options.endPoint : '');

    const prefix =
      this.options.prefix &&
      this._url(this.options.prefix.url, this.options.prefix.params);

    return joinPath(endPoint, prefix ?? '', url);
  }

  /**
   * Send API call request.
   * @param {Object} options the request configuration.
   * @returns {Promise} $http response
   */
  async request<T>(options: RequestOptions): Promise<T | undefined> {
    options = extend(
      {
        method: 'GET',
        cache: false,
      },
      options,
    );

    if (options.cache && !options.cacheKey) {
      options.cacheKey = `_req_${options.url}`;
    }

    if (
      /^get$/i.test(options.method) &&
      (options.useCached === true ||
        (options.useCached !== false &&
          options.cache &&
          typeof options.cache === 'number' &&
          options.cache > 0))
    ) {
      // try to load the result from cache.
      return await this.cache.get<T>(options.cacheKey!).then(result => {
        if (options.useCached === true || result !== void 0) {
          return Promise.resolve(result);
        }
        return undefined;
      });
    }

    let body: FormData | string | undefined = undefined;

    if (options.data) {
      // add appropriate content-type header if not present.
      if (!options.json) {
        if (options.data instanceof FormData) {
          this.setContentType(options, 'multipart/form-data');
          body = options.data;
        } else {
          this.setContentType(options, 'application/x-www-form-urlencoded');
          body = qs.stringify(options.data);
        }
      } else {
        this.setContentType(options, 'application/json');
        body = JSON.stringify(options.data);
      }
    }

    const url = options.url;

    if (!options.headers) {
      options.headers = {};
    }

    options.headers['X-XHR'] = 'true';

    // request with fetch by default.
    const abortController = options.abortController ?? new AbortController();

    const init: RequestInit = {
      method: options.method,
      headers: options.headers,
      body,
      signal: abortController.signal,
    };

    const requestContext: RequestContext = {
      options,
      url,
      init,
    };

    for (const middleware of this.middlewares) {
      if (middleware.pre) {
        await middleware.pre(requestContext);
      }
    }

    const response =
      body instanceof FormData && options.uploadProgressListener
        ? await fetchWithUploadProgressListener(
            url,
            init,
            body,
            options.uploadProgressListener,
          )
        : await fetch(requestContext.url, requestContext.init);

    const responseContext: ResponseContext = {
      url,
      init,
      response,
    };

    for (const middleware of this.middlewares) {
      if (middleware.post) {
        await middleware.post(responseContext);
      }
    }

    const timer = setTimeout(() => {
      abortController.abort();
    }, options.timeout ?? HttpClient.DefaultRequestTimeout);

    try {
      return await this.handleResponse(response, options);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Set the content type header for the request.
   * @param {Object} options request options
   * @param {String} contentType the content type to set.
   */
  private setContentType(options: RequestOptions, contentType: string): void {
    const contentTypeHeader = resolveContentTypeHeader(options.headers);
    if (!options.headers) options.headers = {};
    options.headers[contentTypeHeader] = contentType;
  }

  private async handleResponse(
    response: Response,
    options: RequestOptions,
  ): Promise<any> {
    if (!response.ok || response.status < 200 || response.status >= 300) {
      const error = await this.handleError(response, options);
      throw error;
    }

    if (options.raw) {
      return await response.text();
    }

    const { contentType, data } = await this.getResponseData(response, options);

    let result: any = undefined;

    if (data && contentType.includes('json') && 'code' in data) {
      result = data.response;

      // apply result filter.
      if (options.filterFn && result && Array.isArray(result)) {
        result = result.filter(options.filterFn);
      }

      // apply result transformer.
      if (options.transformFn && result) {
        if (Array.isArray(result)) {
          const len = result.length;
          for (let i = 0; i < len; i++) {
            const item = result[i];
            const ret = options.transformFn(item);
            if (ret !== void 0 && ret !== item) {
              result[i] = ret;
            }
          }
        } else {
          const ret = options.transformFn(result);
          if (ret !== void 0 && ret !== result) {
            result = ret;
          }
        }
      }
    }

    if (
      /^get$/i.test(options.method) &&
      options.cache &&
      typeof options.cache === 'number' &&
      options.cache > 0
    ) {
      await this.cache.set(options.cacheKey!, result, options.cache);
    }

    return result;
  }

  private async getResponseData(
    response: Response,
    options: RequestOptions,
  ): Promise<{ contentType: string; data: any }> {
    const contentType = response.headers.get('content-type') ?? '';

    if (
      options.responseType === 'json' ||
      contentType.includes('application/json')
    ) {
      return {
        contentType: 'application/json',
        data: await response.json(),
      };
    }
    if (options.responseType === 'arraybuffer') {
      return {
        contentType: contentType || 'application/octet-stream',
        data: await response.arrayBuffer(),
      };
    }
    if (options.responseType === 'blob') {
      return {
        contentType: contentType || 'application/octet-stream',
        data: await response.blob(),
      };
    }

    return {
      contentType: contentType || 'text/plain',
      data: await response.text(),
    };
  }

  private async handleError(
    response: Response,
    options: RequestOptions,
  ): Promise<Error> {
    const contentType = response.headers.get('content-type');

    // if the status is 0, the request is not completed.
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status
    if (
      response.status === 0 ||
      contentType?.indexOf('application/json') !== 0
    ) {
      return await this.handleNetworkError(response, options);
    }

    if (
      options.responseType === 'json' ||
      contentType?.includes('application/json')
    ) {
      try {
        const textResult = await response.text();
        if (textResult) {
          const result = JSON.parse(textResult);
          return makeRequestError(result, response);
        }
      } catch (e) {
        // should be network issues.
        return await this.handleNetworkError(
          response,
          options,
          `Error parse json data: ${(e as Error).message}`,
        );
      }
    }

    throw makeRequestError({ message: 'request failure' }, response);
  }

  private async handleNetworkError(
    response: Response,
    _options: RequestOptions,
    message?: string | null,
  ): Promise<Error> {
    const code = String(response.status);
    const defaultMsg =
      response.status === 0
        ? 'The network connection is unavailable for now.'
        : 'The service is temporarily unavailable: ' + `${response.status}. `;
    const msg = message ?? defaultMsg;
    throw makeRequestError({ code, msg }, response);
  }

  private _url(pathOrUrl: string, args: { [key: string]: any } = {}): string {
    const exclude: { [key: string]: boolean } = {};

    let url = pathOrUrl.replace(/:[a-z_][a-z0-9_]*/gi, m => {
      const key = m.substr(1);
      if (Object.prototype.hasOwnProperty.call(args, key)) {
        exclude[key] = true;
        if (args[key] === void 0) {
          throw new Error(
            `could not resolve url parameter ':${key}' in url '${pathOrUrl}'`,
          );
        }
        return args[key];
      } else {
        return m;
      }
    });

    const query: { [key: string]: any } = {};
    for (const p in args) {
      if (!exclude[p]) {
        query[p] = args[p];
      }
    }

    const queryString = qs.stringify(query);
    if (queryString) {
      url += '?' + queryString;
    }
    return url;
  }
}
