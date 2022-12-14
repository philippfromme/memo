const path = require("path");

const { DefinePlugin } = require("webpack");

const pkg = require("./package.json");

module.exports = {
  entry: path.resolve(__dirname, "./client/index.js"),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "./public/js"),
    filename: "app.js",
  },
  plugins: [
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.APP_VERSION": JSON.stringify(pkg.version),
    }),
  ],
  devtool: "eval-source-map",
};
