import axiosInstance from "../axios";

export default async function fetchCsrfToken() {
    const res = await axiosInstance.get("csrf");
    console.log(res);
    return res.data;
}