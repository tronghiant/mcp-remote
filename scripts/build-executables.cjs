#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const platforms = [
  { target: 'linux-x64', pkgTarget: 'node18-linux-x64', ext: '' },
  { target: 'macos-x64', pkgTarget: 'node18-macos-x64', ext: '' },
  { target: 'macos-arm64', pkgTarget: 'node18-macos-arm64', ext: '' },
  { target: 'win-x64', pkgTarget: 'node18-win-x64', ext: '.exe' }
]

const buildExecutables = () => {
  console.log('Building executables for all platforms...')

  // First, ensure we have the built JS files
  console.log('Building TypeScript...')
  execSync('pnpm build', { stdio: 'inherit' })

  platforms.forEach(({ target, pkgTarget, ext }) => {
    console.log(`\nBuilding ${target}...`)
    
    const packageDir = path.join(__dirname, '..', 'packages', target)
    
    // Build mcp-remote executable
    const proxyOutput = path.join(packageDir, `mcp-remote${ext}`)
    console.log(`  Building mcp-remote${ext}...`)
    execSync(`npx pkg dist/proxy.cjs --target ${pkgTarget} --output ${proxyOutput}`, {
      stdio: 'inherit',
      cwd: __dirname + '/..'
    })
    
    // Build mcp-remote-client executable
    const clientOutput = path.join(packageDir, `mcp-remote-client${ext}`)
    console.log(`  Building mcp-remote-client${ext}...`)
    execSync(`npx pkg dist/client.cjs --target ${pkgTarget} --output ${clientOutput}`, {
      stdio: 'inherit',
      cwd: __dirname + '/..'
    })
    
    console.log(`  ✓ ${target} executables built`)
  })

  console.log('\n✓ All executables built successfully!')
}

if (require.main === module) {
  buildExecutables()
}

module.exports = { buildExecutables }