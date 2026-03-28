import axiosInstance from "../axios";
import { AxiosResponse } from "axios";
import { Game } from "../types";

export default async function postMove(gameId: string, x: number, y: number, y1: number, x1: number, upgradeType = ""): Promise<AxiosResponse<Game>> {
  const res = await axiosInstance.post(
    `game/${gameId}/move?x0=${x}&y0=${y}&x1=${x1}&y1=${y1}&promotion=${upgradeType}`
  );
  return res;
}
