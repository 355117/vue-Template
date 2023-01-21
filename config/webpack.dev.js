
module.exports = {
  mode: "development", //为除webpack.config.js外的模块可以使用配置的（webpack4之后）
  devServer: {
    //热模块更新，更改代码后，浏览器不会刷新，只会更新改变的代码
    hot: true,
    // hotOnly: true, //编译错误后，修改代码编译成功也不会刷新浏览器
    // compress: true, //开启gzip压缩
    // port: 8080,//端口号
    open: true, //自动打开浏览器
    // contentBase: path.join(__dirname, "dist"),//html模块的静态资源目录（html模块的script引入的静态文件）
    // publicPath: "./",//静态资源的访问路径,建议devServer.publicPath与output.publicPath相同
    // proxy: {
    //   "/api": "http://localhost:3000",
    //   pathRewrite: { "^/api": "" },//访问路径时的冗余路径,替换为空字符串
    //   secure: "false", //接受在 HTTPS 上运行的后端服务器
    //   changeOrigin: true,//代理时会保留主机头的来源，可以将 changeOrigin 设置为 true 以覆盖此行为，即访问的服务器获取的到request.getHeader("Host")是服务器自身，而不是代理，服务器本身校验的一部分，建议开启
    // },
    //   historyApiFallback: true,//当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html，刷新时访问服务器，服务器加上了#返回数据，无法访问，如果路由是hash模式，则不需要开启
  },
};
