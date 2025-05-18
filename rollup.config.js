import postcss from "rollup-plugin-postcss";
import html from "@rollup/plugin-html";

export default {
  input: "index.mjs", // 入口文件
  output: {
    file: "dist/bundle.js", // 输出文件
    format: "iife", // 打包格式（适合浏览器）
    name: "ChessGame", // 全局变量名
  },
  plugins: [
    postcss({
      extract: true, // 提取为独立文件（而非 JS 内联）
      minimize: true, // 压缩 CSS
    }),
    html({
      title: "我的应用", // HTML 标题
      template: ({ title, files }) => {
        return `
           <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>${title}</title>
                  ${files.css.map(({ fileName }) => `<link rel="stylesheet" href="${fileName}">`)}
                </head>
                <body>
                  <div id="app">
                      <div class="board"> </div>
                      <div class="middle">
                          <p>楚河</p>
                          <p>汉界</p>
                      </div>
                      <div class="status">
                          <p>走子</p>
                      </div>
                      <div class="group">
                          <button type="button" class="reset">reset game</button>
                      </div>
                  </div>
                  ${files.js.map(({ fileName }) => `<script src="${fileName}"></script>`).join("\n")}
                </body>
              </html>
        `;
      },
    }),
  ],
};
