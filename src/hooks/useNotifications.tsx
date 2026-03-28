import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import hasValidToken from "../util/hasValidToken";
import { Notification } from "../types";

interface UseNotificationsResult {
  notifications: Notification[] | null | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function useNotifications(): UseNotificationsResult {
  const { data, isLoading, isError } = useQuery(
    ["notifications"],
    getNotifications,
    { enabled: hasValidToken() }
  );
  const navigate = useNavigate();

  async function getNotifications(): Promise<Notification[] | null> {
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
