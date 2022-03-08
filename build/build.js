const { exec, rm, echo } = require('shelljs')
const { resolve } = require('path')

const dist = resolve(__dirname, '../serverless-deploy')
echo('building...')
rm('-rf', `${dist}/*.js`)
rm('-rf', `${dist}/*.json`)
rm('-rf', `${dist}/*.map`)
exec('node_modules/.bin/babel src/server --out-dir serverless-deploy --ignore "*.json"')
exec('NODE_ENV=production node_modules/.bin/webpack --progress --config build/webpack.config.js')
echo('build done')
