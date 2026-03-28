import axiosInstance from "../axios";
import { User } from "../types";

export default async function getFriends(): Promise<User[] | null> {
    const res = await axiosInstance.get(`friends`);
    if (res.status !== 200) return null;
    return res.data;
}
