
import MyGames from "./MyGames";
import MyFriends from "./MyFriends";
import MyNotifications from "./MyNotifications";

export default function Dashboard({ setGame }) {

  return (
    <div className="w-full h-full pt-4">
      <div className="flex justify-between w-full px-12">
        <MyGames setGame={setGame} />
        <MyFriends />
        <MyNotifications />
      </div>
    </div>
  );
}
