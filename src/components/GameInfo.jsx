export default function GameInfo({game, setGame, user}) {

    const opponent = game.players.find(p => p.id !== user.id);

    function handleClick(e) {
        e.preventDefault();
        setGame(game);
    }

    return(
        <div>
            <a href="" onClick={handleClick}>{opponent.email}</a>
        </div>
    );
}