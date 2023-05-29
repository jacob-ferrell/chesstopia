import axiosInstance from "../axios";

export default async function getNotifications(userId) {
    if (userId === undefined) return null;
    const res = await axiosInstance.get(`/notifications/user/${userId}`);
    if (res.status === 200) return res.data;
}