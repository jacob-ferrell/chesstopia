import { useQuery } from "@tanstack/react-query";
import getPlayerGames from "../api/getPlayerGames";

export default function useGames() {
    const { data, isLoading, isError } = useQuery(["games"], getPlayerGames);

    return {
        games: data,
        isLoading,
        isError,
    }
}