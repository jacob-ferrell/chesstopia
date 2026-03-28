import Tabs from "./Tabs";
import { Game } from "../../types";

interface DashboardProps {
  setGame: (game: Game | null) => void;
  game?: Game | null;
}

export default function Dashboard({ setGame }: DashboardProps) {

  return (
    <div className="w-full h-full pt-4 flex flex-col gap-2 items-center">
      <Tabs setGame={setGame} />
    </div>
  );
}
