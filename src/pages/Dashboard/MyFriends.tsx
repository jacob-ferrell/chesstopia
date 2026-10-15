import { useState } from "react";
import { UserPlus, Users } from "react-feather";
import useFriends from "../../hooks/useFriends";
import getFriendStats from "../../util/getFriendStats";
import useGames from "../../hooks/useGames";
import AddFriendModal from "../../components/modals/AddFriendModal";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";
import PanelSkeleton from "./PanelSkeleton";
import displayName from "../../util/displayName";

export default function MyFriends() {
  const { friends, isLoading } = useFriends();
  const { games, isLoading: gamesLoading } = useGames();

  const [showModal, setShowModal] = useState(false);

  if (isLoading || gamesLoading) return <PanelSkeleton rows={3} />;

  return (
    <>
      <AddFriendModal isOpen={showModal} closeModal={() => setShowModal(false)} />
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-1 pb-3">
        <p className="text-sm text-gray-600">
          {friends?.length
            ? `${friends.length} ${friends.length === 1 ? "friend" : "friends"}`
            : "Add friends to challenge them directly."}
        </p>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <UserPlus className="h-4 w-4" />
          Add friend
        </Button>
      </div>

      {!friends || !friends.length ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="Your friends list is empty"
          description="Add someone by email and they'll show up here with your head-to-head record."
        />
      ) : (
        <ul className="mt-2 flex flex-col gap-1">
          {friends.map((friend) => {
            const stats = getFriendStats(games ?? [], friend);
            const name = displayName(friend);
            return (
              <li
                key={friend.id}
                className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
              >
                <Avatar name={friend.firstName ?? friend.email} tone="slate" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
                  {name !== friend.email && (
                    <p className="truncate text-xs text-gray-500">{friend.email}</p>
                  )}
                </div>
                <dl className="flex shrink-0 gap-3 text-center">
                  <Stat label="Open" value={stats.open.length} />
                  <Stat label="Won" value={stats.won.length} className="text-green-700" />
                  <Stat label="Lost" value={stats.lost.length} className="text-red-700" />
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function Stat({ label, value, className = "text-gray-900" }: { label: string; value: number; className?: string }) {
  return (
    <div className="min-w-[2.25rem]">
      <dd className={`text-sm font-bold leading-tight ${className}`}>{value}</dd>
      <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</dt>
    </div>
  );
}
