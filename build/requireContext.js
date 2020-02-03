const fs = require('fs')
const urljoin = require('url-join')

// read the name of the module to import

function readdirSync (folder, recursive, pattern) {
  const toRemove = []
  let paths = fs.readdirSync(folder)
  paths = (paths !== null ? paths : [])
  return paths.filter((path, index) => {
    let res = true
    const folderPath = urljoin(folder, path)
    // console.log(folderPath)
    if (fs.statSync(folderPath).isDirectory()) {
      if (recursive) {
        const subFolders = readdirSync(folderPath, recursive, pattern)
        paths.push(...subFolders.map((value) => { return urljoin(path, value) }))
      }
      res = false
    } else if (!pattern.test(path)) {
      res = false
    }
    return res
  })
}

module.exports = readdirSync
