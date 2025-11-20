# Iterflow Developer Tools

This directory contains developer tools and extensions for the iterflow library.

## 📦 Packages

### ESLint Plugin (`eslint-plugin-iterflow`)

ESLint plugin that enforces best practices when using iterflow.

**Features:**
- Suggests using iterflow for chained array operations
- Prevents inefficient patterns like `Array.from()` in loops
- Encourages lazy evaluation for performance

**Installation:**
```bash
npm install --save-dev eslint-plugin-iterflow
```

**Usage:**
```javascript
import iterflow from 'eslint-plugin-iterflow';

export default [
  iterflow.configs.recommended
];
```

See [eslint-plugin-iterflow/README.md](./eslint-plugin-iterflow/README.md) for full documentation.

### VSCode Extension (`vscode-iterflow`)

Visual Studio Code extension with code snippets for iterflow.

**Features:**
- 30+ snippets for common iterflow operations
- IntelliSense support
- Covers both wrapper and functional APIs
- Statistical operations snippets

**Installation:**
Search for "Iterflow Snippets" in the VSCode marketplace (coming soon), or install from VSIX:

```bash
cd packages/vscode-iterflow
vsce package
code --install-extension vscode-iterflow-0.1.0.vsix
```

See [vscode-iterflow/README.md](./vscode-iterflow/README.md) for full documentation.

## 🚀 Online Playground Templates

### CodeSandbox Template

Ready-to-use template for experimenting with iterflow in CodeSandbox.

**Quick Start:**
1. Open [CodeSandbox](https://codesandbox.io/)
2. Import from GitHub: `gv-sh/iterflow/tree/main/templates/codesandbox`
3. Start coding!

See [templates/codesandbox/README.md](../templates/codesandbox/README.md) for details.

### StackBlitz Template

Interactive browser-based playground with visual output.

**Quick Start:**
1. Open [StackBlitz](https://stackblitz.com/)
2. Import from GitHub: `gv-sh/iterflow/tree/main/templates/stackblitz`
3. Explore the examples!

See [templates/stackblitz/README.md](../templates/stackblitz/README.md) for details.

## 🛠️ Automation Scripts

Located in `scripts/` directory:

### Changelog Generation

Automatically generate changelog from conventional commits:

```bash
npm run changelog
```

### Release Automation

Interactive release script that handles:
- Version bumping
- Changelog generation
- Running tests
- Git tagging
- npm publishing

```bash
npm run release
```

### Commit Validation

Validate that commits follow conventional commits format:

```bash
npm run validate-commits
```

## 📚 Documentation

Each package has its own README with detailed documentation:

- [ESLint Plugin Documentation](./eslint-plugin-iterflow/README.md)
- [VSCode Extension Documentation](./vscode-iterflow/README.md)
- [CodeSandbox Template Documentation](../templates/codesandbox/README.md)
- [StackBlitz Template Documentation](../templates/stackblitz/README.md)

## 🤝 Contributing

Contributions to developer tools are welcome! Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

All packages are released under the MIT License. See [LICENSE](../LICENSE) for details.
