import axiosInstance from "../axios";
import { AxiosResponse } from "axios";
import { Game, PieceType } from "../types";

export default async function postMove(gameId: string, x: number, y: number, y1: number, x1: number, upgradeType?: PieceType | ""): Promise<AxiosResponse<Game>> {
  const params = new URLSearchParams({
    x0: String(x),
    y0: String(y),
    x1: String(x1),
    y1: String(y1),
  });

  if (upgradeType) params.set("promotion", upgradeType);

  const res = await axiosInstance.post(`game/${gameId}/move?${params}`);
  return res;
}
