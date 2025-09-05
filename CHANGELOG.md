# Changelog

## [Unreleased]

### Added
- **@mcp-remote/exe package**: New standalone executable package that bundles Node.js runtime with mcp-remote
  - Platform-specific executables for Linux x64, macOS x64, macOS ARM64, and Windows x64
  - No Node.js installation required on target machines
  - Automatic platform detection during installation
  - Self-contained ~50MB executables built with pkg
- Build scripts for generating executables across all platforms
- Workspace configuration for managing multiple packages
- Documentation for standalone executable usage

### Changed
- Modified problematic ES module dependencies (`open`, `strict-url-sanitise`) to use dynamic imports for pkg compatibility
- Updated build process to support both ESM and CommonJS outputs
- Enhanced README with installation and usage instructions for standalone executables

### Technical
- Uses pkg to bundle Node.js 18 runtime with the application
- Platform-specific optional dependencies similar to pnpm's approach
- Setup script automatically links correct binaries during installation
- Fixed ES module compatibility issues for standalone bundling