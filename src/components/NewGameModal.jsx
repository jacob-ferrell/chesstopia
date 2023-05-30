import { useQuery } from "@tanstack/react-query";
import Modal from "./Modal";
import getFriends from "../api/getFriends";
import getCurrentUser from "../api/getCurrentUser";

export default function NewGameModal({ title, closeModal, isOpen }) {
    const user = useQuery(["user"], getCurrentUser);
    const { data, isLoading } = useQuery(
      ["friends"],
      () => getFriends(user?.id),
      { enabled: !user.isLoading && !!user.data }
    );
    
    async function handleClick(e) {
        try {

        } catch(error) {

        }
    }
    return (
    <Modal
      title={"Start New Game"}
      closeModal={closeModal}
      isOpen={isOpen}
    >
        <p>Select a friend to begin a new game</p>
        <ul>
        {!isLoading ? data?.map(f => <li><a href="">{f.email}</a></li>) : null}
        </ul>
        
    </Modal>
  );
}
