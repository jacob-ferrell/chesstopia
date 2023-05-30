import axiosInstance from "../axios";

export default async function getNotifications() {
    const res = await axiosInstance.get(`notifications`);
    if (res.status === 200) return res.data;
}