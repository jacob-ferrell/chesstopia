export type PieceType = 'KING' | 'QUEEN' | 'ROOK' | 'BISHOP' | 'KNIGHT' | 'PAWN';
export type PieceColor = 'WHITE' | 'BLACK';

export interface Position {
  x: number;
  y: number;
}

export interface ChessPiece {
  id: string;
  piece: {
    type: PieceType;
    color: PieceColor;
  };
  position: Position;
  possibleMoves?: Position[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
}

export interface Player extends User {
  color: PieceColor;
  isTurn: boolean;
  isInCheck: boolean;
}

export interface Move {
  x: number;
  y: number;
  createdAt: string;
}

export interface Game {
  id: string;
  whitePlayer: User;
  blackPlayer: User;
  pieces: ChessPiece[];
  currentTurn: User;
  playerInCheck: PieceColor | null;
  gameOver: boolean;
  winner: User | null;
  moves: Move[];
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  game?: Game;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface CsrfToken {
  headerName: string;
  token: string;
}

export interface MovePositions {
  x: number;
  y: number;
  x1: number;
  y1: number;
}
