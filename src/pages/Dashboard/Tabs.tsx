import { Tab } from "@headlessui/react";
import { useState, useEffect, useRef } from "react";
import MyFriends from "./MyFriends";
import MyGames from "./MyGames";
import MyNotifications from "./MyNotifications";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";
import { Game } from "../../types";

const pageMap: Record<string, string> = {
  games: "My Games",
  friends: "My Friends",
  notifications: "Notifications",
};

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

interface TabsProps {
  setGame: (game: Game | null) => void;
}

export default function Tabs({ setGame }: TabsProps) {
  let [pages] = useState<Record<string, React.ReactNode>>({
    "My Games": <MyGames setGame={setGame} classNames={classNames} />,
    "My Friends": <MyFriends />,
    Notifications: <MyNotifications />,
  });

  const tabRefs: Record<string, React.RefObject<HTMLButtonElement | null>> = {
    "My Games": useRef<HTMLButtonElement>(null),
    "My Friends": useRef<HTMLButtonElement>(null),
    Notifications: useRef<HTMLButtonElement>(null),
  };

  const navigate = useNavigate();
  const { notifications, isLoading } = useNotifications();

  function getUnreadNotifications(): number | undefined {
    if (isLoading || !notifications) return;
    return notifications.filter((n) => !n.read).length;
  }

  function handleTabClick(page: string) {
    navigate(
      `/dashboard/${Object.keys(pageMap).find((k) => pageMap[k] === page)}`
    );
  }

  useEffect(() => {
    const path = location.hash.split("/").at(-1);
    if (!path || !Object.keys(pageMap).includes(path)) return tabRefs["My Games"].current?.click();
    tabRefs[pageMap[path]].current?.click();
  }, [location.hash]);

  return (
    <div className="w-full max-w-xl px-2 py-6 sm:px-0">
      <button
        className="w-full p-3 mb-2 rounded-xl bg-gradient-to-b from-gray-500 to-gray-700 font-medium"
        onClick={() => navigate("/lobby")}
      >
        Quick Play
      </button>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gradient-to-b from-gray-500 to-gray-700 p-1">
          {Object.keys(pages).map((page) => (
            <Tab
              key={page}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-gray-50 shadow text-gray-900"
                    : "text-gray-100 hover:bg-white/[0.12]"
                )
              }
              ref={tabRefs[page] as React.RefObject<HTMLButtonElement>}
              onClick={() => handleTabClick(page)}
            >
              {page === "Notifications" &&
              !isLoading &&
              getUnreadNotifications()
                ? page + `(${getUnreadNotifications()})`
                : page}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className={"mt-2"}>
          {Object.keys(pages).map((page, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              {pages[page]}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
