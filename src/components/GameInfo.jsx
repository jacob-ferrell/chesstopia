import getGame from "../api/getGame";

export default function GameInfo({game, setGame, user}) {

    const opponent = game.players.find(p => p.id !== user.id);

    async function handleClick(e) {
        e.preventDefault();
        const res = await getGame(game?.id);
        if (res.status === 200) setGame(res.data);
    }

    return(
        <div>
            <a href="" onClick={handleClick}>{opponent.email}</a>
        </div>
    );
}