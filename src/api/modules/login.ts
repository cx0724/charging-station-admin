import request from "../request";
import type { ApiResponse } from "@/types/api";
import type { MenuItem } from "@/types/menu";

interface LoginData {
  token: string;
  user: { username: string };
  menulist: MenuItem[];
}
// 登录接口
export function loginApi(data: { username: string; password: string }) {
  return request.post<ApiResponse<LoginData>>("/users/login", data);
}
