import { useState } from "react";
import addFriend from "../api/addFriend";

export default function AddFriendForm({}) {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await addFriend(email);
    if (res.status !== 200) return alert("Error while adding friend");
    alert("Friend added");
    setEmail('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        defaultValue={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Friend's Email"
      ></input>
      <button type="submit">Add Friend</button>
    </form>
  );
}
