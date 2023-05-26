import axiosInstance from "../axios";

export default async function createGame(p1, p2) {
    const res = await axiosInstance.post(`/games?p1=${p1}&p2=${p2}`);
    return res;
}