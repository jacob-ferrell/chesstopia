import { useEffect, useRef, useState } from "react";
import ChessBoard from "./ChessBoard";
import getGame from "../../api/getGame";
import { useQueryClient } from "@tanstack/react-query";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import BackToDashboardButton from "../../components/buttons/BackToDashboardButton";
import Spinner from "../../components/spinners/Spinner";
import { Client, IMessage } from "@stomp/stompjs";
import { StompSubscription } from "@stomp/stompjs";
import { Game as GameType, Player, User } from "../../types";
import GameStatus from "./GameStatus";
import PlayerCard from "./PlayerCard";

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
  const [, setSubscription] = useState<StompSubscription | null>(null);
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
    if (String(receivedMessage?.player) === String(opponent?.id)) {
      setOpponentIsConnected(true);
      restartTimer();
      return;
    }
    if (!receivedMessage?.game) return;
    queryClient.invalidateQueries(["notifications"]);
    setGame(receivedMessage.game);
  }

  if (!game || !player) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Spinner size="lg" text="Setting up the board…" />
      </div>
    );
  }

  const opponentColor = player.color === "WHITE" ? "BLACK" : "WHITE";
  const opponentIsOnTurn = !game.gameOver && !player.isTurn;

  return (
    <div className="animate-fade-up flex w-full flex-col items-center gap-3">
      <PlayerCard
        user={opponent}
        color={opponentColor}
        isOnTurn={opponentIsOnTurn}
        isInCheck={!game.gameOver && game.playerInCheck === opponentColor}
        connected={opponentIsConnected}
        side="opponent"
      />

      <ChessBoard
        game={game}
        setGame={setGame}
        player={player}
        setLoadingMoves={setLoadingPossibleMoves}
      />

      <PlayerCard
        user={user ?? null}
        color={player.color}
        isOnTurn={!game.gameOver && player.isTurn}
        isInCheck={!game.gameOver && player.isInCheck}
        side="you"
      />

      <GameStatus
        game={game}
        player={player}
        opponent={opponent}
        loadingMoves={loadingPossibleMoves}
      />

      <div className="mt-2">
        <BackToDashboardButton />
      </div>
    </div>
  );
}
