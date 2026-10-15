import { PieceColor, User } from "../../types";
import Avatar from "../../components/ui/Avatar";
import displayName, { isComputerUser } from "../../util/displayName";
import cn from "../../components/ui/cn";

interface PlayerCardProps {
  user: User | null;
  color: PieceColor;
  isOnTurn: boolean;
  isInCheck: boolean;
  side: "you" | "opponent";
  connected?: boolean;
}

export default function PlayerCard({ user, color, isOnTurn, isInCheck, side, connected }: PlayerCardProps) {
  const isComputer = isComputerUser(user);
  const name = side === "you" ? "You" : displayName(user);
  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 ring-1 transition-colors",
        isOnTurn
          ? "bg-yellow-500/10 ring-yellow-500/40"
          : "bg-gray-800/60 ring-white/10"
      )}
    >
      <Avatar
        name={isComputer ? "C" : user?.firstName ?? user?.email}
        size="sm"
        tone={isOnTurn ? "amber" : "slate"}
      />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-50">
          <span className={cn("truncate", side === "you" && "shrink-0")}>{name}</span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide",
              color === "WHITE" ? "bg-gray-100 text-gray-800" : "bg-gray-950 text-gray-200 ring-1 ring-white/20"
            )}
          >
            {color === "WHITE" ? "White" : "Black"}
          </span>
        </p>
        <p className="truncate text-xs text-gray-400">
          {side === "you" ? user?.email : isComputer ? "Built-in engine" : user?.email}
        </p>
      </div>
      <div className="flex max-w-[50%] shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
        {isInCheck && (
          <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-bold text-red-400 ring-1 ring-red-500/40">
            Check
          </span>
        )}
        {isOnTurn && (
          <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs font-semibold text-yellow-400 ring-1 ring-yellow-500/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
            To move
          </span>
        )}
        {side === "opponent" && !isComputer && (
          <span
            title={connected ? "Opponent is online" : "Opponent is offline"}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1",
              connected
                ? "bg-green-500/10 text-green-400 ring-green-500/40"
                : "bg-gray-700/40 text-gray-400 ring-white/10"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", connected ? "bg-green-400" : "bg-gray-500")} />
            {connected ? "Online" : "Offline"}
          </span>
        )}
      </div>
    </div>
  );
}
