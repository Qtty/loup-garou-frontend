import React, { useEffect } from "react";
import { useContract } from "./Context/ContractProvider";
import { getTokenSignature, getInstance } from '../fhevmjs';

// Interface for player data defined
export interface PlayerData {
  address: string;
  role: string;
  status: boolean;
  id: number;
}

type RoleDictionary = {
  [key: number]: string;
};

const roles: RoleDictionary = {
  1: "wolf",
  2: "human",
  3: "sorcerer"
};

const Player: React.FC = () => {
  const { contract, contractAddress, setPlayer, player } = useContract();

  const getRole = async () => {
    if (contract && player.role == "") {
      try {
        const { signature, publicKey } = await getTokenSignature(contractAddress, player.address);
        var fetchedRole = await contract.getRole(publicKey, signature);
        var plainRole = getInstance().decrypt(contractAddress, fetchedRole);
        const updatedPlayer: PlayerData = {
          address: player.address,
          role: roles[plainRole],
          status: player.status,
          id: player.id,
        }
        setPlayer(updatedPlayer);
      } catch (error) {
        console.error("Error fetching player role:", error);
      }
    }
  };

  useEffect(() => {
    getRole();
  }, []); // Dependencies array should include all values from the component scope used in the effect

  return (
    <div className="player"></div>
  );
};

export default Player;
