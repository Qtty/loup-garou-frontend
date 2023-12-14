// WolvesWin.tsx or VillagersWin.tsx
import React from 'react';
import { useContract } from '../Context/ContractProvider';
import "./GameEnd.css";

const EndGameMessage = () => {
    const { player } = useContract();
    const isWolf = player.role == 'wolf';
    const messageRoleClass = isWolf ? 'win-message' : 'lost-message';
    const message = isWolf ? 'Congratulations, Wolves Win!' : 'Oooooops, Wolves Win :(';
  
    return (
    <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className={`win-lose-message ${messageRoleClass}`}>
              <p className="title">
                {message}
              </p>
            </div>  
          </div>
        </div>
    </section>
  );
};

export default EndGameMessage;
