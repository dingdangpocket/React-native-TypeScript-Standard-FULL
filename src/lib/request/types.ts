/**
 * @file: types.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export type Params = {
  [p: string]: any;
};

export type HTTPHeaders = { [key: string]: string };

export type HttpResponseType = 'text' | 'json' | 'blob' | 'arraybuffer';

export type UploadProgressListener = (e: ProgressEvent) => void;
export interface RequestOptions {
  url: string;
  method:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT';
  json?: boolean;
  responseType?: HttpResponseType;
  cache?: boolean | number;
  cacheKey?: string | null | undefined;
  data?: any;
  transformFn?: (x: any) => any;
  filterFn?: (value: any, index: number, array: any[]) => any;
  headers?: HTTPHeaders;
  timeout?: number;
  useCached?: boolean;
  auth?: boolean;
  raw?: boolean;
  uploadProgressListener?: UploadProgressListener;
  abortController?: AbortController;
}

export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'OPTIONS'
  | 'DELETE'
  | 'HEAD'
  | 'TRACE'
  | 'CONNECT';

export interface FetchResponse {
  errMsg?: string;
  data: object | string | ArrayBuffer;
  statusCode: number;
  header: { [name: string]: string };
}

export interface FetchParams {
  url: string;
  init: RequestInit;
}

export interface RestfulService {
  url(url: string, args?: Params, apiEndPoint?: string): string;
  request(options: RequestOptions): Promise<any>;
}

export interface RequestContext {
  options: RequestOptions;
  url: string;
  init: RequestInit;
}

export interface ResponseContext {
  url: string;
  init: RequestInit;
  response: Response;
}
