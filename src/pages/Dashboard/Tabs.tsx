import { Tab } from "@headlessui/react";
import { useState } from "react";
import { Zap, ChevronRight } from "react-feather";
import MyFriends from "./MyFriends";
import MyGames from "./MyGames";
import MyNotifications from "./MyNotifications";
import { useLocation, useNavigate } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";
import { Game } from "../../types";
import cn from "../../components/ui/cn";

const pageMap: Record<string, string> = {
  games: "My Games",
  friends: "My Friends",
  notifications: "Notifications",
};

interface TabsProps {
  setGame: (game: Game | null) => void;
}

export default function Tabs({ setGame }: TabsProps) {
  const [pages] = useState<Record<string, React.ReactNode>>({
    "My Games": <MyGames setGame={setGame} />,
    "My Friends": <MyFriends />,
    Notifications: <MyNotifications />,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, isLoading } = useNotifications();
  const unread = isLoading ? 0 : notifications?.filter((n) => !n.read).length ?? 0;

  // The active tab is driven by the URL (/dashboard/games|friends|notifications).
  const routeKeys = Object.keys(pageMap);
  const segment = location.pathname.split("/").filter(Boolean).at(-1) ?? "";
  const selectedIndex = Math.max(0, routeKeys.indexOf(segment));

  return (
    <div className="flex w-full flex-col gap-4">
      <button
        type="button"
        onClick={() => navigate("/lobby")}
        className="focus-ring group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 p-4 text-left text-yellow-950 shadow-card transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 sm:p-5"
      >
        <span className="absolute -right-6 -top-10 select-none font-chess text-[9rem] leading-none text-yellow-900/15 transition-transform duration-300 group-hover:rotate-6">
          ♛
        </span>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-950/15 ring-1 ring-yellow-950/10">
          <Zap className="h-6 w-6" />
        </span>
        <span className="relative flex-1">
          <span className="block text-lg font-bold leading-tight">Quick Play</span>
          <span className="block text-sm text-yellow-950/80">
            Get matched with another player, or challenge the computer.
          </span>
        </span>
        <ChevronRight className="relative h-5 w-5 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5" />
      </button>

      <Tab.Group selectedIndex={selectedIndex} onChange={(i) => navigate(`/dashboard/${routeKeys[i]}`)}>
        <Tab.List className="flex gap-1 rounded-xl bg-gray-800/80 p-1 ring-1 ring-white/10">
          {Object.keys(pages).map((page) => (
            <Tab
              key={page}
              className={({ selected }) =>
                cn(
                  "focus-ring flex w-full items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-[13px] font-semibold leading-5 transition-colors sm:gap-2 sm:text-sm",
                  selected
                    ? "bg-gray-50 text-gray-900 shadow"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )
              }
            >
              {({ selected }) => (
                <>
                  <span className="truncate">{page}</span>
                  {page === "Notifications" && unread > 0 && (
                    <span
                      className={cn(
                        "flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-bold leading-none",
                        selected ? "bg-red-500 text-white" : "bg-red-500/90 text-white"
                      )}
                    >
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-3">
          {Object.keys(pages).map((page, idx) => (
            <Tab.Panel
              key={idx}
              className="focus-ring rounded-2xl bg-white p-3 text-gray-900 shadow-card ring-1 ring-black/5 [color-scheme:light] sm:p-4"
            >
              {pages[page]}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
