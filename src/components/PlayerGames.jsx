import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import getPlayerGames from "../api/getPlayerGames";

export default function PlayerGames({setGame, user}) {
    const {data, isLoading} = useQuery(['games', user.id],  () => getPlayerGames(user.id));

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