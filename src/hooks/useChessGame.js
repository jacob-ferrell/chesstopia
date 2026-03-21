
export default function useChessGame({ game, setGame, player, setLoadingMoves }) {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [showUpgradePawnModal, setShowUpgradePawnModal] = useState(false);

  const isPossibleMove = (y,x) => {
    return selectedPiece?.possibleMoves?.some(m => m.x === x && m.y === y);
  };

  async function handleSquareClick(piece, y, x) {
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
