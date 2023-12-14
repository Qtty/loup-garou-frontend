// ContractProvider.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import abi from './ContractA_ABI.json';
import { ethers } from 'ethers';
import { PlayerData } from '../Player';

// Define the shape of the context's value
interface IContractContext {
  phase: string;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  contractABI: typeof abi;
  contractAddress: string;
  player: PlayerData;
  setPlayer: (newPlayer: PlayerData) => void;
  setProvider: (newProvider: ethers.BrowserProvider | null) => void;
  setContract: (newContract: ethers.Contract | null) => void;
  isRegistered: boolean;
  setIsRegistered: (registeredValue: boolean) => void;
}

// Define the shape of your context state
export const ContractContext = createContext<IContractContext | undefined>(undefined);

// Type for the provider props
interface ContractProviderProps {
  children: React.ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [phase, setPhase] = useState<string>('initial_phase'); // initial phase
  const [hasInitialPhaseCompleted, setHasInitialPhaseCompleted] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [player, setPlayer] = useState<PlayerData>({} as PlayerData);

  // Define your ABI and Contract Address here
  const contractABI = abi;
  const contractAddress = "0x546C004Dd1703d7BAAaf5b116959636F5D7B75f6";

  // Function to update the provider in the context
  const updateProvider = (newProvider: ethers.BrowserProvider | null) => {
    setProvider(newProvider);
  };

  // Function to update the contract in the context
  const updateContract = (newContract: ethers.Contract | null) => {
    setContract(newContract);
  };

  const updateIsRegistered = (value: boolean) => {
    setIsRegistered(value);
  }

  const updatePlayer = (newPlayer: PlayerData) => {
    setPlayer(newPlayer);
  }

  const phases = ['wolves_vote', 'break1', 'village_debate', 'village_vote', 'break2'];

  type PhaseDurations = {
    [key in 'wolves_vote' | 'break1' | 'village_debate' | 'break2' | 'village_vote']: number;
  };

  const phaseDuration: PhaseDurations = {
    'wolves_vote': 2 * 60 * 1000, // 2 minutes
    'break1': 30 * 1000,
    'village_debate': 1 * 60 * 1000, // 5 minutes
    'village_vote': 2 * 60 * 1000, // 2 minutes
    'break2': 30 * 1000,
  };

  useEffect(() => {
    if (isRegistered && phase === 'initial_phase' && !hasInitialPhaseCompleted) {
      const timeoutId = setTimeout(() => {
        setPhase(phases[0]); // Start the regular phase cycle
        setHasInitialPhaseCompleted(true); // Mark the initial phase as completed
      }, 20 * 1000); // Duration of the initial phase

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isRegistered]);

  useEffect(() => {
    if (isRegistered && hasInitialPhaseCompleted) {
      

      const nextPhase = () => {
        setCurrentPhaseIndex((currentPhaseIndex + 1) % phases.length);
        setPhase(phases[(currentPhaseIndex + 1) % phases.length]);
      };

      // Set initial timeout for the first phase
      let timeoutId = setTimeout(nextPhase, phaseDuration[phase as keyof PhaseDurations]);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [phase, hasInitialPhaseCompleted]);

  return (
    <ContractContext.Provider value={{
        phase,
        provider,
        contract,
        contractABI,
        contractAddress,
        player,
        setPlayer: updatePlayer,
        setProvider: updateProvider,
        setContract: updateContract,
        isRegistered,
        setIsRegistered: updateIsRegistered
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
