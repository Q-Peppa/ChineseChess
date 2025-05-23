const RULE = {
  EAT_SELF: "不准吃自己的棋子",
  NOT_TURN: "不是自己的回合",
  END: "游戏结束",
  PAWN_UN_CROSS: "未过河：只能直走一步",
  PAWN_UNBACK: "卒/兵不能后退",
  BEYOUND_BOARD: "超出棋盘外",
  HORSE_MOVE: "马的移动不符合规范",
  HORSE_MOVE2: "蹩马腿",
  CANNON_MOVE: "只能直线移动",
  CANNON_EAT: "炮必须隔一个棋子",
  CANNON_MOVE_LINE: "平移时，炮中间不能有任何棋子",
  ROOK_LINE: "只能横向或纵向直走",
  ROOK_STOP: "起点和终点之间有阻挡",
  ELEPHANT_SHAPE: "象必须走田字格（斜走两格）",
  ELEPHANT_BLOCKED: "象眼被堵住，不能走",
  ELEPHANT_RIVER: "象不能过河",
  ADVISOR_SHAPE: "士/仕只能斜走一步",
  ADVISOR_PALACE: "士/仕不能出九宫格",
  GENERAL_STEP: "将/帅每步只能横或竖走一格",
  GENERAL_PALACE: "将/帅不能出九宫格",
  UNKNOWN: "未知错误"
};
export default RULE;
