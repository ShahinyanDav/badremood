import React from 'react';
import { GameMetadata } from '../types/chess';
import { Users } from 'lucide-react';

interface GameListProps {
  allGames: GameMetadata[];
  activeGameIndex: number;
  onSelectGame: (gameIndex: number) => void;
}

export const GameList: React.FC<GameListProps> = ({
  allGames,
  activeGameIndex,
  onSelectGame,
}) => {
  if (allGames.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#2b2926] rounded-lg shadow-lg p-6 mb-6 border border-[#3d3a36]">
      <h3 className="text-lg font-semibold mb-4 text-[#f0d9b5] border-b border-[#3d3a36] pb-2 flex items-center space-x-2">
        <Users className="w-5 h-5" />
        <span>Games ({allGames.length})</span>
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {allGames.map((game, index) => (
          <div
            key={index}
            onClick={() => onSelectGame(index)}
            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              activeGameIndex === index
                ? 'bg-[#759900] text-white'
                : 'bg-[#3d3a36] text-[#f0d9b5] hover:bg-[#4a453f]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium truncate">
                  {game.whitePlayerName}
                </div>
                <div className="text-sm opacity-75">
                  {game.moves.length} moves
                </div>
              </div>
              <div className="text-sm opacity-75 ml-2">
                #{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};