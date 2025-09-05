const path = require('path')
const fs = require('fs')

const platform = process.platform === 'win32'
  ? 'win'
  : process.platform === 'darwin'
  ? 'macos'
  : process.platform
const arch = platform === 'win' && process.arch === 'ia32' ? 'x86' : process.arch

const pkgName = `@mcp-remote/${platform}-${arch}`

try {
  const pkgJson = require.resolve(`${pkgName}/package.json`)
  const subpkg = JSON.parse(fs.readFileSync(pkgJson, 'utf8'))

  if (subpkg.bin != null) {
    // Link mcp-remote binary
    if (subpkg.bin['mcp-remote']) {
      const executable = subpkg.bin['mcp-remote']
      const bin = path.resolve(path.dirname(pkgJson), executable)
      linkSync(bin, path.resolve(process.cwd(), 'mcp-remote'))
    }
    
    // Link mcp-remote-client binary
    if (subpkg.bin['mcp-remote-client']) {
      const executable = subpkg.bin['mcp-remote-client']
      const bin = path.resolve(path.dirname(pkgJson), executable)
      linkSync(bin, path.resolve(process.cwd(), 'mcp-remote-client'))
    }

    if (platform === 'win') {
      const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'))
      
      // Update bin entries for Windows
      if (pkg.publishConfig && pkg.publishConfig.bin) {
        pkg.publishConfig.bin['mcp-remote'] = 'mcp-remote.exe'
        pkg.publishConfig.bin['mcp-remote-client'] = 'mcp-remote-client.exe'
        fs.writeFileSync(path.resolve(process.cwd(), 'package.json'), JSON.stringify(pkg, null, 2))
      }
    }
  }
} catch (error) {
  console.warn(`Platform package ${pkgName} not found or could not be linked: ${error.message}`)
  console.warn('This package requires platform-specific binaries to be available.')
}

function linkSync(src, dest) {
  try {
    fs.unlinkSync(dest)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e
    }
  }
  return fs.linkSync(src, dest)
}