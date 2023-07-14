import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import postMove from "../../api/postMove";

export default function UpgradePawnModal({
  isOpen,
  closeModal,
  chessPieces,
  game,
  movePositions,
  setGame,

}) {
  const [upgradeSelection, setUpgradeSelection] = useState("");

  async function handleClick() {
    const { x, y, x1, y1} = movePositions;
    const res = await postMove(game.id, x, y, y1, x1, upgradeSelection);
    setGame(res.data);
    closeModal();
  }

  function formatPieceName(name) {
    return name.at(0) + name.slice(1).toLowerCase();
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
                    className="text-lg font-bold leading-6 text-gray-100"
                  >
                    Upgrade Pawn
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-200">
                      Your pawn has made it to the other side of the board.
                      Select a type of piece to upgrade it to.
                    </p>
                    <div className="flex justify-between mt-3 p-3 rounded-2xl">
                      {["QUEEN", "ROOK", "KNIGHT", "BISHOP"].map((key) => {
                        const char = chessPieces[key];
                        return (
                          <button
                            key={key}
                            onClick={() => setUpgradeSelection(key)}
                            className={`text-gray-100 hover:bg-gray-600 font-bold p-2 rounded-full w-16 flex flex-col justify-center items-center ${
                              upgradeSelection === key ? "bg-gray-600" : ""
                            }`}
                          >
                            <span className="text-3xl">{char}</span>
                            {/* <span className="text-gray-900">{key.at(0) + key.slice(1).toLowerCase()}</span> */}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      disabled={!upgradeSelection}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-b from-lime-900 to-lime-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gradient-to-b hover:from-lime-800 hover:to-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleClick}
                    >
                      {upgradeSelection
                        ? `Upgrade to ${formatPieceName(upgradeSelection)}`
                        : "Select a piece to upgrade"}
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
