/**
 * @file ApiServiceHelper
 * @author Eric Xu <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as whatwgFetch from 'whatwg-fetch';
import { HttpError } from './HttpError';
import { UploadProgressListener } from './types';

export const CONTENT_TYPE = 'Content-Type';

const __global__ =
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  (typeof global !== 'undefined' && global) ||
  {};

const support = {
  searchParams: 'URLSearchParams' in __global__,
  iterable: 'Symbol' in __global__ && 'iterator' in Symbol,
  blob:
    'FileReader' in __global__ &&
    'Blob' in __global__ &&
    (function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    })(),
  formData: 'FormData' in __global__,
  arrayBuffer: 'ArrayBuffer' in __global__,
};

export let DOMException: any = global.DOMException;
try {
  new DOMException();
} catch (err) {
  DOMException = function (this: any, message: string, name: string) {
    this.message = message;
    this.name = name;
    const error = Error(message);
    this.stack = error.stack;
  };
  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

// resolve content type header from the given headers collection.
export function resolveContentTypeHeader(
  headers: { [name: string]: string } | undefined | null,
) {
  if (!headers) return CONTENT_TYPE;
  for (const p in headers) {
    if (
      Object.prototype.hasOwnProperty.call(headers, p) &&
      /^content-type$/i.test(p)
    ) {
      return p;
    }
  }
  return CONTENT_TYPE;
}

// make http response error info object.
export function makeRequestError(
  result: { code?: string; msg?: string; message?: string; response?: any },
  response?: Response,
) {
  const { code, msg, message } = result;
  const err = new HttpError(msg ?? message);
  err.code = code ?? 'unknown';
  if (response) {
    err.status = response.status;
    err.response = result.response;
  }
  return err;
}

export function appendQueryString(url: string, name: string, value: any) {
  const index = url.indexOf('?');
  if (index < 0) url += '?';
  else if (index < url.length) url += '&';
  url += `${name}=${encodeURIComponent(value)}`;
  return url;
}

export function isBufferLikeContentType(contentType: string) {
  if (/^application\/.*?(?:json|xml).*?/i.test(contentType)) return false;
  if (/^application\/(?:vnd|octet)/i.test(contentType)) return true;
  if (/^text\//i.test(contentType)) return false;
  if (/^(?:image|audio|vidio|font)/i.test(contentType)) return true;
  return true;
}

export function parseHeaders(rawHeaders: string): Headers {
  const headers = new whatwgFetch.Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751
  preProcessedHeaders
    .split('\r')
    .map(function (header) {
      return header.startsWith('\n') ? header.substr(1, header.length) : header;
    })
    .forEach(function (line) {
      const parts = line.split(':');
      const key = parts.shift()!.trim();
      if (key) {
        const value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
  return headers;
}

export async function fetchWithUploadProgressListener(
  input: string,
  init: RequestInit,
  formData: FormData,
  listener: UploadProgressListener,
): Promise<Response> {
  return await new Promise((resolve, reject) => {
    const request = new whatwgFetch.Request(input, init) as Request;

    if (request.signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const xhr = new XMLHttpRequest();

    const abortXhr = () => {
      xhr.abort();
    };

    xhr.onload = () => {
      const options: any = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
        url: '',
      };
      options.url =
        'responseURL' in xhr
          ? xhr.responseURL
          : options.headers.get('X-Request-URL');
      const body = 'response' in xhr ? xhr.response : xhr.responseText;
      setTimeout(function () {
        resolve(new whatwgFetch.Response(body, options));
      }, 0);
    };

    xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
      try {
        listener(e);
      } catch {
        /* noop */
      }
    });

    xhr.onerror = function () {
      setTimeout(function () {
        reject(new TypeError('Network request failed'));
      }, 0);
    };

    xhr.ontimeout = function () {
      setTimeout(function () {
        reject(new TypeError('Network request failed'));
      }, 0);
    };

    xhr.onabort = function () {
      setTimeout(function () {
        reject(new DOMException('Aborted', 'AbortError'));
      }, 0);
    };

    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob';
      } else if (
        support.arrayBuffer &&
        request.headers
          .get('Content-Type')
          ?.includes('application/octet-stream')
      ) {
        xhr.responseType = 'arraybuffer';
      }
    }

    if (
      init.headers &&
      typeof init.headers === 'object' &&
      !(init.headers instanceof Headers) &&
      !(init.headers instanceof whatwgFetch.Headers)
    ) {
      Object.getOwnPropertyNames(init.headers).forEach(function (name) {
        xhr.setRequestHeader(name, normalizeValue((init.headers as any)[name]));
      });
    } else {
      request.headers.forEach(function (value: any, name: any) {
        xhr.setRequestHeader(name, value);
      });
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function () {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(formData);
  });
}

export function normalizeName(name: any): string {
  if (typeof name !== 'string') {
    name = String(name);
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError(
      'Invalid character in header field name: "' + name + '"',
    );
  }
  return name.toLowerCase();
}

export function normalizeValue(value: any): string {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value;
}
