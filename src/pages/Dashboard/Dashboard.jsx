import MyGames from "./MyGames";
import MyFriends from "./MyFriends";
import MyNotifications from "./MyNotifications";
import { useNavigate } from "react-router-dom";
import Tabs from "./Tabs";

export default function Dashboard({ setGame }) {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full pt-4 flex flex-col gap-2 items-center">
      <button
        className="w-32 h-8 rounded bg-gray-700 text-gray-100 font-bold hover:bg-opacity-30"
        onClick={() => navigate("/lobby")}
      >
        Quick Play
      </button>
      <Tabs setGame={setGame} /> 
    </div>
  );
}
