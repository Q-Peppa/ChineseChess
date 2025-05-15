import checkRule , {checkPlayerWin} from "./checkRule.mjs";
import RULE from "./RULE.mjs";
import {blackMap, redMap} from "./pos.mjs";
import {drawChessPos} from "./draw.mjs";

const RED = 0;
const BLACK = 1
let step = RED;
let selectedChess = null; // 当前选中的棋子
let turn = RED // 0 means red, 1 means black
let end = false

const addPosHoverTip = ()=>{
    const placeholderChess = document.querySelectorAll(".placeholder-chess")
    placeholderChess.forEach((el,i)=>{
        el.style.cursor = "pointer"
    })
}
const fn = (event)=>{
        const status = document.querySelector(".status p")
        if(end ) {
            console.log(RULE.END)
            return
        } ;
        const target = event.target; // 当前点击的棋子
        const isEmptyPos = target.classList.contains("placeholder-chess");
        const isRed  = target.classList.contains("red-chess");
        const isBlack = target.classList.contains("black-chess");
        // console.log(isEmptyPos, isRed, isBlack);
        if(!selectedChess && !isEmptyPos){
            if(isBlack && turn === RED){

                console.log(RULE.NOT_TURN)
                return;
            }
            if(isRed && turn === BLACK) {
                  console.log(RULE.NOT_TURN)
                return;
            }
            selectedChess = target ;
            addPosHoverTip()
        }else{
            if(!selectedChess) {
                console.log('clicked empty , but not selected');
                return;
            }
            if(turn === RED) {
                const check = checkRule(turn, selectedChess, target)
                if ( check === undefined ) {
                    const [x ,y ] =
                        [+selectedChess.getAttribute("data-x"), +selectedChess.getAttribute("data-y")]
                    const name = selectedChess.textContent.trim();
                    const [nextX , nextY] = [target.getAttribute("data-x"), target.getAttribute("data-y")];
                    const index = redMap[name].findIndex((pos)=> pos[0] ===x && pos[1] ===y);
                    if(index >=0 ) {
                        redMap[name][index] = [+nextX, +nextY];
                        drawChessPos(redMap, true)
                    }
                    if(isBlack){
                        // 吃子
                        const blackName = target.textContent.trim();
                        blackMap[blackName] = blackMap[blackName].filter((pos)=> pos[0] !== +nextX || pos[1] !== +nextY )
                        drawChessPos(blackMap, false)
                    }
                }else{
                     console.log(`check`, check)
                    selectedChess = null
                    return
                }
            }else{
                const check = checkRule(turn, selectedChess, target)
                if (check === undefined ) {
                    const [x ,y ] =
                        [+selectedChess.getAttribute("data-x"), +selectedChess.getAttribute("data-y")]
                    const name = selectedChess.textContent.trim();
                    const [nextX , nextY] = [target.getAttribute("data-x"), target.getAttribute("data-y")];
                    const index = blackMap[name].findIndex((pos)=> pos[0] ===x && pos[1] ===y);
                    if(index >=0 ) {
                        blackMap[name][index] = [+nextX, +nextY];
                        drawChessPos(blackMap, false)
                    }
                    if(isRed){
                        // 吃子
                        const redName = target.textContent.trim();
                        redMap[redName] = redMap[redName].filter((pos)=> pos[0] !== +nextX || pos[1] !== +nextY )
                        drawChessPos(redMap, true)
                    }
                }else{
                    console.log(`check`, check)
                    selectedChess = null
                    return 
                }
            }
            if(checkPlayerWin() !== -1) {
                end = true
                status.textContent = checkPlayerWin() === RED ? "红色 胜利" : "黑色 胜利"
                return ;
            }
          
            turn ^=BLACK
            step++
            selectedChess = null
            status.textContent = `当前轮到 ${turn === RED ? "红色" : "黑色"}`
        }
}
const initRun = () => {
    turn = RED
    const status = document.querySelector(".status p")
    status.textContent = `当前轮到 ${turn === RED ? "红色" : "黑色"}`
    selectedChess = null
    document.body.addEventListener("click", (event) => {
        event.preventDefault();
        const target = event.target;
        if(!target.classList.contains("chess")) return
        console.log(target);
        fn(event);
    })

};


export default initRun;
