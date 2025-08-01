const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')
const fs = require('fs')

module.exports = () => {
  const currentEnv = process.env.REACT_APP_BUILD_ENV || 'development'
  const basePath = path.resolve(__dirname, `../.env.${currentEnv}`)

  const envFile = fs.existsSync(basePath)
    ? dotenv.config({ path: basePath }).parsed
    : {}

  // Transforma { REACT_APP_API_URL: 'http://...' } em { 'process.env.REACT_APP_API_URL': '"http://..."' }
  const envKeys = Object.keys(envFile || {}).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envFile[next])
    return prev
  }, {})

  return {
    entry: './src/main.tsx',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          // use: 'babel-loader',
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new webpack.DefinePlugin(envKeys)
    ]
  }
}
