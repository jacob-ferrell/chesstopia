import { useState, useEffect } from "react";
import axiosInstance from "../axios";
import axios from "axios";

export default function ChessBoard(props) {
  const [gameData, setGameData] = useState(null);
  const [board, setBoard] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [player, setPlayer] = useState({ color: "WHITE" });
  const [isMirrored, setIsMirrored] = useState(false);

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

  function initializeBoard() {
    const board = [];
    for (let i = 0; i < 8; i++) {
      board[i] = new Array(8).fill("");
    }
    gameData?.pieces.forEach((piece) => {
      const { y, x } = piece;
      board[y][x] = piece;
    });
    return board;
  }

  async function handleClick(e, piece, y1, x1) {
    if (e.target.dataset.color !== player.color && !selectedPiece) {
      return;
    }
    if (selectedPiece && isPossibleMove(y1, x1)) {
      const { x, y } = selectedPiece;
      const res = await axiosInstance.post(
        `game/1/move?x0=${x}&y0=${y}&x1=${x1}&y1=${y1}`
      );
      setGameData(res.data);
      return setSelectedPiece(null);
    }
    setSelectedPiece(piece);
    const res = await axiosInstance.get(
      `game/${gameData.id}/possible-moves?x=${piece.x}&y=${piece.y}`
    );
    const possibleMoves = res.data.possibleMoves;
    setSelectedPiece((prev) => ({ ...prev, possibleMoves }));
  }

  function handleMouseOver(e, y, x) {
    const possibleMoves = selectedPiece?.possibleMoves;
    if (!possibleMoves?.length || !isPossibleMove(y, x)) {
      return;
    }
    e.target.classList.add("bg-green-200");
  }

  function handleMouseOut(e, y, x) {
    e.target.classList.remove("bg-green-200");
  }

  function isPossibleMove(y, x) {
    if (
      !selectedPiece?.possibleMoves.find((move) => move.x === x && move.y === y)
    ) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    axiosInstance
      .get("game/1")
      .then((data) => setGameData(data.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (gameData?.pieces) {
      setBoard(initializeBoard());
    }
  }, [gameData]);

  useEffect(() => {
    setIsMirrored(player?.color === "BLACK");
  }, [player]);

  return (
    <div style={isMirrored ? mirroredStyle : null}>
      {board?.map((row, r) => (
        <div key={r} className="flex h-12 border-t-2 border-r-2 border-black">
          {row?.map((col, c) => {
            const piece = col;
            const greenColor =
              selectedPiece?.id === piece.id ? "text-green-500" : "";
            const cursor =
              piece?.color == player?.color
                ? "cursor-pointer"
                : "cursor-default";
            const bgColor = (r + c) % 2 === 0 ? "bg-gray-300" : "bg-red-500";
            return (
              <div
                key={r + c}
                className={`w-12 h-12 text-5xl border-b-2 border-l-2 border-black ${bgColor} ${greenColor} ${cursor}`}
                onClick={(e) => handleClick(e, piece, r, c)}
                onMouseOver={(e) => handleMouseOver(e, r, c)}
                onMouseOut={(e) => handleMouseOut(e, r, c)}
                data-color={piece?.color}
                style={isMirrored ? mirroredStyle : null}
              >
                <span >
                  {piece ? chessPieces[piece.type][piece.color] : ""}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
