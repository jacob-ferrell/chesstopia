export default function opponentIsComputer({whitePlayer, blackPlayer}) {
   return  !![whitePlayer, blackPlayer].find(p => p.email === "computer@chesstopia");
}