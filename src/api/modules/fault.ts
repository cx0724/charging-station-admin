import request from "../request";
import type { ApiResponse } from "@/types/api";
import { type PileInfo, type ChargeInfo } from "@/types/fault";
interface StationList {
  page: number;
  pageSize: number;
  status?: string;
}
interface ChargingPileList {
  station_id: number | string;
  status: number | string;
}
interface StationListData {
  list: PileInfo[];
}
// 分页查询充电站列表接口
export function stationList(data: StationList) {
  return request.post<ApiResponse<StationListData>>(
    "/charging/stationList",
    data,
  );
}
// 根据充电站id/充电站状态查询充电桩状态数据接口
export function chargingPileList(data: ChargingPileList) {
  return request.post<ApiResponse<PileInfo[]>>(
    "/charging/chargingPileList",
    data,
  );
}
// 根据充电桩id查询使用记录
export function chargingPileUsageRecord(data: { pile_id: string }) {
  return request.post<ApiResponse<ChargeInfo[]>>(
    "/charging/chargingPileUsageRecord",
    data,
  );
}
