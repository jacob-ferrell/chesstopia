import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import MyGames from "./MyGames";
import MyFriends from "./MyFriends";
import Game from "./Game";

export default function Dashboard({ user, setGame, game }) {
  const navigate = useNavigate();

  /* useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [localStorage.getItem("token")]); */

  return (
    <div className="w-full h-full pt-4">
      {!game ? (
        <div className="flex justify-between w-full px-12">
          <MyGames user={user} setGame={setGame} />
          <MyFriends user={user} />
        </div>
      ) : (
        <Game game={game} setGame={setGame} user={user} />
      )}
    </div>
  );
}
