import axiosInstance from "../axios";
import { AxiosResponse } from "axios";
import { Game } from "../types";

export default async function makeComputerMove(gameId: string): Promise<AxiosResponse<Game>> {
    const res = await axiosInstance.post(`/game/${gameId}/computer-move`);
    return res;
}
