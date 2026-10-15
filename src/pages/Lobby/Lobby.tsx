import { useEffect, useState } from "react";
import { Cpu } from "react-feather";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import BackToDashboardButton from "../../components/buttons/BackToDashboardButton";
import useCreateGame from "../../hooks/useCreateGame";
import makeComputerMove from "../../api/makeComputerMove";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

interface LobbyProps {
  stompClient: Client | null;
}

interface MatchMessage {
  gameId: number;
}

export default function Lobby({ stompClient }: LobbyProps) {
  const [, setSubscription] = useState<StompSubscription | null>(null);
  const [waiting, setWaiting] = useState(true);
  const [countDown, setCountDown] = useState(3);
  const [startingAI, setStartingAI] = useState(false);

  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const createGame = useCreateGame();

  useEffect(() => {
    if (!stompClient || !user) return;

    const sub = stompClient.subscribe(
      `/topic/matchmaking/${user.id}`,
      handleMessage
    );
    setSubscription(sub);

    stompClient.publish({ destination: "/app/matchmaking/join" });

    return () => {
      sub.unsubscribe();
      stompClient.publish({ destination: "/app/matchmaking/leave" });
    };
  }, [stompClient, user?.id]);

  useEffect(() => {
    if (waiting || countDown <= 0) return;
    const timer = setTimeout(() => setCountDown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [waiting, countDown]);

  function handleMessage(message: IMessage) {
    const { gameId } = JSON.parse(message.body) as MatchMessage;
    redirect(gameId);
  }

  function redirect(gameId: number) {
    setWaiting(false);
    setTimeout(() => navigate("/game/" + gameId), 3000);
  }

  async function handleAIClick() {
    if (startingAI) return;
    setStartingAI(true);
    try {
      const res = await createGame(-1);
      if (!res) return;
      const { whitePlayer, id } = res.data;
      if (whitePlayer.email === "computer@chesstopia") {
        await makeComputerMove(id);
      }
      navigate(`/game/${id}`);
    } finally {
      setStartingAI(false);
    }
  }

  return (
    <div className="animate-fade-up flex flex-col gap-5">
      <Card className="flex flex-col items-center gap-6 py-10 text-center">
        <div className="relative flex h-28 w-28 items-center justify-center">
          {waiting ? (
            <>
              <span className="absolute inset-2 rounded-full bg-gray-900/60 ring-1 ring-white/10" />
              <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-white/5 border-t-yellow-500 [animation-duration:1.2s]" />
              <span className="relative animate-pulsate font-chess text-5xl leading-none text-gray-100">♞</span>
            </>
          ) : (
            <>
              <span className="absolute inset-0 rounded-full bg-lime-500/15 ring-4 ring-lime-500/60" />
              <span className="relative text-5xl font-bold tabular-nums text-lime-400">
                {countDown}
              </span>
            </>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-50">
            {waiting ? "Looking for an opponent…" : "Match found!"}
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            {waiting
              ? "You'll be paired with the next player who joins Quick Play."
              : "Taking you to the board."}
          </p>
        </div>

        {waiting && (
          <>
            <div className="flex w-full items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-500">
              <span className="h-px flex-1 bg-white/10" />
              or don't wait
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <Button variant="accent" size="lg" onClick={handleAIClick} disabled={startingAI} className="w-full max-w-xs">
              <Cpu className="h-5 w-5" />
              {startingAI ? "Setting up the board…" : "Play against the computer"}
            </Button>
          </>
        )}
      </Card>
      <div className="flex justify-center">
        <BackToDashboardButton />
      </div>
    </div>
  );
}
