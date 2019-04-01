const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin")
const Webpack = require('webpack');
// vue.config.js
module.exports = {
  configureWebpack: {
  	// 输出文件
    output: {
        // path: path.join(__dirname, 'dist'), // 所有的文件都输出到dist/目录下
        //path:"C:\\Users\\zonglang\\Documents\\HBuilderProjects\\test\\hybrid\\html",
        filename: 'bundle-[hash].js' ,// 输出文件的名称加上hash值
    }
  },
  publicPath: './',
  outputDir:"C:\\Users\\zonglang\\Documents\\HBuilderProjects\\test\\hybrid\\html"
}