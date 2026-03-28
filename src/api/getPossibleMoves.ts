import axiosInstance from "../axios";
import { Position } from "../types";

export default async function getPossibleMoves(gameId: string, y: number, x: number): Promise<Position[] | undefined> {
  const res = await axiosInstance.get(
    `game/${gameId}/possible-moves?x=${x}&y=${y}`
  );
  return res?.data;
}
