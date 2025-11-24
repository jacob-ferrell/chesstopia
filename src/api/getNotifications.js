import axiosInstance from "../axios";

export default async function getNotifications() {
    if (!localStorage.getItem("token")) return null;
    const res = await axiosInstance.get(`notifications`);
    if (res.status === 200) return res.data;
}