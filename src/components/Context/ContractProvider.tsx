// ContractProvider.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import abi from './ContractA_ABI.json';
import { ethers } from 'ethers';

// Define the shape of the context's value
interface IContractContext {
  phase: string;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  contractABI: typeof abi;
  contractAddress: string;
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
  const [phase, setPhase] = useState<string>('wolves_vote'); // initial phase
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  // Define your ABI and Contract Address here
  const contractABI = abi;
  const contractAddress = "0x027fBDb38DEF8341C343169545b47a12eC96CD4C";

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

  type PhaseDurations = {
    [key in 'wolves_vote' | 'village_debate' | 'village_vote']: number;
  };

  useEffect(() => {
    if (isRegistered) {
      const phaseDuration: PhaseDurations = {
        'wolves_vote': 2 * 60 * 1000, // 2 minutes
        'village_debate': 5 * 60 * 1000, // 5 minutes
        'village_vote': 2 * 60 * 1000, // 2 minutes
      };

      const phases = ['wolves_vote', 'village_debate', 'village_vote'];
      let currentPhaseIndex = 0;

      const nextPhase = () => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        setPhase(phases[currentPhaseIndex]);
      };

      // Set initial timeout for the first phase
      let timeoutId = setTimeout(nextPhase, phaseDuration[phase as keyof PhaseDurations]);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [phase, isRegistered]);

  return (
    <ContractContext.Provider value={{
        phase,
        provider,
        contract,
        contractABI,
        contractAddress,
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
