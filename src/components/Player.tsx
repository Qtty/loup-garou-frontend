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
  const [address, setAddress] = useState<string>(initialAddress);
  const [role, setRole] = useState<string | undefined>(initialRole); // role can be string or undefined
  const [status, setStatus] = useState<boolean>(initialStatus);
  const { provider, contract, contractABI, contractAddress, setProvider, setContract } = useContract();

  useEffect(() => {
    const getRole = async () => {
      if (contract && role == '') {
        try {
          const { signature, publicKey } = await getTokenSignature(contractAddress, address);
          var fetchedRole = await contract.getRole(publicKey, signature);
          console.log("enc role: " + fetchedRole);
          console.log("contract address: " + contractAddress);
          var plainRole = getInstance().decrypt(contractAddress, fetchedRole);
          setRole(roles[plainRole]);
          console.log(`player role: ${role}`);
        } catch (error) {
          console.error("Error fetching player role:", error);
        }
      }
    };

    getRole();
    const intervalId = setInterval(getRole, 5000);
    return () => clearInterval(intervalId);
  }, [contract, address, contractAddress, role]); // Dependencies array should include all values from the component scope used in the effect

  return (
    <div className="player">
      <p>Address: {address}</p>
      <p>Role: {role || "Waiting for role"}</p>
      <p>Status: {status ? "Alive :)" : "Dead :("}</p>
      {/* Interactive elements here */}
    </div>
  );
};

export default Player;
