import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./GameOver.css";

const GameOver: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="game-over-background">
      <div className="game-over">
        <h1 className="title">Game Over</h1>
        <p className="subtitle">Sorry, you have been eliminated from the game.</p>
        <button className="button is-warning" onClick={() => navigate('/')}>Return to Home</button>
      </div>
    </div>
  );
};

export default GameOver;
