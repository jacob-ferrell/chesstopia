import createGame from "../api/createGame";
import AddFriendForm from "./AddFriendForm";

export default function MyFriends({ user }) {
  if (!user) return;

  const { friends } = user;

  async function handleChallengeClick(e) {
    e.preventDefault();
    const res = await createGame(user.id, e.target.dataset.id);
    if (res.status !== 201) alert("Error creating game");

  }

  return (
    <div className="border-solid border-2 border-black rounded-md p-2 bg-gray-500 text-white">
      <h1 className="text-">My Friends</h1>
      <AddFriendForm />
      {friends?.map((f) => (
        <div>
          {f.email}{" "}
          <a onClick={handleChallengeClick} href="" data-id={f.id}>
            Challenge
          </a>
        </div>
      ))}
    </div>
  );
}
