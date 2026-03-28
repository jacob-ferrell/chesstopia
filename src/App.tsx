import "./App.css";
import { useState, useEffect } from "react";
import Game from "./pages/Game/Game";
import { Client, Stomp, StompSubscription } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import LoginPage from "./pages/Login/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Routes, Route, useNavigate } from "react-router";
import Header from "./components/Header";
import useCurrentUser from "./hooks/useCurrentUser";
import Lobby from "./pages/Lobby/Lobby";
import SignUpPage from "./pages/SignUp/SignUpPage";
import { Game as GameType } from "./types";

function App() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [subscription, setSubscription] = useState<StompSubscription | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading || user != null) return;
    if (location.pathname.includes("signup")) return;
    navigate("/login");
  }, [isLoading, user, location.pathname]);

  useEffect(() => {
    if (!user) return;
    connectStompClient();
    return () => {
      subscription?.unsubscribe();
      stompClient?.deactivate();
    };
  }, [user?.id]);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [location.pathname]);

  async function connectStompClient() {

    //const { headerName, token } = await fetchCsrfToken();
    const websocketURL = (import.meta.env.VITE_SERVER as string)
      .replace("https://", "wss://")
      .replace("http://", "ws://") + "/websocket";

    const stompClient = Stomp.client(
      websocketURL
    );
    stompClient.debug = () => {};
    setStompClient(stompClient);
    const headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      //[headerName]: token,

    };

    stompClient.connect(headers, function (_frame: unknown) {

      const subscription = stompClient.subscribe(`/topic/user/${user?.id}`, function (message) {
        queryClient.invalidateQueries()
      });
      setSubscription(subscription);
      setSubscription

    });
  }

  return (
    <div className="App w-full pt-[80px] h-full bg-gradient-to-t from-gray-700 to-gray-900 flex justify-center">
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/lobby" element={<Lobby stompClient={stompClient} />} />
        <Route
          path={"/"}
          element={<Dashboard setGame={setSelectedGame} game={selectedGame} />}
        />
        <Route
          path={"/dashboard/*"}
          element={<Dashboard setGame={setSelectedGame} game={selectedGame} />}
        ></Route>
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
