import "./App.css";
import { useState, useEffect } from "react";
import Game from "./components/Game";
import { Client } from "@stomp/stompjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import { Routes, Route, useNavigate, useParams } from "react-router";
import Header from "./components/Header";
import useCurrentUser from "./hooks/useCurrentUser";

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { gameId, userId } = useParams();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user === null) {
      return navigate("/login");
    }
  }, [isLoading, user, user?.id]);

  useEffect(() => {
    if (!user) return;
    const client = new Client({
      brokerURL: `ws://localhost:8080/websocket`,
      onConnect: () => {
        console.log("Connected");
        const subscription = client.subscribe(
          `/topic/user/${user?.id}`,
          (message) => queryClient.invalidateQueries("notifications")
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
  }, [user?.id]);

  return (
    <div className="App w-full h-full bg-gray-700">
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path={"/"}
          element={<Dashboard setGame={setSelectedGame} game={selectedGame} />}
        />
        <Route
          path={"/dashboard"}
          element={<Dashboard setGame={setSelectedGame} game={selectedGame} />}
        />
        <Route
          path="/game/:gameId"
          element={
            user ? (
              <Game
                stompClient={stompClient}
                game={selectedGame}
                setGame={setSelectedGame}
                user={user}
              />
            ) : null
          }
        />
      </Routes>
    </div>
  );
}

export default App;
