import axiosInstance from "../axios";

export default async function getFriends(id) {
    if (id === undefined) return null;
    const res = await axiosInstance.get(`/user/${id}/friends`);
    if (res.status === 200) return res.data;
}