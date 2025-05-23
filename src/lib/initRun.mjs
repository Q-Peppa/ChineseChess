import checkRule, { checkPlayerWin } from "./checkRule.mjs";
import RULE from "./RULE.mjs";
import { blackMap, redMap } from "./pos.mjs";
import { drawChessPos } from "./draw.mjs";
import {
  getBlackChess,
  getRedChessByPos,
  isBlack,
  isBlankPos,
  isRed,
  walkAllPos,
} from "./lib.mjs";
import { CHESS_NAME } from "./constant.js";
import {
  isValidAdvisorMove,
  isValidCannonMove,
  isValidElephantMove,
  isValidGeneralMove,
  isValidHorseMove,
  isValidPawnMove,
  isValidRookMove,
} from "./move.js";

const RED = 0;
const BLACK = 1;
let step = RED;
let selectedChess = null; // 当前选中的棋子
let turn = RED; // 0 means red, 1 means black
let end = false;
const highLightPossiblePos = (nextX, nextY, preDom) => {
  const name = preDom.textContent.trim();
  const x = Number(nextX);
  const y = Number(nextY);
  const preX = preDom.getAttribute("data-x");
  const preY = preDom.getAttribute("data-y");
  const isNextEmpty = isBlankPos(nextX, nextY);
  const isPreBlackChess = isBlack(preX, preY);
  const isPreRedChess = isRed(preX, preY);
  const isBlackChess = isBlack(nextX, nextY);
  const isRedChess = isRed(nextX, nextY);
  let color = turn === RED ? "red" : "black";
  let res;
  switch (name) {
    case CHESS_NAME.red_soldier:
    case CHESS_NAME.soldier:
      res = isValidPawnMove(preX, preY, nextX, nextY, color);
      break;
    case CHESS_NAME.horse:
    case CHESS_NAME.red_horse:
      res = isValidHorseMove(preX, preY, nextX, nextY);
      break;
    case CHESS_NAME.cannon:
    case CHESS_NAME.red_cannon:
      res = isValidCannonMove(preX, preY, nextX, nextY, !isNextEmpty);
      break;
    case CHESS_NAME.rook:
      res = isValidRookMove(preX, preY, nextX, nextY);
      break;
    case CHESS_NAME.elephant:
    case CHESS_NAME.red_elephant:
      res = isValidElephantMove(preX, preY, nextX, nextY, color);
      break;
    case CHESS_NAME.advisor:
    case CHESS_NAME.red_advisor:
      res = isValidAdvisorMove(preX, preY, nextX, nextY, color);
      break;
    case CHESS_NAME.general:
    case CHESS_NAME.red_general:
      res = isValidGeneralMove(preX, preY, nextX, nextY, color);
      break;
    default:
      break;
  }
  if (res === undefined) {
    const lib = document.querySelectorAll(`[data-x='${x}'][data-y='${y}']`);
    lib.forEach((li) => {
      if ((isPreBlackChess && isBlackChess) || (isPreRedChess && isRedChess)) {
      } else {
        li.classList.add("can-move");
      }
    });
  }
};
const removeHighlight = () => {
  document.querySelectorAll(".can-move")?.forEach((el) => {
    el.classList.remove("can-move");
  });
};
const addPosHoverTip = () => {
  const placeholderChess = document.querySelectorAll(".placeholder-chess");
  placeholderChess.forEach((el, i) => {
    el.style.cursor = "pointer";
  });
};
const fn = (event) => {
  const status = document.querySelector(".status p");
  if (end) {
    console.log(RULE.END);
    return;
  }
  const target = event.target; // 当前点击的棋子
  const [targetX, targetY] = [
    target.getAttribute("data-x"),
    target.getAttribute("data-y"),
  ];
  const isEmptyPos = isBlankPos(targetX, targetY);
  const isRedChess = isRed(targetX, targetY);
  const isBlackChess = isBlack(targetX, targetY);

  // console.log(isEmptyPos, isRed, isBlack);
  if (!selectedChess && !isEmptyPos) {
    if (isBlackChess && turn === RED) {
      console.log(RULE.NOT_TURN);
      return;
    }
    if (isRedChess && turn === BLACK) {
      console.log(RULE.NOT_TURN);
      return;
    }
    selectedChess = target;
    addPosHoverTip();
    walkAllPos((i, j) => highLightPossiblePos(i, j, selectedChess));
  } else {
    if (!selectedChess) {
      console.log("clicked empty , but not selected");
      return;
    }
    const preRed = selectedChess.classList.contains("red-chess");
    const preBlack = selectedChess.classList.contains("black-chess");
    if ((preBlack && isBlackChess) || (preRed && isRedChess)) {
      selectedChess = null;
      removeHighlight();
      fn(event);
      return;
    }
    // if(selectedChess.)
    if (turn === RED) {
      const check = checkRule(turn, selectedChess, target);

      if (check === undefined) {
        const [x, y] = [
          +selectedChess.getAttribute("data-x"),
          +selectedChess.getAttribute("data-y"),
        ];
        const name = selectedChess.textContent.trim();
        const [nextX, nextY] = [
          target.getAttribute("data-x"),
          target.getAttribute("data-y"),
        ];
        const index = redMap[name].findIndex(
          (pos) => pos[0] === x && pos[1] === y,
        );
        if (index >= 0) {
          redMap[name][index] = [+nextX, +nextY];
        }
        if (isBlackChess) {
          // 吃子
          const blackName = getBlackChess(nextX, nextY).textContent.trim();
          blackMap[blackName] = blackMap[blackName].filter(
            (pos) => pos[0] !== +nextX || pos[1] !== +nextY,
          );
        }
        drawChessPos(redMap, true);
        drawChessPos(blackMap, false);
      } else {
        const p = (document.createElement("p").textContent = check);
        document.querySelector(".status").append(p);

        // selectedChess = null;
        return;
      }
    } else {
      const check = checkRule(turn, selectedChess, target);
      if (check === undefined) {
        const [x, y] = [
          +selectedChess.getAttribute("data-x"),
          +selectedChess.getAttribute("data-y"),
        ];
        const name = selectedChess.textContent.trim();
        const [nextX, nextY] = [
          target.getAttribute("data-x"),
          target.getAttribute("data-y"),
        ];
        const index = blackMap[name].findIndex(
          (pos) => pos[0] === x && pos[1] === y,
        );
        if (index >= 0) {
          blackMap[name][index] = [+nextX, +nextY];
        }
        if (isRedChess) {
          // 吃子
          const redName = getRedChessByPos(nextX, nextY).textContent.trim();
          redMap[redName] = redMap[redName].filter(
            (pos) => pos[0] !== +nextX || pos[1] !== +nextY,
          );
        }
        drawChessPos(blackMap, false);
        drawChessPos(redMap, true);
      } else {
        const p = (document.createElement("p").textContent = check);
        document.querySelector(".status").append(p);
        // selectedChess = null;
        return;
      }
    }
    if (checkPlayerWin() !== -1) {
      end = true;
      status.textContent = checkPlayerWin() === RED ? "红色 胜利" : "黑色 胜利";
      removeHighlight();
      selectedChess = null;
      return;
    }

    turn ^= BLACK;
    step++;
    selectedChess = null;
    status.textContent = `当前轮到 ${turn === RED ? "红色" : "黑色"}`;
    removeHighlight();
  }
};

export const initStatus = () => {
  turn = RED;
  const status = document.querySelector(".status p");
  status.textContent = `当前轮到 ${turn === RED ? "红色" : "黑色"}`;
  selectedChess = null;
  end = false;
};
const initRun = () => {
  initStatus();
  document.body.addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    if (!target.classList.contains("chess")) return;
    fn(event);
  });
};

export default initRun;
