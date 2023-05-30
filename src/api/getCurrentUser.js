import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

export default async function getCurrentUser() {
    const res = await axiosInstance.get('current-user');
    if (res.status === 200) return res.data;
    return null;
}