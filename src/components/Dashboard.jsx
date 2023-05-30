import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MyGames from "./MyGames";
import MyFriends from "./MyFriends";
import Game from "./Game";
import MyNotifications from "./MyNotifications";
import getNotifications from "../api/getNotifications";
import getCurrentUser from "../api/getCurrentUser";

export default function Dashboard({ setGame, game }) {
  const user = useQuery(["user"], getCurrentUser);

  return (
    <div className="w-full h-full pt-4">
      {!user.isLoading && !!user.data ? (
        <div className="flex justify-between w-full px-12">
          <MyGames setGame={setGame} />
          <MyFriends />
          <MyNotifications />
        </div>
      ) : null}
    </div>
  );
}
