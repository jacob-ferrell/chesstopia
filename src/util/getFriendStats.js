export default function getFriendStats(games, friend) {
    const friendGamesMap = {
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
        if (game.winner.id === friend.id) {
            friendGamesMap.lost.push(game);
            continue;
        }
        gamesWithFriend.won.push(game);

    }
    return friendGamesMap;
}