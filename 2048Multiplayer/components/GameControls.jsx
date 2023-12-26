import CGame from "../utilities/CGame";

export default function GameControls({ game: CGame, setGame }) {
  return (
    <div>
      <p>
        Join the numbers and get to the <strong>2048 tile!</strong>
      </p>
      <button>New Game</button>
    </div>
  );
}
