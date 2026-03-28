import { useState } from "react";
import { ChessPiece, Game, Player, Position } from "../types";

interface UseChessGameProps {
  game: Game;
  setGame: (game: Game) => void;
  player: Player | null;
  setLoadingMoves: (loading: boolean) => void;
}

interface SelectedPiece extends ChessPiece {
  possibleMoves?: Position[];
}

interface UseChessGameResult {
  selectedPiece: SelectedPiece | null;
  showUpgradePawnModal: boolean;
  setShowUpgradePawnModal: (show: boolean) => void;
  isPossibleMove: (y: number, x: number) => boolean | undefined;
  handleSquareClick: (piece: ChessPiece | null, y: number, x: number) => Promise<void>;
}

export default function useChessGame({ game, setGame, player, setLoadingMoves }: UseChessGameProps): UseChessGameResult {
  const [selectedPiece, setSelectedPiece] = useState<SelectedPiece | null>(null);
  const [showUpgradePawnModal, setShowUpgradePawnModal] = useState(false);

  const isPossibleMove = (y: number, x: number) => {
    return selectedPiece?.possibleMoves?.some(m => m.x === x && m.y === y);
  };

  async function handleSquareClick(piece: ChessPiece | null, y: number, x: number): Promise<void> {
    // your current handleClick logic
  }

  return {
    selectedPiece,
    showUpgradePawnModal,
    setShowUpgradePawnModal,
    isPossibleMove,
    handleSquareClick,
  };
}
