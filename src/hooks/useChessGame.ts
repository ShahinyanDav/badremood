import { useState, useCallback, useEffect } from 'react';
import { GameState, Position, Move, GameMetadata } from '../types/chess';
import { initialBoard, getPossibleMoves, generateAlgebraicNotation, parseMultiPgn, applyMovesToBoard } from '../utils/chessLogic';

export const useChessGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard,
    currentPlayer: 'white',
    moves: [],
    selectedSquare: null,
    possibleMoves: [],
    currentMoveIndex: -1,
    flipped: false,
    lastMove: null,
    allGames: [],
    activeGameIndex: -1,
    allGames: [],
    activeGameIndex: -1,
  });

  const selectSquare = useCallback((position: Position) => {
    const { board, currentPlayer, selectedSquare, possibleMoves } = gameState;
    const clickedPiece = board[position.row][position.col];

    // If clicking on a square that's a possible move, make the move
    if (selectedSquare && possibleMoves.some(move => move.row === position.row && move.col === position.col)) {
      const movingPiece = board[selectedSquare.row][selectedSquare.col]!;
      const capturedPiece = board[position.row][position.col];
      
      // Create new board with the move
      const newBoard = board.map(row => [...row]);
      
      // Handle castling moves
      if (movingPiece.type === 'king' && Math.abs(position.col - selectedSquare.col) === 2) {
        // This is a castling move
        const isKingside = position.col > selectedSquare.col;
        const rookFromCol = isKingside ? 7 : 0;
        const rookToCol = isKingside ? 5 : 3;
        const row = selectedSquare.row;
        
        // Move the king
        newBoard[selectedSquare.row][selectedSquare.col] = null;
        newBoard[position.row][position.col] = movingPiece;
        
        // Move the rook
        const rook = newBoard[row][rookFromCol];
        newBoard[row][rookFromCol] = null;
        newBoard[row][rookToCol] = rook;
      } else if (movingPiece.type === 'pawn' && !capturedPiece && Math.abs(position.col - selectedSquare.col) === 1) {
        // This might be en passant
        const captureRow = movingPiece.color === 'white' ? position.row + 1 : position.row - 1;
        const enPassantTarget = newBoard[captureRow]?.[position.col];
        
        if (enPassantTarget && enPassantTarget.type === 'pawn' && enPassantTarget.color !== movingPiece.color) {
          // This is en passant - remove the captured pawn
          newBoard[captureRow][position.col] = null;
          capturedPiece = enPassantTarget;
        }
        
        // Move the pawn
        newBoard[selectedSquare.row][selectedSquare.col] = null;
        newBoard[position.row][position.col] = movingPiece;
      } else {
        // Regular move
        newBoard[selectedSquare.row][selectedSquare.col] = null;
        newBoard[position.row][position.col] = movingPiece;
      }
      
      // Generate algebraic notation
      const algebraic = generateAlgebraicNotation(
        board,
        selectedSquare,
        position,
        movingPiece,
        capturedPiece || undefined
      );
      
      // Create move object
      const move: Move = {
        from: selectedSquare,
        to: position,
        piece: movingPiece,
        captured: capturedPiece || undefined,
        algebraic,
        moveNumber: gameState.moves.length + 1,
      };
      
      setGameState({
        board: newBoard,
        currentPlayer: currentPlayer === 'white' ? 'black' : 'white',
        moves: [...gameState.moves, move],
        selectedSquare: null,
        possibleMoves: [],
        currentMoveIndex: gameState.moves.length,
        lastMove: move,
      });
      
      return;
    }

    // If clicking on a piece of the current player, select it
    if (clickedPiece && clickedPiece.color === currentPlayer) {
      const moves = getPossibleMoves(board, position, clickedPiece);
      
      setGameState({
        ...gameState,
        selectedSquare: position,
        possibleMoves: moves,
      });
      
      return;
    }

    // Otherwise, deselect
    setGameState({
      ...gameState,
      selectedSquare: null,
      possibleMoves: [],
    });
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState({
      board: initialBoard,
      currentPlayer: 'white',
      moves: [],
      selectedSquare: null,
      possibleMoves: [],
      currentMoveIndex: -1,
      flipped: false,
      lastMove: null,
    });
  }, []);

  const loadPgn = useCallback((pgn: string) => {
    try {
      const games = parseMultiPgn(pgn);
      if (games.length === 0) {
        alert('No valid games found in PGN.');
        return;
      }
      
      // Set the last game as active by default
      const activeGameIndex = games.length - 1;
      const moves = games[activeGameIndex].moves;
      
      setGameState({
        board: initialBoard,
        currentPlayer: 'white',
        moves,
        selectedSquare: null,
        possibleMoves: [],
        currentMoveIndex: moves.length - 1, // Show the final position
        flipped: false,
        lastMove: moves.length > 0 ? moves[moves.length - 1] : null,
        allGames: games,
        activeGameIndex,
      });
    } catch (error) {
      console.error('Error parsing PGN:', error);
      alert('Error parsing PGN file. Please check the format.');
    }
  }, []);

  const navigateToMove = useCallback((moveIndex: number) => {
    const { moves } = gameState;
    
    // Clamp moveIndex to valid range
    const clampedIndex = Math.max(-1, Math.min(moveIndex, moves.length - 1));
    
    // Apply moves up to the specified index
    const { board, currentPlayer } = applyMovesToBoard(initialBoard, moves.slice(0, clampedIndex + 1));
    
    setGameState({
      ...gameState,
      board,
      currentPlayer,
      currentMoveIndex: clampedIndex,
      selectedSquare: null,
      possibleMoves: [],
      lastMove: clampedIndex >= 0 ? moves[clampedIndex] : null,
    });
  }, [gameState]);

  const selectGame = useCallback((gameIndex: number) => {
    const { allGames } = gameState;
    if (gameIndex < 0 || gameIndex >= allGames.length) return;
    
    const selectedGame = allGames[gameIndex];
    const moves = selectedGame.moves;
    
    // Apply all moves to show the final position
    const { board, currentPlayer } = applyMovesToBoard(initialBoard, moves);
    
    setGameState({
      ...gameState,
      board,
      currentPlayer,
      moves,
      activeGameIndex: gameIndex,
      currentMoveIndex: moves.length - 1,
      selectedSquare: null,
      possibleMoves: [],
      lastMove: moves.length > 0 ? moves[moves.length - 1] : null,
    });
  }, [gameState]);

  const flipBoard = useCallback(() => {
    setGameState({
      ...gameState,
      flipped: !gameState.flipped,
    });
  }, [gameState]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not typing in an input/textarea
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { moves, currentMoveIndex } = gameState;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentMoveIndex > -1) {
            navigateToMove(currentMoveIndex - 1);
          }
          break;
          
        case 'ArrowRight':
          event.preventDefault();
          if (currentMoveIndex < moves.length - 1) {
            navigateToMove(currentMoveIndex + 1);
          }
          break;
          
        case 'ArrowUp':
        case 'Home':
          event.preventDefault();
          navigateToMove(-1); // Go to start
          break;
          
        case 'ArrowDown':
        case 'End':
          event.preventDefault();
          if (moves.length > 0) {
            navigateToMove(moves.length - 1); // Go to end
          }
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, navigateToMove]);
  
  return {
    gameState,
    selectSquare,
    resetGame,
    loadPgn,
    navigateToMove,
    flipBoard,
    selectGame,
  };
};