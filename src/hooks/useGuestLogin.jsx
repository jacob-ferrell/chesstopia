import generateRandomString from "../util/generateRandomString";
import useAddFriend from "./useAddFriend";
import useSignUp from "./useSignUp";
import useCreateGame from "./useCreateGame";
import { useState } from "react";

export default function useGuestLogin() {
  const { signUp } = useSignUp();
  const addFriend = useAddFriend();
  const createGame = useCreateGame();

  const [loading, setLoading] = useState(true);

  async function addFriendAndCreateGames() {
    await addFriend("boomkablamo@gmail.com");
    await createGame(1);
    const res = await createGame(-1);
    const { whitePlayer, id } = res.data;
    if (whitePlayer.email === "computer@chesstopia") {
      await makeComputerMove(id);
    }
  }

  async function createGuest() {
    setLoading(true);
    await signUp();
    await addFriendAndCreateGames();
    setLoading(false);
  }

  return { loading, createGuest };

}
