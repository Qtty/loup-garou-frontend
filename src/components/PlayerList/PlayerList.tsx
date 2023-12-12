import React, { useState, useEffect } from 'react';
import PlayerCard from "../PlayerCard/PlayerCard";
import "./PlayerList.css";
import { useContract } from '../Context/ContractProvider';
import {PlayerData} from '../Player';
import { useNavigate } from 'react-router-dom';
import "./PlayerList.css";


const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const { contract, phase, player } = useContract();
  const navigate = useNavigate(); // Hook for navigation

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
      console.log("player list: " + playerList);
      console.log('player: ' + player.address);
      setPlayers(filteredPlayerList);
    } catch (error) {
      console.error('Error fetching registered players:', error);
    }
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

      // Filter out the killed player
      setPlayers(prevPlayers => prevPlayers.filter(participant => participant.address !== killedPlayerAddress));
      console.log('got killed: ' + killedPlayerAddress);
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

  // TODO: update the players list based on the phase, once if it's wolves night and once if it's village debate, or add breaks between phases
  useEffect(() => {
    fetchRegisteredPlayers();
  }, [contract, player]); // Re-run the effect if the contract instance changes

  return (
    <div className="section">
      <div className="container">
        <div className="columns is-centered is-multiline">
          {players.map((participant, index) => (
            <div className="column is-narrow" key={index}>
              <PlayerCard address={participant.address} status={participant.status} id={participant.id}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerList;
