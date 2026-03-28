import { Game, User } from "../types";

interface FriendStats {
  open: Game[];
  won: Game[];
  lost: Game[];
  draw: Game[];
}

export default function getFriendStats(games: Game[], friend: User): FriendStats {
    const friendGamesMap: FriendStats = {
        open: [],
        won: [],
        lost: [],
        draw: [],
    }
    const gamesWithFriend = games.filter(game => {
        return game?.whitePlayer?.id === friend?.id || game?.blackPlayer?.id === friend?.id;
    })

    for (let game of gamesWithFriend) {
        if (!game.gameOver) {
            friendGamesMap.open.push(game);
            continue;
        }
        if (game.gameOver && !game.winner) {
            friendGamesMap.draw.push(game);
            continue;
        }
        if (game.winner!.id === friend.id) {
            friendGamesMap.lost.push(game);
            continue;
        }
        friendGamesMap.won.push(game);

    }
    return friendGamesMap;
}
