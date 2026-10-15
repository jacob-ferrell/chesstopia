import { useState } from "react";
import { ChevronRight } from "react-feather";
import useFriends from "../../hooks/useFriends";
import useCreateGame from "../../hooks/useCreateGame";
import { useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import Spinner from "../spinners/Spinner";
import displayName from "../../util/displayName";
import cn from "../ui/cn";

interface NewGameModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function NewGameModal({ isOpen, closeModal }: NewGameModalProps) {
  const { friends, isLoading } = useFriends();
  const createGame = useCreateGame();
  const navigate = useNavigate();
  const [creatingFor, setCreatingFor] = useState<string | null>(null);

  async function handleClick(friendId: string) {
    if (creatingFor) return;
    setCreatingFor(friendId);
    try {
      const res = await createGame(friendId);
      if (!res) return;
      navigate(`/game/${res.data.id}`);
      closeModal();
    } finally {
      setCreatingFor(null);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Start a new game"
      description="Pick a friend to challenge. They'll be notified right away."
      footer={
        <Button variant="ghost" onClick={closeModal}>
          Cancel
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner text="Loading friends…" />
        </div>
      ) : !friends || friends.length === 0 ? (
        <p className="rounded-xl bg-gray-900/50 px-4 py-6 text-center text-sm text-gray-400 ring-1 ring-white/5">
          You haven't added any friends yet. Add one from the Friends tab, or use Quick Play.
        </p>
      ) : (
        <ul className="nice-scroll -mx-1 max-h-72 overflow-y-auto">
          {friends.map((f) => {
            const busy = creatingFor === f.id;
            const name = displayName(f);
            return (
              <li key={`ng-f-${f.id}`}>
                <button
                  type="button"
                  disabled={!!creatingFor}
                  onClick={() => handleClick(f.id)}
                  className={cn(
                    "focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    "hover:bg-white/5 disabled:cursor-wait",
                    busy && "bg-white/5"
                  )}
                >
                  <Avatar name={f.firstName ?? f.email} size="sm" tone="slate" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-100">{name}</span>
                    {name !== f.email && (
                      <span className="block truncate text-xs text-gray-400">{f.email}</span>
                    )}
                  </span>
                  {busy ? (
                    <Spinner size="sm" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
