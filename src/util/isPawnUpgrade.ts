import { ChessPiece } from "../types";

export default function isPawnUpgrade(piece: ChessPiece | null | undefined, y1: number): boolean {
    return piece?.piece?.type === "PAWN" && (y1 === 0 || y1 === 7);
}
