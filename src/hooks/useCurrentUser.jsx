import { useQuery } from "@tanstack/react-query";
import getCurrentUser from "../api/getCurrentUser";

export default function useCurrentUser() {
  const { data, isLoading, isError, refetch } = useQuery(
    ["user"],
    getCurrentUser
  );
  return {
    user: data,
    isLoading,
    isError,
    refetch,
  };
}
