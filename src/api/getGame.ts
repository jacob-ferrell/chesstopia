import axiosInstance from "../axios";
import { AxiosResponse } from "axios";
import { Game } from "../types";

export default async function getGame(gameId: string): Promise<AxiosResponse<Game> | null> {
    if (!gameId) return null;
    const res = await axiosInstance.get(`game/${gameId}`);
    return res;
}
