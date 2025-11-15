# Contributing to IterFlow

Thank you for your interest in contributing to IterFlow! We welcome contributions from the community.

## Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/gv-sh/iterflow.git
   cd iterflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests to verify setup:**
   ```bash
   npm test
   ```

## Development Workflow

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and add tests:**
   - Write code in `src/`
   - Add tests in `tests/`
   - Update documentation if needed

3. **Verify your changes:**
   ```bash
   npm run build    # Build the package
   npm test         # Run all tests
   npm run lint     # Check code style
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## Guidelines

### Code Style
- We use ESLint and Prettier for code formatting
- Run `npm run lint` to check style
- Follow existing patterns in the codebase

### Testing
- Write tests for new features
- Maintain test coverage above 90%
- Test both happy path and edge cases
- Use descriptive test names

### Commit Messages
Follow conventional commit format:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` test additions/changes
- `refactor:` code refactoring

### TypeScript
- Use strict TypeScript settings
- Provide proper type definitions
- Ensure type safety throughout

## Types of Contributions

### Bug Reports
- Use the GitHub issue template
- Provide minimal reproduction case
- Include relevant environment details

### Feature Requests
- Describe the use case clearly
- Explain why it fits the library's scope
- Consider backward compatibility

### Code Contributions
- Follow the development workflow above
- Include tests and documentation
- Keep changes focused and atomic

## Release Process

Releases are managed by maintainers:
1. Version bumping follows semantic versioning
2. Changelog is automatically generated
3. npm publishing is automated via GitHub Actions

## Questions?

- Check existing issues and discussions
- Join our community chat (link coming soon)
- Ask questions in GitHub discussions

## Code of Conduct

This project follows the standard open source code of conduct. Be respectful and inclusive in all interactions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.