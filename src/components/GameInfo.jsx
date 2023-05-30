import getGame from "../api/getGame";
import { useState, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import getCurrentUser from "../api/getCurrentUser";

export default function GameInfo({ game, setGame }) {
  const [opponent, setOpponent] = useState(null);

  const user = useQuery(["user"], getCurrentUser);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    setOpponent(game.players.find((p) => p.id !== user.data.id));
  }, [game?.id, user.isLoading, user.data]);

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
