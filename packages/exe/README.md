# @mcp-remote/exe

This version of the mcp-remote CLI is packaged with Node.js into standalone executables.
So it may be used on a system with no Node.js installed.

This package automatically downloads the correct platform-specific binary for your system:
- Linux x64
- macOS x64 (Intel)
- macOS ARM64 (Apple Silicon)
- Windows x64

## Installation

```bash
npm install -g @mcp-remote/exe
```

Or with pnpm:

```bash
pnpm add -g @mcp-remote/exe
```

After installation, you can use `mcp-remote` and `mcp-remote-client` commands globally.

## Usage

```bash
# Start MCP Remote proxy
mcp-remote https://your-remote-server.com/sse

# Run client directly 
mcp-remote-client https://your-remote-server.com/sse
```

## Platform Support

The package includes platform-specific executables for:
- `@mcp-remote/linux-x64` - Linux on x64
- `@mcp-remote/macos-x64` - macOS on Intel
- `@mcp-remote/macos-arm64` - macOS on Apple Silicon  
- `@mcp-remote/win-x64` - Windows on x64

The correct binary for your platform will be automatically selected during installation.

## License

MIT