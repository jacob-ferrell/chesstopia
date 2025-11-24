import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

export default function useNotifications() {
  const { data, isLoading, isError } = useQuery(
    ["notifications"],
    getNotifications
  );
  const navigate = useNavigate();

  async function getNotifications() {
    try {
      if (!localStorage.getItem("token")) {
        throw new Error("User has no auth token");
      }
      const res = await axiosInstance.get(`notifications`);
      return res.data;
    } catch (error) {
        return null;
    }
  }
  return {
    notifications: data,
    isLoading,
    isError,
  };
}
