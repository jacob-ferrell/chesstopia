import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import getPlayerGames from "../api/getPlayerGames";
import GameInfo from "./GameInfo";
import getCurrentUser from "../api/getCurrentUser";

export default function MyGames({ setGame }) {
  const user = useQuery(["user"], getCurrentUser);

  const { data, isLoading } = useQuery(
    ["games"],
    () => getPlayerGames(user.data.id),
    { enabled: !user.isLoading && !!user.data }
  );

  const [expanded, setExpanded] = useState(true);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="border-solid border-2 border-black rounded-md p-2 bg-gray-500 text-white">
      {expanded ? (
        <div className="">
          <h1>My Games</h1>
          <button className="bg-green-400">New Game</button>
          {data?.map((game, i) => (
            <GameInfo setGame={setGame} game={game} user={user} key={"g" + i} />
          ))}
        </div>
      ) : (
        <div>{"My Games >"}</div>
      )}
    </div>
  );
}
