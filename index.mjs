import { blackMap, emptyMap, redMap, initPos } from "./src/lib/pos.mjs";
import { createChess, drawChessPos, drawNinePalaces } from "./src/lib/draw.mjs";
import initRun, { initStatus } from "./src/lib/initRun.mjs";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

(function () {
  function initGame() {

    drawChessPos(blackMap, false);
    drawChessPos(redMap, true);
    $$(".placeholder-chess").forEach((el) => {
      el.remove();
    });
    Object.keys(emptyMap).forEach((key) => {
      emptyMap[key].forEach(([x, y]) => {
        const div = createChess(key, x, y, "placeholder-chess");
        document.getElementById("app").appendChild(div);
      });
    });
  }

  for (let i = 0; i < 72; i++) {
    const div = document.createElement("div");
    div.className = "block";
    if (i <= 7) div.style.borderTop = "2px solid black";
    if (i % 8 === 0) div.style.borderLeft = "2px solid black";
    if ((i + 1) % 8 === 0) div.style.borderRight = "2px solid black";
    if (i > 63) div.style.borderBottom = "2px solid black";
    $(".board").appendChild(div);
  }
  initGame();
  drawNinePalaces();
  initRun();
  $(".reset").addEventListener("click", () => {
    initPos();
    initGame();
    initStatus();
  });
})();
