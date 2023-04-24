import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import getPlayerGames from "../api/getPlayerGames";

export default function PlayerGames({game, setGame}) {
    const {data, isLoading} = useQuery(['games', 1],  () => getPlayerGames(1));

    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            {data?.map((game, i) => 
            <div key={'g' + i}>
                <div>White: {game.whitePlayer.name}</div>
                <div>Black: {game.players.find(p => p.id !== game.whitePlayer.id).name}</div>
                <button onClick={() => setGame(game)}>Play</button>
            </div>)}
        </div>
    );
}