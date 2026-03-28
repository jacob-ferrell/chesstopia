import { useEffect, useState } from "react";
import useNotifications from "../../hooks/useNotifications";
import calculateDaysAgo from "../../util/calculateDaysAgo";
import formatDateTime from "../../util/formatDateTime";
import useMarkAllAsRead from "../../hooks/useMarkAllAsRead";
import getOtherPlayer from "../../util/getOtherPlayer";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../types";

export default function MyNotifications({}) {
  const { notifications, isLoading } = useNotifications();

  const { user, isLoading: userIsLoading } = useCurrentUser();

  const navigate = useNavigate();

  const [groupedByGame, setGroupedByGame] = useState<Record<string, Notification[]> | null>(null);

  const markAllAsRead = useMarkAllAsRead();

  function sortByRead() {
    return (notifications as Notification[]).sort((a, b) =>
      a.read && !b.read ? -1 : b.read && !a.read ? 1 : 0
    );
  }

  useEffect(() => {
    markAllAsRead();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    groupByGame();
  }, [isLoading]);

  function groupByGame() {
    const map: Record<string, Notification[]> = {};
    const gameNotifications = (notifications as Notification[]).filter((n) => n.game);
    for (let n of gameNotifications) {
      if (!Object.prototype.hasOwnProperty.call(map, n.game!.id)) {
        map[n.game!.id] = [n];
        continue;
      }
      map[n.game!.id] = [...map[n.game!.id], n];
    }
    Object.keys(map).forEach((gameId) => {
      map[gameId] = map[gameId].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
    setGroupedByGame(map);
  }

  function renderNotifications() {
    if (isLoading || userIsLoading || groupedByGame === null)
      return (
        <li>
          <div>Loading...</div>
        </li>
      );
    if (!(notifications as Notification[]).length)
      return (
        <li>
          <div className="text-gray-900">You have no notifications</div>
        </li>
      );
    const getCreatedAt = (n: Notification | Notification[]) => {
      if (Array.isArray(n)) {
        return new Date(n[0].createdAt);
      }
      return new Date(n.createdAt);
    };
    return [
      ...(notifications as Notification[]).filter((n) => !n.game),
      ...Object.keys(groupedByGame).map((gameId) => groupedByGame![gameId]),
    ]
      .sort((a, b) => getCreatedAt(b).getTime() - getCreatedAt(a).getTime())
      .map((n) => {
        const createdAt = Array.isArray(n) ? n[0]?.createdAt : (n as Notification).createdAt;
        const { date, time } = formatDateTime(createdAt);
        const daysAgo = calculateDaysAgo(createdAt);
        if (!Array.isArray(n)) {
          return (
            <li
              key={`n-${(n as Notification).id}`}
              className="relative rounded-md p-3 hover:bg-gray-100 cursor-pointer"
            >
              <h3 className="text-sm font-medium leading-5 text-left text-gray-900">
                {(n as Notification).message}
              </h3>
              <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                <li>
                  {daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : date}
                </li>
                <li>&middot;</li>
                <li>{time}</li>
              </ul>
            </li>
          );
        }
        const game = (n as Notification[])[0].game!;
        return (
          <li
            key={`g-${game.id}`}
            className="relative rounded-md p-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate("/game/" + game.id)}
          >
            <h3 className="text-sm font-medium leading-5 text-left text-gray-900">
              {`Game ${game.id} against ${
                getOtherPlayer(game, user!)?.firstName
              }`}
            </h3>
            <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
              <li>
                Latest Notification:
                {daysAgo === 0 ? " Today" : daysAgo === 1 ? "Yesterday" : date}
              </li>
              <li>&middot;</li>
              <li>{time}</li>
            </ul>
          </li>
        );
      });
  }

  return <ul>{renderNotifications()}</ul>;
}
