// Assuming ContractA's ABI and address are available
import { ContractProvider } from "./Context/ContractProvider";
import Player, { PlayerData } from "./Player";
import Registration from "./Registration";
import { useState, useEffect } from "react";
import { init } from "../fhevmjs";
import PlayerList from "./PlayerList/PlayerList";
import ChatBox from "./ChatBox/ChatBox";
import StatusBar from "./StatusBar/StatusBar";


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
      <div className="App">
        {registered ? (
          <>
            <StatusBar/>
            <Player initialAddress={player.address} initialRole={player.role} initialStatus={player.status} />
            <PlayerList/>
            <ChatBox playerAddress={player.address} />
          </>
        ) : (
          <Registration updatePlayer={updatePlayer} updateRegistration={updateRegistration} />
        )}
      </div>
    </ContractProvider>
  );
};

export default App;
