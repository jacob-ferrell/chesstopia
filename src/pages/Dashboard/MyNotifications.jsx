
import useNotifications from "../../hooks/useNotifications";

export default function MyNotifications({}) {

  const { notifications, isLoading} = useNotifications();

  return (
    <div className="border-solid border-2 border-black rounded-md p-2 bg-gray-500 text-white">
      <h1>Notifications</h1>
      {isLoading
        ? null
        : notifications
            ?.filter((n) => !n.read)
            .map((n) => (
              <div
                key={`n-${n.id}`}
              >{`Opponent made move in game: ${n.game.id}`}</div>
            ))}
    </div>
  );
}
