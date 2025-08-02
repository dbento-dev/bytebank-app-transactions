/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

function getEnvVars() {
  const buildEnv =
    process.env.BUILD_ENV || process.env.NODE_ENV || 'development'
  const envFileName =
    buildEnv === 'production' ? '.env.production' : '.env.development'
  const envFilePath = path.resolve(__dirname, `../${envFileName}`)

  let localEnv = {}
  if (fs.existsSync(envFilePath)) {
    localEnv = dotenv.parse(fs.readFileSync(envFilePath))
  }

  return {
    'process.env.REACT_APP_BUILD_ENV': JSON.stringify(
      process.env.REACT_APP_BUILD_ENV || localEnv.REACT_APP_BUILD_ENV
    ),
    'process.env.REACT_APP_UTIL_UI_URL': JSON.stringify(
      process.env.REACT_APP_UTIL_UI_URL || localEnv.REACT_APP_UTIL_UI_URL
    ),
    'process.env.REACT_APP_UTIL_API_URL': JSON.stringify(
      process.env.REACT_APP_UTIL_API_URL || localEnv.REACT_APP_UTIL_API_URL
    ),
    'process.env.REACT_APP_UTIL_STORE_URL': JSON.stringify(
      process.env.REACT_APP_UTIL_STORE_URL || localEnv.REACT_APP_UTIL_STORE_URL
    )
  }
}

module.exports = { getEnvVars }
