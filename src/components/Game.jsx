import { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";
import getGame from "../api/getGame";
import Stomp from "stompjs";

export default function Game({ game, user, refreshGame, setGame }) {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const { players, playerInCheck, currentTurn, whitePlayer } = game;
    const { email } = user;
    const color = whitePlayer.email === email ? "WHITE" : "BLACK";
    const curPlayer = players.find((p) => p.email === email);
    const isInCheck = playerInCheck === color;
    const isTurn = currentTurn?.email === user?.email;
    setPlayer({ ...curPlayer, color, isTurn, isInCheck });
  }, [game?.id, user.id, game?.currentTurn, game?.playerInCheck]);

  async function refreshGame(e) {
    const res = await getGame(game?.id);
    setGame(res.data);
  }

  return (
    <div>
      {game.winner ? (
        <div>Check Mate! {game.winner.email === user.email ? " You Win!" : `${game.winner.name} Wins!`}</div>
      ) : player?.isTurn ? (
        <div>It is your turn</div>
      ) : (
        <div>Awaiting other player's move</div>
      )}

      {player?.isInCheck ? <div>You are in check!</div> : null}

      <ChessBoard game={game} user={user} setGame={setGame} player={player} />

      <button onClick={refreshGame}>Refresh</button>
    </div>
  );
}
