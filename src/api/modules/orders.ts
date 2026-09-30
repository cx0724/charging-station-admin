import request from "../request";
import type { ApiResponse, PageResult } from "@/types/api";
export interface RuleForm {
  orderNo: string;
  status: number | string;
  no: string;
  page: number;
  pageSize: number;
}
export interface OrderItem {
  id: number;
  order_no: string;
  equipment_no: string;
  date: string;
  start_time: string;
  end_time: string;
  money: number | string;
  pay: string;
  status: number;
}

// 订单管理订单列表分页查询接口
export function orderList(data: RuleForm) {
  return request.post<ApiResponse<PageResult<OrderItem>>>("/order/list", data);
}
// 根据订单号删除订单接口
export function del(data: { order_no: string }) {
  return request.post<ApiResponse>("/order/delete", data);
}
// 批量删除订单接口
export function deleteBatch(data: { order_no_list: Array<string> }) {
  return request.post<ApiResponse>("/order/deleteBatch", data);
}
