import { useEffect, useState } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import useGames from "../../hooks/useGames";
import { useQueryClient } from "@tanstack/react-query";
import joinLobby from "../../api/joinLobby";
import { useNavigate } from "react-router-dom";
import getGame from "../../api/getGame";

export default function Lobby({ stompClient }) {
  const [subscription, setSubscription] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [countDown, setCountDown] = useState(3);

  const queryClient = useQueryClient();
  const { games, isLoading: gamesLoading } = useGames();
  const { user, isLoading: userLoading } = useCurrentUser();
  const navigate = useNavigate();

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

  return <div className="text-white">{waiting ? "Waiting..." : `Match found. Redirecting in ${countDown}...`}</div>;
}
