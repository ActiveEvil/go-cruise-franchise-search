const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const APP_DIR = resolve(__dirname, './src')
const BUILD_DIR = resolve(__dirname, './dist')

module.exports = (env, { mode }) => ({
  devtool: 'cheap-module-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true
  },
  entry: [resolve(APP_DIR, 'index.ts')],
  mode: mode || 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: resolve(__dirname, './tsconfig.json')
        }
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: BUILD_DIR
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      template: './index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.ts']
  },
  target: 'web'
})
