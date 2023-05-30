import axiosInstance from "../axios";

export default async function getFriends() {
    const res = await axiosInstance.get(`friends`);
    if (res.status !== 200) return null;
    return res.data;
}