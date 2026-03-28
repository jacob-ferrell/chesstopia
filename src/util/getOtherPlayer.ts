import { Game, User } from "../types";

export default function getOtherPlayer(game: Game, currentUser: User): User | undefined {
  const { whitePlayer, blackPlayer } = game;
  return [whitePlayer, blackPlayer].find(
    (user) => user?.email !== currentUser?.email
  );
}
