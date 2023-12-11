import React, {useEffect, useState} from 'react';
import "./PlayerCard.css";
import { useContract } from '../Context/ContractProvider';
import { getInstance } from '../../fhevmjs';
import { FhevmInstance } from 'fhevmjs';

interface PlayerCardProps {
  address: string;  // Assuming this represents the player's ID
  status: boolean;  // This assumes status can only be "Alive" or "Dead"
  id: number; // The ID of the player, this'll be used for boting
}

const PlayerCard: React.FC<PlayerCardProps> = ({ address, status, id }) => {
  const { contract, phase, player } = useContract();
  const [ hasVoted, setHasVoted ] = useState<boolean>(false);

  const handleDailyDebateVote = async () => {
    if (contract && id) {
      try {
        // Call the dailyDebate method of your contract
        await contract.dailyDebate(id);
        console.log(`Voted in daily debate for: ${id}`);
      } catch (error) {
        console.error('Error in dailyDebate voting:', error);
      }
    }
  };

  const handleWolvesNightVote = async () => {
    if (contract && id) {
      try {
        let instance: FhevmInstance =  getInstance();
        // Call the wolves_night method of your contract
        await contract.wolvesNight(instance.encrypt8(id));
        console.log(`Voted in wolves night for: ${id}`);
      } catch (error) {
        console.error('Error in wolves night voting:', error);
      }
    }
  };

  useEffect(() => {
    // Reset hasVoted when the phase changes
    setHasVoted(false);
  }, [phase]);

  //useEffect(() => {
  //  if (player.role) {
  //    let isWolf = player.role == "wolf";
  //    // If the phase is wolves_vote and the player is not a wolf and hasn't voted yet, vote automatically
  //    if (phase === 'wolves_vote' && !isWolf && !hasVoted) {
  //      autoVoteForWolvesNight();
  //      setHasVoted(true); // Set hasVoted to true to prevent further votes this phase
  //    }
  //  }
//
  //}, [phase, player.role, hasVoted]);

  const autoVoteForWolvesNight = async () => {
    if (contract && !hasVoted) {
      try {
        let instance: FhevmInstance = getInstance();
        // Automatically vote for player ID 0
        await contract.wolvesNight(instance.encrypt8(0));
        console.log('Automatic vote in wolves night for ID 0.');
        setHasVoted(true);
      } catch (error) {
        console.error('Error in automatic wolves night voting:', error);
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
        className={`PlayerCard ${status ? "Alive" : "Dead"}`}
        onClick={handleClick} // Assuming daily debate vote is for all players
      >
        <p>{address} - {status ? "Alive" : "Dead"}</p>
      </div>
      <div className="auto vote"
        onClick={autoVoteForWolvesNight} // Assuming daily debate vote is for all players
      >
        <p>auto vote</p>
      </div>
    </>
  );
}

export default PlayerCard;
