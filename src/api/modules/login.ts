import request from "../request";
import type { ApiResponse } from "@/types/api";
// 登录接口
export function loginApi(data: { username: string; password: string }) {
  return request.post<ApiResponse>("/users/login", data);
}
