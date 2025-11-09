'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { X, Circle, RotateCcw } from 'lucide-react';

function Square({ value, onSquareClick, isWinning }: { value: 'X' | 'O' | null, onSquareClick: () => void, isWinning: boolean }) {
  const Icon = value === 'X' ? X : value === 'O' ? Circle : null;
  return (
    <button
      className={cn(
        "flex items-center justify-center h-20 w-20 md:h-24 md:w-24 bg-card border border-border text-4xl md:text-5xl font-bold transition-colors",
        isWinning ? 'bg-primary/20 text-primary' : 'hover:bg-accent/50',
      )}
      onClick={onSquareClick}
    >
      {Icon && <Icon className="h-12 w-12" />}
    </button>
  );
}

function calculateWinner(squares: Array<'X' | 'O' | null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: [] };
}

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winningLine } = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl mb-4 font-semibold">{status}</div>
      <div className="grid grid-cols-3 grid-rows-3">
        {squares.map((square, i) => (
          <Square 
            key={i} 
            value={square} 
            onSquareClick={() => handleClick(i)}
            isWinning={winningLine.includes(i)}
          />
        ))}
      </div>
      <Button onClick={handleReset} variant="outline" className="mt-6">
        <RotateCcw className="mr-2 h-4 w-4" />
        New Game
      </Button>
    </div>
  );
}
