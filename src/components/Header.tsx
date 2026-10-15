import useCurrentUser from "../hooks/useCurrentUser";
import useNotifications from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Settings } from "react-feather";
import useLogout from "../hooks/useLogout";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Avatar from "./ui/Avatar";
import cn from "./ui/cn";

export default function Header() {
  const { user, isLoading: userIsLoading } = useCurrentUser();
  const navigate = useNavigate();
  const { notifications, isLoading } = useNotifications();
  const logout = useLogout();

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gray-900/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-xl items-center justify-between px-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="focus-ring -ml-1 flex items-center gap-2.5 rounded-xl px-1 py-1"
          aria-label="Chesstopia home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-yellow-500 to-yellow-700 font-chess text-2xl leading-none text-yellow-950 shadow-md shadow-yellow-900/40">
            ♞
          </span>
          <span className="text-xl font-bold tracking-tight text-gray-50">Chesstopia</span>
        </button>

        {!userIsLoading && !isLoading && user && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate("/dashboard/notifications")}
              aria-label={
                unreadCount ? `${unreadCount} unread notifications` : "Notifications"
              }
              className="focus-ring relative rounded-xl p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Bell className="h-5 w-5" />
              {!!unreadCount && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-gray-900">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <Menu as="div" className="relative">
              <Menu.Button
                className="focus-ring ml-1 rounded-full"
                aria-label="Account menu"
              >
                <Avatar name={user.firstName} size="sm" className="ring-2 ring-white/10" />
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
                <Menu.Items className="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-xl bg-gray-800 shadow-2xl ring-1 ring-white/10 focus:outline-none">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-50">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Menu.Item disabled>
                      {({ active }) => (
                        <button
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500",
                            active && "bg-white/5"
                          )}
                        >
                          <Settings className="h-4 w-4" />
                          Profile settings
                          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                            Soon
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => logout()}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-200",
                            active && "bg-white/10 text-white"
                          )}
                        >
                          <LogOut className="h-4 w-4 text-yellow-500" />
                          Log out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        )}
      </div>
    </header>
  );
}
