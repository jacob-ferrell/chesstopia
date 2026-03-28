import axiosInstance from "../axios";
import { User } from "../types";

export default async function getCurrentUser(): Promise<User | null> {
    if (!localStorage.getItem("token")) return null;
    const res = await axiosInstance.get('current-user');
    if (res.status === 200) return res.data;
    return null;
}
