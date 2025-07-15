const { ModuleFederationPlugin } = require('webpack').container
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')

const deps = require('../package.json').dependencies

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:3003/',
    filename: '[name].js'
    // clean: true,
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
    // static: {
    //   directory: path.join(__dirname, "../dist"),
    // },
    // compress: true,
    // open: true,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'appTransactions',
      filename: 'remoteEntry.js',
      remotes: {
        utilUi: 'utilUi@http://localhost:8310/remoteEntry.js'
      },
      // exposes: {
      //   './Dashboard': './src/components/Dashboard'
      // },

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
        }
      }
    })
  ]
}

module.exports = merge(commonConfig, devConfig)
