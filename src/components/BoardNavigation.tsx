import React from 'react';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { Move } from '../types/chess';

interface BoardNavigationProps {
  moves: Move[];
  currentMoveIndex: number;
  onMoveClick: (moveIndex: number) => void;
}

export const BoardNavigation: React.FC<BoardNavigationProps> = ({ 
  moves, 
  currentMoveIndex, 
  onMoveClick 
}) => {
  const canGoBack = currentMoveIndex > -1;
  const canGoForward = currentMoveIndex < moves.length - 1;

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onMoveClick(-1)}
        disabled={!canGoBack}
        className="p-2 rounded bg-[#3d3a36] text-[#f0d9b5] hover:bg-[#4a453f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Go to start"
      >
        <SkipBack className="w-4 h-4" />
      </button>
      <button
        onClick={() => onMoveClick(currentMoveIndex - 1)}
        disabled={!canGoBack}
        className="p-2 rounded bg-[#3d3a36] text-[#f0d9b5] hover:bg-[#4a453f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Previous move"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-[#a0a0a0] text-sm px-3 min-w-[80px] text-center">
        {moves.length > 0 ? `${currentMoveIndex + 1} / ${moves.length}` : '0 / 0'}
      </span>
      <button
        onClick={() => onMoveClick(currentMoveIndex + 1)}
        disabled={!canGoForward}
        className="p-2 rounded bg-[#3d3a36] text-[#f0d9b5] hover:bg-[#4a453f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Next move"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => onMoveClick(moves.length - 1)}
        disabled={!canGoForward}
        className="p-2 rounded bg-[#3d3a36] text-[#f0d9b5] hover:bg-[#4a453f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Go to end"
      >
        <SkipForward className="w-4 h-4" />
      </button>
    </div>
  );
};