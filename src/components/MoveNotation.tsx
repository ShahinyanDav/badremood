import React from 'react';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { Move } from '../types/chess';

interface MoveNotationProps {
  moves: Move[];
  currentMoveIndex: number;
  onMoveClick: (moveIndex: number) => void;
}

export const MoveNotation: React.FC<MoveNotationProps> = ({ 
  moves, 
  currentMoveIndex, 
  onMoveClick 
}) => {
  // Group moves by pairs (white and black moves)
  const movePairs: { white?: Move; black?: Move; number: number }[] = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    const whiteMove = moves[i];
    const blackMove = moves[i + 1];
    
    movePairs.push({
      white: whiteMove,
      black: blackMove,
      number: Math.floor(i / 2) + 1,
    });
  }


  return (
    <div className="bg-[#2b2926] rounded-lg shadow-lg p-6 border border-[#3d3a36]">
      <h3 className="text-lg font-semibold mb-4 text-[#f0d9b5] border-b border-[#3d3a36] pb-2">
        Move Notation
      </h3>
      
      <div className="max-h-96 overflow-y-auto">
        {movePairs.length === 0 ? (
          <p className="text-[#a0a0a0] italic">No moves yet</p>
        ) : (
          <div className="space-y-2">
            {movePairs.map((pair, index) => (
              <div key={index} className="flex items-center space-x-4 text-sm">
                <span className="text-[#a0a0a0] font-medium w-8">
                  {pair.number}.
                </span>
                <span 
                  className={`font-mono px-2 py-1 rounded min-w-[60px] text-center cursor-pointer transition-colors ${
                    currentMoveIndex === index * 2 
                      ? 'bg-[#759900] text-white' 
                      : 'bg-[#3d3a36] text-[#f0d9b5] hover:bg-[#4a453f]'
                  }`}
                  onClick={() => pair.white && onMoveClick(index * 2)}
                >
                  {pair.white?.algebraic || ''}
                </span>
                {pair.black && (
                  <span 
                    className={`font-mono px-2 py-1 rounded min-w-[60px] text-center cursor-pointer transition-colors ${
                      currentMoveIndex === index * 2 + 1 
                        ? 'bg-[#759900] text-white' 
                        : 'bg-[#3d3a36] text-[#f0d9b5] hover:bg-[#4a453f]'
                    }`}
                    onClick={() => onMoveClick(index * 2 + 1)}
                  >
                    {pair.black.algebraic}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};