export default function getFriendStats(games, friend) {
    const friendGamesMap = {
        open: [],
        won: [],
        lost: [],
    }
    const gamesWithFriend = games.filter(game => {
        return game?.whitePlayer?.id === friend?.id || game?.blackPlayer?.id === friend?.id;
    })

    for (let game of gamesWithFriend) {
        if (game.winner === null) {
            friendGamesMap.open.push(game);
            continue;
        }
        if (game.winner.id === friend.id) {
            friendGamesMap.lost.push(game);
            continue;
        }
        gamesWithFriend.won.push(game);

    }
    return friendGamesMap;
}