# Migration Guide: v[X.0.0] → v[Y.0.0]

> **Note:** This is a template for future migration guides. Copy this template when creating migration documentation for a new major version.

## Overview

This guide helps you migrate from IterFlow v[X.0.0] to v[Y.0.0]. This major version includes breaking changes that require updates to your code.

### Quick Summary

- **Estimated Migration Time:** [e.g., 15-30 minutes for most projects]
- **Breaking Changes:** [Number] breaking changes
- **New Features:** [Number] new features
- **Deprecated APIs:** [Number] APIs deprecated (will be removed in v[Z.0.0])

### Who Should Read This Guide

- Anyone upgrading from v[X.x.x] to v[Y.0.0]
- Developers maintaining IterFlow-dependent applications
- Package maintainers that depend on IterFlow

### Before You Begin

1. **Read the full CHANGELOG:** Review all changes in CHANGELOG.md
2. **Check your version:** Run `npm list iterflow` to confirm your current version
3. **Backup your code:** Commit all changes or create a backup
4. **Update tests:** Ensure you have adequate test coverage before upgrading

---

## Breaking Changes

### 1. [Breaking Change Title]

**What Changed:**
[Describe what changed and why]

**Before (v[X.0.0]):**
```typescript
// Old code example
import { iter } from 'iterflow';

const result = iter([1, 2, 3])
  .oldMethod()
  .toArray();
```

**After (v[Y.0.0]):**
```typescript
// New code example
import { iter } from 'iterflow';

const result = iter([1, 2, 3])
  .newMethod()
  .toArray();
```

**Migration Steps:**

1. Find all usages: Search your codebase for `oldMethod`
2. Replace with new API: Update each usage to `newMethod`
3. Update types if needed: [Any TypeScript type changes]
4. Run tests: Verify everything works

**Automatic Migration:**

If available, you can use a codemod to automate this change:

```bash
npx @iterflow/codemod vX-to-vY old-method-to-new-method ./src
```

**Why This Change:**
[Explain the rationale behind the breaking change]

---

### 2. [Another Breaking Change]

**What Changed:**
[Description]

**Before (v[X.0.0]):**
```typescript
// Old code
```

**After (v[Y.0.0]):**
```typescript
// New code
```

**Migration Steps:**
[Steps to migrate]

---

## Deprecated APIs

### [Deprecated Feature Name]

**Deprecated In:** v[Y.0.0]
**Will Be Removed In:** v[Z.0.0]

**What's Deprecated:**
[Describe what's deprecated]

**Recommended Alternative:**
```typescript
// Instead of this (deprecated):
oldAPI();

// Use this:
newAPI();
```

**Deprecation Warning:**
You will see this warning if you use the deprecated API:
```
[iterflow] DEPRECATED: oldAPI() has been deprecated since vY.0.0 and will be removed in vZ.0.0
Please use newAPI() instead.
```

**Migration Timeline:**
- v[Y.0.0] - v[Z-1.x.x]: API works but shows warnings
- v[Z.0.0]: API removed, must use alternative

---

## New Features

### [New Feature Name]

[Brief description of the new feature and how to use it]

**Example:**
```typescript
import { iter } from 'iterflow';

// Example usage of new feature
const result = iter([1, 2, 3])
  .newFeature()
  .toArray();
```

**Benefits:**
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

**Documentation:** [Link to full documentation]

---

## Updated Dependencies

### Node.js Version Requirement

- **Previous:** Node.js >= [X]
- **New:** Node.js >= [Y]

**Reason:** [Why the requirement changed]

**How to Update:**
1. Check your Node version: `node --version`
2. Update Node.js if needed: [Link to Node.js downloads]
3. Update your CI/CD pipelines if applicable

### TypeScript Version Requirement

- **Previous:** TypeScript >= [X]
- **New:** TypeScript >= [Y]

**Reason:** [Why the requirement changed]

**How to Update:**
```bash
npm install --save-dev typescript@latest
# or
yarn upgrade typescript@latest
```

---

## Type Changes

### [Type Change Description]

**Before:**
```typescript
// Old type definition
type OldType = {
  // ...
};
```

**After:**
```typescript
// New type definition
type NewType = {
  // ...
};
```

**Impact:**
[Describe how this affects user code]

**Migration:**
[Steps to update your types]

---

## Behavioral Changes

### [Behavior Change Description]

**What Changed:**
[Describe the behavior change]

**Example:**

```typescript
import { iter } from 'iterflow';

const data = [1, 2, 3, 4, 5];

// v[X.0.0] behavior:
// [Description of old behavior]

// v[Y.0.0] behavior:
// [Description of new behavior]
```

**Why This Changed:**
[Rationale]

**Action Required:**
[What users need to do, if anything]

---

## Step-by-Step Migration Guide

Follow these steps to migrate your project:

### Step 1: Update Package Version

```bash
npm install iterflow@[Y.0.0]
# or
yarn add iterflow@[Y.0.0]
```

### Step 2: Update TypeScript Version (if needed)

```bash
npm install --save-dev typescript@latest
```

### Step 3: Fix Breaking Changes

Work through each breaking change listed above:

1. [ ] [Breaking Change 1]
2. [ ] [Breaking Change 2]
3. [ ] [Breaking Change 3]

Use the search and replace strategies provided for each change.

### Step 4: Address Deprecation Warnings

While not immediately required, it's recommended to fix deprecation warnings:

1. Run your application with deprecation warnings enabled
2. Note each deprecation warning
3. Update code to use recommended alternatives

### Step 5: Update Tests

1. Run your test suite: `npm test`
2. Fix any failing tests
3. Add new tests for new features you're using

### Step 6: Update Documentation

1. Update your project's documentation
2. Update code comments
3. Update any internal migration guides

### Step 7: Test Thoroughly

1. Run full test suite
2. Test in development environment
3. Test in staging environment
4. Perform manual testing of critical paths

### Step 8: Deploy

Once everything works:

1. Deploy to production with monitoring
2. Watch for any issues
3. Be prepared to rollback if needed

---

## Troubleshooting

### Common Issues

#### Issue: [Common Problem]

**Symptoms:**
[How to identify this issue]

**Solution:**
[How to fix it]

**Example:**
```typescript
// Example of the fix
```

---

#### Issue: [Another Common Problem]

**Symptoms:**
[Description]

**Solution:**
[Fix]

---

## Automated Migration Tools

### Codemod Scripts

We provide automated codemod scripts to help with migration:

```bash
# Install codemod tool
npm install -g @iterflow/codemod

# Run migration script
npx @iterflow/codemod vX-to-vY ./src

# Available codemods:
# - old-method-to-new-method
# - update-types
# - update-imports
```

### Running Specific Codemods

```bash
# Run specific codemod
npx @iterflow/codemod vX-to-vY old-method-to-new-method ./src

# Dry run (preview changes without applying)
npx @iterflow/codemod vX-to-vY old-method-to-new-method ./src --dry
```

---

## Getting Help

### Resources

- **CHANGELOG:** See [CHANGELOG.md](../../CHANGELOG.md) for detailed changes
- **API Documentation:** [Link to API docs]
- **Examples:** [Link to examples]
- **Discussion Forum:** [Link to GitHub Discussions]

### Support Channels

If you encounter issues during migration:

1. **Check GitHub Issues:** Search for similar problems at [GitHub Issues](https://github.com/gv-sh/iterflow/issues)
2. **Ask in Discussions:** Post in [GitHub Discussions](https://github.com/gv-sh/iterflow/discussions)
3. **Report Bugs:** File a bug report if you find issues with the migration guide or the new version

### Staying on v[X.x.x]

If you cannot migrate immediately:

- v[X.x.x] will receive LTS support for [duration]
- Security fixes and critical bugs will be backported
- Plan your migration within the LTS window
- See [SEMANTIC_VERSIONING.md](../../SEMANTIC_VERSIONING.md) for LTS policy

---

## FAQ

### Q: How long will v[X.x.x] be supported?

A: Version [X.x.x] will receive LTS support until [date], which is 18 months after v[Y.0.0] release. See our [Semantic Versioning Policy](../../SEMANTIC_VERSIONING.md#long-term-support-lts).

### Q: Can I upgrade gradually?

A: While we recommend upgrading in one go, you can:
1. Upgrade to the latest v[X.x.x] first
2. Fix all deprecation warnings
3. Then upgrade to v[Y.0.0]

### Q: Will my code break?

A: If you're using only public, non-deprecated APIs, the breaking changes are limited to those documented above. Follow the migration steps and test thoroughly.

### Q: What if I find an issue?

A: Please [open an issue](https://github.com/gv-sh/iterflow/issues/new) with:
- Your current version
- Expected behavior
- Actual behavior
- Minimal reproduction code

---

## Changelog Summary

For the complete list of changes, see [CHANGELOG.md](../../CHANGELOG.md).

**Highlights:**

- [Major feature 1]
- [Major feature 2]
- [Important fix]
- [Performance improvement]

---

## Next Steps

After migrating:

1. ✅ Review new features and consider using them
2. ✅ Update your project documentation
3. ✅ Share feedback about the migration process
4. ✅ Help others by sharing your experience

Thank you for using IterFlow! 🚀

---

**Document Version:** 1.0
**Last Updated:** [Date]
**Applies To:** Migration from v[X.x.x] to v[Y.0.0]
