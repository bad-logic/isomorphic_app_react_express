const nodeExternals = require("webpack-node-externals");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin"); // for copying files to build/dist folders
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  name: "server",
  entry: {
    server: path.resolve(__dirname, "..", "src", "server", "server.ts"),
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "..", "dist"),
    filename: "[name].js",
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.server.json",
        },
      },
    ],
  },
  target: "node",
  node: {
    __dirname: false,
  },
  plugins: [new CleanWebpackPlugin()],
};
