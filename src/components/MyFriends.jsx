import createGame from "../api/createGame";
import getFriends from "../api/getFriends";
import AddFriendForm from "./AddFriendForm";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function MyFriends({ user }) {
  const { data, isLoading } = useQuery(["friends", user?.id], () =>
    getFriends(user?.id)
  );

  const [showForm, setShowForm] = useState(false);

  async function handleChallengeClick(e) {
    e.preventDefault();
    const res = await createGame(user.id, e.target.dataset.id);
    if (res.status !== 201) alert("Error creating game");
  }

  return (
    <div className="border-solid border-2 border-black rounded-md p-2 bg-gray-500 text-white">
      <h1 className="text-">My Friends</h1>
      {!showForm && <button className="bg-purple-500" onClick={() => setShowForm(true)}>Add Friend</button>}
      {showForm && <AddFriendForm hide={() => setShowForm(false)}/>}
      {!isLoading && !showForm
        ? data?.map((f) => (
            <div key={`f-${f.id}`}>
              {f.email}{" "}
              <a onClick={handleChallengeClick} href="" data-id={f.id}>
                Challenge
              </a>
            </div>
          ))
        : null}
    </div>
  );
}
