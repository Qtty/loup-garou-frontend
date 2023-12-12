import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameOver: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="game-over">
      <h1>Game Over</h1>
      <p>Sorry, you have been eliminated from the game.</p>
      <button onClick={() => navigate('/')}>Return to Home</button>
    </div>
  );
};

export default GameOver;
