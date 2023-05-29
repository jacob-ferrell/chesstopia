import { useQuery } from "@tanstack/react-query";
import getNotifications from "../api/getNotifications";

export default function MyNotifications({ user }) {
  const { data, isLoading } = useQuery(["notifications", user?.id], () =>
    getNotifications(user?.id)
  );

  return (
    <div className="border-solid border-2 border-black rounded-md p-2 bg-gray-500 text-white">
      <h1>Notifications</h1>
      {isLoading
        ? null
        : data
            .filter((n) => !n.read)
            .map((n) => (
              <div
                key={`n-${n.id}`}
              >{`Opponent made move in game: ${n.game.id}`}</div>
            ))}
    </div>
  );
}
