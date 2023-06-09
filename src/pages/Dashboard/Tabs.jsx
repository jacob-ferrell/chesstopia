import { Tab } from "@headlessui/react";
import { useState } from "react";
import MyFriends from "./MyFriends";
import MyGames from "./MyGames";
import MyNotifications from "./MyNotifications";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ setGame }) {
  let [pages] = useState({
    "My Games": <MyGames setGame={setGame} classNames={classNames} />,
    "My Friends": <MyFriends />,
    "Notifications": <MyNotifications />,
  });

  return (
    <div className="w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-700 p-1">
          {Object.keys(pages).map((page) => (
            <Tab
              key={page}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-100 hover:bg-white/[0.12]"
                )
              }
            >
              {page}
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
