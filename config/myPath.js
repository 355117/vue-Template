const path = require("path");

// "build": "webpack --config webpack.config.js",指的是webpack.config.js目录
let addDir = process.cwd(); //获取启动线程的目录，

const myPath = (l) => path.resolve(addDir, l);

module.exports = myPath;
