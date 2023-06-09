import { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";
import getGame from "../../api/getGame";
import updateNotification from "../../api/updateNotification";
import { useQueryClient } from "@tanstack/react-query";
import formatName from "../../util/formatName";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";

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
    if (!game) {
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
  }, [game, game?.id, isLoading, game?.currentTurn, game?.playerInCheck]);

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
    console.log('refreshing')
    let id;
    const url = window.location.href;
    if (url.at(-1) === "/") {
      const start = url.slice(0, -1).lastIndexOf("/") + 1;
      const end = url.lastIndexOf("/");
      id = url.slice(start, end);
    } else {
      id = url.slice(url.lastIndexOf("/") + 1);
    }
    const res = await getGame(id);
    console.log(res.data)
    setGame(res.data);
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
        <button className="flex items-center justify-center gap-1 bg-gray-700 font-bold text-sm rounded p-2 shadow hover:bg-gray-600" onClick={() => navigate("/")}>
          <span className="text-[1.3rem]">⬅</span>{" Back To Dashboard"}
        </button>
      </div>
    </>
  );
}
