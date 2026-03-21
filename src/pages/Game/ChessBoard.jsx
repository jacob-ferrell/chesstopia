import { useState, useEffect } from "react";
import getPossibleMoves from "../../api/getPossibleMoves";
import isPawnUpgrade from "../../util/isPawnUpgrade.js"
import postMove from "../../api/postMove";
import opponentIsComputer from "../../util/opponentIsComputer";
import makeComputerMove from "../../api/makeComputerMove";
import UpgradePawnModal from "../../components/modals/UpgradePawnModal";
import { useQueryClient } from "@tanstack/react-query";

export default function ChessBoard({ game, setGame, player, setLoadingMoves }) {

  const COLORS = Object.freeze({
    dark: "bg-yellow-900",
    light: "bg-yellow-600",
  });

  const PIECE_ICONS = Object.freeze({
    KING: "\u265A",
    QUEEN: "\u265B",
    ROOK: "\u265C",
    BISHOP: "\u265D",
    KNIGHT: "\u265E",
    PAWN: "\u265F",
  });

  const [board, setBoard] = useState(null);

  const [selectedPiece, setSelectedPiece] = useState(null);

  const [showUpgradePawnModal, setShowUpgradePawnModal] = useState(false);

  const queryClient = useQueryClient();

  const isMirrored = player?.color === "BLACK";
  const letters = !isMirrored ? "ABCDEFGH" : "HGFEDCBA";
  const numbers = isMirrored ? "12345678" : "87654321";
  const isPlayerTurn = player?.isTurn;

  const [movePositions, setMovePositions] = useState({});

  const mirroredStyle = {
    transform: `rotate(180deg)`,
  };

  const isDarkSpace = (y, x) => (y + x) % 2 !== 0;

  const isEnemyPiece = (color) => color !== player.color;

  function initializeBoard() {
    const board = [];

    for (let i = 0; i < 8; i++) {
      board[i] = new Array(8).fill("");
    }

    game?.pieces.forEach((piece) => {
      const { y, x } = piece?.position;
      board[y][x] = piece;
    });
    return board;
  }

  async function handleClick(e, piece, y1, x1) {
    const color = e.currentTarget.dataset.color;
    if (isEnemyPiece(color) && !isPossibleMove(y1, x1)) return;

    if (isPossibleMove(y1, x1)) {
      return await makeMove(y1, x1);
    }

    setSelectedPiece(piece);

    if (!piece) return;

    setLoadingMoves(true);

    const possibleMoves = await getPossibleMoves(game.id, piece.position.y, piece.position.x);

    setLoadingMoves(false);
    setSelectedPiece((prev) => ({ ...prev, possibleMoves }));
  }

  async function makeMove(y1, x1) {

    const { x, y } = selectedPiece?.position;

    if (isPawnUpgrade(selectedPiece, y1)) {
      setMovePositions({
        x, y, x1, y1
      })
      setShowUpgradePawnModal(true);
      setSelectedPiece(null);
      return;
    }

    optimisticallyUpdateGame(x, y, x1, y1);

    let res = await postMove(game.id, x, y, y1, x1);

    setGame(res.data);
    if (opponentIsComputer(game) && !res.data.gameOver) {
      res = await makeComputerMove(game.id);
      setGame(res.data);
    }
    queryClient.invalidateQueries("notifications");
    return setSelectedPiece(null);
  }

  function optimisticallyUpdateGame(x, y, x1, y1) {
    let gamePiecesCopy = [...game.pieces];
    const index = gamePiecesCopy.findIndex(pieces => pieces?.position?.x === x && pieces?.position?.y === y);
    gamePiecesCopy[index] = {...gamePiecesCopy[index], position: { x: x1, y: y1 }};
    setGame(prev => ({
      ...prev,
      pieces: gamePiecesCopy
    })) 
  }

  function handleMouseOver(e, y, x) {
    const isDark = isDarkSpace(y, x);
    const possibleMoves = selectedPiece?.possibleMoves;
    if (!possibleMoves?.length || !isPossibleMove(y, x)) {
      return;
    }
    if (isDark) e.currentTarget.classList.toggle(COLORS.dark);
    else e.currentTarget.classList.toggle(COLORS.light);
    e.currentTarget.classList.add("bg-green-500");
    e.currentTarget.classList.add("cursor-pointer");
  }

  function handleMouseOut(e, y, x) {
    const space = e.currentTarget;
    space.classList.remove("bg-green-500");
    if (isDarkSpace(y, x)) space.classList.add(COLORS.dark);
    else space.classList.add(COLORS.light);
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

  useEffect(() => {
    if (game?.pieces) {
      setBoard(initializeBoard());
    }
  }, [game, game?.gameOver]);

  return (
    <>
      <UpgradePawnModal
        setGame={(game) => setGame(game)}
        movePositions={movePositions}
        isOpen={showUpgradePawnModal}
        closeModal={() => setShowUpgradePawnModal(false)}
        chessPieces={PIECE_ICONS}
        game={game}
      />
      <div className="flex flex-col gap-2">
        <div className="text-xl  sm:text-2xl flex justify-between pl-9 pr-4 text-gray-200">
          {letters.split("").map((c) => (
            <div key={c}>
              <span>{c}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="text-xl sm:text-2xl flex flex-col justify-between text-gray-200">
            {numbers.split("").map((c) => (
              <div key={c}>
                <span>{c}</span>
              </div>
            ))}
          </div>
          {/* Chessboard */}
          <div
            className={
              isMirrored
                ? "shadow border-b-2 border-l-2 border-black transform rotate-180"
                : "shadow border-t-2 border-r-2 border-black"
            }
            style={{ width: "100%", maxWidth: "100vw", overflowX: "auto", overflowY: "hidden", }}
          >
            {board?.map((row, r) => (
              <div key={r} className="flex h-10 sm:h-12">
                {row?.map((col, c) => {
                  const piece = col;
                  const greenColor =
                    selectedPiece?.id === piece?.id ? "text-green-500" : "";
                  const cursor =
                    piece?.piece?.color == player?.color
                      ? "cursor-pointer"
                      : "cursor-default";
                  const isKingInCheck =
                    game?.playerInCheck === player?.color &&
                    piece?.piece?.type === "KING" &&
                    piece?.piece?.color === player?.color;
                  const bgColor = isKingInCheck
                    ? "bg-red-600"
                    : !isDarkSpace(r, c)
                    ? COLORS.light
                    : COLORS.dark;
                  return (
                    <div
                      key={r + c}
                      className={`w-10 sm:w-12 h-10 sm:h-12 text-4xl sm:text-5xl border-b-2 border-l-2 border-black ${bgColor} ${greenColor} ${cursor}`}
                      onMouseOver={(e) => handleMouseOver(e, r, c)}
                      onMouseOut={(e) => handleMouseOut(e, r, c)}
                      style={isMirrored ? mirroredStyle : null}
                      data-color={piece?.piece?.color}
                      onClick={(e) =>
                        isPlayerTurn ? handleClick(e, piece, r, c) : null
                      }
                    >
                      <span
                        className={
                          piece?.id === selectedPiece?.id
                            ? "text-green-500"
                            : piece?.piece?.color === "WHITE"
                            ? "text-gray-200"
                            : piece?.piece?.color === "BLACK"
                            ? "text-zinc-900"
                            : ""
                        }
                      >
                        {piece?.piece ? PIECE_ICONS[piece?.piece?.type] : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
