import request from "../request";
import type { ApiResponse, ChartItem, PageResult } from "@/types/api";
interface ListType {
  page: number;
  pageSize: number;
  name?: string;
}
export interface RevenueRecord {
  name: string;
  id: string;
  city: string;
  count: number;
  electricity: number | string;
  parkingFee: number | string;
  serviceFee: number | string;
  member: number | string;
  growth_percent: number;
  monthly_income: number;
  month_growth_percent: number;
}
// 营收统计图表接口
export function chartApi() {
  return request.get<ApiResponse<{ list: ChartItem[] }>>("/charging/revenueChart");
}
// 营收表格分页查询接口
export function revenueTableList(data: ListType) {
  return request.post<ApiResponse<PageResult<RevenueRecord>>>("/charging/revenueTableList", data);
}
