import axios, { AxiosRequestConfig } from "axios";
export enum MethodType {
  GET = "get",
  POST = "post",
  DELETE = "delete",
}
export interface Request {
  path: string;
  methodType: MethodType;
}
export interface RequestOptions extends AxiosRequestConfig<any> {
  query?: any;
  data?: any;
  params?: any;
}
export const requester = async (request: Request, options?: RequestOptions) => {
  let url = request.path;
  if (options?.params) {
    for (let param in options.params) {
      url = url.replace(`:${param}`, options.params[param]);
    }
  }
  return await axios.request({
    ...options,
    url: process.env.NEXT_PUBLIC_API_URL + (url.startsWith("/") ? url : `/${url}`),
    method: request.methodType,
    data: options?.data,
    params: options?.query,
    headers: { userId: localStorage.getItem("userId") as string },
  });
};
