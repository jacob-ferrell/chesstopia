import axiosInstance from "../axios";

export default async function login(credentials) {
  const res = await axiosInstance.post("auth/authenticate", {
    ...credentials,
  });
  return res;
}
