import React from 'react';
import { ChessPiece, Position } from '../types/chess';
import { pieceImages } from '../utils/chessLogic';

interface ChessSquareProps {
  piece: ChessPiece | null;
  position: Position;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  flipped: boolean;
  isLastMoveSquare: boolean;
  onClick: (position: Position) => void;
}

export const ChessSquare: React.FC<ChessSquareProps> = ({
  piece,
  position,
  isLight,
  isSelected,
  isPossibleMove,
  flipped,
  isLastMoveSquare,
  onClick,
}) => {
  const baseClasses = 'w-16 h-16 flex items-center justify-center relative cursor-pointer transition-all duration-150';
  
  // Lichess authentic colors
  const backgroundClasses = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
  
  // Lichess-style selection and highlighting
  const selectedClasses = isSelected ? 'bg-[#f7ec74] shadow-[inset_0_0_0_3px_#f7ec74]' : '';
  const lastMoveClasses = isLastMoveSquare && !isSelected ? 'bg-[#cdd26a]' : '';
  const hoverClasses = piece ? 'hover:shadow-[inset_0_0_0_2px_rgba(0,0,0,0.1)]' : '';
  
  return (
    <div
      className={`${baseClasses} ${isSelected ? selectedClasses : (isLastMoveSquare ? lastMoveClasses : backgroundClasses)} ${hoverClasses}`}
      onClick={() => onClick(position)}
    >
      {piece && (
        <img
          src={pieceImages[piece.color][piece.type]}
          alt={`${piece.color} ${piece.type}`}
          className="w-14 h-14 select-none transition-transform duration-150 hover:scale-105"
          draggable={false}
        />
      )}
      {isPossibleMove && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {piece ? (
            // Capture indicator - ring around the square
            <div className="w-14 h-14 border-4 border-[#646f40] rounded-full opacity-80"></div>
          ) : (
            // Move indicator - dot in center
            <div className="w-6 h-6 bg-[#646f40] rounded-full opacity-70"></div>
          )}
        </div>
      )}
      {/* Coordinate labels - Lichess style */}
      {(flipped ? position.row === 0 : position.row === 7) && (
        <div className={`absolute bottom-0.5 right-1 text-xs font-bold ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'}`}>
          {String.fromCharCode(97 + (flipped ? 7 - position.col : position.col))}
        </div>
      )}
      {(flipped ? position.col === 7 : position.col === 0) && (
        <div className={`absolute top-0.5 left-1 text-xs font-bold ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'}`}>
          {flipped ? position.row + 1 : 8 - position.row}
        </div>
      )}
    </div>
  );
};