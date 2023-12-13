import React, { useState, useEffect } from 'react';
import PlayerCard from "../PlayerCard/PlayerCard";
import "./PlayerList.css";
import { useContract } from '../Context/ContractProvider';
import {PlayerData} from '../Player';
import { useNavigate } from 'react-router-dom';
import { getInstance } from '../../fhevmjs';
import { FhevmInstance } from 'fhevmjs';
import "./PlayerList.css";


const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [playerDiedNotification, setPlayerDiedNotification] = useState('');
  const [showPlayerDied, setShowPlayerDied] = useState(false);
  const { contract, phase, player } = useContract();
  const navigate = useNavigate(); // Hook for navigation
  const gasLimit = 4000000;

  // Function to fetch registered players from the contract
  const fetchRegisteredPlayers = async () => {
    if (!contract) return;

    try {
      // Assuming registeredPlayer is a method in your contract that returns an array of player data
      const registeredPlayers = await contract.getRegisteredPlayers();
      
      // Transform the data (if necessary) and update state
      const playerList = registeredPlayers
        .map((participant: any, index: number) => ({
          address: participant,
          role: 0,
          status: true,
          id: index
        }));

      const filteredPlayerList = playerList.filter((participant: PlayerData) => participant.address != player.address);
      setPlayers(filteredPlayerList);
    } catch (error) {
      console.error('Error fetching registered players:', error);
    }
  };

  const onPlayerDeath = () => {
    setShowPlayerDied(true);
    setTimeout(() => {
      setShowPlayerDied(false);
    }, 20000); // Hide the notification after 10 seconds
  };
  
  const removeKilledPlayer = async () => {
    if (!contract) return;

    try {
      // Assuming getKilledPlayer is a method in your contract
      const killedPlayerAddress = await contract.gotKilled();
      
      // Navigate to Game Over page if the killed player is the current player
      if (killedPlayerAddress === player.address) {
        navigate('/game-over'); // Adjust the path as per your routing setup
      }

      if (killedPlayerAddress == "0x0000000000000000000000000000000000000000") {
        setPlayerDiedNotification(`No one died: Tie`);
      } else {
        // Filter out the killed player
        setPlayers(prevPlayers => prevPlayers.filter(participant => participant.address !== killedPlayerAddress));
        setPlayerDiedNotification(`Player died: ${killedPlayerAddress}`);
      }

      console.log('got killed: ' + killedPlayerAddress);
      onPlayerDeath();
      await gameEnded();
    } catch (error) {
      console.error('Error removing killed player:', error);
    }
  };

  const gameEnded = async () => {
    if (!contract) return;

    try {
      const villagersWon = await contract.villagers_win();
      if (villagersWon == true) {
        navigate("/villagers-win");
      }

      const wolvesWon = await contract.wolves_win();
      if (wolvesWon == true) {
        navigate("/wolves-win");
      }

    } catch (error) {
      console.error("Error getting game end status");
    }
  };

  // Effect to update the players list on phase change
  useEffect(() => {
    // When the phase changes to 'village_debate' or 'wolves_night', remove the killed player
    if (phase === 'break1' || phase === 'break2') {
      removeKilledPlayer();
    }
  }, [phase]);

  useEffect(() => {
    fetchRegisteredPlayers();
  }, [contract, player]); // Re-run the effect if the contract instance changes

  useEffect(() => {
    let isWolf = (player.role == "wolf");
    // If the phase is wolves_vote and the player is not a wolf and hasn't voted yet, vote automatically
    if (phase == 'wolves_vote' && !isWolf) {
      autoVoteForWolvesNight();
    }

  }, [phase]);

  const autoVoteForWolvesNight = async () => {
    if (contract) {
      try {
        let instance: FhevmInstance = getInstance();
        // Automatically vote for player ID 0
        await contract.wolvesNight(instance.encrypt8(0), { gasLimit: gasLimit });
        console.log('Automatic vote in wolves night for ID 0.');
      } catch (error) {
        console.error('Error in automatic wolves night voting:', error);
      }
    }
  };

  return (
    <>
    {showPlayerDied && (
      <div className="player-died-notification">
        {playerDiedNotification}
      </div>
    )}
    {(<div className="section">
      <div className="container">
        <div className="columns is-centered is-multiline">
          {players.map((participant, index) => (
            <div className="column is-narrow" key={index}>
              <PlayerCard address={participant.address} status={participant.status} id={participant.id}/>
            </div>
          ))}
        </div>
      </div>
    </div>)}
    </>
  );
}

export default PlayerList;
