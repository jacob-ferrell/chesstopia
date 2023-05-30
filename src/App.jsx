import "./App.css";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axios";
import getCurrentUser from "./api/getCurrentUser";
import Game from "./components/Game";
import { Client } from "@stomp/stompjs";
import getGame from "./api/getGame";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import { Routes, Route, useNavigate, useParams } from "react-router";
import Header from "./components/Header";

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  const navigate = useNavigate();
  const { gameId, userId } = useParams();
  const user = useQuery(["user"], getCurrentUser, {enabled: false});

  useEffect(() => {
    if (!user.isLoading && !user.data) {
      navigate('/login');
    }
  }, [user.isLoading, user.data])


/*   useEffect(() => {
    if (!localStorage.getItem("token")) return navigate("/login");
    if (user) return;
    getCurrentUser()
      .then((res) => {
        setUser(res.data);
        navigate(`/user/${res.data.id}/dashboard`);
      })
      .catch((error) => {
        localStorage.removeItem("token");
        return navigate("/login");
      });
  }, [localStorage.getItem("token")]); */

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
  }, [user?.id]);

  return (
    <div className="App w-full h-full bg-gray-700">
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/user/:userId/dashboard"
          element={
            <Dashboard
              setGame={setSelectedGame}
              game={selectedGame}
            />
          }
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
