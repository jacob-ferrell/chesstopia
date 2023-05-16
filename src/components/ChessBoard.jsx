import { useState, useEffect } from "react";
import axiosInstance from "../axios";
import getPlayerGames from "../api/getPlayerGames";
import { useQuery } from "@tanstack/react-query";
import getPossibleMoves from "../api/getPossibleMoves";
import postMove from "../api/postMove";
import axios from "axios";
import getCurrentUser from "../api/getCurrentUser.js";

export default function ChessBoard({ game, setGame, player}) {
  const [board, setBoard] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const isMirrored = player?.color === "BLACK";
  const letters = !isMirrored ? "ABCDEFGH" : "HGFEDCBA";
  const numbers = isMirrored ? "12345678" : "87654321";
  const isPlayerTurn = player?.isTurn;

  const chessPieces = {
    KING: {
      BLACK: "\u265A",
      WHITE: "\u2654",
    },
    QUEEN: {
      BLACK: "\u265B",
      WHITE: "\u2655",
    },
    ROOK: {
      BLACK: "\u265C",
      WHITE: "\u2656",
    },
    BISHOP: {
      BLACK: "\u265D",
      WHITE: "\u2657",
    },
    KNIGHT: {
      BLACK: "\u265E",
      WHITE: "\u2658",
    },
    PAWN: {
      BLACK: "\u265F",
      WHITE: "\u2659",
    },
  };

  const mirroredStyle = {
    transform: `rotate(180deg)`,
  };

  const isRedSpace = (y, x) => (y + x) % 2 !== 0;

  const isEnemyPiece = (color) => color !== player.color;

  function initializeBoard() {
    const board = [];
    for (let i = 0; i < 8; i++) {
      board[i] = new Array(8).fill("");
    }
    game?.pieces.forEach((piece) => {
      const { y, x } = piece;
      board[y][x] = piece;
    });
    return board;
  }

  async function handleClick(e, piece, y1, x1) {
    const color = e.currentTarget.dataset.color;
    console.log(isEnemyPiece(color));
    if (isEnemyPiece(color) && !isPossibleMove(y1, x1)) return;

    if (isPossibleMove(y1, x1)) {
      return await makeMove(y1, x1);
    }
    setSelectedPiece(piece);
    if (!piece) return;
    const possibleMoves = await getPossibleMoves(game.id, piece.y, piece.x);
    setSelectedPiece((prev) => ({ ...prev, possibleMoves }));
  }

  async function makeMove(y1, x1) {
    const { x, y } = selectedPiece;
    const res = await postMove(x, y, y1, x1);
    setGame(res.data);
    return setSelectedPiece(null);
  }

  function handleMouseOver(e, y, x) {
    const isRed = isRedSpace(y, x);
    const possibleMoves = selectedPiece?.possibleMoves;
    if (!possibleMoves?.length || !isPossibleMove(y, x)) {
      return;
    }
    if (isRed) e.currentTarget.classList.toggle("bg-red-500");
    e.currentTarget.classList.add("bg-green-200");
    e.currentTarget.classList.add("cursor-pointer");
  }

  function handleMouseOut(e, y, x) {
    const space = e.currentTarget;
    space.classList.remove("bg-green-200");
    if (isRedSpace(y, x) && !space.classList.contains("bg-red-500"))
      space.classList.add("bg-red-500");
    if (isPossibleMove(y, x)) space.classList.remove("cursor-pointer");
  }

  function isPossibleMove(y, x) {
    if (
      !selectedPiece?.possibleMoves?.find(
        (move) => move.x === x && move.y === y
      )
    ) {
      return false;
    }
    return true;
  }

/*   useEffect(() => {
    const interval = setInterval(() => {
      axiosInstance
      .get(`game/${game.id}`)
      .then((data) => setGameData(data.data))
      .catch((error) => console.error(error));
    }, 5000000000000);
  }, []); */


  useEffect(() => {
    if (game?.pieces) {
      setBoard(initializeBoard());
    }
  }, [game]);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-3xl flex justify-between pl-11 pr-4">
        {letters.split("").map((c) => (
          <div key={c}>
            <span>{c}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="text-3xl flex flex-col justify-between">
          {numbers.split("").map((c) => (
            <div key={c}>
              <span>{c}</span>
            </div>
          ))}
        </div>
        <div
          className="border-t-2 border-r-2 border-black"
          style={isMirrored ? mirroredStyle : null}
        >
          {board?.map((row, r) => (
            <div key={r} className="flex h-12">
              {row?.map((col, c) => {
                const piece = col;
                const greenColor =
                  selectedPiece?.id === piece.id ? "text-green-500" : "";
                const cursor =
                  piece?.color == player?.color
                    ? "cursor-pointer"
                    : "cursor-default";
                const bgColor = !isRedSpace(r, c)
                  ? "bg-gray-300"
                  : "bg-red-500";
                return (
                  <div
                    key={r + c}
                    className={`w-12 h-12 text-5xl border-b-2 border-l-2 border-black ${bgColor} ${greenColor} ${cursor}`}
                    onMouseOver={(e) => handleMouseOver(e, r, c)}
                    onMouseOut={(e) => handleMouseOut(e, r, c)}
                    style={isMirrored ? mirroredStyle : null}
                    data-color={piece?.color}
                    onClick={(e) => isPlayerTurn ? handleClick(e, piece, r, c) : null }
                  >
                    <span>
                      {piece ? chessPieces[piece.type][piece.color] : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
