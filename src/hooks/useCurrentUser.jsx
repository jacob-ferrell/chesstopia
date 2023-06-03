import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
export default function useCurrentUser() {
  const { data, isLoading, isError, refetch } = useQuery(
    ["user"],
    getCurrentUser
  );

  async function getCurrentUser() {
    if (!localStorage.getItem("token")) return null;
    console.log(axiosInstance);
    const res = await axiosInstance.get("current-user");
    if (res.status === 403) return useNavigate()("/login");
    if (res.status === 200) return res.data;
    return null;
  }

  return {
    user: data,
    isLoading,
    isError,
    refetch,
  };
}
