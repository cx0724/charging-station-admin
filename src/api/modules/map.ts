import requst from "../request";
import type { ApiResponse } from "@/types/api";
export interface MapMarker {
  position: [number, number];
  [key: string]: unknown;
}
// 电子地图接口
export function mapList() {
  return requst.get<ApiResponse<MapMarker[]>>("/map/maplist");
}
