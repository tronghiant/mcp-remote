import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the project root directory (parent of scripts directory)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.dirname(__dirname)

// Read package.json to get version
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'))
const version = packageJson.version

async function build() {
  try {
    console.log('Building CJS versions for SEA...')

    // Create temporary source files with hardcoded version for SEA builds
    const utilsContent = fs.readFileSync(path.join(projectRoot, 'src/lib/utils.ts'), 'utf-8')
    const modifiedUtilsContent = utilsContent.replace(
      `import { version as MCP_REMOTE_VERSION } from '../../package.json'`,
      `const MCP_REMOTE_VERSION = "${version}"`,
    )

    const srcSeaTempDir = path.join(projectRoot, 'src-sea-temp')
    const srcSeaTempLibDir = path.join(srcSeaTempDir, 'lib')
    const distSeaDir = path.join(projectRoot, 'dist-sea')

    // Create temp directory
    if (!fs.existsSync(srcSeaTempDir)) {
      fs.mkdirSync(srcSeaTempDir, { recursive: true })
    }
    if (!fs.existsSync(srcSeaTempLibDir)) {
      fs.mkdirSync(srcSeaTempLibDir, { recursive: true })
    }

    // Create dist-sea directory
    if (!fs.existsSync(distSeaDir)) {
      fs.mkdirSync(distSeaDir, { recursive: true })
    }

    // Copy all source files to temp directory
    const copyFile = (src, dest) => {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(src, dest)
    }

    // Copy main files
    copyFile(path.join(projectRoot, 'src/proxy.ts'), path.join(srcSeaTempDir, 'proxy.ts'))
    copyFile(path.join(projectRoot, 'src/client.ts'), path.join(srcSeaTempDir, 'client.ts'))

    // Copy lib files
    const libFiles = fs.readdirSync(path.join(projectRoot, 'src/lib'))
    for (const file of libFiles) {
      if (file === 'utils.ts') {
        // Use modified utils.ts
        fs.writeFileSync(path.join(srcSeaTempLibDir, 'utils.ts'), modifiedUtilsContent)
      } else {
        copyFile(path.join(projectRoot, 'src/lib', file), path.join(srcSeaTempLibDir, file))
      }
    }

    // Build options for SEA
    const buildOptionsSEA = {
      bundle: true,
      platform: 'node',
      target: 'node20',
      format: 'cjs',
      minify: false,
      sourcemap: false,
      // No longer need to external 'open' since we removed it
    }

    // Build proxy CJS version for SEA
    await esbuild.build({
      ...buildOptionsSEA,
      entryPoints: [path.join(srcSeaTempDir, 'proxy.ts')],
      outfile: path.join(distSeaDir, 'proxy.cjs'),
    })

    // Build client CJS version for SEA
    await esbuild.build({
      ...buildOptionsSEA,
      entryPoints: [path.join(srcSeaTempDir, 'client.ts')],
      outfile: path.join(distSeaDir, 'client.cjs'),
    })

    // Clean up temp directory
    fs.rmSync(srcSeaTempDir, { recursive: true, force: true })

    console.log('Build completed successfully')
  } catch (error) {
    console.error('Build failed:', error)
    // Clean up temp directory on error
    const srcSeaTempDir = path.join(projectRoot, 'src-sea-temp')
    if (fs.existsSync(srcSeaTempDir)) {
      fs.rmSync(srcSeaTempDir, { recursive: true, force: true })
    }
    process.exit(1)
  }
}

build()
