import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'

// Read package.json to get version
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const version = packageJson.version

async function build() {
  try {
    console.log('Building CJS versions for SEA...')

    // Create temporary source files with hardcoded version for SEA builds
    const utilsContent = fs.readFileSync('src/lib/utils.ts', 'utf-8')
    const modifiedUtilsContent = utilsContent.replace(
      `import { version as MCP_REMOTE_VERSION } from '../../package.json'`,
      `const MCP_REMOTE_VERSION = "${version}"`
    )

    // Create temp directory
    if (!fs.existsSync('src-sea-temp')) {
      fs.mkdirSync('src-sea-temp', { recursive: true })
    }
    if (!fs.existsSync('src-sea-temp/lib')) {
      fs.mkdirSync('src-sea-temp/lib', { recursive: true })
    }

    // Copy all source files to temp directory
    const copyFile = (src, dest) => {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(src, dest)
    }

    // Copy main files
    copyFile('src/proxy.ts', 'src-sea-temp/proxy.ts')
    copyFile('src/client.ts', 'src-sea-temp/client.ts')

    // Copy lib files
    const libFiles = fs.readdirSync('src/lib')
    for (const file of libFiles) {
      if (file === 'utils.ts') {
        // Use modified utils.ts
        fs.writeFileSync('src-sea-temp/lib/utils.ts', modifiedUtilsContent)
      } else {
        copyFile(`src/lib/${file}`, `src-sea-temp/lib/${file}`)
      }
    }

    // Build options for SEA
    const buildOptionsSEA = {
      bundle: true,
      platform: 'node',
      target: 'node20',
      format: 'cjs',
      minify: false,
      sourcemap: false
      // No longer need to external 'open' since we removed it
    }

    // Build proxy CJS version for SEA
    await esbuild.build({
      ...buildOptionsSEA,
      entryPoints: ['src-sea-temp/proxy.ts'],
      outfile: 'dist-sea/proxy.cjs'
    })

    // Build client CJS version for SEA
    await esbuild.build({
      ...buildOptionsSEA,
      entryPoints: ['src-sea-temp/client.ts'],
      outfile: 'dist-sea/client.cjs'
    })

    // Clean up temp directory
    fs.rmSync('src-sea-temp', { recursive: true, force: true })

    console.log('Build completed successfully')
  } catch (error) {
    console.error('Build failed:', error)
    // Clean up temp directory on error
    if (fs.existsSync('src-sea-temp')) {
      fs.rmSync('src-sea-temp', { recursive: true, force: true })
    }
    process.exit(1)
  }
}

build()