import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import useFriends from "../../hooks/useFriends";
import useCreateGame from "../../hooks/useCreateGame";
import { useNavigate } from "react-router-dom";

export default function NewGameModal({ isOpen, closeModal }) {
  const { friends, isLoading } = useFriends();
  const createGame = useCreateGame();
  const navigate = useNavigate();

  async function handleClick(e) {
    e.preventDefault();
    const res = await createGame(e.target.dataset.id);
    navigate(`/game/${res.data.id}`);
    closeModal();
  }

  function renderFriends() {
    return (
      <ul className="bg-gray-100 p-3 rounded text-center text-gray-900 font-medium">
        {isLoading ? (
          <li>Loading...</li>
        ) : !friends || friends.length === 0 ? (
          <li>No friends found.</li>
        ) : (
          friends.map((f) => (
            <li key={`ng-f-${f.id}`}>
              <a onClick={handleClick} href="" data-id={f.id}>
                {f.email}
              </a>
            </li>
          ))
        )}
      </ul>
    );
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-200"
                  >
                    Start a new game
                  </Dialog.Title>
                  <p className="text-sm text-gray-200">
                    Select a friend to start a new game with
                  </p>
                  {renderFriends()}
                  <div className="mt-4 flex justify-between">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-b from-lime-900 to-lime-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gradient-to-b hover:from-lime-800 hover:to-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Start game
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-b from-red-900 to-red-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gradient-to-b hover:from-red-800 hover:to-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
