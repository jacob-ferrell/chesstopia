import axiosInstance from "../axios";

export default async function getPlayerGames(userId) {
    const res = await axiosInstance.get(`games/user/${userId}`);
    if (res.status === 200) return res.data;
}