(function () {
  'use strict';

  const initBlack = {
      "車": [[0, 0], [0, 8]],    // 黑车（双车）
      "馬": [[0, 1], [0, 7]],    // 黑马
      "相": [[0, 2], [0, 6]],    // 黑象
      "士": [[0, 3], [0, 5]],    // 黑士
      "将": [[0, 4]],            // 黑将
      "砲": [[2, 1], [2, 7]],    // 黑炮
      "卒": [[3, 0], [3, 2], [3, 4], [3, 6], [3, 8]], // 五个黑卒
  };
  const intRed = {
      "车": [[9, 0], [9, 8]],    // 红车
      "马": [[9, 1], [9, 7]],    // 红马
      "象": [[9, 2], [9, 6]],    // 红相
      "仕": [[9, 3], [9, 5]],    // 红士
      "帅": [[9, 4]],            // 红帅
      "炮": [[7, 1], [7, 7]],    // 红炮
      "兵": [[6, 0], [6, 2], [6, 4], [6, 6], [6, 8]], // 五个红兵
  };
  const initEmpty = [];
  const blackMap = {
      ...structuredClone(initBlack)
  };


  const redMap = {
    ...structuredClone(intRed)
  };


  for(let i=0; i<=9; i++) {
      for(let j=0; j<=8; j++) {
          initEmpty.push([i ,j ]);
      }
  }

  const emptyMap = {
      "EM": structuredClone(initEmpty),
  };
  const initPos = ()=>{
      for(const key in blackMap){
          blackMap[key] = structuredClone(initBlack[key]);
      }
      for(const key in redMap){
          redMap[key] = structuredClone(intRed[key]);
      }
      emptyMap["EM"] = structuredClone(initEmpty);
  };

  function drawNinePalaces() {
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
          const width = Math.hypot(
              (x2 - x1) * blockWidth,
              (y2 - y1) * blockHeight
          );

          // 斜线角度
          const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

          // 应用斜线样式
          line.style.left = `${startX}px`;
          line.style.top = `${startY}px`;
          line.style.width = `${width}px`;
          line.style.transform = `rotate(${angle}deg)`;
          line.style.transformOrigin = "0 0";

          document.querySelector(".board").appendChild(line);
      };

      // 黑方九宫格（从 y=0~2）
      drawLine(3,0, 5, 2); // 左上→右下
      drawLine(5, 0, 3, 2); // 右上→左下

      // 红方九宫格（y=7~9）
      drawLine(3, 7, 5, 9);
      drawLine(5, 7, 3, 9);
  }


  function removeAllRed(){
      document.querySelectorAll(".red-chess").forEach((elem) => {
          elem.remove();
      });
  }
  function removeAllBlack(){
      document.querySelectorAll(".black-chess").forEach((elem) => {
          elem.remove();
      });
  }


  // 通用棋子创建函数
  function createChess(key, x, y, colorClass,) {
      const div = document.createElement("div");
      div.textContent = key;
      div.classList.add('chess', colorClass);
      div.setAttribute("data-x",x );
      div.setAttribute("data-y",y);

      // ✅ 棋子位置：直接对齐节点（去掉 +40 和 translate居中）
      div.style.left = `${y * 90 - 35}px`;
      div.style.top = `${x * 90 - 35}px`;

      return div;
  }

  function drawChessPos(it, isRed = false) {
      if(isRed) removeAllRed();
      else removeAllBlack();
      Object.keys(it).forEach(key => {
          it[key].forEach(([x, y], index) => {
              const div = createChess(key, x, y, isRed ? "red-chess" : "black-chess",);
              document.getElementById("app").appendChild(div);
          });
      });
  }

  const RULE = {
      EAT_SELF : '不准吃自己的棋子',
      NOT_TURN: "不是自己的回合",
      END:"游戏结束"
  };

  /**
   * @description 检测此次行棋是否合理
   * @param { 0 | 1 } turn
   * @param {HTMLDivElement} preDom 点击的格子
   * @param {HTMLDivElement} nextDom 准备前往的格子
   * @return { undefined | keyof RULE }
   */
  const checkRule = (turn, preDom , nextDom)=>{
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
      const text =  document.createElement("p");
      text.style.color ='red';

      if(turn === 0 && isPreBlack || turn === 1 && isPreRed) {
          text.textContent = RULE.NOT_TURN;
          status.appendChild(text);
          return RULE.NOT_TURN
      }
      if(isPreRed && isNextRed || isPreBlack && isNextBlack) {
          text.textContent = RULE.EAT_SELF;
          status.appendChild(text);
          return RULE.EAT_SELF
      }

      if (isPreRed && isNextEmpty || isPreBlack && isNextEmpty) {
          return undefined;
      }
      if(isPreRed && isNextBlack) return undefined;
      if(isPreBlack && isNextRed) return undefined;
      return false
  };


  const checkPlayerWin = ()=>{
      if(blackMap['将'].length === 0 ) return 0;
      if(redMap['帅'].length === 0 ) return 1;
      return -1 
  };

  const RED = 0;
  const BLACK = 1;
  let selectedChess = null; // 当前选中的棋子
  let turn = RED; // 0 means red, 1 means black
  let end = false;

  const addPosHoverTip = ()=>{
      const placeholderChess = document.querySelectorAll(".placeholder-chess");
      placeholderChess.forEach((el,i)=>{
          el.style.cursor = "pointer";
      });
  };
  const fn = (event)=>{
          const status = document.querySelector(".status p");
          if(end ) {
              console.log(RULE.END);
              return
          }        const target = event.target; // 当前点击的棋子
          const isEmptyPos = target.classList.contains("placeholder-chess");
          const isRed  = target.classList.contains("red-chess");
          const isBlack = target.classList.contains("black-chess");
          // console.log(isEmptyPos, isRed, isBlack);
          if(!selectedChess && !isEmptyPos){
              if(isBlack && turn === RED){

                  console.log(RULE.NOT_TURN);
                  return;
              }
              if(isRed && turn === BLACK) {
                    console.log(RULE.NOT_TURN);
                  return;
              }
              selectedChess = target ;
              addPosHoverTip();
          }else {
              if(!selectedChess) {
                  console.log('clicked empty , but not selected');
                  return;
              }
              if(turn === RED) {
                  const check = checkRule(turn, selectedChess, target);
                  if ( check === undefined ) {
                      const [x ,y ] =
                          [+selectedChess.getAttribute("data-x"), +selectedChess.getAttribute("data-y")];
                      const name = selectedChess.textContent.trim();
                      const [nextX , nextY] = [target.getAttribute("data-x"), target.getAttribute("data-y")];
                      const index = redMap[name].findIndex((pos)=> pos[0] ===x && pos[1] ===y);
                      if(index >=0 ) {
                          redMap[name][index] = [+nextX, +nextY];
                          drawChessPos(redMap, true);
                      }
                      if(isBlack){
                          // 吃子
                          const blackName = target.textContent.trim();
                          blackMap[blackName] = blackMap[blackName].filter((pos)=> pos[0] !== +nextX || pos[1] !== +nextY );
                          drawChessPos(blackMap, false);
                      }
                  }else {
                       console.log(`check`, check);
                      selectedChess = null;
                      return
                  }
              }else {
                  const check = checkRule(turn, selectedChess, target);
                  if (check === undefined ) {
                      const [x ,y ] =
                          [+selectedChess.getAttribute("data-x"), +selectedChess.getAttribute("data-y")];
                      const name = selectedChess.textContent.trim();
                      const [nextX , nextY] = [target.getAttribute("data-x"), target.getAttribute("data-y")];
                      const index = blackMap[name].findIndex((pos)=> pos[0] ===x && pos[1] ===y);
                      if(index >=0 ) {
                          blackMap[name][index] = [+nextX, +nextY];
                          drawChessPos(blackMap, false);
                      }
                      if(isRed){
                          // 吃子
                          const redName = target.textContent.trim();
                          redMap[redName] = redMap[redName].filter((pos)=> pos[0] !== +nextX || pos[1] !== +nextY );
                          drawChessPos(redMap, true);
                      }
                  }else {
                      console.log(`check`, check);
                      selectedChess = null;
                      return 
                  }
              }
              if(checkPlayerWin() !== -1) {
                  end = true;
                  status.textContent = checkPlayerWin() === RED ? "红色 胜利" : "黑色 胜利";
                  return ;
              }
            
              turn ^=BLACK;
              selectedChess = null;
              status.textContent = `当前轮到 ${turn === RED ? "红色" : "黑色"}`;
          }
  };
  const initRun = () => {
      turn = RED;
      const status = document.querySelector(".status p");
      status.textContent = `当前轮到 ${turn === RED ? "红色" : "黑色"}`;
      selectedChess = null;
      document.body.addEventListener("click", (event) => {
          event.preventDefault();
          const target = event.target;
          if(!target.classList.contains("chess")) return
          console.log(target);
          fn(event);
      });

  };

  const $ = document.querySelector.bind(document);
  document.querySelectorAll.bind(document);

  (function () {
      function initGame() {
          drawChessPos(blackMap, false);
          drawChessPos(redMap, true);
          document.querySelectorAll(".placeholder-chess").forEach(el=>{
              el.remove();
          });
          Object.keys(emptyMap).forEach(key => {
              emptyMap[key].forEach(([x, y] ) => {
                  const div = createChess(key, x, y, "placeholder-chess",);
                  document.getElementById("app").appendChild(div);
              });
          });
      }

      for(let i = 0; i < 72 ; i++) {
          const  div = document.createElement("div");
          div.className = 'block';
          if (i<= 7 )div.style.borderTop = '2px solid black';
          if( i % 8 === 0 )div.style.borderLeft = '2px solid black';
          if( (i + 1) % 8 === 0  )div.style.borderRight = '2px solid black';
          if( i > 63 )div.style.borderBottom = '2px solid black';
          $(".board").appendChild(div);
      }
      initGame();
      drawNinePalaces();
      initRun();
      $(".reset").addEventListener("click", () => {
          initPos();
          initGame();
      });
  })();

})();
