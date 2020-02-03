// read module in src
// read package.json as json
// register module in package.json
// write package.json
// read wrapper.js as lodash template
// write wrapper.compiled.js in src compiling lodash template
const requireContext = require('./requireContext')
const fs = require('fs')
const _ = require('lodash')
const files = requireContext('./src', false, /\.vue$/)
const modules = []
const names = {}

const snakeToCamel = function (string) {
  return string.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}
const upFirstChar = function (string) {
  if (string.length > 0) return string.charAt(0).toUpperCase() + string.slice(1)
  return string
}
files.forEach(key => {
  if (key === './wrapper.js') return
  const fileName = key.replace(/(\.\/|\.vue)/g, '')
  modules.push(fileName)
  names[fileName] = upFirstChar(snakeToCamel(fileName))
})

let data = fs.readFileSync('package.json')
const packageJson = JSON.parse(data.toString())
const obj = {}
for (const name of modules) {
  obj['./sfc/' + name] = 'src/' + name + '.vue'
}
packageJson.browser = obj
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, '\t'))

data = fs.readFileSync('src/wrapper.js')
const template = _.template(data.toString())
const result = template({ modules, names })
fs.writeFileSync('src/wrapper.compiled.js', result)
