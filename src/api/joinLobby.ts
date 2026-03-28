import axiosInstance from "../axios";
import { AxiosResponse } from "axios";

export default async function joinLobby(): Promise<AxiosResponse> {
    const res = await axiosInstance.put("/lobby");
    return res;
}
