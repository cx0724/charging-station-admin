import request from "../request";
import type { ApiResponse, ChartItem } from "@/types/api";

// 能源统计折线图数据接口
export function chartData() {
  return request.get<ApiResponse<{ list: ChartItem[] }>>("/home/chartData");
}
// 营收占比饼图数据接口
export function chartData2() {
  return request.get<ApiResponse<{ list: Array<{ name: string; value: number }> }>>("/home/chartData2");
}
// 设备总览数据接口
export function chartData3() {
  return request.get<ApiResponse<{ list: number[] }>>("/home/chartData3");
}
