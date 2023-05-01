import "./App.css";
import { useState, useEffect } from "react";
import axiosInstance from "./axios";
import ChessBoard from "./components/ChessBoard";
import PlayerGames from "./components/PlayerGames";
import getCurrentUser from "./api/getCurrentUser";
import Game from "./components/Game";

function App() {
  const [user, setUser] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    getCurrentUser().then((res) => {
      if (res.status !== 200) return;
      setUser(res.data);
    });
  }, []);

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
    <div className="App">
      {!user ? (
        <>
          <button onClick={loginAsJacob}>Login As Jacob</button>
          <button onClick={loginAsCindy}>Login As Cindy</button>
        </>
      ) : !selectedGame ? (
        <PlayerGames user={user} setGame={setSelectedGame} />
      ) : (
        <Game game={selectedGame} user={user} />
      )}
    </div>
  );
}

export default App;
