import { useContract } from '../Context/ContractProvider';
import "./GameEnd.css";

const EndGameMessage = () => {
    const { player } = useContract();
    const isWolf = player.role == 'wolf';
    const messageRoleClass = isWolf ? 'lost-message' : 'win-message';
    const message = isWolf ? 'Ooooops, Villagers Win :(' : 'Congratulations, Villagers Win!';
  
    return (
    <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className={`win-lose-message ${messageRoleClass}`}>
              <p className="title">
                {message}
              </p>
            </div>  
          </div>
        </div>
    </section>
  );
};

export default EndGameMessage;
