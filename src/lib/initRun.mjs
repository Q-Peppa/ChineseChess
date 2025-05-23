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
let selectedChess = null;
let turn = RED;
let end = false;

// 公共方法：根据棋名和颜色获取映射表
const getMapByColor = (color) => color === RED ? redMap : blackMap;

// 公共方法：根据颜色获取对方映射表
const getOpponentMap = (color) => color === RED ? blackMap : redMap;

// 公共方法：根据颜色和坐标获取棋子 DOM
const getChessDomByColor = (x, y, color) =>
    color === RED ? getRedChessByPos(x, y) : getBlackChess(x, y);

// 简化后的高亮判断
const highLightPossiblePos = (nextX, nextY, preDom) => {
  const name = preDom.textContent.trim();
  const preX = Number(preDom.getAttribute("data-x"));
  const preY = Number(preDom.getAttribute("data-y"));
  const x = Number(nextX);
  const y = Number(nextY);
  const color = preDom.classList.contains("red-chess") ? RED : BLACK;
  let res;

  switch (name) {
    case CHESS_NAME.red_soldier:
    case CHESS_NAME.soldier:
      res = isValidPawnMove(preX, preY, x, y, color === RED ? "red" : "black");
      break;
    case CHESS_NAME.horse:
    case CHESS_NAME.red_horse:
      res = isValidHorseMove(preX, preY, x, y);
      break;
    case CHESS_NAME.cannon:
    case CHESS_NAME.red_cannon:
      res = isValidCannonMove(preX, preY, x, y, !isBlankPos(x, y));
      break;
    case CHESS_NAME.rook:
    case CHESS_NAME.red_rook:
      res = isValidRookMove(preX, preY, x, y);
      break;
    case CHESS_NAME.elephant:
    case CHESS_NAME.red_elephant:
      res = isValidElephantMove(preX, preY, x, y, color === RED ? "red" : "black");
      break;
    case CHESS_NAME.advisor:
    case CHESS_NAME.red_advisor:
      res = isValidAdvisorMove(preX, preY, x, y, color === RED ? "red" : "black");
      break;
    case CHESS_NAME.general:
    case CHESS_NAME.red_general:
      res = isValidGeneralMove(preX, preY, x, y, color === RED ? "red" : "black");
      break;
    default:
      break;
  }
  // 只高亮可走的位置
  if (res === undefined) {
    const sameColor = color === RED ? isRed(x, y) : isBlack(x, y);
    if (!sameColor) {
      document
          .querySelectorAll(`[data-x='${x}'][data-y='${y}']`)
          .forEach((li) => li.classList.add("can-move"));
    }
  }
};

const removeHighlight = () => {
  document.querySelectorAll(".can-move")?.forEach((el) => {
    el.classList.remove("can-move");
  });
};

const addPosHoverTip = () => {
  document.querySelectorAll(".placeholder-chess").forEach((el) => {
    el.style.cursor = "pointer";
  });
};

// 移动棋子的公共方法
function moveChess(selectedChess, target, color) {
  const map = getMapByColor(color);
  const oppMap = getOpponentMap(color);
  const [fromX, fromY] = [
    +selectedChess.getAttribute("data-x"),
    +selectedChess.getAttribute("data-y"),
  ];
  const [toX, toY] = [
    +target.getAttribute("data-x"),
    +target.getAttribute("data-y"),
  ];
  const name = selectedChess.textContent.trim();
  // 更新己方棋子坐标
  const idx = map[name].findIndex((pos) => pos[0] === fromX && pos[1] === fromY);
  if (idx >= 0) map[name][idx] = [toX, toY];
  // 如果吃子，移除对方棋子
  const isOpponent = color === RED ? isBlack(toX, toY) : isRed(toX, toY);
  if (isOpponent) {
    const oppChessDom = getChessDomByColor(toX, toY, color === RED ? BLACK : RED);
    if (oppChessDom) {
      const oppName = oppChessDom.textContent.trim();
      oppMap[oppName] = oppMap[oppName].filter(
          (pos) => pos[0] !== toX || pos[1] !== toY
      );
    }
  }
  // 重绘
  drawChessPos(redMap, true);
  drawChessPos(blackMap, false);
}

// 统一走子处理逻辑
function handleMove(selectedChess, target, color) {
  const check = checkRule(color, selectedChess, target);
  if (check === undefined) {
    moveChess(selectedChess, target, color);
    return true;
  } else {
    const p = document.createElement("p");
    p.textContent = check;
    document.querySelector(".status").append(p);
    return false;
  }
}

// 判断是否自己回合并选中棋子
function canSelectChess(target, turn) {
  return (
      (isRed(target.getAttribute("data-x"), target.getAttribute("data-y")) && turn === RED) ||
      (isBlack(target.getAttribute("data-x"), target.getAttribute("data-y")) && turn === BLACK)
  );
}

// 主点击逻辑
const fn = (event) => {
  const status = document.querySelector(".status p");
  if (end) {
    console.log(RULE.END);
    return;
  }
  const target = event.target;
  const [targetX, targetY] = [
    target.getAttribute("data-x"),
    target.getAttribute("data-y"),
  ];
  const isEmptyPos = isBlankPos(targetX, targetY);

  if (!selectedChess && !isEmptyPos) {
    // 首次选中棋子
    if (!canSelectChess(target, turn)) {
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
    // 重复选中自己颜色的棋子，重新选择
    if (
        (selectedChess.classList.contains("red-chess") && isRed(targetX, targetY)) ||
        (selectedChess.classList.contains("black-chess") && isBlack(targetX, targetY))
    ) {
      selectedChess = null;
      removeHighlight();
      fn(event);
      return;
    }
    // 走子并吃子逻辑
    if (handleMove(selectedChess, target, turn)) {
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
    // 若非法，handleMove 已输出提示
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