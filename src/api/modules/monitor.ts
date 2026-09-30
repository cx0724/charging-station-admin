import request from "../request";
import type { RuleForm } from "@/types/monitor.ts";
import type { ApiResponse, PageResult } from "@/types/api";
interface ListType {
  page: number;
  pageSize: number;
  name?: string;
  id?: string;
  status: number | string;
}

// 分页查询充电站列表接口
export function stationList(data: ListType) {
  return request.post<ApiResponse<PageResult<RuleForm>>>("/charging/stationList", data);
}
// 编辑充电站接口
export function editApi(data: RuleForm) {
  return request.post<ApiResponse>("/charging/edit", data);
}
// 编辑充电站接口
export function addApi(data: RuleForm) {
  return request.post<ApiResponse>("/charging/add", data);
}
// 根据充电站id删除充电站接口
export function deleteApi(data: { id: string | number }) {
  return request.post<ApiResponse>("/charging/delete", data);
}
