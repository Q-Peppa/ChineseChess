const initBlack = {
  車: [
    [0, 0],
    [0, 8],
  ], // 黑车（双车）
  馬: [
    [0, 1],
    [0, 7],
  ], // 黑马
  相: [
    [0, 2],
    [0, 6],
  ], // 黑象
  士: [
    [0, 3],
    [0, 5],
  ], // 黑士
  将: [[0, 4]], // 黑将
  砲: [
    [2, 1],
    [2, 7],
  ], // 黑炮
  卒: [
    [3, 0],
    [3, 2],
    [3, 4],
    [3, 6],
    [3, 8],
  ], // 五个黑卒
};
const intRed = {
  车: [
    [9, 0],
    [9, 8],
  ], // 红车
  马: [
    [9, 1],
    [9, 7],
  ], // 红马
  象: [
    [9, 2],
    [9, 6],
  ], // 红相
  仕: [
    [9, 3],
    [9, 5],
  ], // 红士
  帅: [[9, 4]], // 红帅
  炮: [
    [7, 1],
    [7, 7],
  ], // 红炮
  兵: [
    [6, 0],
    [6, 2],
    [6, 4],
    [6, 6],
    [6, 8],
  ], // 五个红兵
};
const initEmpty = [];
export const blackMap = {
  ...structuredClone(initBlack),
};

export const redMap = {
  ...structuredClone(intRed),
};

for (let i = 0; i <= 9; i++) {
  for (let j = 0; j <= 8; j++) {
    initEmpty.push([i, j]);
  }
}

export const emptyMap = {
  EM: structuredClone(initEmpty),
};
export const initPos = () => {
  for (const key in blackMap) {
    blackMap[key] = structuredClone(initBlack[key]);
  }
  for (const key in redMap) {
    redMap[key] = structuredClone(intRed[key]);
  }
  emptyMap["EM"] = structuredClone(initEmpty);
};
