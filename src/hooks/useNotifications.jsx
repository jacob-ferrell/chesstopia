import { useQuery } from "@tanstack/react-query";
import getNotifications from "../api/getNotifications";

export default function useNotifications() {
    const { data, isLoading, isError } = useQuery(["notifications"], getNotifications);
    return {
        notifications: data,
        isLoading,
        isError
    }
}