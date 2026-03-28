import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { Game } from "../types";

interface UseGamesResult {
  games: Game[] | null | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function useGames(): UseGamesResult {
  const { data, isLoading, isError } = useQuery(["games"], getPlayerGames);
  const navigate = useNavigate();

  async function getPlayerGames(): Promise<Game[] | null> {
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
