import path from 'path'
import { fileURLToPath } from 'url'
import nodeExternals from 'webpack-node-externals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createConfig = (entry, outputFilename) => ({
  entry,
  target: 'node20',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist-sea'),
    filename: outputFilename,
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  externals: [
    // Don't bundle Node.js built-in modules
    nodeExternals({
      allowlist: [
        // Bundle all non-Node.js modules
        /^(?!node:)/,
      ],
    }),
  ],
  optimization: {
    minimize: false, // Keep readable for debugging
  },
})

export default [createConfig('./src/proxy.ts', 'proxy.js'), createConfig('./src/client.ts', 'client.js')]
