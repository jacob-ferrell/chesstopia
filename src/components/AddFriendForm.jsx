import { useState } from "react";
import addFriend from "../api/addFriend";
import { useQueryClient } from "@tanstack/react-query";

export default function AddFriendForm({ hide }) {
  const [email, setEmail] = useState("");

  const queryClient = useQueryClient();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await addFriend(email);
    if (res.status !== 200) return alert("Error while adding friend");
    queryClient.invalidateQueries("friends");
    setEmail("");
    hide();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        defaultValue={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Friend's Email"
        className="text-black"
      ></input>
      <button type="submit">Add Friend</button>
    </form>
  );
}
