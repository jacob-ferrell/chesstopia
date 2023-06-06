import axiosInstance from "../axios";

export default async function joinLobby() {
    const res = await axiosInstance.put("/lobby");
    return res;
}