import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axios";

export default function useMarkAllAsRead() {
    const queryClient = useQueryClient();

    return async () => {
        await axiosInstance.put("/notifications/mark-all-as-read");
        queryClient.invalidateQueries("notifications");
    }
}