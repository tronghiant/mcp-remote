#!/bin/bash

# Script to create standalone executables using Node.js SEA

set -e

echo "Creating standalone executables..."

# Create output directory
mkdir -p dist-standalone

# Get Node.js binary path, handling cases where node might be a shim (like from nvm)
NODE_BINARY=$(which node)
# If node is a shim, try to get the actual binary
if [[ -L "$NODE_BINARY" ]]; then
    NODE_BINARY=$(readlink -f "$NODE_BINARY")
fi
echo "Using Node.js binary: $NODE_BINARY"

# Copy Node.js binary and inject SEA blobs
echo "Creating mcp-remote standalone executable..."
cp "$NODE_BINARY" dist-standalone/mcp-remote
# NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 is a unique identifier used by Node.js SEA
# to mark the location in the binary where the application blob should be injected
npx postject dist-standalone/mcp-remote NODE_SEA_BLOB .tmp/sea-prep-proxy.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

echo "Creating mcp-remote-client standalone executable..."
cp "$NODE_BINARY" dist-standalone/mcp-remote-client
npx postject dist-standalone/mcp-remote-client NODE_SEA_BLOB .tmp/sea-prep-client.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

# Make executables
chmod +x dist-standalone/mcp-remote
chmod +x dist-standalone/mcp-remote-client

echo "Standalone executables created successfully!"
echo "Files:"
ls -la dist-standalone/