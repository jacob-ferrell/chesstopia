import { useState, useEffect } from "react";
import useGames from "../../hooks/useGames";
import NewGameModal from "../../components/modals/NewGameModal";
import useCurrentUser from "../../hooks/useCurrentUser";
import getOtherPlayer from "../../util/getOtherPlayer";
import { useNavigate } from "react-router-dom";
import formatDateTime from "../../util/formatDateTime";
import calculateDaysAgo from "../../util/calculateDaysAgo";

export default function MyGames({ classNames }) {
  const { games, isLoading } = useGames();
  const { user, isLoading: userLoading } = useCurrentUser();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hideCompletedGames, setHideCompletedGames] = useState(true);

  

  if (!userLoading && !user) return null;

  if (userLoading || isLoading) return <div>Loading...</div>;

  

  function renderGames() {
    const gamesSorted = games.sort(sortByIsTurn);
    const toRender = expanded ? gamesSorted : gamesSorted.slice(0, 5);
    return (
      <>
        {toRender.map((game) => {
          const { moves, id } = game;
          const isUserTurn = !game.gameOver && game.currentTurn.id === user.id;
          const lastMoveDateTime = getMostRecentMove(moves)?.createdAt;
          const daysAgo = calculateDaysAgo(lastMoveDateTime);
          const { time } = formatDateTime(lastMoveDateTime);
          return (
            <li
              key={id}
              className={`relative flex justify-between items-center rounded-md p-3 hover:bg-gray-100 cursor-pointer ${
                isUserTurn ? "bg-yellow-200" : ""
              }`}
              onClick={() => navigate("/game/" + id)}
            >
              <div>
                <h3 className="text-sm font-medium leading-5 text-left text-gray-900">
                  {`Game against ${getOtherPlayer(game, user)?.email}`}
                </h3>
                <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                  {/* <li>{`Started: ${date}`}</li>
                <li>&middot;</li> */}
                  {!!moves.length ? (
                    <>
                      <li>{`Last Move: ${
                        daysAgo === 0
                          ? time
                          : daysAgo === 1
                          ? "Yesterday"
                          : daysAgo + " days ago"
                      }`}</li>
                      <li>&middot;</li>
                    </>
                  ) : null}
                  <li className="font-bold">
                    {game.gameOver
                      ? "Game Over"
                      : isUserTurn
                      ? "Your Turn"
                      : "Opponent's Turn"}
                  </li>
                </ul>
              </div>
              {isUserTurn && (
                <div className="text-red-500 font-bold text-4xl">!</div>
              )}
            </li>
          );
        })}
        {games.length > 5 && (
          <li className="">
            <span
              onClick={() => setExpanded(!expanded)}
              className="text-blue-500 font-medium cursor-pointer"
            >
              {expanded ? "Collapse" : "Show All"}
            </span>
          </li>
        )}
      </>
    );
  }

  function getMostRecentMove(moves) {
    const sorted = moves.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return sorted.at(0);
  }

  function sortByIsTurn(a, b) {
    const isTurn = (game) => game.currentTurn.id === user.id;
    return isTurn(b) - isTurn(a);
  }

  return (
    <>
      <NewGameModal isOpen={showModal} closeModal={() => setShowModal(false)} />
      <ul className="flex flex-col gap-1">
        <li className="flex justify-between mb-2 border-b border-gray-200 pb-3">
          <div className="flex justify-center items-center gap-2 pl-4">
            <input
              type="checkbox"
              defaultChecked={hideCompletedGames}
              onChange={(e) => setHideCompletedGames(e.target.checked)}
            />
            <span className="text-gray-900 text-sm">Hide completed games</span>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-md bg-lime-700 shadow px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            New Game
          </button>
        </li>
        {!games || !games.length ? (
          <li>
            <div>You have no games</div>
          </li>
        ) : (
          renderGames()
        )}
      </ul>
    </>
  );
}
