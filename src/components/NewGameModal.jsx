import { useQueryClient } from "@tanstack/react-query";
import Modal from "./Modal";
import useFriends from "../hooks/useFriends";
import useCreateGame from "../hooks/useCreateGame";

export default function NewGameModal({ closeModal, isOpen }) {
  const { friends, isLoading } = useFriends();
  const queryClient = useQueryClient();
  const createGame = useCreateGame();

  async function handleClick(e) {
    e.preventDefault();
    await createGame(e.target.dataset.id);
    closeModal();
    
  }

  function renderFriends() {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (!friends || friends.length === 0) {
      return <p>No friends found.</p>;
    }

    return (
      <ul>
        {friends.map((f) => (
          <li key={`ng-f-${f.id}`}>
            <a onClick={handleClick} href="" data-id={f.id}>
              {f.email}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Modal title={"Start New Game"} closeModal={closeModal} isOpen={isOpen}>
      <p>Select a friend to begin a new game</p>
      {renderFriends()}
    </Modal>
  );
}
