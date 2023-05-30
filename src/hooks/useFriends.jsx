import { useQuery } from "@tanstack/react-query";
import getFriends from "../api/getFriends";

export default function useFriends() {
    const { data, isLoading, isError } = useQuery(["friends"], getFriends);
    return {
        friends: data,
        isLoading,
        isError,
    }
}