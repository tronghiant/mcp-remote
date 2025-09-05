import * as esbuild from 'esbuild'

const buildOptions = {
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  minify: false,
  sourcemap: false,
  external: [
    // Node.js built-ins - keep these external to avoid bundling issues
    'node:*',
    'fs',
    'path',
    'os',
    'crypto',
    'http',
    'https',
    'url',
    'events',
    'stream',
    'util',
    'buffer',
    'process',
    'assert',
    'net',
    'tls',
    'zlib'
  ],
  define: {
    // Define process.env for bundling
    'process.env.NODE_ENV': '"production"'
  }
}

async function build() {
  try {
    // Build proxy
    await esbuild.build({
      ...buildOptions,
      entryPoints: ['src/proxy.ts'],
      outfile: 'dist-sea/proxy.js'
    })

    // Build client  
    await esbuild.build({
      ...buildOptions,
      entryPoints: ['src/client.ts'],
      outfile: 'dist-sea/client.js'
    })

    console.log('Build completed successfully')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

build()