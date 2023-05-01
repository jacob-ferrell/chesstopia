import { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";
import Stomp from "stompjs";

export default function Game({game, user}) {

    return (
        <div>
            <ChessBoard game={game} user={user} />
        </div>
    );
}
