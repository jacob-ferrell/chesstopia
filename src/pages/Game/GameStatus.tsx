import { Award, AlertTriangle } from "react-feather";
import { Game, Player, User } from "../../types";
import Spinner from "../../components/spinners/Spinner";
import displayName from "../../util/displayName";
import cn from "../../components/ui/cn";

interface GameStatusProps {
  game: Game;
  player: Player;
  opponent: User | null;
  loadingMoves: boolean;
}

export default function GameStatus({ game, player, opponent, loadingMoves }: GameStatusProps) {
  if (game.gameOver) {
    const youWon = game.winner?.id === player.id;
    const draw = !game.winner;
    return (
      <div
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl px-4 py-3 ring-1",
          draw
            ? "bg-gray-800/70 ring-white/10"
            : youWon
            ? "bg-lime-500/10 ring-lime-500/40"
            : "bg-red-500/10 ring-red-500/30"
        )}
      >
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            draw ? "bg-gray-700 text-gray-200" : youWon ? "bg-lime-500/20 text-lime-400" : "bg-red-500/20 text-red-400"
          )}
        >
          <Award className="h-5 w-5" />
        </span>
        <div>
          <p className="text-base font-bold text-gray-50">
            {draw ? "It's a draw" : youWon ? "Checkmate. You win!" : "Checkmate"}
          </p>
          <p className="text-sm text-gray-400">
            {draw
              ? "Neither side could force a win."
              : youWon
              ? `Well played against ${displayName(opponent)}.`
              : `${displayName(opponent)} wins this one.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[2.5rem] w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
      {loadingMoves ? (
        <Spinner size="sm" text="Finding legal moves…" />
      ) : player.isTurn ? (
        <p className="text-gray-200">
          <span className="font-semibold text-yellow-400">Your move.</span>{" "}
          Tap a piece to see where it can go.
        </p>
      ) : (
        <p className="text-gray-400">Waiting for {displayName(opponent)} to move…</p>
      )}
      {player.isInCheck && (
        <span className="inline-flex items-center gap-1.5 font-semibold text-red-400">
          <AlertTriangle className="h-4 w-4" />
          You're in check
        </span>
      )}
    </div>
  );
}
