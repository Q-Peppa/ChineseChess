/**
 * @description 判断一个点是否为空棋子
 */
export function isBlankPos(x, y) {
  x = Number(x);
  y = Number(y);
  const list = document.querySelectorAll(`[data-x='${x}'][data-y='${y}']`);
  return list.length === 1 && list[0].classList.contains("placeholder-chess");
}
export function isBlack(x, y) {
  x = Number(x);
  y = Number(y);
  const list = document.querySelectorAll(`[data-x='${x}'][data-y='${y}']`);
  let check = false;
  for (let i = 0; i < list.length; i++) {
    if (list[i].classList.contains("black-chess")) {
      check = true;
      break;
    }
  }
  return check;
}
export function isRed(x, y) {
  x = Number(x);
  y = Number(y);
  const list = document.querySelectorAll(`[data-x='${x}'][data-y='${y}']`);
  let check = false;
  for (let i = 0; i < list.length; i++) {
    if (list[i].classList.contains("red-chess")) {
      check = true;
      break;
    }
  }
  return check;
}
export function walkAllPos(fn) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 9; j++) {
      fn(i, j);
    }
  }
}

export function getRedChessByPos(x, y) {
  const list = document.querySelectorAll(`[data-x='${x}'][data-y='${y}']`);
  let check;
  for (let i = 0; i < list.length; i++) {
    if (list[i].classList.contains("red-chess")) {
      check = list[i];
      break;
    }
  }
  return check;
}

export function getBlackChess(x, y) {
  const list = document.querySelectorAll(`[data-x='${x}'][data-y='${y}']`);
  let check;
  for (let i = 0; i < list.length; i++) {
    if (list[i].classList.contains("black-chess")) {
      check = list[i];
      break;
    }
  }
  return check;
}
