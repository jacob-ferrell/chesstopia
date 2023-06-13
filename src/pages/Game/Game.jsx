import { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";
import getGame from "../../api/getGame";
import updateNotification from "../../api/updateNotification";
import { useQueryClient } from "@tanstack/react-query";
import formatName from "../../util/formatName";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import BackToDashboardButton from "../../components/buttons/BackToDashboardButton";

export default function Game({ stompClient }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isLoading } = useCurrentUser();

  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [opponentIsConnected, setOpponentIsConnected] = useState(false);
  const [connectedTimeout, setConnectedTimeout] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (isLoading) return;
    if (!game || game.id === undefined) {
      setGameFromURL();
      return;
    }
    const { blackPlayer, playerInCheck, currentTurn, whitePlayer } = game;
    const players = [whitePlayer, blackPlayer];
    const { email } = user;
    const color = whitePlayer.email === email ? "WHITE" : "BLACK";
    const curPlayer = players.find((p) => p.email === email);
    setOpponent(players.find((p) => p.email !== email));
    const isInCheck = playerInCheck === color;
    const isTurn = currentTurn?.email === user.email;
    setPlayer({ ...curPlayer, color, isTurn, isInCheck });
  }, [game, game?.id, isLoading, game?.currentTurn, game?.playerInCheck, game?.winner]);

  useEffect(() => {
    if (!player || !stompClient || player.isTurn) return;
    const url = `/topic/game/${game?.id}`;

    const subscription = stompClient.subscribe(url, (message) =>
      handleMessage(message)
    );
    setSubscription(subscription);
    return () => {
      subscription?.unsubscribe();
    };
  }, [player?.isTurn, stompClient]);

  function restartTimer() {
    clearTimeout(connectedTimeout);
    setConnectedTimeout(setTimeout(() => setOpponentIsConnected(false), 60000));
  }

  async function setGameFromURL() {
    console.log("refreshing");
    let id;
    const url = window.location.href;
    if (url.at(-1) === "/") {
      const start = url.slice(0, -1).lastIndexOf("/") + 1;
      const end = url.lastIndexOf("/");
      id = url.slice(start, end);
    } else {
      id = url.slice(url.lastIndexOf("/") + 1);
    }
    try {
      const res = await getGame(id);
      console.log(res.data);
      setGame(res.data);
    } catch (error) {
      navigate("/");
    }
  }

  async function handleMessage(message) {
    const receivedMessage = JSON.parse(message.body);
    console.log(receivedMessage);
    if (receivedMessage?.player === opponent.id) {
      setOpponentIsConnected(true);
      restartTimer();
      return;
    }
    console.log("Received message:", receivedMessage);
    if (!receivedMessage?.notification || !receivedMessage?.game) return;
    const { game, notification } = receivedMessage;
    await updateNotification(notification.id);
    queryClient.invalidateQueries("notifications");
    setGame(game);
  }

  return (
    <>
      {game ? (
        <>
          <div className={``}>{`${opponent?.email}: ${
            opponentIsConnected ? "Active" : "Inactive"
          }`}</div>
          <div className="flex flex-col items-center gap-3 text-white text-2xl">
            {game?.winner ? (
              <div>
                Check Mate!{" "}
                {game?.winner.email === user.email
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
            <BackToDashboardButton />
          </div>
        </>
      ) : null}
    </>
  );
}
