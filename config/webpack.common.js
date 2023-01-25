const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //自动生成html文件，并引入打包后的文件
const { VueLoaderPlugin } = require("vue-loader/dist/index"); //加载vue的template模块，同时也块级适配了热更新
const { merge } = require("webpack-merge"); //合并webpack配置文件
const TerserPlugin = require("terser-webpack-plugin"); //压缩js,默认是开启的
const myPath = require("./myPath");
let devConfig = require("./webpack.dev.js"); //开发模式下合并的配置
let prodConfig = require("./webpack.prod.js"); //生产模式下合并的配置
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //打包css
const { DefinePlugin } = require("webpack"); //定义环境变量
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

let commonConfig = function (isProduction) {
  return {
    context: path.resolve(__dirname, "../"), //配置入口文件的根目录，默认为webpack调用时的路径，如package里面的webpack.config.js路径
    // devtool:
    //   "cheap-module-source-map" /* 根据这个配置在浏览器调试时，可以还原源代码，行提示，性能更高，26种配置，有两种最合适 */,
    entry: "./src/main.js", //路径是相对于context的
    output: {
      //输出路径需要为js结尾，不然production模式下不会对js文件进行压缩
      path: path.resolve(__dirname, "../dist"),
      filename: "js/[name].[chunkhash:6].bundle.js", // 将 js 文件输出到 static/js 目录中,
      // chunkFilename: "[id].chunk.js",
      //hash所有hash值命名是一样的，一个改变，所有的都改变，都需要重新加载，chunkhash是根据chunk生成的，不同的chunk有不同的hash值，只有改变的chunk才会重新加载，contenthash是根据文件内容生成的hash值，只有文件内容改变才会重新加载
      chunkFilename: "js/[name].[contenthash:6].chunk.js", //魔法字符串设置，用于设置动态加载的模块的文件名
      clean: true,
      publicPath: isProduction ? "./" : "/", //压缩后访问资源的路径（./为本地路径，/为服务器路径）,如果想要在打包后直接打开静态资源，需要改为./
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".vue"], //自动解析确定的扩展，引入文件时可以省略扩展名
      alias: {
        "@": path.resolve(__dirname, "../src"), //l路径别名
      },
    },
    cache: {
      type: "filesystem", // 使用文件缓存,优化构建速度
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false, //不将注释提取到单独的文件中
        }),
      ],
      usedExports: true, //标记未使用的导出，tree shaking
      // chunkIds: "deterministic",//设不设置都可以
      splitChunks: {
        //import分包
        //async异步代码分割 initial同步代码分割 all同步异步分割都开启
        // chunks: "all", //同步异步都分割
        chunks: "all",
        // minSize: 2000, //拆分后的尺寸不小于20kb
        // maxSize: 10000, //拆分大于1000kb的文件
        // minChunks: 1, //最少引用1次才拆分
        // maxAsyncRequests: 30, //最大异步请求数
        cacheGroups: {
          //引用多名字类型的模块会被打包到vendors里面
          defaultVendors: {
            //默认拆分模块
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: {
        //runtimeChunk作用是为了线上更新版本时，充分利用浏览器缓存，使用户感知的影响到最低。
        name: (entrypoint) => `runtime~${entrypoint.name}`,
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader", //生产环境使用MiniCssExtractPlugin.loader，开发环境使用style-loader
            {
              loader: "css-loader",
              options: {
                importLoaders: 1, //执行css-loader的前一个loader的数量，即执行前执行一次postcss-loader,当css内引入了less文件时，默认是不执行的，英文执行顺序是从下到上的
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      "postcss-preset-env",
                      {
                        // 选项
                      },
                    ],
                  ],
                },
              },
            },
          ], //postcss-loader css属性转换为兼容性的css属性
        },
        {
          test: /\.less$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1, //执行css-loader的前一个loader的数量，即执行前执行一次postcss-loader,当css内引入了less文件时，默认是不执行的，英文执行顺序是从下到上的
              },
            },
            "postcss-loader",
            "less-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|svg|gif)$/,
          type: "asset",
          generator: {
            publicPath: isProduction ? "./" : "/",
            //名字
            filename: "img/[name].[contenthash:6].[ext]",
          },
          parser: {
            dataUrlCondition: {
              //大于4kb合并到文件流内
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
        {
          test: /\.m?jsx?$/,
          exclude: /(node_modules|bower_components)/, //排除
          use: ["babel-loader"],
        },
        {
          test: /\.vue$/,
          use: ["vue-loader"],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        // 以 public/index.html 为模板创建文件
        // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
        template: path.resolve(__dirname, "../public/index.html"),
      }),
      new VueLoaderPlugin(), //加载vue的template模块，同时也块级适配了热更新
      new DefinePlugin({
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
      }),




      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),

    ],
  };
};
module.exports = function (env) {
  //这里的env是执行node程序时传入的
  let isProduction = env.production; //返回的是一个对象，里面有一个production属性，值为true
  process.env.production = isProduction; //process是node线程，全局变量,process.env.production是一个字符串，不是一个布尔值
  return merge(
    commonConfig(isProduction),
    isProduction ? prodConfig : devConfig
  );
};
