export default function getOtherPlayer(game, currentUser) {
  const { whitePlayer, blackPlayer } = game;
  return [whitePlayer, blackPlayer].find(
    (user) => user.email !== currentUser.email
  );
}
