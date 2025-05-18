import RULE from "./RULE.mjs";
import { blackMap, redMap } from "./pos.mjs";

/**
 * @description 检测此次行棋是否合理
 * @param { 0 | 1 } turn
 * @param {HTMLDivElement} preDom 点击的格子
 * @param {HTMLDivElement} nextDom 准备前往的格子
 * @return { undefined | keyof RULE }
 */
const checkRule = (turn, preDom, nextDom) => {
  /**  上一个选中的棋子是红色 */
  const isPreRed = preDom.classList.contains("red-chess");
  /**  下一个选中的棋子是红色 */
  const isNextRed = nextDom.classList.contains("red-chess");
  /**  上一个选中的棋子是黑色 */
  const isPreBlack = preDom.classList.contains("black-chess");
  /**  下一个选中的棋子是黑色 */
  const isNextBlack = nextDom.classList.contains("black-chess");
  /**  下一个选中的棋子是空白格子 */
  const isNextEmpty = nextDom.classList.contains("placeholder-chess");

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

  if ((isPreRed && isNextEmpty) || (isPreBlack && isNextEmpty)) {
    return undefined;
  }
  if (isPreRed && isNextBlack) return undefined;
  if (isPreBlack && isNextRed) return undefined;
  return false;
};

export const checkPlayerWin = () => {
  if (blackMap["将"].length === 0) return 0;
  if (redMap["帅"].length === 0) return 1;
  return -1;
};
export default checkRule;
