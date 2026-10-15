import { useState } from "react";
import { Plus, Grid } from "react-feather";
import useGames from "../../hooks/useGames";
import NewGameModal from "../../components/modals/NewGameModal";
import useCurrentUser from "../../hooks/useCurrentUser";
import getOtherPlayer from "../../util/getOtherPlayer";
import { useNavigate } from "react-router-dom";
import formatDateTime from "../../util/formatDateTime";
import calculateDaysAgo from "../../util/calculateDaysAgo";
import { Game, Move } from "../../types";
import Button from "../../components/ui/Button";
import Badge, { BadgeTone } from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";
import PanelSkeleton from "./PanelSkeleton";
import displayName, { isComputerUser } from "../../util/displayName";
import cn from "../../components/ui/cn";

interface MyGamesProps {
  setGame?: (game: Game | null) => void;
}

const PREVIEW_COUNT = 5;

export default function MyGames({}: MyGamesProps) {
  const { games, isLoading } = useGames();
  const { user, isLoading: userLoading } = useCurrentUser();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hideCompletedGames, setHideCompletedGames] = useState(true);

  if (!userLoading && !user) return null;
  if (userLoading || isLoading) return <PanelSkeleton rows={4} />;

  const allGames = (games ?? []) as Game[];
  const visibleGames = allGames
    .filter((g) => !hideCompletedGames || !g.gameOver)
    .sort(sortGames);
  const toRender = expanded ? visibleGames : visibleGames.slice(0, PREVIEW_COUNT);

  function isUserTurn(game: Game): boolean {
    return !game.gameOver && game.currentTurn?.id === user!.id;
  }

  function sortGames(a: Game, b: Game): number {
    const turnDiff = (isUserTurn(b) ? 1 : 0) - (isUserTurn(a) ? 1 : 0);
    if (turnDiff !== 0) return turnDiff;
    const overDiff = (a.gameOver ? 1 : 0) - (b.gameOver ? 1 : 0);
    if (overDiff !== 0) return overDiff;
    return lastMoveTime(b) - lastMoveTime(a);
  }

  function lastMoveTime(game: Game): number {
    const last = getMostRecentMove(game.moves);
    return last ? new Date(last.createdAt).getTime() : 0;
  }

  function getMostRecentMove(moves: Move[]): Move | undefined {
    return [...moves].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }

  function describeLastMove(moves: Move[]): string | null {
    const last = getMostRecentMove(moves);
    if (!last) return null;
    const daysAgo = calculateDaysAgo(last.createdAt);
    const { time, date } = formatDateTime(last.createdAt);
    if (daysAgo === 0) return `Last move ${time}`;
    if (daysAgo === 1) return "Last move yesterday";
    if (daysAgo < 7) return `Last move ${daysAgo} days ago`;
    return `Last move ${date}`;
  }

  function statusFor(game: Game): { label: string; tone: BadgeTone } {
    if (game.gameOver) {
      if (!game.winner) return { label: "Draw", tone: "gray" };
      return game.winner.id === user!.id
        ? { label: "You won", tone: "green" }
        : { label: "You lost", tone: "red" };
    }
    return isUserTurn(game)
      ? { label: "Your turn", tone: "amber" }
      : { label: "Their turn", tone: "gray" };
  }

  return (
    <>
      <NewGameModal isOpen={showModal} closeModal={() => setShowModal(false)} />
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-1 pb-3">
        <label className="flex cursor-pointer select-none items-center gap-2 whitespace-nowrap text-sm text-gray-600">
          <input
            type="checkbox"
            checked={hideCompletedGames}
            onChange={(e) => setHideCompletedGames(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-lime-700"
          />
          Hide completed
        </label>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          New game
        </Button>
      </div>

      {visibleGames.length === 0 ? (
        <EmptyState
          icon={<Grid className="h-5 w-5" />}
          title={allGames.length ? "No games in progress" : "No games yet"}
          description={
            allGames.length
              ? "Untick “Hide completed” to see your finished games."
              : "Challenge a friend or hit Quick Play to start your first game."
          }
        />
      ) : (
        <ul className="mt-2 flex flex-col gap-1">
          {toRender.map((game) => {
            const opponent = getOtherPlayer(game, user!);
            const yourTurn = isUserTurn(game);
            const status = statusFor(game);
            const lastMove = describeLastMove(game.moves);
            return (
              <li key={game.id}>
                <button
                  type="button"
                  onClick={() => navigate("/game/" + game.id)}
                  className={cn(
                    "focus-ring flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors",
                    yourTurn
                      ? "bg-yellow-50 ring-1 ring-inset ring-yellow-300/70 hover:bg-yellow-100/80"
                      : "hover:bg-gray-50",
                    game.gameOver && "opacity-75"
                  )}
                >
                  <Avatar
                    name={isComputerUser(opponent) ? "C" : opponent?.firstName ?? opponent?.email}
                    tone={yourTurn ? "amber" : "slate"}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-900">
                      {isComputerUser(opponent) ? "vs. Computer" : `vs. ${displayName(opponent)}`}
                    </span>
                    <span className="block truncate text-xs text-gray-500">
                      {lastMove ?? "No moves yet"}
                    </span>
                  </span>
                  <Badge tone={status.tone} dot={yourTurn}>
                    {status.label}
                  </Badge>
                </button>
              </li>
            );
          })}
          {visibleGames.length > PREVIEW_COUNT && (
            <li className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="focus-ring rounded-lg px-3 py-1.5 text-sm font-semibold text-lime-700 hover:bg-lime-50"
              >
                {expanded ? "Show fewer" : `Show all ${visibleGames.length} games`}
              </button>
            </li>
          )}
        </ul>
      )}
    </>
  );
}
