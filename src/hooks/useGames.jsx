import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

export default function useGames() {
  const { data, isLoading, isError } = useQuery(["games"], getPlayerGames);
  const navigate = useNavigate();

  async function getPlayerGames() {
    try {
      if (!localStorage.getItem("token")) {
        throw new Error("User has no auth token");
      }
      const res = await axiosInstance.get(`games`);
      return res.data;
    } catch (error) {
      return null;
    }
  }

  return {
    games: data,
    isLoading,
    isError,
  };
}
