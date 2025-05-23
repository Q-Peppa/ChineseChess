import RULE from "./RULE.mjs";
import { blackMap, redMap } from "./pos.mjs";
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
import { isBlack, isBlankPos, isRed } from "./lib.mjs";
Array.prototype.flat();
/**
 * @description 检测此次行棋是否合理
 * @param { 0 | 1 } turn
 * @param {HTMLDivElement} preDom 点击的格子
 * @param {HTMLDivElement} nextDom 准备前往的格子
 * @return { undefined | keyof RULE }
 */
const checkRule = (turn, preDom, nextDom) => {
  const name = preDom.textContent.trim();
  /**  上一个选中的棋子是红色 */
  const isPreRed = preDom.classList.contains("red-chess");
  /**  上一个选中的棋子是黑色 */
  const isPreBlack = preDom.classList.contains("black-chess");

  const preX = preDom.getAttribute("data-x");
  const preY = preDom.getAttribute("data-y");
  const nextX = nextDom.getAttribute("data-x");
  const nextY = nextDom.getAttribute("data-y");

  /**  下一个选中的棋子是空白格子 */
  const isNextEmpty = isBlankPos(nextX, nextY);
  /**  下一个选中的棋子是黑色 */
  const isNextBlack = isBlack(nextX, nextY);
  /**  下一个选中的棋子是红色 */
  const isNextRed = isRed(nextX, nextY);

  const status = document.querySelector(".status p");
  const text = document.createElement("p");
  text.style.color = "red";

  if ((turn === 0 && isPreBlack) || (turn === 1 && isPreRed)) {
    text.textContent = RULE.NOT_TURN;
    status.appendChild(text);
    return RULE.NOT_TURN;
  }
  if ((isPreRed && isNextRed) || (isPreBlack && isNextBlack)) {
    text.textContent = RULE.EAT_SELF;
    status.appendChild(text);
    return RULE.EAT_SELF;
  }

  if (
    (isPreRed && (isNextEmpty || isNextBlack)) ||
    (isPreBlack && (isNextEmpty || isNextRed))
  ) {
    const color = isPreRed ? "red" : "black";
    switch (name) {
      case CHESS_NAME.red_soldier:
      case CHESS_NAME.soldier:
        return isValidPawnMove(preX, preY, nextX, nextY, color);
      case CHESS_NAME.horse:
      case CHESS_NAME.red_horse:
        return isValidHorseMove(preX, preY, nextX, nextY);
      case CHESS_NAME.cannon:
      case CHESS_NAME.red_cannon:
        return isValidCannonMove(
          preX,
          preY,
          nextX,
          nextY,
          !isNextEmpty,
        );
      case CHESS_NAME.rook:
      case CHESS_NAME.red_rook:
        return isValidRookMove(preX, preY, nextX, nextY);
      case CHESS_NAME.elephant:
      case CHESS_NAME.red_elephant:
        return isValidElephantMove(preX, preY, nextX, nextY, color);
      case CHESS_NAME.advisor:
      case CHESS_NAME.red_advisor:
        return isValidAdvisorMove(preX, preY, nextX, nextY, color);
      case CHESS_NAME.general:
      case CHESS_NAME.red_general:
        return isValidGeneralMove(preX, preY, nextX, nextY, color);
    }
  }
  return RULE.UNKNOWN;
};

export const checkPlayerWin = () => {
  if (blackMap[CHESS_NAME.general].length === 0) return 0;
  if (redMap[CHESS_NAME.red_general].length === 0) return 1;
  return -1;
};
export default checkRule;
