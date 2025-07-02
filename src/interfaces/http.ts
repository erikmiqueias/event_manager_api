export interface IHttpRequest {
  body?: any;
  params?: any;
  query?: any;
  file?: any;
}

export interface IHttpResponse<B> {
  statusCode: number;
  body: B | string | null;
}
