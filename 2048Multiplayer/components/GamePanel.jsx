import styles from "../styles/GamePanel.module.css";

export default function GamePanel({ tiles = [], online = false }) {
  return (
    <>
      <div style="display: flex; width: 800px">
        <div id="game-cube" class="game-container" style="float: left">
          <div class="buttons">
            <button class="game-button" id="00" disabled=""></button>
            <button class="game-button" id="01" disabled=""></button>
            <button class="game-button" id="02" disabled=""></button>
            <button class="game-button" id="03" disabled=""></button>
            <br />
            <button class="game-button" id="10" disabled=""></button>
            <button class="game-button" id="11" disabled=""></button>
            <button class="game-button" id="12" disabled=""></button>
            <button class="game-button" id="13" disabled=""></button>
            <br />
            <button class="game-button" id="20" disabled=""></button>
            <button class="game-button" id="21" disabled=""></button>
            <button class="game-button" id="22" disabled=""></button>
            <button class="game-button" id="23" disabled=""></button>
            <br />
            <button class="game-button" id="30" disabled=""></button>
            <button class="game-button" id="31" disabled=""></button>
            <button class="game-button" id="32" disabled=""></button>
            <button class="game-button" id="33" disabled=""></button>
          </div>
          <div id="gameover" class="game-over">
            <p id="alert" class="alert">
              Game Over!
            </p>
          </div>
        </div>

        <div class="keys" style="float: right">
          <p class="game-explanation">
            <strong class="important">How to play:</strong> Use your
            <strong>arrow keys</strong> to move the tiles. When two tiles with
            the same number touch, they <strong>merge into one!</strong>
          </p>
          <div id="up" class="up arr">
            ↑
          </div>
          <br />
          <div id="left" class="left arr">
            ←
          </div>
          <div id="down" class="down arr">
            ↓
          </div>
          <div id="right" class="right arr">
            →
          </div>
        </div>
      </div>
    </>
  );
}
