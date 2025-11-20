# Pull Request

<!--
Thank you for contributing to iterflow! Please fill out this template to help us review your PR efficiently.
-->

## Description

**Brief summary of what this PR does:**

<!-- Provide a clear, concise description of the changes -->

**Motivation and context:**

<!-- Why is this change needed? What problem does it solve? -->

## Type of Change

<!-- Check all that apply -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Dependency update
- [ ] CI/CD changes
- [ ] Test improvements

## Related Issues

<!-- Link related issues using keywords: Closes #123, Fixes #456, Relates to #789 -->

Closes #
Relates to #

## Changes Made

<!-- Provide a detailed list of changes -->

### Core Changes
-
-
-

### API Changes
<!-- If applicable, describe any API additions, modifications, or removals -->
-

### Internal Changes
<!-- Implementation details, refactoring, optimizations -->
-

## Breaking Changes

<!-- If this PR introduces breaking changes, document them here -->

**Does this PR include breaking changes?**

- [ ] Yes
- [ ] No

**If yes, describe what breaks:**

- **What functionality is affected:**
- **What will break for users:**
- **Required migration steps:**

**Suggested version bump:** [e.g. major, minor, patch]

## Testing

### Test Coverage

- [ ] All existing tests pass (`npm test`)
- [ ] New tests added for new functionality
- [ ] Test coverage maintained or improved (target: 90%+)
- [ ] Edge cases tested (empty iterators, null/undefined, large datasets)
- [ ] Type tests added (if applicable)

### Manual Testing

- [ ] Manual testing completed
- [ ] Tested in different Node.js versions (if applicable)
- [ ] Tested in browser environment (if applicable)
- [ ] Tested with TypeScript (if applicable)

**Testing steps performed:**

1.
2.
3.

**Test results:**

```
<!-- Paste relevant test output -->
```

## Code Quality

### Code Standards

- [ ] Code follows the project's style guidelines (ESLint passes)
- [ ] Code is properly formatted (Prettier)
- [ ] Self-review completed
- [ ] Code is well-commented, particularly in hard-to-understand areas
- [ ] No commented-out code or debug statements
- [ ] No console.log or debugging code left in

### TypeScript

- [ ] TypeScript types are properly defined
- [ ] No use of `any` in public APIs
- [ ] Generic types are properly constrained
- [ ] Type inference works as expected
- [ ] JSDoc comments include type information
- [ ] Exported types for public APIs

### Best Practices

- [ ] Functions are small and focused
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Descriptive variable and function names
- [ ] Error handling implemented where needed
- [ ] No performance regressions introduced

## Documentation

### Code Documentation

- [ ] JSDoc comments added to all public methods/functions
- [ ] Parameter descriptions are clear and accurate
- [ ] Return types are documented
- [ ] Usage examples included in JSDoc
- [ ] Caveats and edge cases documented

### Project Documentation

- [ ] README.md updated (if applicable)
- [ ] API reference updated (if applicable)
- [ ] Examples added for new features
- [ ] Guides/tutorials updated (if applicable)
- [ ] Migration guide provided (for breaking changes)
- [ ] CHANGELOG.md will be updated by maintainers

## Performance Impact

**Does this PR affect performance?**

- [ ] No performance impact
- [ ] Performance improved
- [ ] Performance impact acceptable for the feature
- [ ] Performance benchmarks included

**If performance is affected, provide details:**

<!-- Describe the performance implications -->

**Benchmark results (if applicable):**

```
<!-- Paste benchmark results -->
Before: ...
After:  ...
```

## Browser/Runtime Compatibility

<!-- Check all that have been tested -->

- [ ] Node.js
- [ ] Browser (specify: ____________)
- [ ] Deno
- [ ] Bun
- [ ] Not applicable

**Compatibility notes:**

<!-- Any compatibility concerns or considerations -->

## Dependencies

**Does this PR add, update, or remove dependencies?**

- [ ] Yes
- [ ] No

**If yes, list changes and justify:**

<!-- List dependency changes and explain why they're needed -->

## Security Considerations

- [ ] No security implications
- [ ] Security implications reviewed and addressed

**If there are security implications, describe them:**

<!-- Describe any security considerations -->

## Screenshots/Videos (if applicable)

<!-- For visual changes, include screenshots or videos -->

## Checklist

<!-- Ensure all items are checked before submitting -->

- [ ] I have read the [CONTRIBUTING](../../CONTRIBUTING.md) guidelines
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
- [ ] I have checked my code and corrected any misspellings
- [ ] I have updated the relevant documentation
- [ ] I have tested on multiple environments (if applicable)

## Reviewer Notes

<!-- Any specific areas you'd like reviewers to focus on? -->

**Areas needing special attention:**

-

**Questions for reviewers:**

-

## Additional Context

<!-- Any additional information that reviewers should know -->

---

**Thank you for your contribution!** The maintainers will review your PR and provide feedback.