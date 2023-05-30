import axiosInstance from "../axios";

export default async function getPlayerGames() {
    const res = await axiosInstance.get(`games`);
    if (res.status === 200) return res.data;
}