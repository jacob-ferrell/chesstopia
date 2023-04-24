import axiosInstance from "../axios";

export default async function postMove(x, y, y1, x1) {
  const res = await axiosInstance.post(
    `game/1/move?x0=${x}&y0=${y}&x1=${x1}&y1=${y1}`
  );
  return res.data;
}
