import request from "../request";
import type { ApiResponse } from "@/types/api";
interface ListType {
  page: number;
  pageSize: number;
  name?: string;
}
// 营收统计图表接口
export function chartApi() {
  return request.get<ApiResponse>("/charging/revenueChart");
}
// 营收表格分页查询接口
export function revenueTableList(data: ListType) {
  return request.post<ApiResponse>("/charging/revenueTableList", data);
}
