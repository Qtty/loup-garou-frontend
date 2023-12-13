import React, {useEffect, useState} from 'react';
import "./PlayerCard.css";
import { useContract } from '../Context/ContractProvider';
import { getInstance } from '../../fhevmjs';
import { FhevmInstance } from 'fhevmjs';
import { sendMessageUtil } from "../ChatBox/sendMessage";
import "./PlayerCard.css";

interface PlayerCardProps {
  address: string;  // Assuming this represents the player's ID
  status: boolean;  // This assumes status can only be "Alive" or "Dead"
  id: number; // The ID of the player, this'll be used for boting
}

const PlayerCard: React.FC<PlayerCardProps> = ({ address, status, id }) => {
  const { contract, phase, player } = useContract();
  const gasLimit = 4000000;

  const handleDailyDebateVote = async () => {
    if (contract) {
      try {
        // Call the dailyDebate method of your contract
        await contract.dailyDebate(id);
        console.log(`Voted in daily debate for: ${id}`);
        await sendMessageUtil("1341", player.address, `Voted in daily debate for ${address.slice(0, 10)}`);
      } catch (error) {
        console.error('Error in dailyDebate voting:', error);
      }
    }
  };

  const handleWolvesNightVote = async () => {
    if (contract) {
      try {
        let instance: FhevmInstance =  getInstance();

        // Call the wolves_night method of your contract
        await contract.wolvesNight(instance.encrypt8(id), { gasLimit: gasLimit });
        console.log(`Voted in wolves night for: ${id}`);
      } catch (error) {
        console.error('Error in wolves night voting:', error);
      }
    }
  };

  const handleClick = () => {
    if (phase === 'village_vote') {
      handleDailyDebateVote();
    } else if (phase === 'wolves_vote') {
      handleWolvesNightVote();
    }
    // If it's neither 'village_vote' nor 'wolves_vote', nothing happens
  };

  return (
    <>
      <div
        className={`PlayerCard`}
        onClick={handleClick} // Assuming daily debate vote is for all players
      >
      </div>
      <p>{address.slice(0, 10)}</p>
    </>
  );
}

export default PlayerCard;
