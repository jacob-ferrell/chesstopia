import { useNavigate } from "react-router-dom";
import useCurrentUser from "./useCurrentUser";

export default function useLogout(): () => Promise<void> {
    const navigate = useNavigate();
    const { refetch } = useCurrentUser();

    return async function logout(): Promise<void> {
        localStorage.removeItem("token");
        await refetch();
        navigate("/login");
      }

}
