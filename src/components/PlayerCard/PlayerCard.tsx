import React from 'react';
import "./PlayerCard.css";
import { useContract } from '../Context/ContractProvider';

interface PlayerCardProps {
  address: string;  // Assuming this represents the player's ID
  status: boolean;  // This assumes status can only be "Alive" or "Dead"
}

const PlayerCard: React.FC<PlayerCardProps> = ({ address, status }) => {
  const { contract } = useContract();

  const handleDailyDebateVote = async () => {
    if (contract && address) {
      try {
        // Call the dailyDebate method of your contract
        await contract.dailyDebate(address);
        console.log(`Voted in daily debate for: ${address}`);
      } catch (error) {
        console.error('Error in dailyDebate voting:', error);
      }
    }
  };

  const handleWolvesNightVote = async () => {
    if (contract && address) {
      try {
        // Call the wolves_night method of your contract
        await contract.wolves_night(address);
        console.log(`Voted in wolves night for: ${address}`);
      } catch (error) {
        console.error('Error in wolves night voting:', error);
      }
    }
  };

  return (
    <div 
      className={`PlayerCard ${status ? "Alive" : "Dead"}`}
      onClick={handleDailyDebateVote}  // Assuming daily debate vote is for all players
    >
      <p>{address} - {status ? "Alive" : "Dead"}</p>
      { /* Add conditional rendering for wolves night vote if needed, e.g., if only wolves can vote */ }
      <button onClick={handleWolvesNightVote}>Vote for Wolves Night</button>
    </div>
  );
}

export default PlayerCard;
