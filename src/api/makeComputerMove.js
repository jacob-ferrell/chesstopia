import axiosInstance from "../axios";

export default async function makeComputerMove(gameId) {
    const res = await axiosInstance.post(`/game/${gameId}/computer-move`);
    return res;
}