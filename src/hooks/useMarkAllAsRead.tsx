import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axios";

export default function useMarkAllAsRead(): () => Promise<void> {
    const queryClient = useQueryClient();

    return async (): Promise<void> => {
        await axiosInstance.put("/notifications/mark-all-as-read");
        queryClient.invalidateQueries(["notifications"]);
    }
}
