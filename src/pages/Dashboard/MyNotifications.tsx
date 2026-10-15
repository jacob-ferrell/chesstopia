import { useEffect, useState } from "react";
import { Bell, ChevronRight } from "react-feather";
import useNotifications from "../../hooks/useNotifications";
import calculateDaysAgo from "../../util/calculateDaysAgo";
import formatDateTime from "../../util/formatDateTime";
import useMarkAllAsRead from "../../hooks/useMarkAllAsRead";
import getOtherPlayer from "../../util/getOtherPlayer";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../types";
import EmptyState from "../../components/ui/EmptyState";
import PanelSkeleton from "./PanelSkeleton";
import Avatar from "../../components/ui/Avatar";
import displayName, { isComputerUser } from "../../util/displayName";
import cn from "../../components/ui/cn";

export default function MyNotifications() {
  const { notifications, isLoading } = useNotifications();
  const { user, isLoading: userIsLoading } = useCurrentUser();
  const navigate = useNavigate();

  const [groupedByGame, setGroupedByGame] = useState<Record<string, Notification[]> | null>(null);
  const markAllAsRead = useMarkAllAsRead();

  useEffect(() => {
    markAllAsRead();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    groupByGame();
  }, [isLoading, notifications]);

  function groupByGame() {
    const map: Record<string, Notification[]> = {};
    const gameNotifications = ((notifications ?? []) as Notification[]).filter((n) => n.game);
    for (const n of gameNotifications) {
      map[n.game!.id] = [...(map[n.game!.id] ?? []), n];
    }
    Object.keys(map).forEach((gameId) => {
      map[gameId] = map[gameId].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
    setGroupedByGame(map);
  }

  function describeWhen(createdAt: string): string {
    const { date, time } = formatDateTime(createdAt);
    const daysAgo = calculateDaysAgo(createdAt);
    const day = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : date;
    return `${day} · ${time}`;
  }

  if (isLoading || userIsLoading || groupedByGame === null) return <PanelSkeleton rows={3} />;

  const all = (notifications ?? []) as Notification[];
  if (!all.length) {
    return (
      <EmptyState
        icon={<Bell className="h-5 w-5" />}
        title="You're all caught up"
        description="Game updates and friend requests will appear here."
      />
    );
  }

  const getCreatedAt = (n: Notification | Notification[]) =>
    new Date(Array.isArray(n) ? n[0].createdAt : n.createdAt).getTime();

  const items = [
    ...all.filter((n) => !n.game),
    ...Object.keys(groupedByGame).map((gameId) => groupedByGame[gameId]),
  ].sort((a, b) => getCreatedAt(b) - getCreatedAt(a));

  return (
    <ul className="flex flex-col gap-1">
      {items.map((n) => {
        if (!Array.isArray(n)) {
          const unread = !n.read;
          return (
            <li
              key={`n-${n.id}`}
              className={cn(
                "flex items-start gap-3 rounded-xl p-3",
                unread ? "bg-yellow-50" : "hover:bg-gray-50"
              )}
            >
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <Bell className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{n.message}</p>
                <p className="mt-0.5 text-xs text-gray-500">{describeWhen(n.createdAt)}</p>
              </div>
              {unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-yellow-500" />}
            </li>
          );
        }
        const game = n[0].game!;
        const opponent = getOtherPlayer(game, user!);
        const unreadCount = n.filter((x) => !x.read).length;
        return (
          <li key={`g-${game.id}`}>
            <button
              type="button"
              onClick={() => navigate("/game/" + game.id)}
              className={cn(
                "focus-ring flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors",
                unreadCount ? "bg-yellow-50 hover:bg-yellow-100/80" : "hover:bg-gray-50"
              )}
            >
              <Avatar
                name={isComputerUser(opponent) ? "C" : opponent?.firstName ?? opponent?.email}
                tone={unreadCount ? "amber" : "slate"}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  Game vs. {displayName(opponent)}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {n[0].message ? n[0].message : `${n.length} update${n.length === 1 ? "" : "s"}`}
                  {" · "}
                  {describeWhen(n[0].createdAt)}
                </p>
              </div>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-yellow-500 px-1.5 text-[11px] font-bold text-yellow-950">
                  {unreadCount}
                </span>
              )}
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
