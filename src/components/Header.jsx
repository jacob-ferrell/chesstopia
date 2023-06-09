import getFirstChar from "../util/getFirstChar";
import useCurrentUser from "../hooks/useCurrentUser";
import useNotifications from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

export default function Header({}) {
  const { user, isLoading: userIsLoading } = useCurrentUser();
  const navigate = useNavigate();
  const { notifications, isLoading } = useNotifications();

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent text-white p-4 flex justify-between items-center">
      <div
        onClick={() => navigate("/")}
        className="flex gap-2 items-center justify-center cursor-pointer"
      >
        <div className="text-5xl">♞</div>
        <h1 className="text-4xl">Chesstopia</h1>
      </div>
      <div className="flex gap-2">
        <div>{!userIsLoading && user ? getFirstChar(user.email) : ""}</div>
        <div>{!isLoading && notifications?.filter((n) => !n.read).length}</div>
      </div>
    </header>
  );
}
