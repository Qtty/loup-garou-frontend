// MainContent.jsx
import { useContract } from "./Context/ContractProvider";
import Player from "./Player";
import PlayerList from "./PlayerList/PlayerList";
import ChatBox from "./ChatBox/ChatBox";
import StatusBar from "./StatusBar/StatusBar";
import Registration from "./Registration";

const MainContent = () => {
  const { isRegistered } = useContract();

  return isRegistered ? (
    <>
      <StatusBar />
      <Player />
      <PlayerList />
      <ChatBox/>
    </>
  ) : (
    <Registration />
  );
};

export default MainContent;
