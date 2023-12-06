import React, { useState, useEffect } from 'react';
import PlayerCard from "../PlayerCard/PlayerCard";
import "./PlayerList.css";
import { useContract } from '../Context/ContractProvider';
import {PlayerData} from '../Player';


const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const { contract } = useContract();

  // Function to fetch registered players from the contract
  const fetchRegisteredPlayers = async () => {
    if (!contract) return;

    try {
      // Assuming registeredPlayer is a method in your contract that returns an array of player data
      const registeredPlayers = await contract.getRegisteredPlayers();
      console.log(registeredPlayers);
      
      // Transform the data (if necessary) and update state
      const playerList = registeredPlayers.map((player: any) => ({
        address: player,
        role: 0,
        status: true,
      }));

      setPlayers(playerList);
    } catch (error) {
      console.error('Error fetching registered players:', error);
    }
  };

  useEffect(() => {
    fetchRegisteredPlayers();
  }, [contract]); // Re-run the effect if the contract instance changes

  return (
    <div className="PlayerList">
      {players.map((player, index) => (
        <PlayerCard key={index} address={player.address} status={player.status} />
      ))}
    </div>
  );
}

export default PlayerList;
