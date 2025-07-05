import { Board, ChessPiece, Position, PieceType, PieceColor } from '../types/chess';
import type { Move, GameMetadata } from '../types/chess';

export const initialBoard: Board = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ],
  Array(8).fill({ type: 'pawn', color: 'black' }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: 'pawn', color: 'white' }),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ],
];

// Lichess cburnett piece set URLs
export const pieceImages: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: 'https://lichess1.org/assets/piece/cburnett/wK.svg',
    queen: 'https://lichess1.org/assets/piece/cburnett/wQ.svg',
    rook: 'https://lichess1.org/assets/piece/cburnett/wR.svg',
    bishop: 'https://lichess1.org/assets/piece/cburnett/wB.svg',
    knight: 'https://lichess1.org/assets/piece/cburnett/wN.svg',
    pawn: 'https://lichess1.org/assets/piece/cburnett/wP.svg',
  },
  black: {
    king: 'https://lichess1.org/assets/piece/cburnett/bK.svg',
    queen: 'https://lichess1.org/assets/piece/cburnett/bQ.svg',
    rook: 'https://lichess1.org/assets/piece/cburnett/bR.svg',
    bishop: 'https://lichess1.org/assets/piece/cburnett/bB.svg',
    knight: 'https://lichess1.org/assets/piece/cburnett/bN.svg',
    pawn: 'https://lichess1.org/assets/piece/cburnett/bP.svg',
  },
};

export const fileNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function positionToAlgebraic(position: Position): string {
  return fileNames[position.col] + (8 - position.row);
}

export function isValidPosition(position: Position): boolean {
  return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8;
}

export function getPossibleMoves(
  board: Board,
  position: Position,
  piece: ChessPiece
): Position[] {
  const moves: Position[] = [];
  const { row, col } = position;
  const { type, color } = piece;

  switch (type) {
    case 'pawn':
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;
      
      // Move forward one square
      if (isValidPosition({ row: row + direction, col }) && !board[row + direction][col]) {
        moves.push({ row: row + direction, col });
        
        // Move forward two squares from starting position
        if (row === startRow && !board[row + 2 * direction][col]) {
          moves.push({ row: row + 2 * direction, col });
        }
      }
      
      // Capture diagonally
      for (const colOffset of [-1, 1]) {
        const newPos = { row: row + direction, col: col + colOffset };
        if (isValidPosition(newPos) && board[newPos.row][newPos.col] && 
            board[newPos.row][newPos.col]!.color !== color) {
          moves.push(newPos);
        }
      }
      break;

    case 'rook':
      // Horizontal and vertical moves
      for (const [rowDir, colDir] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        for (let i = 1; i < 8; i++) {
          const newPos = { row: row + i * rowDir, col: col + i * colDir };
          if (!isValidPosition(newPos)) break;
          
          const targetPiece = board[newPos.row][newPos.col];
          if (!targetPiece) {
            moves.push(newPos);
          } else {
            if (targetPiece.color !== color) {
              moves.push(newPos);
            }
            break;
          }
        }
      }
      break;

    case 'knight':
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      
      for (const [rowOffset, colOffset] of knightMoves) {
        const newPos = { row: row + rowOffset, col: col + colOffset };
        if (isValidPosition(newPos)) {
          const targetPiece = board[newPos.row][newPos.col];
          if (!targetPiece || targetPiece.color !== color) {
            moves.push(newPos);
          }
        }
      }
      break;

    case 'bishop':
      // Diagonal moves
      for (const [rowDir, colDir] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        for (let i = 1; i < 8; i++) {
          const newPos = { row: row + i * rowDir, col: col + i * colDir };
          if (!isValidPosition(newPos)) break;
          
          const targetPiece = board[newPos.row][newPos.col];
          if (!targetPiece) {
            moves.push(newPos);
          } else {
            if (targetPiece.color !== color) {
              moves.push(newPos);
            }
            break;
          }
        }
      }
      break;

    case 'queen':
      // Combination of rook and bishop moves
      for (const [rowDir, colDir] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        for (let i = 1; i < 8; i++) {
          const newPos = { row: row + i * rowDir, col: col + i * colDir };
          if (!isValidPosition(newPos)) break;
          
          const targetPiece = board[newPos.row][newPos.col];
          if (!targetPiece) {
            moves.push(newPos);
          } else {
            if (targetPiece.color !== color) {
              moves.push(newPos);
            }
            break;
          }
        }
      }
      break;

    case 'king':
      const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      
      for (const [rowOffset, colOffset] of kingMoves) {
        const newPos = { row: row + rowOffset, col: col + colOffset };
        if (isValidPosition(newPos)) {
          const targetPiece = board[newPos.row][newPos.col];
          if (!targetPiece || targetPiece.color !== color) {
            moves.push(newPos);
          }
        }
      }
      
      // Add castling moves
      const isStartingPosition = (color === 'white' && row === 7 && col === 4) || 
                                (color === 'black' && row === 0 && col === 4);
      
      if (isStartingPosition) {
        // Check kingside castling (O-O)
        if (!board[row][5] && !board[row][6] && board[row][7]?.type === 'rook' && board[row][7]?.color === color) {
          moves.push({ row, col: 6 });
        }
        
        // Check queenside castling (O-O-O)
        if (!board[row][3] && !board[row][2] && !board[row][1] && board[row][0]?.type === 'rook' && board[row][0]?.color === color) {
          moves.push({ row, col: 2 });
        }
      }
      break;
  }

  return moves;
}

export function generateAlgebraicNotation(
  board: Board,
  from: Position,
  to: Position,
  piece: ChessPiece,
  captured?: ChessPiece
): string {
  const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
  const isCapture = !!captured;
  const toSquare = positionToAlgebraic(to);
  
  if (piece.type === 'pawn') {
    if (isCapture) {
      return `${fileNames[from.col]}x${toSquare}`;
    } else {
      return toSquare;
    }
  }
  
  return `${pieceSymbol}${isCapture ? 'x' : ''}${toSquare}`;
}

export function parseSingleGamePgn(pgn: string): Move[] {
  const moves: Move[] = [];
  let board = initialBoard.map(row => [...row]);
  let currentPlayer: PieceColor = 'white';
  
  // More careful PGN parsing
  let gameText = pgn;
  
  // Remove headers (everything in square brackets)
  gameText = gameText.replace(/\[.*?\]/g, '');
  
  // Remove comments in curly braces
  gameText = gameText.replace(/\{[^}]*\}/g, '');
  
  // Remove line comments (everything after semicolon to end of line)
  gameText = gameText.replace(/;.*$/gm, '');
  
  // Remove result indicators
  gameText = gameText.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '');
  
  // Split by move numbers and extract moves more carefully
  const movePattern = /(\d+\.+)\s*([^\d]*?)(?=\d+\.|\s*$)/g;
  const allMoveTexts: string[] = [];
  
  let match;
  while ((match = movePattern.exec(gameText)) !== null) {
    const moveText = match[2].trim();
    if (moveText) {
      // Split white and black moves, handling various separators
      const moveParts = moveText.split(/\s+/).filter(part => 
        part && 
        !part.match(/^(1-0|0-1|1\/2-1\/2|\*)$/) &&
        !part.match(/^\{.*\}$/) &&
        !part.match(/^;/)
      );
      allMoveTexts.push(...moveParts);
    }
  }
  
  // If the pattern-based approach didn't work, fall back to simpler method
  if (allMoveTexts.length === 0) {
    gameText = gameText.replace(/\d+\./g, ' ').trim();
    const simpleMoves = gameText.split(/\s+/).filter(move => 
      move && 
      !move.match(/^(1-0|0-1|1\/2-1\/2|\*)$/) &&
      !move.match(/^\{.*\}$/) &&
      !move.match(/^;/) &&
      move.length > 1
    );
    allMoveTexts.push(...simpleMoves);
  }
  
  for (let i = 0; i < allMoveTexts.length; i++) {
    const moveString = allMoveTexts[i].trim();
    if (!moveString) continue;
    
    try {
      const move = parseAlgebraicMove(board, moveString, currentPlayer);
      if (move) {
        moves.push({
          ...move,
          moveNumber: i + 1,
          algebraic: moveString,
        });
        
        // Apply move to board using the same logic as applyMovesToBoard
        if (move.piece.type === 'king' && Math.abs(move.to.col - move.from.col) === 2) {
          // Castling
          const isKingside = move.to.col > move.from.col;
          const rookFromCol = isKingside ? 7 : 0;
          const rookToCol = isKingside ? 5 : 3;
          const row = move.from.row;
          
          board[move.from.row][move.from.col] = null;
          board[move.to.row][move.to.col] = move.piece;
          
          const rook = board[row][rookFromCol];
          board[row][rookFromCol] = null;
          board[row][rookToCol] = rook;
        } else if (move.piece.type === 'pawn' && move.captured && !board[move.to.row][move.to.col]) {
          // En passant
          const captureRow = move.piece.color === 'white' ? move.to.row + 1 : move.to.row - 1;
          
          board[move.from.row][move.from.col] = null;
          board[move.to.row][move.to.col] = move.piece;
          board[captureRow][move.to.col] = null;
        } else {
          // Regular move
          board[move.from.row][move.from.col] = null;
          board[move.to.row][move.to.col] = move.piece;
        }
        
        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
      } else {
        console.warn(`Could not parse move: "${moveString}" at position ${i + 1}`);
      }
    } catch (error) {
      console.warn(`Error parsing move: "${moveString}" at position ${i + 1}:`, error);
    }
  }
  
  return moves;
}

export function extractHeader(pgnString: string, headerName: string): string | null {
  const headerRegex = new RegExp(`\\[${headerName}\\s+"([^"]*)"\\]`, 'i');
  const match = pgnString.match(headerRegex);
  return match ? match[1] : null;
}

export function parseMultiPgn(pgnContent: string): GameMetadata[] {
  const games: GameMetadata[] = [];
  
  // Split PGN content into individual games
  // Games are typically separated by double newlines or start with [Event
  const gameStrings = pgnContent.split(/(?=\[Event)/g).filter(game => game.trim());
  
  for (const gameString of gameStrings) {
    if (!gameString.trim()) continue;
    
    try {
      // Extract White player name
      const whitePlayerName = extractHeader(gameString, 'White') || 'Unknown Player';
      
      // Parse moves for this game
      const moves = parseSingleGamePgn(gameString);
      
      games.push({
        whitePlayerName,
        moves,
      });
    } catch (error) {
      console.warn('Could not parse game:', error);
    }
  }
  
  return games;
}

export function parsePgn(pgn: string): Move[] {
  // For backward compatibility, return moves from the first game
  const games = parseMultiPgn(pgn);
  return games.length > 0 ? games[0].moves : [];
}

function parseAlgebraicMove(board: Board, moveString: string, color: PieceColor): Omit<Move, 'moveNumber' | 'algebraic'> | null {
  // Handle castling
  if (moveString === 'O-O' || moveString === 'O-O-O') {
    const row = color === 'white' ? 7 : 0;
    const kingFrom = { row, col: 4 };
    const kingTo = moveString === 'O-O' ? { row, col: 6 } : { row, col: 2 };
    
    return {
      from: kingFrom,
      to: kingTo,
      piece: { type: 'king', color },
    };
  }
  
  // Clean the move string
  const cleanMove = moveString.replace(/[+#!?]/g, '');
  
  // Determine piece type
  let pieceType: PieceType = 'pawn';
  let moveText = cleanMove;
  let disambiguationFile: string | null = null;
  let disambiguationRank: string | null = null;
  
  if (/^[KQRBN]/.test(cleanMove)) {
    const pieceChar = cleanMove[0];
    pieceType = {
      'K': 'king',
      'Q': 'queen',
      'R': 'rook',
      'B': 'bishop',
      'N': 'knight'
    }[pieceChar] as PieceType;
    moveText = cleanMove.slice(1);
  }
  
  // Extract destination square first
  const destinationMatch = moveText.match(/([a-h][1-8])$/);
  if (!destinationMatch) return null;
  
  const destination = destinationMatch[1];
  const toCol = destination.charCodeAt(0) - 97; // 'a' = 0
  const toRow = 8 - parseInt(destination[1]); // '8' = 0
  const to = { row: toRow, col: toCol };
  
  // Remove destination from moveText to analyze disambiguation
  const beforeDestination = moveText.slice(0, -2);
  
  const isCapture = moveText.includes('x');
  
  // Parse disambiguation from the part before destination
  let disambiguationPart = beforeDestination;
  if (isCapture) {
    // Remove 'x' and everything before it for disambiguation
    const xIndex = beforeDestination.indexOf('x');
    if (xIndex >= 0) {
      disambiguationPart = beforeDestination.slice(0, xIndex);
    }
  }
  
  // Parse disambiguation characters
  for (const char of disambiguationPart) {
    if (/[a-h]/.test(char)) {
      disambiguationFile = char;
    } else if (/[1-8]/.test(char)) {
      disambiguationRank = char;
    }
  }
  
  // Special handling for pawn captures and en passant
  if (pieceType === 'pawn' && isCapture) {
    // For pawn captures, the file before 'x' is the disambiguation
    const xIndex = moveText.indexOf('x');
    if (xIndex > 0) {
      disambiguationFile = moveText[xIndex - 1];
    }
  }
  
  // Find all pieces of the correct type and color that can reach the destination
  const candidatePieces: { from: Position; piece: ChessPiece }[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color && piece.type === pieceType) {
        const from = { row, col };
        const possibleMoves = getPossibleMoves(board, from, piece);
        
        if (possibleMoves.some(move => move.row === toRow && move.col === toCol)) {
          candidatePieces.push({ from, piece });
        }
      }
    }
  }
  
  // If no candidates found, return null
  if (candidatePieces.length === 0) return null;
  
  // Filter candidates based on disambiguation
  let filteredCandidates = candidatePieces;
  
  if (disambiguationFile) {
    filteredCandidates = filteredCandidates.filter(candidate => 
      String.fromCharCode(97 + candidate.from.col) === disambiguationFile
    );
  }
  
  if (disambiguationRank) {
    filteredCandidates = filteredCandidates.filter(candidate => 
      (8 - candidate.from.row).toString() === disambiguationRank
    );
  }
  
  // If still multiple candidates and it's a pawn capture, handle en passant
  if (pieceType === 'pawn' && isCapture && !board[toRow][toCol]) {
    // This might be en passant - check if there's an enemy pawn that can be captured
    const captureRow = color === 'white' ? toRow + 1 : toRow - 1;
    const enPassantTarget = board[captureRow]?.[toCol];
    
    if (enPassantTarget && enPassantTarget.type === 'pawn' && enPassantTarget.color !== color) {
      // Find the pawn that can make this en passant capture
      const validCandidate = filteredCandidates.find(candidate => {
        const { from } = candidate;
        return from.row === captureRow && Math.abs(from.col - toCol) === 1;
      });
      
      if (validCandidate) {
        return {
          from: validCandidate.from,
          to,
          piece: validCandidate.piece,
          captured: enPassantTarget,
        };
      }
    }
  }
  
  // Return the first valid candidate (should be unique after disambiguation)
  if (filteredCandidates.length > 0) {
    const candidate = filteredCandidates[0];
    const captured = board[toRow][toCol];
    
    return {
      from: candidate.from,
      to,
      piece: candidate.piece,
      captured: captured || undefined,
    };
  }
  
  return null;
}

export function applyMovesToBoard(initialBoard: Board, moves: Move[]): { board: Board; currentPlayer: PieceColor } {
  const board = initialBoard.map(row => [...row]);
  let currentPlayer: PieceColor = 'white';
  
  for (const move of moves) {
    // Handle castling moves
    if (move.piece.type === 'king' && Math.abs(move.to.col - move.from.col) === 2) {
      // This is a castling move
      const isKingside = move.to.col > move.from.col;
      const rookFromCol = isKingside ? 7 : 0;
      const rookToCol = isKingside ? 5 : 3;
      const row = move.from.row;
      
      // Move the king
      board[move.from.row][move.from.col] = null;
      board[move.to.row][move.to.col] = move.piece;
      
      // Move the rook
      const rook = board[row][rookFromCol];
      board[row][rookFromCol] = null;
      board[row][rookToCol] = rook;
    } else if (move.piece.type === 'pawn' && move.captured && !board[move.to.row][move.to.col]) {
      // This is en passant - the captured piece is not on the destination square
      const captureRow = move.piece.color === 'white' ? move.to.row + 1 : move.to.row - 1;
      
      // Move the pawn
      board[move.from.row][move.from.col] = null;
      board[move.to.row][move.to.col] = move.piece;
      
      // Remove the captured pawn
      board[captureRow][move.to.col] = null;
    } else {
      // Regular move
      board[move.from.row][move.from.col] = null;
      board[move.to.row][move.to.col] = move.piece;
    }
    
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
  }
  
  return { board, currentPlayer };
}