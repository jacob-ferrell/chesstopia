import axiosInstance from "../axios";
import { AxiosResponse } from "axios";

export default async function updateNotification(id: string): Promise<AxiosResponse> {
    const res = await axiosInstance.put(`/notifications/${id}`);
    return res;
}
