export interface PileInfo {
  create_time: string;
  current: string;
  id: number;
  percent: number | null;
  pile_id: string;
  power: string;
  station_id: string;
  status: number;
  tem: string;
  update_time: string;
  voltage: string;
}
export interface ChargeInfo {
  charge_amount: number;
  charge_time: string;
  consume_amount: string;
  create_time: string;
  id: number;
  pile_id: string;
}
