import { useState } from "react";
import useFriends from "../../hooks/useFriends";
import getFriendStats from "../../util/getFriendStats";
import useGames from "../../hooks/useGames";
import FriendModal from "../../components/modals/FriendModal";

export default function MyFriends() {
  const { friends, isLoading } = useFriends();
  const { games, gamesLoading } = useGames();

  const [showModal, setShowModal] = useState(false);

  if (isLoading || gamesLoading) return <div>Loading...</div>;

  return (
    <>
      <FriendModal isOpen={showModal} closeModal={() => setShowModal(false)} />
      <ul>
        <li className="flex justify-end mb-2 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-md bg-lime-700 shadow px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            Add Friend
          </button>
        </li>
        {!friends.length ? (
          <li>
            <div>User has no friends</div>
          </li>
        ) : (
          friends?.map((friend) => {
            const stats = getFriendStats(games, friend);
            return (
              <li
                key={friend.id}
                className="relative rounded-md p-3 hover:bg-gray-100"
              >
                <h3 className="text-sm font-medium leading-5 text-left">
                  {friend.email}
                </h3>
                <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                  <li>{`Open Games: ${stats.open.length}`}</li>
                  <li>&middot;</li>
                  <li>{`Won Against: ${stats.won.length}`}</li>
                  <li>&middot;</li>
                  <li>{`Lost Against: ${stats.lost.length}`}</li>
                </ul>
              </li>
            );
          })
        )}
      </ul>
    </>
  );
}
