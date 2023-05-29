import axiosInstance from "../axios";


export default async function updateNotification(id) {
    const res = await axiosInstance.put(`/notifications/${id}`);
    return res;
}