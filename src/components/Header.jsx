import getFirstChar from "../util/getFirstChar";
import useCurrentUser from "../hooks/useCurrentUser";
import useNotifications from "../hooks/useNotifications";
import { useNavigate, Link } from "react-router-dom";
import { Bell, LogOut, Settings } from "react-feather";
import useLogout from "../hooks/useLogout";
import { useEffect, useState, Fragment, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";

export default function Header({}) {
  const { user, isLoading: userIsLoading } = useCurrentUser();
  const navigate = useNavigate();
  const { notifications, isLoading } = useNotifications();
  const logout = useLogout();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    setUnreadCount(notifications?.filter((n) => !n.read).length);
  }, [isLoading, notifications]);

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent text-white p-4 flex justify-between items-center">
      <div
        onClick={() => navigate("/")}
        className="flex gap-2 items-center justify-center cursor-pointer"
      >
        <div className="sm:text-5xl text-2xl">♞</div>
        <h1 className="sm:text-4xl text-lg">Chesstopia</h1>
      </div>
      {!userIsLoading && !isLoading && user && (
        <div className="flex gap-5 items-center relative">
          <Bell
            className="text-gray-100 cursor-pointer"
            onClick={() => navigate("/dashboard/notifications")}
          />
          {!!unreadCount && (
            <div className="absolute bottom-0 left-4 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center opacity-90">
              <span className="text-gray-100 font-medium text-xs">
                {unreadCount}
              </span>
            </div>
          )}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="bg-yellow-600 font-bold cursor-pointer text-yellow-900 px-3 py-1 rounded-full flex justify-center items-center">
              {getFirstChar(user.firstName)}
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-violet-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-4`}
                      >
                        {active ? (
                          <Settings className="text-violet-200 h-5 w-5" />
                        ) : (
                          <Settings className="text-violet-400 h-5 w-5" />
                        )}
                        Profile Settings
                      </button>
                    )}
                  </Menu.Item>
                </div>

                <div className="px-1 py-1">
                  <Menu.Item onClick={() => logout()}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-violet-500 text-gray-100" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-4`}
                      >
                        {active ? (
                          <LogOut className="text-violet-200 h-5 w-5" />
                        ) : (
                          <LogOut className="text-violet-400 h-5 w-5" />
                        )}
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      )}
    </header>
  );
}

function EditInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function DeleteInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}
