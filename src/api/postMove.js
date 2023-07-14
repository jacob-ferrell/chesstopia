import axiosInstance from "../axios";

export default async function postMove(gameId, x, y, y1, x1, upgradeType = "") {
  const res = await axiosInstance.post(
    `game/${gameId}/move?x0=${x}&y0=${y}&x1=${x1}&y1=${y1}&promotion=${upgradeType}`
  );
  return res;
}
