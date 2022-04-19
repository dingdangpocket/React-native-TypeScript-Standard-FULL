/**
 * @file RequestBuilder
 * @author Eric Xu <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import ms from 'ms';
import {
  HttpResponseType,
  Params,
  RequestOptions,
  RestfulService,
  UploadProgressListener,
} from './types';

export type TransformFn = (x: any) => any;
export type FilterFn = (value: any, index: number, array: any[]) => any;

/**
 * @class a simple request class builder.
 */
export class RequestBuilder {
  _api: RestfulService;
  _method: string | null | undefined;
  _json: boolean;
  _responseType: HttpResponseType | undefined;
  _url: string;
  _data: any;
  _transformFn?: TransformFn;
  _filterFn?: FilterFn;
  _cache?: boolean | number;
  _cacheKey?: string | null;
  _timeout?: number;
  _auth: boolean;
  _raw: boolean;
  _progressListener?: UploadProgressListener;
  _abortController?: AbortController;

  constructor(api: RestfulService, method?: string) {
    this._api = api;
    this._method = method;
    this._json = true;
    this._auth = true; // require authentication by default.
    this._raw = false;
    this._url = '';
  }

  /**
   * Set the url for the request.
   * @param {String} url the url optionally w/ parameters.
   * @param {Object} [args] url parameters.
   * @param {String} [apiEndPoint] api end point.
   * @returns {RequestBuilder} return self for further chaining.
   */
  url(url: string, args?: Params, apiEndPoint?: string): this {
    this._url = this._api.url(url, args, apiEndPoint);
    return this;
  }

  /**
   * Set the response type.
   * @param responseType {HttpResponseType} response type
   */
  responseType(responseType: HttpResponseType): this {
    this._responseType = responseType;
    return this;
  }

  /**
   * Set the request as a raw request.
   * @returns {RequestBuilder} return self for further chaining.
   */
  raw(): this {
    this._raw = true;
    return this;
  }

  /**
   * Set the data for the request.
   * @param {Object} data the data to send.
   * @param {Boolean} [json] if send the data as json.
   * @returns {RequestBuilder} return self for further chaining.
   */
  data(data: any, json?: boolean): this {
    this._data = data;
    this._json = json !== false;
    return this;
  }

  /**
   * Set the cacheability of the request.
   * @param {Boolean} cache if the request should be cached.
   * @param {String} key cache key
   * @returns {RequestBuilder} return self for further chaining.
   */
  cache(cache: boolean | number | string = true, key?: string): this {
    if (typeof cache === 'string') {
      cache = ms(cache) as number; // convert string to milliseconds.
    }
    this._cache = cache;
    this._cacheKey = key;
    return this;
  }

  /**
   * Set the timeout of the request.
   * @param {Number} timeout timeout in milliseconds.
   * @returns {RequestBuilder} return self for further chaining.
   */
  timeout(timeout: number): this {
    this._timeout = timeout;
    return this;
  }

  /**
   * Set the transform function for the response.
   * @param {TransformFn} transformFn response transform function.
   *   if the response is an array, the transformFn is called for
   *   each item. otherwise, the transformFn is called for the
   *   response itself.
   */
  transform(transformFn: TransformFn): this {
    this._transformFn = transformFn;
    return this;
  }

  /**
   * Set the filter function for the response.
   * @param {FilterFn} filterFn the filter function
   * @returns {RequestBuilder}
   */
  filter(filterFn: FilterFn): this {
    this._filterFn = filterFn;
    return this;
  }

  /**
   * Set if the request requires user authenticated.
   * @param {boolean} [auth = true]
   * @returns {RequestBuilder}
   */
  auth(auth = true) {
    this._auth = auth;
    return this;
  }

  /**
   * Set the upload progress listener.
   * @param {UploadProgressListener} listener progress event listener.
   */
  onUploadProgress(listener?: UploadProgressListener) {
    this._progressListener = listener;
    return this;
  }

  /**
   * Set the external abort controller.
   * @param {AbortController} abortController
   * @returns
   */
  withAbortController(abortController?: AbortController) {
    this._abortController = abortController;
    return this;
  }

  /**
   * Send the request.
   * @returns {Promise<T>}
   */
  async future<T>(): Promise<T> {
    const options: RequestOptions = {
      url: this._url,
      method: (this._method ?? 'GET') as any,
      json: this._json,
      responseType: this._responseType,
      data: this._data,
      transformFn: this._transformFn,
      filterFn: this._filterFn,
      cache: this._cache,
      cacheKey: this._cacheKey,
      timeout: this._timeout,
      auth: this._auth,
      raw: this._raw,
      uploadProgressListener: this._progressListener,
      abortController: this._abortController,
    };
    return await this._api.request(options);
  }
}
