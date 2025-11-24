import axiosInstance from "../axios";

export default async function getCurrentUser() {
    if (!localStorage.getItem("token")) return null;
    const res = await axiosInstance.get('current-user');
    if (res.status === 200) return res.data;
    return null;
}