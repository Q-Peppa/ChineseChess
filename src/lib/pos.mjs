import { CHESS_NAME } from "./constant.js";

const initBlack = {
  [CHESS_NAME.rook]: [
    [0, 0],
    [0, 8],
  ], // 黑车（双车）
  [CHESS_NAME.horse]: [
    [0, 1],
    [0, 7],
  ], // 黑马
  [CHESS_NAME.elephant]: [
    [0, 2],
    [0, 6],
  ], // 黑象
  [CHESS_NAME.advisor]: [
    [0, 3],
    [0, 5],
  ], // 黑士
  [CHESS_NAME.general]: [[0, 4]], // 黑将
  [CHESS_NAME.cannon]: [
    [2, 1],
    [2, 7],
  ], // 黑炮
  [CHESS_NAME.soldier]: [
    [3, 0],
    [3, 2],
    [3, 4],
    [3, 6],
    [3, 8],
  ], // 五个黑卒
};

const initRed = {
  [CHESS_NAME.red_rook || CHESS_NAME.rook]: [
    [9, 0],
    [9, 8],
  ], // 红车
  [CHESS_NAME.red_horse || CHESS_NAME.horse]: [
    [9, 1],
    [9, 7],
  ], // 红马
  [CHESS_NAME.red_elephant]: [
    [9, 2],
    [9, 6],
  ], // 红相
  [CHESS_NAME.red_advisor]: [
    [9, 3],
    [9, 5],
  ], // 红士
  [CHESS_NAME.red_general]: [[9, 4]], // 红帅
  [CHESS_NAME.red_cannon]: [
    [7, 1],
    [7, 7],
  ], // 红炮
  [CHESS_NAME.red_soldier]: [
    [6, 0],
    [6, 2],
    [6, 4],
    [6, 6],
    [6, 8],
  ], // 五个红兵
};

// 兼容你的 CHESS_NAME，如果没有 red_rook/red_horse 用原有的
if (!CHESS_NAME.red_rook) {
  initRed[CHESS_NAME.rook] = [
    [9, 0],
    [9, 8],
  ];
}
if (!CHESS_NAME.red_horse) {
  initRed[CHESS_NAME.horse] = [
    [9, 1],
    [9, 7],
  ];
}

const initEmpty = [];
for (let i = 0; i <= 9; i++) {
  for (let j = 0; j <= 8; j++) {
    initEmpty.push([i, j]);
  }
}

export const blackMap = {
  ...structuredClone(initBlack),
};

export const redMap = {
  ...structuredClone(initRed),
};

export const emptyMap = {
  EM: structuredClone(initEmpty),
};

export const initPos = () => {
  for (const key in blackMap) {
    blackMap[key] = structuredClone(initBlack[key]);
  }
  for (const key in redMap) {
    redMap[key] = structuredClone(initRed[key]);
  }
  emptyMap["EM"] = structuredClone(initEmpty);
};