import axiosInstance from "../axios";
import { AxiosResponse } from "axios";
import { Credentials } from "../types";

export default async function login(credentials: Credentials): Promise<AxiosResponse> {
  const res = await axiosInstance.post("auth/authenticate", {
    ...credentials,
  });
  return res;
}
