import { useNavigate } from "react-router-dom";
import useCurrentUser from "./useCurrentUser";

export default function useLogout() {
    const navigate = useNavigate();
    const { refetch } = useCurrentUser();

    return async function logout() {
        localStorage.removeItem("token");
        await refetch();
        navigate("/login");
      }
    
}