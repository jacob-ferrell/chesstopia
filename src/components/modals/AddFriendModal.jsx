import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import useAddFriend from "../../hooks/useAddFriend";

export default function AddFriendModal({ isOpen, closeModal }) {
  const [friend, setFriend] = useState("");

  const addFriend = useAddFriend();

  async function handleSubmit(e) {
    e.preventDefault();
    await addFriend(friend);
    closeModal();
  }

  useEffect(() => {
    setFriend("");
  }, [isOpen])

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
                    Add a friend
                  </Dialog.Title>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-2">
                      <p className="text-sm text-gray-200">
                        Enter the email or username of the friend you wish to add
                      </p>
                      <input
                        onChange={(e) => setFriend(e.target.value)}
                        defaultValue={friend}
                        className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 mt-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                      ></input>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-b from-lime-900 to-lime-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gradient-to-b hover:from-lime-800 hover:to-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Add to my friends list
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-b from-red-900 to-red-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gradient-to-b hover:from-red-800 hover:to-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
