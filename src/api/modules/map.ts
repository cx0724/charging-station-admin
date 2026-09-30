import requst from "../request";
import type { ApiResponse } from "@/types/api";
// 电子地图接口
export function mapList() {
  return requst.get<ApiResponse>("/map/maplist");
}
