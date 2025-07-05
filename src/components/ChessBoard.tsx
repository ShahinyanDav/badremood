import React from 'react';
import { ChessSquare } from './ChessSquare';
import { Board, Position, Move } from '../types/chess';

interface ChessBoardProps {
  board: Board;
  flipped: boolean;
  selectedSquare: Position | null;
  possibleMoves: Position[];
  lastMove: Move | null;
  onSquareClick: (position: Position) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  flipped,
  selectedSquare,
  possibleMoves,
  lastMove,
  onSquareClick,
}) => {
  const isSquareSelected = (row: number, col: number): boolean => {
    return selectedSquare?.row === row && selectedSquare?.col === col;
  };

  const isPossibleMove = (row: number, col: number): boolean => {
    return possibleMoves.some(move => move.row === row && move.col === col);
  };

  const isLastMoveSquare = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    return (lastMove.from.row === row && lastMove.from.col === col) ||
           (lastMove.to.row === row && lastMove.to.col === col);
  };
  return (
    <div className="inline-block border-2 border-[#8b7355] shadow-xl rounded-sm overflow-hidden">
      <div className="grid grid-cols-8 gap-0">
        {(flipped ? [...board].reverse() : board).map((row, displayRowIndex) => {
          const actualRowIndex = flipped ? 7 - displayRowIndex : displayRowIndex;
          return (flipped ? [...row].reverse() : row).map((piece, displayColIndex) => {
            const actualColIndex = flipped ? 7 - displayColIndex : displayColIndex;
            return (
            <ChessSquare
              key={`${actualRowIndex}-${actualColIndex}`}
              piece={piece}
              position={{ row: actualRowIndex, col: actualColIndex }}
              isLight={(actualRowIndex + actualColIndex) % 2 === 0}
              isSelected={isSquareSelected(actualRowIndex, actualColIndex)}
              isPossibleMove={isPossibleMove(actualRowIndex, actualColIndex)}
              isLastMoveSquare={isLastMoveSquare(actualRowIndex, actualColIndex)}
              onClick={onSquareClick}
              flipped={flipped}
            />
            );
          });
        })}
      </div>
    </div>
  );
};