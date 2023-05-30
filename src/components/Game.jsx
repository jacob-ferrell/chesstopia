import { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";
import getGame from "../api/getGame";
import updateNotification from "../api/updateNotification";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import formatName from "../util/formatName";
import getCurrentUser from "../api/getCurrentUser";

export default function Game({ game, gameId, setGame, stompClient }) {
  const queryClient = useQueryClient();
  const user = useQuery(["user"], getCurrentUser);

  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (user.isLoading || !user.data) return;
    if (!game) {
      handleRefresh();
      return;
    }
    const { players, playerInCheck, currentTurn, whitePlayer } = game;
    const { email } = user.data;
    const color = whitePlayer.email === email ? "WHITE" : "BLACK";
    const curPlayer = players.find((p) => p.email === email);
    setOpponent(players.find((p) => p.email !== email));
    const isInCheck = playerInCheck === color;
    const isTurn = currentTurn?.email === user.data.email;
    setPlayer({ ...curPlayer, color, isTurn, isInCheck });
  }, [
    game?.id,
    user.isLoading,
    game?.currentTurn,
    game?.playerInCheck,
    gameId,
    game,
  ]);

  useEffect(() => {
    if (!player || !stompClient || player.isTurn) return;
    const subscription = stompClient.subscribe(
      `/topic/game/${game?.id}`,
      (message) => handleMessage(message)
    );
    setSubscription(subscription);

    return () => {
      subscription?.unsubscribe();
    };
  }, [player?.isTurn, stompClient]);

  async function refreshGame() {
    const res = await getGame(game?.id);
    setGame(res.data);
  }

  async function getCurrentGame() {
    console.log(gameId);
    const res = await getGame(gameId);
    return res.data;
  }

  async function handleRefresh() {
    if (gameId !== undefined || game) return;
    const storedId = localStorage.getItem("gameId");
    if (storedId) {
      const res = await getGame(storedId);
      console.log(res);
      setGame(res.data);
      return;
    }
    const url = window.location.href;
    if (url.at(-1) === "/") {
      const start = url.slice(0, -1).lastIndexOf("/") + 1;
      const end = url.lastIndexOf("/");
      const id = url.slice(start, end);
      const res = await getGame(id);
      return setGame(res.data);
    }
    const res = await getGame(url.slice(url.lastIndexOf("/") + 1));
    setGame(res.data);
    return;
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
      {game?.winner ? (
        <div>
          Check Mate!{" "}
          {game?.winner.email === user.data.email
            ? " You Win!"
            : `${game?.winner.name} Wins!`}
        </div>
      ) : player?.isTurn ? (
        <div>It is your turn</div>
      ) : (
        <div>{`Awaiting ${
          opponent?.name ? formatName(opponent.name) : "opponent's"
        } move`}</div>
      )}

      {player?.isInCheck ? <div>You are in check!</div> : null}

      <ChessBoard game={game} setGame={setGame} player={player} />
    </div>
  );
}
