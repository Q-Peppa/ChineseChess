export function drawNinePalaces() {
  // 棋盘格尺寸
  const blockWidth = 90;
  const blockHeight = 90;

  // 斜线坐标 (x,y)
  const drawLine = (x1, y1, x2, y2) => {
    const line = document.createElement("div");
    line.className = "palace-line";

    // 斜线起点（格子中点）
    const startX = x1 * blockWidth;
    const startY = y1 * blockHeight;

    // 斜线长度
    const width = Math.hypot((x2 - x1) * blockWidth, (y2 - y1) * blockHeight);

    // 斜线角度
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

    // 应用斜线样式
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.width = `${width}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = "0 0";

    document.querySelector(".board").appendChild(line);
  };

  // 黑方九宫格（从 y=0~2）
  drawLine(3, 0, 5, 2); // 左上→右下
  drawLine(5, 0, 3, 2); // 右上→左下

  // 红方九宫格（y=7~9）
  drawLine(3, 7, 5, 9);
  drawLine(5, 7, 3, 9);
}

export function removeAllRed() {
  document.querySelectorAll(".red-chess").forEach((elem) => {
    elem.remove();
  });
}
export function removeAllBlack() {
  document.querySelectorAll(".black-chess").forEach((elem) => {
    elem.remove();
  });
}

// 通用棋子创建函数
export function createChess(key, x, y, colorClass) {
  const div = document.createElement("div");
  div.textContent = key;
  div.classList.add("chess", colorClass);
  div.setAttribute("data-x", x);
  div.setAttribute("data-y", y);

  // ✅ 棋子位置：直接对齐节点（去掉 +40 和 translate居中）
  div.style.left = `${y * 90 - 35}px`;
  div.style.top = `${x * 90 - 35}px`;

  return div;
}

export function drawChessPos(it, isRed = false) {
  if (isRed) removeAllRed();
  else removeAllBlack();
  Object.keys(it).forEach((key) => {
    it[key].forEach(([x, y], ) => {
      const div = createChess(key, x, y, isRed ? "red-chess" : "black-chess");
      document.getElementById("app").appendChild(div);
    });
  });
}
