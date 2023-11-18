const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  return {
    mode: env.mode || "production",
    entry: {
      main: path.resolve(__dirname, "src", "index.js"),
    },
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "[name]-[contenthash].js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
      new webpack.ProgressPlugin(),
    ],
    devServer: {
      port: env.port || 5000,
      open: true,
    },
  };
};
