const { ModuleFederationPlugin } = require('webpack').container
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const deps = require('../package.json').dependencies

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:3003/',
    filename: '[name].js'
  },

  devServer: {
    port: 3003,
    historyApiFallback: {
      index: '/index.html'
    },
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'appTransactions',
      filename: 'remoteEntry.js',
      remotes: {
        utilUi: 'utilUi@http://localhost:8310/remoteEntry.js',
        utilApi: 'utilApi@http://localhost:8311/remoteEntry.js',
        utilStore: 'utilStore@http://localhost:8312/remoteEntry.js'
      },
      exposes: {
        './Transactions': './src/components/TransactionList'
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom']
        },
        '@emotion/react': {
          singleton: true,
          requiredVersion: deps['@emotion/react']
        },
        '@emotion/styled': {
          singleton: true,
          requiredVersion: deps['@emotion/styled']
        },
        '@mui/material': {
          singleton: true,
          requiredVersion: deps['@mui/material']
        },
        '@mui/icons-material': {
          singleton: true,
          requiredVersion: deps['@mui/icons-material']
        },
        zustand: { singleton: true, requiredVersion: deps.zustand },
        'react-toastify': {
          singleton: true,
          requiredVersion: deps['react-toastify']
        }
      }
    })
  ]
}

module.exports = merge(commonConfig, devConfig)
