# Version Update Workflow

This document outlines the process for releasing new versions of IterFlow.

## Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (x.0.0) - Breaking changes
- **MINOR** (0.x.0) - New features, backward compatible
- **PATCH** (0.0.x) - Bug fixes, backward compatible

## Pre-Release Checklist

### 1. Code Quality Verification
```bash
# Run all quality checks
npm run lint
npm test
npm run test:coverage
npm run build

# Verify all checks pass
echo "All checks must pass before proceeding"
```

### 2. Version Decision
Determine the new version based on changes:
- Breaking changes = Major version bump
- New features = Minor version bump  
- Bug fixes only = Patch version bump

## Release Process

### 3. Update Version Number
```bash
# For patch release (0.1.0 -> 0.1.1)
npm version patch

# For minor release (0.1.0 -> 0.2.0)  
npm version minor

# For major release (0.1.0 -> 1.0.0)
npm version major

# Or manually specify version
npm version 0.2.0
```

This automatically:
- Updates `package.json` version
- Creates a git commit
- Creates a git tag

### 4. Update CHANGELOG.md
Add new section for the version:

```markdown
## [0.2.0] - 2024-MM-DD

### Added
- New feature descriptions

### Changed
- Modified functionality descriptions

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features (breaking changes)

### Fixed
- Bug fix descriptions

### Security
- Security improvements

[0.2.0]: https://github.com/gv-sh/iterflow/releases/tag/v0.2.0
```

### 5. Update Documentation
Review and update if needed:
- `README.md` - New features, examples
- `docs/api.md` - API changes
- `CONTRIBUTING.md` - Process updates
- `SECURITY.md` - Security policy updates

### 6. Commit Changes
```bash
# Stage updated files
git add CHANGELOG.md docs/ README.md

# Commit with conventional format
git commit -m "docs: update documentation for v0.2.0 release"
```

### 7. Push to GitHub
```bash
# Push commits and tags
git push origin main
git push origin --tags
```

### 8. npm Publishing (Automated via GitHub Actions)

IterFlow uses **npm Trusted Publishing** with OpenID Connect (OIDC) for secure automated publishing. This eliminates the need for storing sensitive npm tokens.

#### Automated Publishing Triggers
- **Tag-based releases**: Creating a git tag triggers automatic publishing
- **Main branch updates**: Automatic publishing if version in package.json differs from npm

#### Manual Publishing (if needed)
```bash
# Verify package contents
npm pack --dry-run

# Test in clean environment (optional but recommended)
cd /tmp
mkdir test-iterflow && cd test-iterflow
npm init -y
npm install /path/to/iterflow

# Manual publish (requires npm Trusted Publishing setup)
cd /path/to/iterflow
npm publish --provenance --access public
```

### 9. GitHub Release
After pushing the tag, the automated release workflow will:
1. Run all tests and build checks
2. Publish to npm with provenance
3. Create a GitHub release automatically

You can also create releases manually:
1. Go to https://github.com/gv-sh/iterflow/releases
2. Click "Create a new release"
3. Select the version tag (e.g., `v0.2.0`)
4. Release title: `IterFlow v0.2.0`
5. Copy changelog content to release description
6. Click "Publish release"

### 10. Verify Release
- Check npm: https://www.npmjs.com/package/iterflow
- Test installation: `npm install iterflow@latest`
- Verify GitHub Actions completed successfully
- Check all badges in README are working

## Hotfix Process

For urgent bug fixes:

### 1. Create Hotfix Branch
```bash
git checkout main
git pull origin main
git checkout -b hotfix/v0.1.1
```

### 2. Apply Fix
```bash
# Make necessary changes
# Add tests for the fix
npm test
```

### 3. Version and Release
```bash
npm version patch
git push origin hotfix/v0.1.1
git push origin --tags
```

### 4. Merge to Main
```bash
git checkout main
git merge hotfix/v0.1.1
git push origin main
git branch -d hotfix/v0.1.1
```

### 5. Follow Release Process
Continue with steps 4-10 from the main release process.

## Pre-Release Versions

For testing before official release:

```bash
# Create pre-release version
npm version prerelease --preid=beta
# Creates version like 0.2.0-beta.0

# Publish as beta
npm publish --tag beta

# Users can install with:
# npm install iterflow@beta
```

## npm Trusted Publishing Setup

IterFlow uses npm Trusted Publishing with OIDC for secure, token-free automated publishing.

### Initial Setup (One-time Configuration)

#### 1. Configure npm Trusted Publishing
1. Go to https://www.npmjs.com/package/iterflow/access
2. Click "Publishing access" tab
3. Click "Add a Trusted Publisher"
4. Select "GitHub Actions"
5. Fill in the configuration:
   - **Repository**: `gv-sh/iterflow`
   - **Workflow filename**: `release.yml` (or `ci.yml`)
   - **Job**: `release` (or `publish`)

#### 2. Verify GitHub Actions Configuration
The workflows are already configured with:
```yaml
permissions:
  id-token: write  # Required for OIDC authentication
```

And publishing with provenance:
```yaml
- name: Publish to npm
  run: npm publish --provenance --access public
```

### Automated Release Workflows

#### Tag-based Releases (`.github/workflows/release.yml`)
- Triggered when pushing git tags (e.g., `v1.2.3`)
- Runs full test suite
- Publishes to npm with provenance
- Creates GitHub release automatically

#### CI-based Publishing (`.github/workflows/ci.yml`)  
- Triggered on main branch pushes
- Only publishes if package.json version differs from npm
- Provides continuous deployment for version updates

## Version History Tracking

Keep track of:
- What triggered each release
- Breaking changes and migration guides
- Performance improvements
- Community feedback and adoption

## Rollback Process

If issues are discovered after release:

### 1. Immediate Response
```bash
# Deprecate problematic version
npm deprecate iterflow@0.2.0 "Critical bug discovered, use 0.1.9 instead"
```

### 2. Quick Fix
```bash
# Create patch version with fix
npm version patch
# Follow full release process
```

### 3. Communication
- Update GitHub issue/discussion
- Consider blog post for major issues
- Update documentation with known issues

## Best Practices

1. **Test thoroughly** - Always run full test suite
2. **Review dependencies** - Check for security updates
3. **Backward compatibility** - Avoid breaking changes in minor/patch
4. **Clear changelogs** - Help users understand what changed
5. **Consistent timing** - Regular release schedule when possible
6. **Community input** - Consider feedback and feature requests
7. **Security first** - Prioritize security fixes

## Checklist Template

```
Release Checklist for v__.__.__:

Pre-Release:
- [ ] All tests pass
- [ ] Linting clean
- [ ] Build successful
- [ ] Version number decided
- [ ] Breaking changes documented

Release:
- [ ] Version bumped with npm version
- [ ] CHANGELOG.md updated
- [ ] Documentation reviewed
- [ ] Changes committed
- [ ] Pushed to GitHub
- [ ] GitHub release created
- [ ] Published to npm
- [ ] Release verified

Post-Release:
- [ ] Installation tested
- [ ] GitHub Actions completed
- [ ] Community notified (if major release)
- [ ] Monitor for issues
```