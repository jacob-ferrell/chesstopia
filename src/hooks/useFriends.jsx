import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

export default function useFriends() {
  const { data, isLoading, isError } = useQuery(["friends"], getFriends);
  const navigate = useNavigate();

  async function getFriends() {
    try {
      if (!localStorage.getItem("token")) {
        throw new Error("User has no auth token");
      }
      const res = await axiosInstance.get(`friends`);
      return res.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return {
    friends: data,
    isLoading,
    isError,
  };
}
