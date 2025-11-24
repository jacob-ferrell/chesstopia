import axiosInstance from "../axios";

export default async function createGame(p2) {
    const res = await axiosInstance.post(`/games/${p2}`);
    return res;
}