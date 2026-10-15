import { useEffect, useState } from "react";
import useAddFriend from "../../hooks/useAddFriend";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface AddFriendModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddFriendModal({ isOpen, closeModal }: AddFriendModalProps) {
  const [friend, setFriend] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const addFriend = useAddFriend();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!friend.trim()) return;
    setSubmitting(true);
    try {
      await addFriend(friend.trim());
      closeModal();
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    setFriend("");
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Add a friend"
      description="Enter the email address they signed up with."
      footer={
        <>
          <Button variant="ghost" type="button" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" form="add-friend-form" disabled={submitting || !friend.trim()}>
            {submitting ? "Adding…" : "Add friend"}
          </Button>
        </>
      }
    >
      <form id="add-friend-form" onSubmit={handleSubmit}>
        <Input
          label="Friend's email"
          type="email"
          autoFocus
          value={friend}
          onChange={(e) => setFriend(e.target.value)}
          placeholder="friend@example.com"
        />
      </form>
    </Modal>
  );
}
