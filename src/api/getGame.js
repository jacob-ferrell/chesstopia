import axiosInstance from "../axios";

export default async function getGame(gameId) {
    if (!gameId) return null;
    const res = await axiosInstance.get(`game/${gameId}`);
    return res;
}