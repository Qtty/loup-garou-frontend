import React, { useState, useEffect } from "react";
import { useContract } from "./Context/ContractProvider";
import { getTokenSignature, getInstance } from '../fhevmjs';

// Define the shape of the props using an interface
interface PlayerProps {
  initialAddress: string;
  initialRole?: string; // Use '?' to mark the property as optional if it can be undefined
  initialStatus: boolean;
}

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

const Player: React.FC<PlayerProps> = ({ initialAddress, initialRole = '', initialStatus }) => {
  const [address] = useState<string>(initialAddress);
  const [status] = useState<boolean>(initialStatus);
  const { contract, contractAddress, setPlayer, player } = useContract();

  const getRole = async () => {
    if (contract && player.role == undefined) {
      try {
        const { signature, publicKey } = await getTokenSignature(contractAddress, address);
        var fetchedRole = await contract.getRole(publicKey, signature);
        var plainRole = getInstance().decrypt(contractAddress, fetchedRole);
        const player: PlayerData = {
          address: address,
          role: roles[plainRole],
          status: status,
          id: 0,
        }
        setPlayer(player);
      } catch (error) {
        console.error("Error fetching player role:", error);
      }
    }
  };

  useEffect(() => {
    getRole();
  }, []); // Dependencies array should include all values from the component scope used in the effect

  return (
    <div className="player">
      <p>Role: {player.role || "Waiting for role"}</p>
      {/* Interactive elements here */}
    </div>
  );
};

export default Player;
