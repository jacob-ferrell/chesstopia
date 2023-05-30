import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

export default async function getCurrentUser() {
    if (!localStorage.getItem("token")) return null;
    const res = await axiosInstance.get('current-user');
    if (res.status === 200) return res.data;
    return null;
}