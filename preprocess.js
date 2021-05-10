const path = require('path')
const fs = require('fs')

const babelrc = require('./.babelrc.js')
babelrc.presets.find(([name]) => name.includes('preset-env'))[1].modules = 'commonjs'
babelrc.plugins.push(require.resolve('babel-plugin-dynamic-import-node'))
babelrc.plugins.push(require.resolve('babel-plugin-add-module-exports'))
const transformer = require('babel-jest').createTransformer(babelrc)
const proc = transformer.process.bind(transformer)
transformer.process = function (...args) {
    const [code, path] = args
    if (!path.includes('node_modules') || code.match(/^(import |export )|import\(/gm)) {
        return proc(...args)
    }
    return code
}
module.exports = transformer