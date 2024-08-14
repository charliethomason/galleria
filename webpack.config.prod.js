const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: "./src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "app.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "img/photos/[name][ext][contenthash]"
        }
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
};
