import axiosInstance from "../axios";

export default async function upgradePawn(gameId, type, x, y) {
    const res = await axiosInstance.put(`/game/${gameId}/upgrade-pawn/${type}?x=${x}&y=${y}`);
    return res;
}