import { useContract } from "./Context/ContractProvider";
import { BrowserProvider, Contract } from "ethers";
import React, { useState, useEffect } from "react";
import { createFhevmInstance } from "../fhevmjs";
import { PlayerData } from "./Player";
import './Registration.css';


const Registration: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWaitingForTx, setIsWaitingForTx] = useState(false);
  const [playersLeft, setPlayersLeft] = useState<number | null>(null);
  const [registrationError, setRegistrationError] = useState<string>('');

  const { contract, contractABI, contractAddress, setProvider, setContract, setIsRegistered, setPlayer } = useContract();

  useEffect(() => {
    const fetchPlayerCount = async () => {
      if (contract && isLoading) {
        try {
          await createFhevmInstance();
          const playerCount: number = await contract.getPlayersLeftToRegister();
          console.log(`players left: ${playerCount}`);
          setPlayersLeft(playerCount);
          if (playerCount == 0) {
            console.log("all registered");
            setIsRegistered(true);
          }
        } catch (error) {
          console.error("Error fetching player count:", error);
        }
      }
    };

    fetchPlayerCount();
    const intervalId = setInterval(fetchPlayerCount, 1000);

    return () => clearInterval(intervalId);
  }, [contract, isLoading]);

  const handleRegistration = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = new BrowserProvider(window.ethereum);
        const signer = await newProvider.getSigner();
        const newContract = new Contract(contractAddress, contractABI, signer);

        setProvider(newProvider);
        setContract(newContract);

        const tx = await newContract.registerForGame();
        setIsWaitingForTx(true);
        console.log("Transaction sent:", tx.hash);
        let receipt = await tx.wait();
        setIsWaitingForTx(false);
        if (receipt.status == 1) {
          console.log("Registered for game");

          const playerData: PlayerData = {
            address: await signer.getAddress(),
            role: "",
            status: true,
            id: 0
          };

          setPlayer(playerData);
          setIsLoading(true);
        }
        else {
          setRegistrationError('Transaction failed, please try again.');
        }
      } catch (error) {
        setRegistrationError('Could not connect to MetaMask');
      }
    } else {
      setRegistrationError("Please install MetaMask to continue.");
    }
  };

  return (
    <div className="registration-background">
      <div className="container registration-box">
        {registrationError && (
            <div className="transaction-notification">
              {registrationError}
            </div>
        )}
        {isWaitingForTx ? (
          <div className="notification">
            Waiting for transaction...
          </div>
        ) : (
          <section className="hero is-fullheight">
            <div className="hero-body">
              <div className="container has-text-centered">
                {isLoading ? (
                  <div className="loading">Loading... {playersLeft !== null ? `${playersLeft} players left to register` : ''}</div>
                ): <button className="button is-register" onClick={handleRegistration}>
                Register for Game
              </button>}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>

  );
};

export default Registration;
