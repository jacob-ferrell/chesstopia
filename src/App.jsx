import "./App.css";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axios";
import ChessBoard from "./components/ChessBoard";
import PlayerGames from "./components/MyGames";
import getCurrentUser from "./api/getCurrentUser";
import Game from "./components/Game";
import getGame from "./api/getGame";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import { Routes, Route, useNavigate } from "react-router";
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) return navigate("/login");
    getCurrentUser().then((res) => {
      if (res.status !== 200) return localStorage.removeItem("token");
      setUser(res.data);
    });
  }, [localStorage.getItem("token")]);

  async function loginAsJacob() {
    const res = await axiosInstance.post("auth/authenticate", {
      email: "boomkablamo@gmail.com",
      password: "asdf",
    });
    if (res.status !== 200) return;
    getCurrentUser().then((res) => {
      if (res.status !== 200) return;
      console.log(res);
      setUser(res.data);
    });
  }

  async function loginAsCindy() {
    const res = await axiosInstance.post("auth/authenticate", {
      email: "cindy@gmail.com",
      password: "asdf",
    });
    if (res.status !== 200) return;
    getCurrentUser().then((res) => {
      if (res.status !== 200) return;
      console.log(res);
      setUser(res.data);
    });
  }

  return (
    <div className="App w-full h-full bg-gray-700">
      <Header user={user}/>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route
          path="/"
          element={
            <Dashboard
              user={user}
              setGame={setSelectedGame}
              game={selectedGame}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
