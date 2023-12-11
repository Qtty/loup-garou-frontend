// Assuming ContractA's ABI and address are available
import { ContractProvider } from "./Context/ContractProvider";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Player, { PlayerData } from "./Player";
import Registration from "./Registration";
import { useState, useEffect } from "react";
import { init } from "../fhevmjs";
import PlayerList from "./PlayerList/PlayerList";
import ChatBox from "./ChatBox/ChatBox";
import StatusBar from "./StatusBar/StatusBar";
import GameOver from "./GameOver/GameOver"; 
import "./App.css";


const App = () => {

  const [player, setPlayer] = useState<PlayerData>({} as PlayerData);
  const [registered, setRegistered] = useState<boolean>(false);

  // These updater functions will be passed down to components as needed
  const updatePlayer = (playerData: PlayerData) => setPlayer(playerData);
  const updateRegistration = (isRegistered: boolean) => setRegistered(isRegistered);

  useEffect(() => {
    async function initializeLibrary() {
      await init();
    }
  
    initializeLibrary();
  }, []);
  

  return (
    <ContractProvider>
      <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={
              registered ? (
                <>
                  <StatusBar/>
                  <Player initialAddress={player.address} initialRole={player.role} initialStatus={player.status} />
                  <PlayerList/>
                  <ChatBox playerAddress={player.address} />
                </>
              ) : (
                <Registration updatePlayer={updatePlayer} updateRegistration={updateRegistration} />
              )
            } />
          <Route path="/game-over" element={<GameOver />} />
        </Routes>
      </div>
      </Router>
    </ContractProvider>
  );
};

export default App;
