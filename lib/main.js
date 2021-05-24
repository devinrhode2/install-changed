// const fs = require('fs')
const execSync = require('child_process').execSync
const { isPackageChanged } = require('package-changed')

// returns whether or not npm install should be executed
const watchFile = ({
  hashFilename = 'packagehash.txt',
  installCommand = 'yarn install',
  isHashOnly = false
}) => {
  // if fs.existsSync('.yarnrc.yml'), then use --immutable, else use "--prefer-offline", "--pure-lockfile", "--ignore-optional"]
  // see https://github.com/frontsideair/yarnhook/blob/d630516b02f2217c6de282b64fadb4ab59834152/packages/yarnhook/index.js
  // if the hash file doesn't exist or if it does and the hash is different
  const {
    isChanged,
    writeHash
  } = isPackageChanged({
    hashFilename
  })

  if (isChanged) {
    console.log('package.json has been modified.')

    if (isHashOnly) {
      console.log('Updating hash only because --hash-only is true.')
      writeHash()
      return true
    }

    console.log('Installing and updating hash.')

    try {
      execSync(
        installCommand,
        {
          stdio: 'inherit'
        }
      )
      writeHash() // write hash to file for future use
    }
    catch (error) {
      console.log(error)
    }
    return true
  }
  console.log('package.json has not been modified.')
  return false
}

module.exports = watchFile
