import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import MyGames from "./MyGames";
import MyFriends from "./MyFriends";
import Game from "./Game";
import MyNotifications from "./MyNotifications";
import getNotifications from "../api/getNotifications";

export default function Dashboard({ user, setGame, game }) {
  const { data, isLoading } = useQuery(["notifications", user?.id], () =>
    getNotifications(user?.id)
  );
  const [subscription, setSubscription] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;
    const client = new Client({
      brokerURL: `ws://localhost:8080/websocket`,
      onConnect: () => {
        console.log("Connected");
        const subscription = client.subscribe(
          `/topic/user/${user?.id}`,
          (message) => handleMessage(message)
        );
        setSubscription(subscription);
      },
    });
    client.activate();
    setStompClient(client);
    return () => {
      subscription?.unsubscribe();
      client.deactivate();
    };
  }, [user?.id])

  function handleMessage(message) {
    console.log("Received Message: " + message);
    queryClient.invalidateQueries("notifications")
  }

  /* useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [localStorage.getItem("token")]); */

  return (
    <div className="w-full h-full pt-4">
      {(!game && user) ? (
        <div className="flex justify-between w-full px-12">
          <MyGames user={user} setGame={setGame} />
          <MyFriends user={user} />
          <MyNotifications user={user}/>
        </div>
      ) : (game && user) ? (
        <Game stompClient={stompClient} game={game} setGame={setGame} user={user} />
      ) : null }
    </div>
  );
}
