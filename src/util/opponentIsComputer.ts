import { Game } from "../types";

export default function opponentIsComputer({ whitePlayer, blackPlayer }: Game): boolean {
   return  !![whitePlayer, blackPlayer].find(p => p.email === "computer@chesstopia");
}
