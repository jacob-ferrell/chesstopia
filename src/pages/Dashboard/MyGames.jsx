import { useEffect, useState } from "react";
import GameInfo from "./GameInfo";
import useGames from "../../hooks/useGames";
import NewGameModal from "../../components/modals/NewGameModal";

export default function MyGames({ setGame }) {

  const { games, isLoading } = useGames();

  const [expanded, setExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="border-solid border-2 border-black rounded-md p-4 bg-gray-500 text-white flex flex-col gap-3 items-center">
      <div className="flex gap-3 justify-center items-center">
        <h1 className="text-4xl">My Games</h1>
        <button
          className="bg-purple-500 w-12 h-12 rounded-full"
          onClick={() => setShowModal(true)}
        >
          <span className="text-white text-2xl font-bold">+</span>
        </button>
      </div>
      <table className="table-fixed border-collapse">
        <thead className="">
          <tr>
            <th className="border border-gray-900 px-3">Opponent</th>
            <th className="border border-gray-900 px-3">Last Move</th>
            <th className="px-3"></th>
          </tr>
        </thead>
        <tbody>
          {games?.map((game, i) => (
            <GameInfo setGame={setGame} game={game} key={"g" + i} />
          ))}
        </tbody>
      </table>
      <NewGameModal closeModal={() => setShowModal(false)} isOpen={showModal} />
    </div>
  );
}
