import React from 'react';
import { ChessBoard } from './components/ChessBoard';
import { MoveNotation } from './components/MoveNotation';
import { PgnUpload } from './components/PgnUpload';
import { GameList } from './components/GameList';
import { BoardNavigation } from './components/BoardNavigation';
import { useChessGame } from './hooks/useChessGame';
import { RotateCcw, RotateCw } from 'lucide-react';

function App() {
  const { gameState, selectSquare, resetGame, loadPgn, navigateToMove, flipBoard, selectGame } = useChessGame();

  return (
    <div className="min-h-screen bg-[#312e2b] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#f0d9b5] mb-2">Chess Board</h1>
          <p className="text-[#a0a0a0]">Interactive chess with move notation • Use ← → ↑ ↓ keys to navigate</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Left Panel - PGN Upload */}
          <div className="w-full lg:w-80">
            <PgnUpload onPgnLoad={loadPgn} />
            <GameList 
              allGames={gameState.allGames}
              activeGameIndex={gameState.activeGameIndex}
              onSelectGame={selectGame}
            />
          </div>

          {/* Center Panel - Chess Board */}
          <div className="flex-shrink-0">
            <ChessBoard
              board={gameState.board}
              flipped={gameState.flipped}
              selectedSquare={gameState.selectedSquare}
              possibleMoves={gameState.possibleMoves}
              lastMove={gameState.lastMove}
              onSquareClick={selectSquare}
            />
            
            {/* Board Navigation */}
            <div className="mt-4 flex items-center justify-between">
              <BoardNavigation 
                moves={gameState.moves}
                currentMoveIndex={gameState.currentMoveIndex}
                onMoveClick={navigateToMove}
              />
              
              <button
                onClick={flipBoard}
                className="bg-[#3d3a36] hover:bg-[#4a453f] text-[#f0d9b5] font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                title="Flip board"
              >
                <RotateCw className="w-4 h-4" />
                <span>Flip</span>
              </button>
            </div>
          </div>

          {/* Right Panel - Move Notation */}
          <div className="w-full lg:w-80">
            <MoveNotation 
              moves={gameState.moves} 
              currentMoveIndex={gameState.currentMoveIndex}
              onMoveClick={navigateToMove}
            />
            
            {/* Reset Button */}
            <div className="mt-6">
              <button
                onClick={resetGame}
                className="w-full bg-[#759900] hover:bg-[#6d8a00] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset Game</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;