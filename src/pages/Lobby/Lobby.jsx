import { useEffect, useState } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import useGames from "../../hooks/useGames";
import { useQueryClient } from "@tanstack/react-query";
import joinLobby from "../../api/joinLobby";
import { useNavigate } from "react-router-dom";
import getGame from "../../api/getGame";
import BackToDashboardButton from "../../components/buttons/BackToDashboardButton";
import Spinner from "../../components/spinners/Spinner";
import useCreateGame from "../../hooks/useCreateGame";
import makeComputerMove from "../../api/makeComputerMove";

export default function Lobby({ stompClient }) {
  const [subscription, setSubscription] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [countDown, setCountDown] = useState(3);

  const queryClient = useQueryClient();
  const { games, isLoading: gamesLoading } = useGames();
  const { user, isLoading: userLoading } = useCurrentUser();
  const navigate = useNavigate();
  const createGame = useCreateGame();

  useEffect(() => {
    if (!stompClient || (!userLoading && !user)) return;
    const url = `/topic/lobby`;

    const subscription = stompClient.subscribe(url, (message) =>
      handleMessage(message)
    );
    setSubscription(subscription);
    return () => {
      subscription?.unsubscribe();
    };
  }, [stompClient]);

  useEffect(() => {
    connectToLobby();
  }, []);

  useEffect(() => {
    if (waiting || countDown <= 0) return;
    const timer = setTimeout(() => setCountDown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [waiting, countDown]);

  async function handleMessage(message) {
    const { game } = JSON.parse(message.body);
    const res = await getGame(game);
    if (!res?.data) return;
    redirect(res.data.id);
  }

  function redirect(gameId) {
    setWaiting(false);
    setTimeout(() => navigate("/game/" + gameId), 3000);
  }

  async function connectToLobby() {
    const res = await joinLobby();
    if (!Array.isArray(res.data)) {
      redirect(res.data.id);
    }
  }

  async function handleAIClick() {
    const res = await createGame(-1);
    const { whitePlayer, id } = res.data;
    if (whitePlayer.email === "computer@chesstopia") {
      await makeComputerMove(id);
    }
    navigate(`/game/${res.data.id}`);
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
        <button onClick={handleAIClick} className="bg-gray-700 font-bold text-gray-100 text-sm rounded p-2 shadow hover:bg-gray-600">
          Play Against AI
        </button>
        <BackToDashboardButton />
      </div>
    </div>
  );
}
