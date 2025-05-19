import RULE from "./RULE.mjs";
import { isBlank } from "./lib.mjs";
export function isValidGeneralMove(preX, preY, nextX, nextY, color = "black") {
  preX = Number(preX);
  preY = Number(preY);
  nextX = Number(nextX);
  nextY = Number(nextY);

  // 只能走一步，且只能横或竖
  const dx = Math.abs(nextX - preX);
  const dy = Math.abs(nextY - preY);
  if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1)))
    return RULE.GENERAL_STEP;

  // 不能出九宫格
  if (color === "black") {
    if (nextX < 0 || nextX > 2 || nextY < 3 || nextY > 5)
      return RULE.GENERAL_PALACE;
  } else if (color === "red") {
    if (nextX < 7 || nextX > 9 || nextY < 3 || nextY > 5)
      return RULE.GENERAL_PALACE;
  }

  return undefined;
}
/**
 * 判断士/仕（advisor/red_advisor）走法是否合法
 */
export function isValidAdvisorMove(preX, preY, nextX, nextY, color = "black") {
  preX = Number(preX);
  preY = Number(preY);
  nextX = Number(nextX);
  nextY = Number(nextY);

  // 只能斜着走一步
  const dx = nextX - preX;
  const dy = nextY - preY;
  if (!(Math.abs(dx) === 1 && Math.abs(dy) === 1)) return RULE.ADVISOR_SHAPE;

  // 不能出九宫格
  if (color === "black") {
    if (nextX < 0 || nextX > 2 || nextY < 3 || nextY > 5)
      return RULE.ADVISOR_PALACE;
  } else if (color === "red") {
    if (nextX < 7 || nextX > 9 || nextY < 3 || nextY > 5)
      return RULE.ADVISOR_PALACE;
  }

  return undefined;
}

export function isValidElephantMove(
  preX,
  preY,
  nextX,
  nextY,
  isEmptyFunc,
  color = "black",
) {
  // 必须走田字格（斜着走两格）
  preX = Number(preX);
  preY = Number(preY);
  nextX = Number(nextX);
  nextY = Number(nextY);
  const dx = nextX - preX;
  const dy = nextY - preY;
  if (Math.abs(dx) !== 2 || Math.abs(dy) !== 2) return RULE.ELEPHANT_SHAPE;

  // 不能过河
  if (color === "black" && nextX > 4) return RULE.ELEPHANT_RIVER;
  if (color === "red" && nextX < 5) return RULE.ELEPHANT_RIVER;

  // 象眼不能被堵
  const eyeX = preX + dx / 2;
  const eyeY = preY + dy / 2;
  if (!isEmptyFunc(eyeX, eyeY)) return RULE.ELEPHANT_BLOCKED;

  return undefined;
}

export function isValidRookMove(preX, preY, nextX, nextY) {
  preX = Number(preX);
  preY = Number(preY);
  nextX = Number(nextX);
  nextY = Number(nextY);

  // 只能横向或纵向直走
  if (preX !== nextX && preY !== nextY) return RULE.ROOK_LINE;

  // 统计起点和终点之间是否有阻挡
  if (preX === nextX) {
    // 横向
    const minY = Math.min(preY, nextY) + 1;
    const maxY = Math.max(preY, nextY);
    for (let y = minY; y < maxY; y++) {
      if (!isBlank(preX, y)) return RULE.ROOK_STOP;
    }
  } else {
    // 纵向
    const minX = Math.min(preX, nextX) + 1;
    const maxX = Math.max(preX, nextX);
    for (let x = minX; x < maxX; x++) {
      if (!isBlank(x, preY)) return RULE.ROOK_STOP;
    }
  }

  return undefined;
}
export function isValidCannonMove(preX, preY, nextX, nextY, isCapture) {
  preX = Number(preX);
  preY = Number(preY);
  nextX = Number(nextX);
  nextY = Number(nextY);

  // 只能直线移动
  if (preX !== nextX && preY !== nextY) return RULE.CANNON_MOVE;

  // 统计起点和终点之间有多少个棋子
  let count = 0;
  if (preX === nextX) {
    // 横向移动
    const minY = Math.min(preY, nextY) + 1;
    const maxY = Math.max(preY, nextY);
    for (let y = minY; y < maxY; y++) {
      if (!isBlank(preX, y)) count++;
    }
  } else {
    // 纵向移动
    const minX = Math.min(preX, nextX) + 1;
    const maxX = Math.max(preX, nextX);
    for (let x = minX; x < maxX; x++) {
      if (!isBlank(x, preY)) count++;
    }
  }

  if (isCapture) {
    // 吃子时，炮必须隔一个棋子
    return count === 1 ? undefined : RULE.CANNON_EAT;
  } else {
    // 平移时，炮中间不能有任何棋子
    return count === 0 ? undefined : RULE.CANNON_MOVE_LINE;
  }
}
export function isValidHorseMove(preX, preY, nextX, nextY) {
  preX = Number(preX);
  preY = Number(preY);
  nextX = Number(nextX);
  nextY = Number(nextY);
  const dx = nextX - preX;
  const dy = nextY - preY;

  // “马走日”：两格直一格横
  const isLShape =
    (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
    (Math.abs(dx) === 1 && Math.abs(dy) === 2);
  if (!isLShape) return RULE.HORSE_MOVE;

  // 判断“蹩马腿”
  if (Math.abs(dx) === 2) {
    // 横向跳，两步方向的中间点
    const blockX = preX + dx / 2;
    if (!isBlank(blockX, preY)) return RULE.HORSE_MOVE2;
  } else {
    // 纵向跳，两步方向的中间点
    const blockY = preY + dy / 2;
    if (!isBlank(preX, blockY)) return RULE.HORSE_MOVE2;
  }

  return undefined;
}
export function isValidPawnMove(preX, preY, nextX, nextY, color = "red") {
  // 只能前进一步，过河后可左右平移一步
  const dx = nextX - preX;
  const dy = nextY - preY;

  if (color === "red") {
    // 红兵只能向上（行数减少）
    if (preX >= 5) {
      // 未过河：只能直走一步
      return dx === -1 && dy === 0 ? undefined : RULE.PAWN_UN_CROSS;
    } else {
      // 过河：可以左右或者直走一步
      return (dx === -1 && dy === 0) || (dx === 0 && Math.abs(dy) === 1)
        ? undefined
        : RULE.PAWN_UNBACK;
    }
  } else if (color === "black") {
    // 黑卒只能向下（行数增加）
    if (preX <= 4) {
      // 未过河：只能直走一步
      return dx === 1 && dy === 0 ? undefined : RULE.PAWN_UN_CROSS;
    } else {
      // 过河：可以左右或者直走一步
      return (dx === 1 && dy === 0) || (dx === 0 && Math.abs(dy) === 1)
        ? undefined
        : RULE.PAWN_UNBACK;
    }
  }
  return RULE.BEYOUND_BOARD;
}
