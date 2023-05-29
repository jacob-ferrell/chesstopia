import { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";
import getGame from "../api/getGame";
import { Client } from "@stomp/stompjs";
import updateNotification from "../api/updateNotification";
import { useQueryClient } from "@tanstack/react-query";
import formatName from "../util/formatName";

export default function Game({ game, user, setGame }) {
  const queryClient = useQueryClient();
  
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const { players, playerInCheck, currentTurn, whitePlayer } = game;
    const { email } = user;
    const color = whitePlayer.email === email ? "WHITE" : "BLACK";
    const curPlayer = players.find((p) => p.email === email);
    setOpponent(players.find((p) => p.email !== email));
    const isInCheck = playerInCheck === color;
    const isTurn = currentTurn?.email === user?.email;
    setPlayer({ ...curPlayer, color, isTurn, isInCheck });
  }, [game?.id, user?.id, game?.currentTurn, game?.playerInCheck]);

  useEffect(() => {
    if (!player || player.isTurn) return;
    const stompClient = new Client({
      brokerURL: `ws://localhost:8080/websocket`,
      onConnect: () => {
        console.log("Connected");
        const subscription = stompClient.subscribe(
          `/topic/game/${game?.id}`,
          (message) => handleMessage(message)
        );
        setSubscription(subscription);
      },
    });
    stompClient.activate();

    return () => {
      subscription?.unsubscribe();
      stompClient.deactivate();
    };
  }, [player?.isTurn]);

  async function refreshGame() {
    const res = await getGame(game?.id);
    setGame(res.data);
  }

  async function handleMessage(message) {
    const receivedMessage = JSON.parse(message.body);
    console.log("Received message:", receivedMessage);
    if (!receivedMessage) return;
    const { game, notification } = receivedMessage;
    await updateNotification(notification.id);
    queryClient.invalidateQueries("notifications");
    setGame(game);
  }

  return (
    <div className="flex flex-col items-center gap-3 text-white text-2xl">
      {game.winner ? (
        <div>
          Check Mate!{" "}
          {game.winner.email === user.email
            ? " You Win!"
            : `${game.winner.name} Wins!`}
        </div>
      ) : player?.isTurn ? (
        <div>It is your turn</div>
      ) : (
        <div>{`Awaiting ${opponent?.name ? formatName(opponent.name) : "opponent's"} move`}</div>
      )}

      {player?.isInCheck ? <div>You are in check!</div> : null}

      <ChessBoard game={game} user={user} setGame={setGame} player={player} />
    </div>
  );
}
