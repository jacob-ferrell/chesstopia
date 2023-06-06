import MyGames from "./MyGames";
import MyFriends from "./MyFriends";
import MyNotifications from "./MyNotifications";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ setGame }) {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full pt-4">
      <div className="flex justify-between w-full px-12">
        <MyGames setGame={setGame} />
        <MyFriends />
        <MyNotifications />
      </div>
      <button onClick={() => navigate("/lobby")}>Quick Play</button>
    </div>
  );
}
