import axiosInstance from "../axios";

export default async function getPossibleMoves(gameId, y, x) {
  const res = await axiosInstance.get(
    `game/${gameId}/possible-moves?x=${x}&y=${y}`
  );
  return res?.data?.possibleMoves;
}
