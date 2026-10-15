import { useState } from "react";
import { PieceType } from "../../types";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import cn from "../ui/cn";

interface UpgradePawnModalProps {
  isOpen: boolean;
  closeModal: () => void;
  chessPieces: Record<string, string>;
  onUpgrade: (upgradeType: PieceType) => Promise<unknown>;
}

const OPTIONS: PieceType[] = ["QUEEN", "ROOK", "KNIGHT", "BISHOP"];

export default function UpgradePawnModal({
  isOpen,
  closeModal,
  chessPieces,
  onUpgrade,
}: UpgradePawnModalProps) {
  const [upgradeSelection, setUpgradeSelection] = useState<PieceType | "">("");
  const [isUpgrading, setIsUpgrading] = useState(false);

  async function handleClick() {
    if (!upgradeSelection) return;
    setIsUpgrading(true);
    try {
      await onUpgrade(upgradeSelection);
      setUpgradeSelection("");
      closeModal();
    } finally {
      setIsUpgrading(false);
    }
  }

  function handleClose() {
    if (isUpgrading) return;
    setUpgradeSelection("");
    closeModal();
  }

  function formatPieceName(name: string): string {
    return name.at(0)! + name.slice(1).toLowerCase();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Promote your pawn"
      description="Your pawn reached the last rank. Choose what it becomes."
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isUpgrading}>
            Cancel
          </Button>
          <Button disabled={!upgradeSelection || isUpgrading} onClick={handleClick}>
            {isUpgrading
              ? "Promoting…"
              : upgradeSelection
              ? `Promote to ${formatPieceName(upgradeSelection)}`
              : "Choose a piece"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Promotion piece">
        {OPTIONS.map((key) => {
          const selected = upgradeSelection === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setUpgradeSelection(key)}
              className={cn(
                "focus-ring flex flex-col items-center gap-1 rounded-xl py-3 transition-all",
                selected
                  ? "bg-gradient-to-b from-yellow-500 to-yellow-600 text-yellow-950 shadow-glow"
                  : "bg-gray-900/60 text-gray-100 ring-1 ring-white/10 hover:bg-white/10"
              )}
            >
              <span className="font-chess text-4xl leading-none">{chessPieces[key]}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide">
                {formatPieceName(key)}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
