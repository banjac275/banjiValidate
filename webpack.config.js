const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require("path");

module.exports = {
  entry:["./src/validate.js", "./src/style/main.scss"],
  output:{
      path: path.resolve(__dirname, "dist"),
      filename: "main.js",
  },
  devServer: {
      contentBase: path.join(__dirname, "dist")
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    },
    {
      test: /\.html$/,
      use: [
        {
          loader: "html-loader",
          options: { minimize: true }
        }
      ]
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
    }]
  },
  plugins: [
      new ExtractTextPlugin({filename: './style.css'}),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      })
  ]  
};