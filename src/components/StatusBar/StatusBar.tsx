import React, { useState, useEffect } from 'react';
import { useContract } from '../Context/ContractProvider';

const StatusBar: React.FC = () => {
  const { phase, player } = useContract(); // Assuming phase is part of your context
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Define the duration for each phase
  const phaseDurations: { [key: string]: number } = {
    'wolves_vote': 2 * 60, // 2 minutes in seconds
    'break1': 30,
    'village_debate': 1 * 60, // 5 minutes in seconds
    'village_vote': 2 * 60, // 2 minutes in seconds
    'break2': 30,
  };

  // Function to format the time left as mm:ss
  const formatTimeLeft = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Set the initial time left when the phase changes
    setTimeLeft(phaseDurations[phase]);

    // Update the timer every second
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="status-bar has-background-dark has-text-light" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}>
      <div className="container">
        <div className="level is-mobile is-justify-content-space-between">
          <div className="level-left">
            <p className="level-item">Current Phase: {phase}</p>
          </div>
          <p className="level-item has-text-centered">Time Left: {formatTimeLeft(timeLeft)}</p>
          <div className="level-right">
            <p className="level-item">Role: {player.role}</p> {/* Replace {playerAddress} with your actual data */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
