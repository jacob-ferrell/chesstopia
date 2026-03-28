import { useEffect, useRef, useState } from "react";
import ChessBoard from "./ChessBoard";
import getGame from "../../api/getGame";
import { useQueryClient } from "@tanstack/react-query";
import formatName from "../../util/formatName";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import BackToDashboardButton from "../../components/buttons/BackToDashboardButton";
import Spinner from "../../components/spinners/Spinner";
import { Client, IMessage } from "@stomp/stompjs";
import { StompSubscription } from "@stomp/stompjs";
import { Game as GameType, Player, User } from "../../types";

interface GameProps {
  stompClient: Client | null;
  game?: GameType | null;
  setGame?: (game: GameType | null) => void;
  user?: User;
}

interface GameMessage {
  player?: number;
  game?: GameType;
}

export default function Game({ stompClient }: GameProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isLoading } = useCurrentUser();

  const [game, setGame] = useState<GameType | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [opponentIsConnected, setOpponentIsConnected] = useState(false);
  const [connectedTimeout, setConnectedTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [subscription, setSubscription] = useState<StompSubscription | null>(null);
  const [loadingPossibleMoves, setLoadingPossibleMoves] = useState(false);
  const handleMessageRef = useRef(handleMessage);
  handleMessageRef.current = handleMessage;

  useEffect(() => {
    if (isLoading) return;
    if (!game || game.id === undefined) {
      setGameFromURL();
      return;
    }
    const { blackPlayer, playerInCheck, currentTurn, whitePlayer } = game;
    const players = [whitePlayer, blackPlayer];
    const { email } = user!;
    const color = whitePlayer.email === email ? "WHITE" : "BLACK";
    const curPlayer = players.find((p) => p.email === email)!;
    setOpponent(players.find((p) => p.email !== email) ?? null);
    const isInCheck = playerInCheck === color;
    const isTurn = currentTurn?.email === user!.email;
    setPlayer({ ...curPlayer, color, isTurn, isInCheck });
    //queryClient.invalidateQueries("notifications");
  }, [
    game,
    game?.id,
    isLoading,
    game?.currentTurn,
    game?.playerInCheck,
    game?.gameOver,
  ]);

  useEffect(() => {
    if (!player || !stompClient) return;
    const url = `/topic/game/${game?.id}`;

    const subscription = stompClient.subscribe(url, (message: IMessage) =>
      handleMessageRef.current(message)
    );
    stompClient.publish({ destination: `/app/game/${game?.id}/connected` });
    setSubscription(subscription);
    return () => {
      subscription?.unsubscribe();
    };
  }, [player?.email, stompClient]);

  function restartTimer() {
    clearTimeout(connectedTimeout ?? undefined);
    setConnectedTimeout(setTimeout(() => setOpponentIsConnected(false), 60000));
  }

  async function setGameFromURL() {
    let id: string;
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
      setGame(res!.data);
    } catch (error) {
      navigate("/");
    }
  }

  function handleMessage(message: IMessage) {
    const receivedMessage: GameMessage = JSON.parse(message.body);
    console.log("game message received", receivedMessage, "opponent id:", opponent?.id);
    if (String(receivedMessage?.player) === String(opponent?.id)) {
      setOpponentIsConnected(true);
      restartTimer();
      return;
    }
    if (!receivedMessage?.game) return;
    queryClient.invalidateQueries(["notifications"]);
    setGame(receivedMessage.game);
  }

  return (
    <>
      {game ? (
        <div className="flex flex-col">
          <div className="flex flex-col h-24 text-xl items-center">
            <div className="flex items-center gap-3">
              <span>{`Playing against: ${opponent?.email}`}</span>
              <span className={`flex items-center gap-1.5 text-sm px-2.5 py-0.5 rounded-full font-medium ${
                opponentIsConnected
                  ? "bg-green-900/50 text-green-400 border border-green-700"
                  : "bg-gray-700/50 text-gray-400 border border-gray-600"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${opponentIsConnected ? "bg-green-400" : "bg-gray-400"}`} />
                {opponentIsConnected ? "Connected" : "Not connected"}
              </span>
            </div>
            {game?.winner ? (
              <div>
                Check Mate!{" "}
                {game.winner.email === user!.email
                  ? " You Win!"
                  : `${game.winner.name} Wins!`}
              </div>
            ) : game.gameOver ? (
              <div>It's a draw!</div>
            ) : player?.isTurn ? (
              <div>It is your turn</div>
            ) : (
              <div>{`Awaiting ${
                opponent?.name ? formatName(opponent.name) : "opponent's"
              } move`}</div>
            )}
            {player?.isInCheck ? <div>You are in check!</div> : null}
            {loadingPossibleMoves ?<Spinner text="Loading possible moves..."/> : null }
          </div>
          <div className="flex flex-col items-center gap-3 text-white text-2xl">
            <ChessBoard game={game} setGame={setGame} player={player} setLoadingMoves={setLoadingPossibleMoves}/>
            <BackToDashboardButton />
          </div>
        </div>
      ) : null}
    </>
  );
}
