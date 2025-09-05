# Standalone Executables

mcp-remote now supports creating standalone executables using Node.js v22 Single Executable Applications (SEA). This allows users to run mcp-remote without requiring Node.js to be installed on their system.

## Building Standalone Executables

### Prerequisites

- Node.js v20 or later (for building only)
- `postject` package (installed automatically as dev dependency)

### Build Commands

```bash
# Build all versions (normal + standalone)
npm run build:all

# Or build standalone executables only
npm run build:sea        # Build SEA-compatible CJS versions
npm run build:standalone # Generate standalone executables
```

### Generated Files

The build process creates:

- `dist/` - Regular Node.js modules (requires Node.js runtime)
- `dist-standalone/` - Standalone executables (no Node.js required)
  - `mcp-remote` - Standalone proxy executable (~100MB)
  - `mcp-remote-client` - Standalone client executable (~100MB)

## Usage

### With Node.js (traditional method)

```bash
# Using npx (requires Node.js)
npx mcp-remote https://example.remote/server

# Using locally installed package
node dist/proxy.js https://example.remote/server
```

### Standalone (no Node.js required)

```bash
# Run directly without Node.js
./dist-standalone/mcp-remote https://example.remote/server
./dist-standalone/mcp-remote-client https://example.remote/server
```

### MCP Client Configuration

For MCP clients like Claude Desktop, you can use either method:

#### Traditional (requires Node.js)

```json
{
  "mcpServers": {
    "remote-example": {
      "command": "npx",
      "args": ["mcp-remote", "https://remote.mcp.server/sse"]
    }
  }
}
```

#### Standalone (no Node.js required)

```json
{
  "mcpServers": {
    "remote-example": {
      "command": "/path/to/mcp-remote/dist-standalone/mcp-remote",
      "args": ["https://remote.mcp.server/sse"]
    }
  }
}
```

## Technical Details

### Single Executable Applications (SEA)

The standalone executables use Node.js v22's experimental SEA feature which bundles JavaScript code directly into the Node.js binary. Key characteristics:

- **Self-contained**: Includes Node.js runtime + application code
- **No dependencies**: No need for Node.js or npm to be installed
- **Platform-specific**: Executables are built for the current platform
- **Large size**: ~100MB per executable (includes full Node.js runtime)

### Changes for SEA Compatibility

To support SEA, several changes were made:

1. **Removed `open` package**: Browser auto-opening is disabled in standalone mode
2. **CJS bundling**: SEA requires CommonJS format, not ESM
3. **Static version**: Package.json imports replaced with compile-time constants
4. **HTTP server**: Replaced Express with Node.js built-in HTTP module

### OAuth Flow Changes

In standalone mode:

- ✅ OAuth authentication works normally
- ❌ Browser auto-opening is disabled (shows URL to copy/paste instead)
- ✅ All other functionality remains the same

### Build Process

1. **Regular build**: Creates ESM modules for normal Node.js usage
2. **SEA build**: Creates bundled CJS versions compatible with SEA
3. **Blob generation**: Uses Node.js SEA config to create binary blobs
4. **Executable creation**: Injects blobs into Node.js binaries using `postject`

## Distribution

### For End Users

Standalone executables can be distributed without requiring users to install Node.js:

```bash
# Download and run directly
curl -O https://releases.example.com/mcp-remote
chmod +x mcp-remote
./mcp-remote https://example.remote/server
```

### For Developers

Traditional npm installation still works for development:

```bash
npm install mcp-remote
npx mcp-remote https://example.remote/server
```

## Platform Support

Standalone executables are platform-specific and must be built on the target platform:

- ✅ Linux x64
- ✅ macOS (Intel/Apple Silicon)
- ✅ Windows x64

For cross-platform distribution, build on each target platform separately.
