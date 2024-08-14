const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./demo/index.js",
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
          "style-loader",
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "demo/index.html"
    })
  ],
  devServer: {
    static: {
      directory: __dirname + "/dist",
    },
    port: 9100,
    open: true
  }
};
