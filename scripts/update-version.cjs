#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const packageDirs = [
  '.',
  'packages/exe',
  'packages/linux-x64',
  'packages/macos-x64',
  'packages/macos-arm64',
  'packages/win-x64'
]

function updateVersion(newVersion) {
  packageDirs.forEach(dir => {
    const packageJsonPath = path.join(dir, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    console.log(`Updating ${packageJson.name} from ${packageJson.version} to ${newVersion}`)
    packageJson.version = newVersion
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  })
}

const newVersion = process.argv[2]
if (!newVersion) {
  console.error('Usage: node scripts/update-version.cjs <new-version>')
  process.exit(1)
}

updateVersion(newVersion)
console.log(`All packages updated to version ${newVersion}`)