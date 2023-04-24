import { useState, useEffect } from "react";
import axiosInstance from "./axios";
import "./App.css";
import ChessBoard from "./components/ChessBoard";
import PlayerGames from "./components/PlayerGames";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) return setIsAuthenticated(false);
    
  });

  async function loginAsJacob() {
    const res = await axiosInstance.post("auth/authenticate", {
      email: "boomkablamo@gmail.com",
      password: "asdf",
    });
    if (res.status === 200) setIsAuthenticated(true);
  }

  return (
    <div className="App">
      {!isAuthenticated ? (
        <button onClick={loginAsJacob}>Login As Jacob</button>
      ) : !selectedGame ? (
        <PlayerGames game={selectedGame} setGame={setSelectedGame} />
      ) : (
        <ChessBoard game={selectedGame} />
      )}
    </div>
  );
}

export default App;
