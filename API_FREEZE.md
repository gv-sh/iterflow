# API Freeze Policy

## Overview

This document outlines IterFlow's API freeze policy for the path to v1.0.0 and beyond. An API freeze ensures stability and predictability for users of the library.

## Current Status

**Status:** 🟡 **Pre-Freeze** (v0.x.x - API subject to change)

Once we reach **API Freeze** status (target: pre-1.0 release candidate), the public API will be locked and no breaking changes will be introduced until v2.0.0.

---

## What is an API Freeze?

An **API freeze** means that the public API surface is considered stable and complete:

- ✅ **No breaking changes** to existing public APIs
- ✅ **No removal** of public methods, functions, or classes
- ✅ **No signature changes** to existing public APIs
- ✅ **Bug fixes and patches** are allowed (that don't change behavior)
- ✅ **New features** can be added (additive only)
- ✅ **Deprecations** can be introduced (with proper warnings)
- ✅ **Internal implementation** changes are allowed
- ✅ **Performance improvements** are allowed
- ✅ **Documentation improvements** are allowed

An API freeze provides **stability guarantees** for production users.

---

## Timeline to v1.0.0

### Phase 1: Pre-Freeze (v0.1.x - v0.9.x) - **CURRENT**

**Status:** Active Development

**Allowed Changes:**
- ❌ Breaking changes (with proper documentation)
- ✅ New features
- ✅ API refinements
- ✅ Bug fixes
- ✅ Documentation updates

**What Users Should Expect:**
- APIs may change between minor versions
- Some breakage may occur (documented in CHANGELOG)
- Migration guides provided for significant changes
- Feedback strongly encouraged

**Current Version:** v0.1.7

### Phase 2: Feature Freeze (v0.9.x)

**Status:** Not Started (Target: Q1 2025)

**Goals:**
- Complete all planned features for v1.0
- Finalize API surface
- No new features (only refinements)

**Allowed Changes:**
- ⚠️ Breaking changes (only if critical, with strong justification)
- ❌ New features (feature complete)
- ✅ API refinements based on feedback
- ✅ Bug fixes
- ✅ Documentation polish
- ✅ Performance optimizations

**Duration:** 1-2 months

### Phase 3: API Freeze / Release Candidate (v1.0.0-rc.x)

**Status:** Not Started (Target: Q2 2025)

**Goals:**
- Lock the public API
- Final testing and validation
- Production readiness verification

**Allowed Changes:**
- ❌ Breaking changes (API is frozen)
- ❌ New features
- ✅ Bug fixes
- ✅ Documentation improvements
- ✅ Performance optimizations
- ✅ Security fixes

**Duration:** 1 month minimum

**Exit Criteria:**
- No critical bugs
- All tests passing
- Documentation complete
- Beta testing successful
- Performance benchmarks meet targets

### Phase 4: v1.0.0 Release

**Status:** Not Started (Target: Q2 2025)

**Milestone:** Stable release with full API stability guarantees

**Commitment:**
- ✅ Semantic versioning strictly followed
- ✅ No breaking changes until v2.0.0
- ✅ 18-month LTS support minimum
- ✅ Deprecation policy enforced
- ✅ Security updates
- ✅ Critical bug fixes

---

## Public API Surface

### What is Considered "Public API"?

The public API includes:

1. **Exported Classes and Functions**
   - `iter()` and all its static methods
   - `IterFlow` class and all its methods
   - `AsyncIterflow` class and all its methods
   - All exported utility functions

2. **Type Definitions**
   - All exported TypeScript types and interfaces
   - Generic type parameters
   - Return types of public methods

3. **Function Signatures**
   - Parameter types and order
   - Optional vs required parameters
   - Return types

4. **Behavior and Semantics**
   - Documented behavior of all operations
   - Error handling behavior
   - Performance characteristics (big-O complexity where documented)

### What is NOT Public API?

The following are considered internal and may change:

1. **Internal Implementation**
   - Private methods (prefixed with `_` or marked `@internal`)
   - Internal helper functions
   - Code organization and file structure

2. **Undocumented Behavior**
   - Side effects not mentioned in documentation
   - Specific error messages (error types are public, messages are not)
   - Internal data structures

3. **Experimental Features**
   - APIs marked with `@experimental`
   - APIs in `experimental/` namespace
   - Features explicitly documented as unstable

4. **Development Dependencies**
   - Testing infrastructure
   - Build tools
   - Development scripts

---

## Breaking Changes Policy

### Before v1.0.0 (Current Phase)

**Allowed:** Yes, with documentation

When we make breaking changes:
1. ✅ Document in CHANGELOG.md
2. ✅ Bump minor version (0.x.0)
3. ✅ Provide migration guidance
4. ✅ Explain rationale

**Example:**
```
v0.1.0 → v0.2.0: Changed method signature
v0.2.0 → v0.3.0: Renamed function
```

### After v1.0.0 Release

**Allowed:** Only in major versions (v2.0.0, v3.0.0, etc.)

Breaking changes require:
1. ✅ Deprecation in v1.x.0 (with warnings)
2. ✅ At least 6 months notice
3. ✅ Migration guide
4. ✅ Codemods (if possible)
5. ✅ Breaking change in v2.0.0

**Example Timeline:**
```
v1.5.0: Deprecate feature X (warnings emitted)
v1.6.0: Feature X still works (warnings continue)
v1.7.0: Feature X still works (warnings continue)
v2.0.0: Feature X removed (breaking change)
```

---

## Feature Additions Policy

### During API Freeze (v1.0.0-rc.x)

**Allowed:** No new features

**Rationale:** Focus on stability and testing

### After v1.0.0 Release

**Allowed:** Yes, in minor versions

New features can be added in v1.x.0 releases:
- ✅ New methods on existing classes (additive)
- ✅ New exported functions
- ✅ New optional parameters
- ✅ New utility classes
- ✅ New types and interfaces

**Requirements:**
- Must be backwards-compatible
- Must not change existing behavior
- Must include tests
- Must include documentation

---

## Deprecation Policy

### How We Deprecate APIs

When an API needs to be replaced:

1. **Mark as Deprecated** (v1.x.0)
   ```typescript
   /**
    * @deprecated Since v1.5.0. Use newMethod() instead. Will be removed in v2.0.0.
    */
   oldMethod() {
     deprecate({
       feature: 'oldMethod',
       since: '1.5.0',
       removeIn: '2.0.0',
       alternative: 'newMethod',
     });
     // ... implementation continues to work
   }
   ```

2. **Emit Runtime Warnings**
   ```
   [iterflow] DEPRECATED: oldMethod() has been deprecated since v1.5.0
   and will be removed in v2.0.0
   Please use newMethod() instead.
   ```

3. **Document in CHANGELOG**
   ```markdown
   ### Deprecated
   - `oldMethod()` - Use `newMethod()` instead (will be removed in v2.0.0)
   ```

4. **Provide Migration Path**
   - Update documentation
   - Provide examples
   - Create migration guide
   - Offer codemods if possible

5. **Remove in Next Major** (v2.0.0)
   - API is removed completely
   - Users have had ample time to migrate

### Minimum Deprecation Period

- **Minimum:** 6 months
- **Typical:** 1 major version cycle
- **Preferred:** Multiple major versions for critical APIs

---

## Experimental Features

### Purpose

Experimental features allow us to:
- Test new ideas with real users
- Gather feedback before stabilization
- Iterate quickly without breaking stability promises

### Rules for Experimental APIs

1. **Clearly Marked**
   ```typescript
   /**
    * @experimental This API is experimental and may change without notice
    */
   export function experimentalFeature() { }
   ```

2. **Separate Namespace** (when possible)
   ```typescript
   import { experimental } from 'iterflow';
   experimental.newFeature();
   ```

3. **No Stability Guarantees**
   - May change between any version (major, minor, patch)
   - May be removed without deprecation period
   - May be renamed or redesigned

4. **Opt-in Usage**
   - Users must explicitly choose to use experimental features
   - Documentation clearly states experimental status

5. **Graduation Path**
   - Experimental → Beta → Stable
   - Each stage has increasing stability guarantees

---

## Exceptions and Emergency Changes

### Security Vulnerabilities

Security fixes may introduce breaking changes:
- Published as patch version (v1.0.x)
- Breaking change is acceptable if it fixes a security issue
- Documented in security advisory
- Migration path provided

### Critical Bugs

Critical bugs that make the library unusable:
- Fixed in patch version (v1.0.x)
- Behavior change is acceptable if it aligns with documentation
- Explained in CHANGELOG
- May be considered breaking if it changes relied-upon behavior

### Process for Emergency Changes

1. Assess impact and severity
2. Discuss with maintainers
3. Document the change thoroughly
4. Provide migration guidance
5. Consider backporting to LTS versions

---

## Monitoring and Enforcement

### How We Ensure Compliance

1. **Automated Checks**
   - API surface testing
   - Type compatibility testing
   - Regression testing

2. **Review Process**
   - All PRs reviewed for API changes
   - Breaking changes require explicit approval
   - Deprecations require documentation

3. **Documentation**
   - All changes documented in CHANGELOG
   - Migration guides for breaking changes
   - API documentation kept up-to-date

4. **Communication**
   - Release notes for all versions
   - Deprecation warnings in code
   - GitHub discussions for major changes

---

## Feedback and Questions

We welcome feedback on our API freeze policy:

- **Questions:** Open a [Discussion](https://github.com/gv-sh/iterflow/discussions)
- **Concerns:** File an [Issue](https://github.com/gv-sh/iterflow/issues)
- **Suggestions:** Start a conversation in [Discussions](https://github.com/gv-sh/iterflow/discussions)

Your input helps us create a stable, predictable library that meets your needs.

---

## Related Documents

- [SEMANTIC_VERSIONING.md](./SEMANTIC_VERSIONING.md) - Our semantic versioning commitment
- [CHANGELOG.md](./CHANGELOG.md) - Detailed change history
- [ROADMAP.md](./ROADMAP.md) - Feature roadmap and timeline
- [Migration Guide Template](./docs/guides/migration-template.md) - Template for future migrations

---

**Status:** 🟡 Pre-Freeze (v0.x.x)
**Target API Freeze:** Q2 2025 (v1.0.0-rc.1)
**Target v1.0.0 Release:** Q2 2025

**Last Updated:** 2025-11-20

This policy is effective immediately and will be strictly enforced once we enter the API Freeze phase (v1.0.0-rc.x).
