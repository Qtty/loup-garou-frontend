// Assuming ContractA's ABI and address are available
import { ContractProvider } from "./Context/ContractProvider";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import { init } from "../fhevmjs";
import GameOver from "./GameEnd/GameOver"; 
import WolvesWin from "./GameEnd/WolvesWin";
import VillagersWin from "./GameEnd/VillagersWin";
import MainContent from "./MainContent";
import "./App.css";


const App = () => {
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
            <Route path="/" element={<MainContent />} />
            <Route path="/game-over" element={<GameOver />} />
            <Route path="/wolves-win" element={<WolvesWin />} />
            <Route path="/villagers-win" element={<VillagersWin />} />
          </Routes>
        </div>
      </Router>
    </ContractProvider>
  );
};

export default App;
