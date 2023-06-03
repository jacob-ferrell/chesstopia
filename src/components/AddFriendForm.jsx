import { useState } from "react";
import addFriend from "../api/addFriend";
import { useQueryClient } from "@tanstack/react-query";

export default function AddFriendForm({ close }) {
  const [email, setEmail] = useState("");

  const queryClient = useQueryClient();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await addFriend(email);
      queryClient.invalidateQueries("friends");
      setEmail("");
      close();
    } catch(error) {
      alert("Error while adding " + email + ": " + error);
    }
    
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
