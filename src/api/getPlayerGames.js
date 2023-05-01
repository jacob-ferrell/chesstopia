import axiosInstance from "../axios";

export default async function getPlayerGames(userId) {
    if (!userId) return null;
    const res = await axiosInstance.get(`games/user/${userId}`);
    if (res.status === 200) return res.data;
}