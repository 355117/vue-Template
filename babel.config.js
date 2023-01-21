
module.exports = {
  presets: [
    [
      "@babel/preset-env", //加载js文件，自动检测并进行语法转换
      {
        useBuiltIns: "usage", //根据代码promise等自动添加相应解析，配置如何@babel/preset-env处理 polyfill，Polyfill是一个js库,主要抚平不同浏览器之间对js实现的差异
        corejs: "3",
      },
    ],
  ],
};

