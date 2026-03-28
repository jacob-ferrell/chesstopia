import axiosInstance from "../axios";
import { Notification } from "../types";

export default async function getNotifications(): Promise<Notification[] | undefined | null> {
    if (!localStorage.getItem("token")) return null;
    const res = await axiosInstance.get(`notifications`);
    if (res.status === 200) return res.data;
}
