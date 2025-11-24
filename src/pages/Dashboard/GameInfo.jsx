import getGame from "../../api/getGame";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function GameInfo({ game, setGame }) {
  const [opponent, setOpponent] = useState(null);

  const { user, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const { whitePlayer, blackPlayer } = game;
    setOpponent([whitePlayer, blackPlayer].find((p) => p.id !== user.id));
  }, [game?.id, isLoading, user]);

  async function handleClick(e) {
    e.preventDefault();
    const res = await getGame(game.id);
    queryClient.invalidateQueries("notifications");
    if (res.status !== 200) return;
    setGame(res.data);
    localStorage.setItem("gameId", game.id);
    navigate(`/game/${game.id}`);
  }

  return (
    <tr>
      <td className="px-3">
        <a href="" className="text-purple-400 font-bold" onClick={handleClick}>
          {opponent?.email}
        </a>
      </td>
      <td className="px-3">Date</td>
      <td className="px-3"></td>
    </tr>
  );
}
