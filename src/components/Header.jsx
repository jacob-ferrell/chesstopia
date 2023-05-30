import getFirstChar from "../util/getFirstChar";
import getNotifications from "../api/getNotifications";
import { useQuery } from "@tanstack/react-query";
import getCurrentUser from "../api/getCurrentUser";
import useCurrentUser from "../hooks/useCurrentUser";
import useNotifications from "../hooks/useNotifications";

export default function Header({}) {
  const { user, isLoading: userIsLoading } = useCurrentUser();

  const { notifications, isLoading } = useNotifications();

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center">
      <div></div>
      <h1>Chesstopia</h1>
      <div className="flex gap-2">
        <div>{!userIsLoading ? getFirstChar(user.email) : ""}</div>
        <div>{!isLoading && notifications?.filter((n) => !n.read).length}</div>
      </div>
    </header>
  );
}
