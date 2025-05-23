/**
 * 通用：获取指定坐标的棋子 DOM 列表
 */
function getElementsByPos(x, y) {
  x = Number(x);
  y = Number(y);
  return document.querySelectorAll(`[data-x='${x}'][data-y='${y}']`);
}

/**
 * 通用：判断指定坐标的棋子是否包含指定样式
 */
function hasChessClass(x, y, className) {
  const list = getElementsByPos(x, y);
  for (let i = 0; i < list.length; i++) {
    if (list[i].classList.contains(className)) {
      return true;
    }
  }
  return false;
}

/**
 * 通用：获取指定坐标的某种棋子 DOM
 */
function getChessByClass(x, y, className) {
  const list = getElementsByPos(x, y);
  for (let i = 0; i < list.length; i++) {
    if (list[i].classList.contains(className)) {
      return list[i];
    }
  }
  return null;
}

/**
 * @description 判断一个点是否为空棋子
 */
export function isBlankPos(x, y) {
  const list = getElementsByPos(x, y);
  return list.length === 1 && list[0].classList.contains("placeholder-chess");
}

export function isBlack(x, y) {
  return hasChessClass(x, y, "black-chess");
}

export function isRed(x, y) {
  return hasChessClass(x, y, "red-chess");
}

export function getRedChessByPos(x, y) {
  return getChessByClass(x, y, "red-chess");
}

export function getBlackChess(x, y) {
  return getChessByClass(x, y, "black-chess");
}

export function walkAllPos(fn) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 9; j++) {
      fn(i, j);
    }
  }
}