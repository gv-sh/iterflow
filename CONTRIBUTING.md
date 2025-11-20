# Contributing to iterflow

Thank you for your interest in contributing to iterflow! We welcome contributions from the community and are grateful for every contribution, whether it's reporting a bug, proposing a new feature, or submitting code changes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Guidelines](#guidelines)
- [Types of Contributions](#types-of-contributions)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

Before you begin:
- Check the [existing issues](https://github.com/gv-sh/iterflow/issues) to see if your bug or feature has already been reported
- Read through our [README](README.md) to understand the project's goals and scope
- Review our [ROADMAP](ROADMAP.md) to see planned features and improvements
- Join the discussions in [GitHub Discussions](https://github.com/gv-sh/iterflow/discussions) for questions and ideas

## Development Setup

1. **Fork and clone the repository:**
   ```bash
   # Fork the repo on GitHub first, then:
   git clone https://github.com/YOUR-USERNAME/iterflow.git
   cd iterflow
   ```

2. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/gv-sh/iterflow.git
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run tests to verify setup:**
   ```bash
   npm test
   ```

5. **Verify build works:**
   ```bash
   npm run build
   ```

## Development Workflow

### 1. Sync with upstream

Before starting work, sync your fork with the upstream repository:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create a feature branch

Create a descriptive branch name:

```bash
# For new features
git checkout -b feature/add-groupby-operation

# For bug fixes
git checkout -b fix/filter-empty-iterator

# For documentation
git checkout -b docs/update-api-reference

# For refactoring
git checkout -b refactor/optimize-map-operation
```

### 3. Make your changes

- **Write code in `src/`** - Follow existing patterns and TypeScript conventions
- **Add tests in `tests/`** - Ensure comprehensive test coverage (target: 90%+)
- **Update documentation** - Include JSDoc comments and update relevant docs
- **Follow code style** - The project uses ESLint and Prettier

### 4. Write meaningful commits

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat(core): add groupBy operation for categorizing elements"
git commit -m "fix(filter): handle empty iterator correctly"
git commit -m "docs(readme): add examples for statistical operations"
git commit -m "test(map): add edge case tests for undefined values"
```

### 5. Keep your branch updated

Regularly sync with upstream to avoid conflicts:

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Verify your changes

Run the complete verification suite before pushing:

```bash
# Run all tests
npm test

# Check code coverage
npm run coverage

# Run linting
npm run lint

# Build the package
npm run build

# Run type checking
npm run type-check
```

### 7. Push your changes

```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill out the PR template completely
- Link related issues using "Closes #123" or "Fixes #456"
- Wait for review and address feedback promptly

## Pull Request Process

1. **Ensure your PR:**
   - Follows the coding standards and conventions
   - Includes tests for new functionality
   - Updates documentation as needed
   - Passes all CI checks (tests, linting, build)
   - Has a clear, descriptive title and description

2. **PR Review Process:**
   - Maintainers will review your PR within 3-5 business days
   - Address any feedback or requested changes
   - Keep the PR updated with the main branch
   - Once approved, a maintainer will merge your PR

3. **After Merge:**
   - Your contribution will be included in the next release
   - You'll be credited in the release notes and CHANGELOG
   - Delete your feature branch

## Guidelines

### Code Style

- **Formatting:** We use ESLint and Prettier for consistent code formatting
  - Run `npm run lint` to check style
  - Run `npm run format` to auto-format code
  - Configuration is in `.eslintrc` and `.prettierrc`

- **Patterns:** Follow existing patterns in the codebase
  - Study similar implementations before adding new features
  - Maintain consistency with existing API design
  - Use functional programming patterns where appropriate

- **Naming Conventions:**
  - Use camelCase for variables, functions, and methods
  - Use PascalCase for classes and types
  - Use UPPER_CASE for constants
  - Use descriptive, self-documenting names

### Testing

- **Test Coverage:** Maintain test coverage above 90%
  - Write tests for all new features and bug fixes
  - Include unit tests for individual functions
  - Add integration tests for complex workflows

- **Test Quality:**
  - Test both happy path and edge cases
  - Include tests for error conditions
  - Test with empty inputs, single items, and large datasets
  - Use descriptive test names that explain what is being tested

- **Test Organization:**
  - Place tests in `tests/` directory mirroring `src/` structure
  - Group related tests using `describe()` blocks
  - Use `it()` or `test()` for individual test cases
  - Use `beforeEach()` for common setup

- **Example Test Structure:**
  ```typescript
  describe('map', () => {
    it('should transform each element', () => {
      const result = iter([1, 2, 3]).map(x => x * 2).toArray();
      expect(result).toEqual([2, 4, 6]);
    });

    it('should handle empty iterator', () => {
      const result = iter([]).map(x => x * 2).toArray();
      expect(result).toEqual([]);
    });
  });
  ```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Format:** `<type>(<scope>): <description>`

**Types:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes only
- `test:` - Adding or updating tests
- `refactor:` - Code changes that neither fix bugs nor add features
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks (deps, tooling, etc.)
- `ci:` - CI/CD changes

**Scopes (optional):**
- `core` - Core iterator operations
- `async` - Async iterator operations
- `stats` - Statistical operations
- `types` - TypeScript types
- `docs` - Documentation

**Examples:**
```bash
feat(core): add groupBy operation
fix(async): resolve race condition in parallel processing
docs(readme): add performance benchmarks section
test(stats): add tests for correlation function
refactor(core): simplify map implementation
```

### TypeScript

- **Type Safety:**
  - Use strict TypeScript settings (strict mode enabled)
  - Provide proper type definitions for all public APIs
  - No `any` types in public interfaces
  - Use generics for reusable, type-safe code

- **Type Documentation:**
  - Include JSDoc comments with type information
  - Document generic type parameters
  - Provide examples in JSDoc comments

- **Best Practices:**
  - Prefer `unknown` over `any` when type is uncertain
  - Use type guards for runtime type checking
  - Leverage type inference where possible
  - Export types that consumers might need

### Documentation

- **Code Documentation:**
  - Add JSDoc comments to all public methods and functions
  - Include parameter descriptions and return types
  - Provide usage examples in JSDoc
  - Document any caveats or performance considerations

- **Documentation Files:**
  - Update README.md for significant features
  - Add examples to relevant documentation
  - Update API reference if applicable
  - Keep CHANGELOG.md updated (maintainers handle this)

## Types of Contributions

We welcome various types of contributions:

### 🐛 Bug Reports

Found a bug? Help us fix it:

1. **Search first:** Check if the bug has already been reported
2. **Use the template:** Fill out the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
3. **Provide details:**
   - Clear description of the bug
   - Minimal reproduction case (code sample)
   - Expected vs actual behavior
   - Environment details (Node.js version, OS, etc.)
   - Error messages or stack traces

**Good bug report example:**
```
Title: filter() incorrectly handles null values

Description: When using filter() with a predicate that checks for
null values, the operation includes null in results when it shouldn't.

Reproduction:
const result = iter([1, null, 2, null, 3])
  .filter(x => x !== null)
  .toArray();
// Expected: [1, 2, 3]
// Actual: [1, null, 2, null, 3]
```

### 💡 Feature Requests

Have an idea for a new feature?

1. **Check roadmap:** Review [ROADMAP.md](ROADMAP.md) for planned features
2. **Use the template:** Fill out the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. **Explain the use case:**
   - What problem does this solve?
   - Why is this valuable?
   - How would you use it?
4. **Consider scope:** Does it fit iterflow's philosophy?
5. **Propose an API:** Show how the API might look

**Good feature request example:**
```
Title: Add takeWhile() operation

Use Case: I need to take elements from an iterator until a
condition becomes false. This is useful for processing streaming
data where I want to stop at a certain point.

Proposed API:
iter([1, 2, 3, 4, 5])
  .takeWhile(x => x < 4)
  .toArray(); // [1, 2, 3]

Alternatives: Currently using filter() but it processes all
elements instead of stopping early.
```

### 📝 Documentation Improvements

Documentation is always valuable:

- Fix typos or grammatical errors
- Improve unclear explanations
- Add missing examples
- Create tutorials or guides
- Improve code comments
- Update outdated information

### 🔧 Code Contributions

Contributing code:

1. **Start small:** Begin with small, focused changes
2. **Discuss first:** For major changes, open an issue first to discuss
3. **Follow guidelines:** Adhere to all guidelines in this document
4. **Include tests:** All code changes must include tests
5. **Update docs:** Update documentation for your changes
6. **Keep it focused:** One feature/fix per PR

### 🎨 Examples and Tutorials

Share how you use iterflow:

- Create example projects
- Write blog posts or tutorials
- Share use cases and patterns
- Contribute to the examples directory

### 💬 Community Support

Help others:

- Answer questions in GitHub Discussions
- Help triage issues
- Review pull requests
- Share the project

## Release Process

Releases are managed by maintainers following this process:

1. **Version Bumping:**
   - Follows [Semantic Versioning](https://semver.org/)
   - MAJOR: Breaking changes
   - MINOR: New features (backward compatible)
   - PATCH: Bug fixes (backward compatible)

2. **Changelog Generation:**
   - Automatically generated from commit messages
   - Reviewed and edited by maintainers
   - Published with each release

3. **Publishing:**
   - Automated via GitHub Actions
   - Published to npm registry
   - GitHub release created with notes
   - Git tag created for version

4. **Release Schedule:**
   - Patch releases: As needed for critical bugs
   - Minor releases: Monthly or when features are ready
   - Major releases: When breaking changes are necessary

## Getting Help

Need assistance? Here's how to get help:

### Documentation

- **[README](README.md):** Quick start and overview
- **[API Reference](docs/api/):** Complete API documentation
- **[Guides](docs/guides/):** Tutorials and how-tos
- **[Examples](examples/):** Sample projects and code

### Community

- **[GitHub Discussions](https://github.com/gv-sh/iterflow/discussions):** Ask questions, share ideas
- **[Issues](https://github.com/gv-sh/iterflow/issues):** Bug reports and feature requests
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/iterflow):** Tag questions with `iterflow`

### Communication Guidelines

- Be respectful and constructive
- Provide context and details
- Search before asking
- Share solutions you find
- Help others when you can

## Recognition

We value all contributions:

- Contributors are credited in release notes
- Significant contributions are highlighted in CHANGELOG
- Active contributors may be invited as maintainers
- All contributors are listed in the repository

## License

By contributing to iterflow, you agree that your contributions will be licensed under the [MIT License](LICENSE). This means:

- Your code can be freely used, modified, and distributed
- You retain copyright to your contributions
- You grant others the same rights through the MIT License
- Your contribution is provided "as-is" without warranty

---

**Thank you for contributing to iterflow!** 🎉

Your time and effort help make iterflow better for everyone. We appreciate your support!