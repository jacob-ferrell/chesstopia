import getFirstChar from "../util/getFirstChar";
import getNotifications from "../api/getNotifications";
import { useQuery } from "@tanstack/react-query";

export default function Header({ user }) {
  const { data, isLoading } = useQuery(["notifications", user?.id], () =>
    getNotifications(user?.id)
  );

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center">
      <div></div>
      <h1>Chesstopia</h1>
      <div className="flex gap-2">
          <div>{user ? getFirstChar(user.email) : ""}</div>
          <div>{data?.filter(n => !n.read).length}</div>
      </div>
    </header>
  );
}
