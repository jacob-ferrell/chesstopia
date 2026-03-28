import axiosInstance from "../axios";
import { AxiosResponse } from "axios";
import { Game, PieceType } from "../types";

export default async function upgradePawn(gameId: string, type: PieceType, x: number, y: number): Promise<AxiosResponse<Game>> {
    const res = await axiosInstance.put(`/game/${gameId}/upgrade-pawn/${type}?x=${x}&y=${y}`);
    return res;
}
