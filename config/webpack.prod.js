const { ModuleFederationPlugin } = require('webpack').container
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')()
const deps = require('../package.json').dependencies
const path = require('path')

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: 'auto',
    clean: true
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'appTransactions',
      filename: 'remoteEntry.js',
      remotes: {
        utilUi: 'utilUi@https://bytebank-util-ui.vercel.app/remoteEntry.js',
        utilApi: 'utilApi@https://bytebank-util-api.vercel.app/remoteEntry.js',
        utilStore:
          'utilStore@https://bytebank-util-store.vercel.app/remoteEntry.js'
      },
      exposes: {
        './Transactions': './src/components/TransactionList'
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom']
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
        zod: {
          singleton: true,
          requiredVersion: deps['zod']
        },
        'lodash.debounce': {
          singleton: true,
          requiredVersion: deps['lodash.debounce']
        }
      }
    })
  ]
}

module.exports = merge(commonConfig, prodConfig)
