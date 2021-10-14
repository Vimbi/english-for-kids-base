const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const devServer = (isDev) => !isDev ? {} : {
  devServer: {
    open: true,
    hot: true,
    port: 8080,
    contentBase: path.join(__dirname, 'public'),
  }
};

module.exports = ({ develop }) => ({
  mode: develop ? 'development' : 'production',
  devtool: develop ? 'inline-source-map' : false,
  stats: {
    errorDetails: true,
  },
  context: path.resolve(__dirname, 'src'),
  entry: './main.ts',
  output: {
    filename: '[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },  
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false}),
    new CopyPlugin({
      patterns: [
        { from: 'public' }
      ]
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.[tj]s$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          }
      },
      {
        test: /\.(png|jpe?g|svg|gif|ico|webp)$/i,
        type: 'asset/resource',
        // use: {
        //   loader: 'file-loader'
        // }
      },
      {
        test: /\.mp3$/,
        type: 'asset/resource',
        // use: {
        //   loader: 'file-loader'
        // }
      }
    ]
  },
  ...devServer(develop),
})