import axiosInstance from "../axios";

export default async function getCurrentUser() {
    const res = await axiosInstance.get('current-user');
    return res;
}