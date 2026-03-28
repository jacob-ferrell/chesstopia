import axiosInstance from "../axios";
import { AxiosResponse } from "axios";

export default async function addFriend(email: string): Promise<AxiosResponse> {
    const res = await axiosInstance.post(`add-friend?email=${email}`);
    return res;
}
