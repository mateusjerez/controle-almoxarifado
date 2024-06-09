// src/components/Bingo.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Bingo: React.FC = () => {
  const [highlightedNumbers, setHighlightedNumbers] = useState<number[]>([]);

  const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);

  const toggleNumber = (number: number) => {
    setHighlightedNumbers(prevState =>
      prevState.includes(number)
        ? prevState.filter(num => num !== number)
        : [...prevState, number]
    );
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
          className={`list-group-item ${highlightedNumbers.includes(num) ? 'active' : ''}`}
          onClick={() => toggleNumber(num)}
          style={{ cursor: 'pointer' }}
        >
          {num}
        </li>
      ));
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Bingo</h1>
      <div className="row">
        {['B', 'I', 'N', 'G', 'O'].map((column) => (
          <div key={column} className="col">
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
