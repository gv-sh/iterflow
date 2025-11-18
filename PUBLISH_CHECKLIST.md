# Publishing Checklist

## Pre-GitHub Setup

### 1. Repository Initialization
```bash
# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: initial release of iterflow v0.1.0

- Complete statistical operations suite
- Windowing and grouping operations
- TypeScript type constraints
- Dual API support (wrapper + functional)
- Comprehensive test coverage"
```

### 2. GitHub Repository Setup
1. Create new repository on GitHub: `https://github.com/gv-sh/iterflow`
2. Update all placeholder URLs in:
   - `package.json` - repository, bugs, homepage URLs
   - `README.md` - badge URLs and links
   - `.github/workflows/ci.yml` - workflow references
   - Other documentation files

3. Set up GitHub repository:
```bash
# Add remote origin
git remote add origin https://github.com/gv-sh/iterflow.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. GitHub Settings Configuration
- Enable Issues and Discussions
- Set up branch protection rules for `main`
- Configure GitHub Actions secrets:
  - `NPM_TOKEN` - for npm publishing
- Enable vulnerability alerts
- Set up Codecov integration (optional)

## npm Publishing Preparation

### 4. Verify Package Contents
```bash
# Check what files will be published
npm pack --dry-run

# Verify package structure
npm run build
ls -la dist/
```

### 5. Test Package Locally
```bash
# Install in test directory
mkdir test-install && cd test-install
npm init -y
npm install ../iterflow

# Test imports
node -e "const { iter } = require('iterflow'); console.log(iter([1,2,3]).sum());"
node -e "import('iterflow').then(({ iter }) => console.log(iter([1,2,3]).sum()));"
```

### 6. npm Account Setup
```bash
# Login to npm
npm login

# Verify account
npm whoami

# Check if package name is available
npm view iterflow
```

### 7. Publish to npm
```bash
# Final verification
npm run build
npm test
npm run lint

# Publish (do NOT run this until ready!)
npm publish
```

## Post-Publishing

### 8. GitHub Release
1. Create a new release on GitHub
2. Tag: `v0.1.0`
3. Release title: `iterflow v0.1.0 - Initial Release`
4. Copy changelog content for release notes
5. Attach build artifacts if needed

### 9. Verification
- Check package appears on npm: `https://www.npmjs.com/package/iterflow`
- Test installation: `npm install iterflow`
- Verify GitHub Actions are working
- Check all badge links in README

### 10. Community Setup
- Share in relevant JavaScript communities
- Consider posting on:
  - Reddit (r/javascript, r/typescript)
  - Dev.to
  - Twitter/X
  - JavaScript Weekly newsletter

## Checklist

- [ ] All placeholder URLs updated with actual GitHub repository
- [ ] GitHub repository created and configured
- [ ] npm account setup and package name verified
- [ ] All tests passing
- [ ] Build successful
- [ ] Linting clean
- [ ] Package contents verified
- [ ] Local installation test successful
- [ ] Ready to publish to npm
- [ ] GitHub release prepared
- [ ] Documentation complete

## Important Notes

**Before first npm publish:**
1. All `your-username` placeholders updated with `gv-sh`
2. Email addresses updated in package.json and SECURITY.md  
3. All URLs verified and correct
4. Test the package installation locally
5. Make sure you own the npm package name

**Security:**
- Never commit npm tokens or credentials
- Use GitHub secrets for CI/CD automation
- Keep dependencies updated