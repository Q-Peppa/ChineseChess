/**
 * @description 判断一个点是否为空棋子
 */
export function isBlank(x, y) {
  const list = document.querySelectorAll(`[data-x='${x}'][data-y='${y}']`);
  return list.length === 1 && list[0].classList.contains("placeholder-chess");
}
