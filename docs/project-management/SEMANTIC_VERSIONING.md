# Semantic Versioning Commitment

## Our Promise

IterFlow is committed to [Semantic Versioning 2.0.0](https://semver.org/) (SemVer). This document outlines our versioning policy and what you can expect from different types of releases.

## Version Format

All releases follow the format `MAJOR.MINOR.PATCH`, for example `1.2.3`:

- **MAJOR** version (1.x.x) - Incompatible API changes
- **MINOR** version (x.2.x) - New functionality, backwards-compatible
- **PATCH** version (x.x.3) - Backwards-compatible bug fixes

## What Constitutes a Breaking Change

A **MAJOR** version bump will occur when we make incompatible changes to the public API, including:

### Code-Breaking Changes
- Removing a public API (function, class, method, property)
- Renaming a public API without providing an alias
- Changing the signature of a public API (parameter types, order, or count)
- Changing the return type of a public API in an incompatible way
- Changing the behavior of a public API in a way that breaks documented use cases
- Removing or renaming exported types or interfaces
- Changing error types or error handling behavior

### Dependency Changes
- Increasing the minimum required Node.js version
- Increasing the minimum required TypeScript version (major versions only)
- Removing support for a runtime (e.g., Deno, Bun, Browser)

### What is NOT a Breaking Change
- Internal implementation changes that don't affect the public API
- Adding new optional parameters to functions
- Adding new methods to classes
- Adding new exported functions or classes
- Performance improvements that don't change behavior
- Bug fixes that align behavior with documentation
- Changes to undocumented behavior
- Changes to experimental or internal APIs (marked with `@internal` or `@experimental`)
- Documentation improvements
- Development dependency updates

## Minor Version Updates (New Features)

A **MINOR** version bump will occur when we add new functionality in a backwards-compatible manner:

- Adding new public methods, functions, or classes
- Adding new optional parameters to existing functions
- Adding new error recovery utilities
- Adding new statistical operations
- Adding new transformation or terminal operations
- Enhancing existing functionality without changing its signature
- Adding new type definitions or interfaces
- Deprecating existing APIs (with proper warnings)

**Promise:** Your code will continue to work without modifications when upgrading minor versions.

## Patch Version Updates (Bug Fixes)

A **PATCH** version bump will occur for backwards-compatible bug fixes:

- Fixing incorrect behavior that doesn't match documentation
- Performance optimizations that don't change behavior
- Security patches
- Documentation corrections
- Type definition fixes that don't break existing code
- Correcting edge cases
- Memory leak fixes

**Promise:** Your code will continue to work without modifications when upgrading patch versions.

## Pre-1.0 Versioning

**Current Status:** IterFlow is currently in pre-1.0 development (0.x.x versions).

During the pre-1.0 phase:
- **0.x.0** releases may include breaking changes
- **0.0.x** releases are for patches and minor additions
- We will document all breaking changes in CHANGELOG.md
- We will provide migration guides for significant API changes

**Note:** Once we release v1.0.0, we will strictly adhere to SemVer for all future releases.

## API Stability Guarantees

### From v1.0.0 onwards:

1. **No Breaking Changes in Minor/Patch Releases**
   - Your code will not break when upgrading within the same major version
   - All changes will be additive or fix bugs

2. **Deprecation Before Removal**
   - APIs will be marked as deprecated at least one MAJOR version before removal
   - Deprecation warnings will be emitted when using deprecated APIs
   - Migration paths will be provided in documentation

3. **Clear Communication**
   - All breaking changes will be documented in CHANGELOG.md
   - Migration guides will be provided for major version upgrades
   - Deprecation notices will include version information and alternatives

4. **Type Safety**
   - TypeScript types are considered part of the public API
   - Type changes that break compilation are breaking changes

## Deprecation Policy

When we need to remove or change an API:

1. **Deprecation Warning** (Current Major Version)
   - API is marked as `@deprecated` in TypeScript
   - Runtime warnings are emitted when the API is used
   - Documentation shows the deprecation notice with alternatives
   - The API continues to work normally

2. **Breaking Change** (Next Major Version)
   - The deprecated API may be removed or changed
   - Migration guide is provided in the release notes
   - CHANGELOG clearly documents the removal

### Example Timeline:
```
v1.5.0: Feature X is deprecated, use Feature Y instead
v1.6.0: Feature X still works but shows deprecation warnings
v1.7.0: Feature X still works but shows deprecation warnings
v2.0.0: Feature X is removed, Feature Y is the only way
```

## Dependency Version Policy

### Runtime Dependencies
- We aim to minimize runtime dependencies
- Any new runtime dependency requires careful consideration
- Removing a runtime dependency is considered a **minor** change
- Upgrading a runtime dependency to a new major version may be a **major** change if it affects our API

### Peer Dependencies
- Minimum Node.js version will only increase in **major** releases
- TypeScript version requirements follow the same policy
- We test against all supported Node.js LTS versions

### Development Dependencies
- Development dependencies (testing, building, etc.) can be updated freely
- These changes do not affect our version number

## Experimental Features

APIs marked as `@experimental` or `@beta`:
- May change without a major version bump
- May be removed without following the deprecation policy
- Will be clearly documented as experimental
- Should not be used in production code without understanding the risks

Once an experimental API is stabilized, it follows normal SemVer guarantees.

## Long-Term Support (LTS)

### Major Version Support
- Each major version will be supported for at least 18 months after the next major version is released
- LTS support includes:
  - Critical security fixes
  - Critical bug fixes
  - No new features
  - No breaking changes

### Example Support Timeline:
```
v1.0.0 released: 2025-06-01
v2.0.0 released: 2026-06-01
v1.x.x supported until: 2027-12-01 (18 months of LTS)
```

## Version Upgrade Guidance

### Patch Upgrades (1.0.0 → 1.0.1)
- **Safe to upgrade immediately**
- No code changes required
- Only bug fixes and security patches

### Minor Upgrades (1.0.0 → 1.1.0)
- **Safe to upgrade**
- No breaking changes
- Review release notes for new features you can benefit from
- Check for deprecation warnings in your code

### Major Upgrades (1.0.0 → 2.0.0)
- **Review migration guide**
- Read CHANGELOG.md for all breaking changes
- Update your code based on the migration guide
- Test thoroughly before deploying
- Consider staying on LTS version if immediate upgrade is not needed

## Commitment to Stability

IterFlow is committed to:

1. **Predictability** - You can confidently upgrade knowing what to expect
2. **Stability** - Your production code won't break from minor/patch updates
3. **Clear Communication** - All changes are documented and explained
4. **Migration Support** - We provide clear paths when breaking changes are necessary
5. **Backward Compatibility** - We preserve compatibility whenever possible

## Questions or Concerns?

If you have questions about our versioning policy or believe a release doesn't follow these guidelines:

- Open an issue on [GitHub Issues](https://github.com/gv-sh/iterflow/issues)
- Tag it with `versioning` label
- We will respond and clarify or correct as needed

---

**Last Updated:** 2025-11-20
**Applies From:** v1.0.0 onwards (with notes for pre-1.0)

This is a living document and may be updated to clarify our policies, but the core SemVer commitment remains unchanged.
