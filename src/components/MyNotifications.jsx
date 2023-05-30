import { useQuery } from "@tanstack/react-query";
import getNotifications from "../api/getNotifications";
import getCurrentUser from "../api/getCurrentUser";

export default function MyNotifications({}) {
  const user = useQuery(["user"], getCurrentUser);

  const { data, isLoading } = useQuery(
    ["notifications"],
    () => getNotifications(user.data.id),
    { enabled: !user.isLoading && !!user.data }
  );

  return (
    <div className="border-solid border-2 border-black rounded-md p-2 bg-gray-500 text-white">
      <h1>Notifications</h1>
      {isLoading
        ? null
        : data
            ?.filter((n) => !n.read)
            .map((n) => (
              <div
                key={`n-${n.id}`}
              >{`Opponent made move in game: ${n.game.id}`}</div>
            ))}
    </div>
  );
}
