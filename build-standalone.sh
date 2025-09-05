#!/bin/bash

# Script to create standalone executables using Node.js SEA

set -e

echo "Creating standalone executables..."

# Create output directory
mkdir -p dist-standalone

# Get Node.js binary path
NODE_BINARY=$(which node)
echo "Using Node.js binary: $NODE_BINARY"

# Copy Node.js binary and inject SEA blobs
echo "Creating mcp-remote standalone executable..."
cp "$NODE_BINARY" dist-standalone/mcp-remote
npx postject dist-standalone/mcp-remote NODE_SEA_BLOB sea-prep-proxy.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

echo "Creating mcp-remote-client standalone executable..."
cp "$NODE_BINARY" dist-standalone/mcp-remote-client
npx postject dist-standalone/mcp-remote-client NODE_SEA_BLOB sea-prep-client.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

# Make executables
chmod +x dist-standalone/mcp-remote
chmod +x dist-standalone/mcp-remote-client

echo "Standalone executables created successfully!"
echo "Files:"
ls -la dist-standalone/