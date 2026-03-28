import axiosInstance from "../axios";
import { AxiosResponse } from "axios";
import { Game } from "../types";

export default async function createGame(p2: string | number): Promise<AxiosResponse<Game>> {
    const res = await axiosInstance.post(`/games/${p2}`);
    return res;
}
