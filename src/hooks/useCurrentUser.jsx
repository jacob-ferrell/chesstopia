import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
export default function useCurrentUser() {

  const { data, isLoading, isError, refetch } = useQuery(
    ["user"],
    getCurrentUser
  );

  const navigate = useNavigate();

  async function getCurrentUser() {
    try {
      if (!localStorage.getItem("token")) {
        throw new Error("User has no auth token");
      }
      const res = await axiosInstance.get("current-user");
      return res.data;
    } catch(error) {
      localStorage.removeItem("token");
      return null;
    }
   /*  if (!localStorage.getItem("token")) return null;
    const res = await axiosInstance.get("current-user");
    if (res.status === 403) return useNavigate()("/login");
    if (res.status === 200) return res.data;
    return null; */
  }

  return {
    user: data,
    isLoading,
    isError,
    refetch,
  };
}
