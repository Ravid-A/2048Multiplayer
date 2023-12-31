export default function GamePanel({ tiles = [], online = false }) {
  return (
    <>
      <div>
        <div>
          <div>
            <button disabled={true}></button>
            <button disabled={true}></button>
            <button disabled={true}></button>
            <button disabled={true}></button>
            <br />
            <button disabled={true}></button>
            <button disabled={true}></button>
            <button disabled={true}></button>
            <button disabled={true}></button>
            <br />
            <button disabled={true}></button>
            <button disabled={true}></button>
            <button disabled={true}></button>
            <button disabled={true}></button>
            <br />
            <button disabled={true}></button>
            <button disabled={true}></button>
            <button disabled={true}></button>
            <button disabled={true}></button>
          </div>
          <div>
            <p>Game Over!</p>
          </div>
        </div>

        <div>
          <p>
            <strong>How to play:</strong> Use your
            <strong>arrow keys</strong> to move the tiles. When two tiles with
            the same number touch, they <strong>merge into one!</strong>
          </p>
          <div>↑</div>
          <br />
          <div>←</div>
          <div>↓</div>
          <div>→</div>
        </div>
      </div>
    </>
  );
}
