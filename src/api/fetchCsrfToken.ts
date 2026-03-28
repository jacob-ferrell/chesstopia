import axiosInstance from "../axios";
import { CsrfToken } from "../types";

export default async function fetchCsrfToken(): Promise<CsrfToken> {
    const res = await axiosInstance.get("csrf");
    console.log(res);
    return res.data;
}
