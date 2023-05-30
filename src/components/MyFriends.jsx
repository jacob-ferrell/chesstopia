import createGame from "../api/createGame";
import getCurrentUser from "../api/getCurrentUser";
import getFriends from "../api/getFriends";
import AddFriendForm from "./AddFriendForm";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useFriends from "../hooks/useFriends";

export default function MyFriends() {


  const { friends, isLoading } = useFriends();

  const [showForm, setShowForm] = useState(false);

  async function handleChallengeClick(e) {
    e.preventDefault();
    try {
      await createGame(e.target.dataset.id);
    } catch (error) {
      alert("Error creating game: " + error);
    }
  }

  function renderFriends() {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (!friends || friends.length === 0) {
      return <p>No friends found.</p>;
    }

    return friends.map((f) => (
      <div key={`f-${f.id}`}>
        {f.email}{" "}
        <a onClick={handleChallengeClick} href="" data-id={f.id}>
          Challenge
        </a>
      </div>
    ));
  }

  return (
    <div className="border-solid border-2 border-black rounded-md p-2 bg-gray-500 text-white">
      <h1 className="text-">My Friends</h1>
      {!showForm && (
        <button className="bg-purple-500" onClick={() => setShowForm(true)}>
          Add Friend
        </button>
      )}
      {showForm && <AddFriendForm hide={() => setShowForm(false)} />}
      {renderFriends()}
    </div>
  );
}
