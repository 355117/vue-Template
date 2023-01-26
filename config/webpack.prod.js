const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //打包css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); //压缩css
const CompressionPlugin = require("compression-webpack-plugin"); //压缩gzip文件，便于传输development模式下devServer自带gzip压缩

// const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin"); //将runtime.js内联到html中
var InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin"); //生成的html文件

const webpack = require("webpack");
module.exports = {
  mode: "production", //为除webpack.config.js外的模块可以使用配置的（webpack4之后）
  // externals: {
  //   //注册cdn，别的文件可以直接使用全局对象，这个不会被打包
  //   dayjs: "dayjs", //：模块名字：全局对象名字
  // },
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:10].css",
      chunkFilename: "css/[name].[contenthash:10].css",
    }),
    new CssMinimizerPlugin(),
    //作用域提升在开发模式下默认是开启的，但是在生产模式下默认是关闭的
    new webpack.optimize.ModuleConcatenationPlugin(), //打包js文件时作用域提升式打包，打包后的代码运行在找个作用域中，减少作用域查找，提升代码运行效率
    new CompressionPlugin({
      test: /\.js$|\.css$|/i, //匹配文件名
      exclude: /\.html$/, //排除html文件
      threshold: 10240, //对超过10kb的数据进行压缩
      deleteOriginalAssets: false, //是否删除原文件
      algorithm: "gzip", //压缩算法
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime.+\.js/]),
  ],
};
