import AddFriendForm from "../../pages/Dashboard/AddFriendForm";
import Modal from "./Modal";

export default function AddFriendModal({isOpen, closeModal}) {

    return (
        <Modal title={"Add Friend"} isOpen={isOpen} closeModal={closeModal}>
            <AddFriendForm close={closeModal} />
        </Modal>
    );
}