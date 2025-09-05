// prepare.js - runs after install to finalize setup
const fs = require('fs')
const path = require('path')

// Create placeholder files if they don't exist
const placeholderFiles = ['mcp-remote', 'mcp-remote-client']

placeholderFiles.forEach(filename => {
  const filepath = path.resolve(process.cwd(), filename)
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, 'This file intentionally left blank')
  }
})