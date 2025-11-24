export default function isPawnUpgrade(piece, y1) {
    return piece?.piece?.type === "PAWN" && (y1 === 0 || y1 === 7);
}
