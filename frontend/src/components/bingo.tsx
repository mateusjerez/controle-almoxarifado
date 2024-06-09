// src/components/Bingo.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bingo.css';

const Bingo: React.FC = () => {
  const [highlightedNumbers, setHighlightedNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);

  const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);

  const toggleNumber = (number: number) => {
    const column = getColumn(number);
    setHighlightedNumbers(prevState =>
      prevState.includes(number)
        ? prevState.filter(num => num !== number)
        : [...prevState, number]
    );

    setCurrentNumber(number);
    setCurrentColumn(column);
    setTimeout(() => {
      setCurrentNumber(null);
      setCurrentColumn(null);
    }, 5000);
  };

  const getColumn = (number: number): string => {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
  };

  const renderNumbers = (column: string) => {
    return allNumbers
      .filter(num => getColumn(num) === column)
      .map(num => (
        <li
          key={num}
          className={`list-group-item d-flex justify-content-center align-items-center ${highlightedNumbers.includes(num) ? 'active' : ''}`}
          onClick={() => toggleNumber(num)}
          style={{ cursor: 'pointer', height: '50px' }}
        >
          {num}
        </li>
      ));
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Bingo</h1>
      {currentNumber !== null && currentColumn !== null && (
        <div className="fullscreen-number">
          <div>
             <p>{currentColumn} {currentNumber}</p>
          </div>
        </div>
      )}
      <div className="row">
        {['B', 'I', 'N', 'G', 'O'].map((column) => (
          <div key={column} className="col text-center">
            <h2>{column}</h2>
            <ul className="list-group">
              {renderNumbers(column)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bingo;
