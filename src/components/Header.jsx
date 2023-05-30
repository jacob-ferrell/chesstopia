import getFirstChar from "../util/getFirstChar";
import getNotifications from "../api/getNotifications";
import { useQuery } from "@tanstack/react-query";
import getCurrentUser from "../api/getCurrentUser";

export default function Header({}) {
  const user = useQuery(["user"], getCurrentUser, {enabled: false});
  const { data, isLoading } = useQuery(
    ["notifications"],
    () => getNotifications(user?.id),
    { enabled: !user.isLoading && !!user.data }
  );

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center">
      <div></div>
      <h1>Chesstopia</h1>
      <div className="flex gap-2">
        <div>{!!user.data ? getFirstChar(user.data.email) : ""}</div>
        <div>{data?.filter((n) => !n.read).length}</div>
      </div>
    </header>
  );
}
