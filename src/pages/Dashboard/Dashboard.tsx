import Tabs from "./Tabs";
import { Game } from "../../types";

interface DashboardProps {
  setGame: (game: Game | null) => void;
  game?: Game | null;
}

export default function Dashboard({ setGame }: DashboardProps) {
  return (
    <div className="animate-fade-up flex w-full flex-col gap-5">
      <Tabs setGame={setGame} />
    </div>
  );
}
