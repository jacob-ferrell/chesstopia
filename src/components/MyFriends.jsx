import createGame from "../api/createGame";
import AddFriendForm from "./AddFriendForm";
import { useState } from "react";
import useFriends from "../hooks/useFriends";
import AddFriendModal from "./modals/AddFriendModal";

export default function MyFriends() {
  const { friends, isLoading } = useFriends();

  const [showModal, setShowModal] = useState(false);

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
    <div className="border-solid border-2 border-black rounded-md p-4 bg-gray-500 text-white">
      <div className="flex gap-3 justify-center items-center">
        <h1 className="text-4xl">My Friends</h1>
        <button
          className="bg-purple-500 w-12 h-12 rounded-full"
          onClick={() => setShowModal(true)}
        >
          <span className="text-white text-2xl font-bold">+</span>
        </button>
      </div>
      <AddFriendModal
        closeModal={() => setShowModal(false)}
        isOpen={showModal}
      />
      {renderFriends()}
    </div>
  );
}
