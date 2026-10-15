import { useState, useEffect } from "react";
import getPossibleMoves from "../../api/getPossibleMoves";
import isPawnUpgrade from "../../util/isPawnUpgrade";
import postMove from "../../api/postMove";
import opponentIsComputer from "../../util/opponentIsComputer";
import makeComputerMove from "../../api/makeComputerMove";
import UpgradePawnModal from "../../components/modals/UpgradePawnModal";
import { useQueryClient } from "@tanstack/react-query";
import { ChessPiece, Game, MovePositions, Player, PieceType } from "../../types";
import cn from "../../components/ui/cn";

import React from "react";

interface ChessBoardProps {
  game: Game;
  setGame: React.Dispatch<React.SetStateAction<Game | null>>;
  player: Player | null;
  setLoadingMoves: (loading: boolean) => void;
}

type BoardCell = ChessPiece | "";
type Board = BoardCell[][];

interface SelectedPiece extends ChessPiece {
  possibleMoves?: { x: number; y: number }[];
}

export const PIECE_ICONS: Record<PieceType, string> = Object.freeze({
  KING: "♚",
  QUEEN: "♛",
  ROOK: "♜",
  BISHOP: "♝",
  KNIGHT: "♞",
  PAWN: "♟",
});

const FILES = "abcdefgh";

export default function ChessBoard({ game, setGame, player, setLoadingMoves }: ChessBoardProps) {
  const [board, setBoard] = useState<Board | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<SelectedPiece | null>(null);
  const [showUpgradePawnModal, setShowUpgradePawnModal] = useState(false);
  const [movePositions, setMovePositions] = useState<MovePositions>({ x: 0, y: 0, x1: 0, y1: 0 });

  const queryClient = useQueryClient();

  const isMirrored = player?.color === "BLACK";
  const isPlayerTurn = !!player?.isTurn && !game.gameOver;

  const isDarkSpace = (y: number, x: number) => (y + x) % 2 !== 0;
  const isOwnPiece = (piece: BoardCell) => !!piece && piece.piece.color === player?.color;

  function initializeBoard(): Board {
    const board: Board = [];
    for (let i = 0; i < 8; i++) {
      board[i] = new Array(8).fill("");
    }
    game?.pieces.forEach((piece) => {
      const { y, x } = piece?.position;
      board[y][x] = piece;
    });
    return board;
  }

  async function handleClick(piece: BoardCell, y1: number, x1: number) {
    if (!isPlayerTurn) return;

    if (isPossibleMove(y1, x1)) {
      return await makeMove(y1, x1);
    }

    // Clicking an enemy piece (that isn't a capture target) or an empty square deselects.
    if (!isOwnPiece(piece)) {
      setSelectedPiece(null);
      return;
    }

    // Re-clicking the selected piece deselects it.
    if (selectedPiece?.id === (piece as ChessPiece).id) {
      setSelectedPiece(null);
      return;
    }

    setSelectedPiece(piece as ChessPiece);
    setLoadingMoves(true);
    try {
      const possibleMoves = await getPossibleMoves(
        game.id,
        (piece as ChessPiece).position.y,
        (piece as ChessPiece).position.x
      );
      setSelectedPiece((prev) =>
        prev && prev.id === (piece as ChessPiece).id ? { ...prev, possibleMoves } : prev
      );
    } finally {
      setLoadingMoves(false);
    }
  }

  async function makeMove(y1: number, x1: number) {
    const { x, y } = selectedPiece!.position;

    if (isPawnUpgrade(selectedPiece, y1)) {
      setMovePositions({ x, y, x1, y1 });
      setShowUpgradePawnModal(true);
      setSelectedPiece(null);
      return;
    }

    optimisticallyUpdateGame(x, y, x1, y1);
    return await submitMove(x, y, x1, y1);
  }

  async function submitMove(x: number, y: number, x1: number, y1: number, upgradeType?: PieceType) {
    let res = await postMove(game.id, x, y, y1, x1, upgradeType);
    setGame(res.data);
    if (opponentIsComputer(game) && !res.data.gameOver) {
      res = await makeComputerMove(game.id);
      setGame(res.data);
    }
    queryClient.invalidateQueries(["notifications"]);
    return setSelectedPiece(null);
  }

  function optimisticallyUpdateGame(x: number, y: number, x1: number, y1: number) {
    const gamePiecesCopy = [...game.pieces];
    const index = gamePiecesCopy.findIndex((p) => p?.position?.x === x && p?.position?.y === y);
    gamePiecesCopy[index] = { ...gamePiecesCopy[index], position: { x: x1, y: y1 } };
    setGame((prev: Game | null) => (prev ? { ...prev, pieces: gamePiecesCopy } : null));
  }

  function isPossibleMove(y: number, x: number): boolean {
    return !!selectedPiece?.possibleMoves?.find((move) => move.x === x && move.y === y);
  }

  useEffect(() => {
    if (game?.pieces) {
      setBoard(initializeBoard());
    }
  }, [game, game?.gameOver]);

  // Deselect whenever the turn passes to the opponent.
  useEffect(() => {
    if (!isPlayerTurn) setSelectedPiece(null);
  }, [isPlayerTurn]);

  // Which visual edge carries the coordinate labels depends on orientation.
  const labelRankCol = isMirrored ? 7 : 0;
  const labelFileRow = isMirrored ? 0 : 7;

  return (
    <>
      <UpgradePawnModal
        onUpgrade={(upgradeType) => {
          const { x, y, x1, y1 } = movePositions;
          return submitMove(x, y, x1, y1, upgradeType);
        }}
        isOpen={showUpgradePawnModal}
        closeModal={() => setShowUpgradePawnModal(false)}
        chessPieces={PIECE_ICONS}
      />

      <div className="w-full max-w-[560px] rounded-xl bg-board-frame p-1.5 shadow-card ring-1 ring-black/40 sm:p-2">
        <div
          role="grid"
          aria-label="Chess board"
          className={cn(
            "grid aspect-square w-full grid-cols-8 grid-rows-8 overflow-hidden rounded-md",
            isMirrored && "rotate-180"
          )}
        >
          {board?.map((row, r) =>
            row.map((cell, c) => {
              const piece = cell as ChessPiece | "";
              const dark = isDarkSpace(r, c);
              const selected = !!piece && selectedPiece?.id === piece.id;
              const possible = isPossibleMove(r, c);
              const capture = possible && !!piece;
              const kingInCheck =
                !!piece &&
                piece.piece.type === "KING" &&
                game.playerInCheck === piece.piece.color;
              const clickable = isPlayerTurn && (isOwnPiece(piece) || possible);

              return (
                <div
                  key={`${r}-${c}`}
                  role="gridcell"
                  aria-label={`${FILES[c]}${8 - r}${piece ? ` ${piece.piece.color.toLowerCase()} ${piece.piece.type.toLowerCase()}` : ""}`}
                  onClick={() => handleClick(piece, r, c)}
                  className={cn(
                    "group relative flex select-none items-center justify-center",
                    dark ? "bg-board-dark" : "bg-board-light",
                    clickable ? "cursor-pointer" : "cursor-default",
                    isMirrored && "rotate-180"
                  )}
                >
                  {/* Highlight layers */}
                  {kingInCheck && (
                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(220,38,38,0.95)_0%,rgba(220,38,38,0.55)_45%,transparent_72%)]" />
                  )}
                  {selected && (
                    <span className="pointer-events-none absolute inset-0 bg-lime-400/50" />
                  )}
                  {possible && !capture && (
                    <span className="pointer-events-none absolute h-[30%] w-[30%] rounded-full bg-gray-900/30 transition-transform group-hover:scale-125 group-hover:bg-lime-500/80" />
                  )}
                  {capture && (
                    <span className="pointer-events-none absolute inset-[6%] rounded-full border-[0.3rem] border-gray-900/30 transition-colors group-hover:border-lime-500/90 sm:border-[0.38rem]" />
                  )}

                  {/* Coordinates */}
                  {c === labelRankCol && (
                    <span
                      className={cn(
                        "pointer-events-none absolute left-[5%] top-[3%] text-[clamp(0.5rem,1.9vw,0.7rem)] font-bold leading-none",
                        dark ? "text-yellow-600/90" : "text-yellow-900/80"
                      )}
                    >
                      {8 - r}
                    </span>
                  )}
                  {r === labelFileRow && (
                    <span
                      className={cn(
                        "pointer-events-none absolute bottom-[3%] right-[6%] text-[clamp(0.5rem,1.9vw,0.7rem)] font-bold leading-none",
                        dark ? "text-yellow-600/90" : "text-yellow-900/80"
                      )}
                    >
                      {FILES[c]}
                    </span>
                  )}

                  {/* Piece */}
                  {piece && (
                    <span
                      className={cn(
                        "relative font-chess leading-none transition-transform duration-150",
                        piece.piece.color === "WHITE"
                          ? "text-gray-50 [text-shadow:0_1px_2px_rgba(0,0,0,0.7),0_0_1px_rgba(0,0,0,0.9)]"
                          : "text-zinc-900 [text-shadow:0_1px_1px_rgba(255,255,255,0.18)]",
                        selected && "scale-110",
                        clickable && isOwnPiece(piece) && "group-hover:scale-110"
                      )}
                      style={{ fontSize: "clamp(1.5rem, 9.5vw, 3.1rem)" }}
                    >
                      {PIECE_ICONS[piece.piece.type]}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
