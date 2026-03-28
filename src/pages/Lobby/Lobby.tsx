import { useEffect, useState } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import BackToDashboardButton from "../../components/buttons/BackToDashboardButton";
import Spinner from "../../components/spinners/Spinner";
import useCreateGame from "../../hooks/useCreateGame";
import makeComputerMove from "../../api/makeComputerMove";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";

interface LobbyProps {
  stompClient: Client | null;
}

interface MatchMessage {
  gameId: number;
}

export default function Lobby({ stompClient }: LobbyProps) {
  const [subscription, setSubscription] = useState<StompSubscription | null>(null);
  const [waiting, setWaiting] = useState(true);
  const [countDown, setCountDown] = useState(3);

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
    const res = await createGame(-1);
    const { whitePlayer, id } = res!.data;
    if (whitePlayer.email === "computer@chesstopia") {
      await makeComputerMove(id);
    }
    navigate(`/game/${res!.data.id}`);
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="text-white">
        {waiting ? (
          <>
            <Spinner text="Waiting for other players..." />
            <div></div>
          </>
        ) : (
          `Match found. Redirecting in ${countDown}...`
        )}
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={handleAIClick} className="bg-gradient-to-b from-gray-500 to-gray-700 font-bold text-gray-100 text-sm rounded p-2 shadow hover:bg-gray-600">
          Play Against AI
        </button>
        <BackToDashboardButton />
      </div>
    </div>
  );
}
