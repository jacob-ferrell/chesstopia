import axiosInstance from "../axios";
import { Game } from "../types";

export default async function getPlayerGames(): Promise<Game[] | undefined> {
    const res = await axiosInstance.get(`games`);
    if (res.status === 200) return res.data;
}
