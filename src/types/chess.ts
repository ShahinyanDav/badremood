export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  captured?: ChessPiece;
  algebraic: string;
  moveNumber: number;
}

export type Board = (ChessPiece | null)[][];

export interface GameState {
  board: Board;
  currentPlayer: PieceColor;
  moves: Move[];
  selectedSquare: Position | null;
  possibleMoves: Position[];
  currentMoveIndex: number;
  flipped: boolean;
  lastMove: Move | null;
  allGames: GameMetadata[];
  activeGameIndex: number;
}

export interface GameMetadata {
  whitePlayerName: string;
  moves: Move[];
}