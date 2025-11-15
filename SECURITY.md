# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in IterFlow, please report it privately by:

1. **Email:** Send details to hi@gvsh.cc
2. **GitHub:** Use the private vulnerability reporting feature
3. **Subject:** Include "IterFlow Security" in the subject line

### What to Include

Please provide:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes (if available)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Varies based on severity

### Security Best Practices

When using IterFlow:

- Keep dependencies up to date
- Validate inputs when processing untrusted data
- Be aware that some operations (like `toArray()`) can consume significant memory
- Consider using `take()` or similar limiting operations with infinite iterators

## Security Considerations

### Memory Usage
- Statistical operations that collect data (`median`, `variance`, etc.) will load all values into memory
- Use caution with large datasets or infinite sequences
- Consider streaming alternatives for very large data processing

### Input Validation
- IterFlow does not perform input validation beyond TypeScript type checking
- Validate untrusted input before passing to IterFlow operations
- Be cautious with user-provided functions (predicates, mappers, etc.)

### Known Limitations
- No built-in protection against infinite loops in user-provided functions
- Statistical operations on very large numbers may have precision limitations
- Memory exhaustion possible with very large datasets

## Disclosure Policy

- Security issues will be disclosed publicly after a fix is available
- Credit will be given to reporters unless anonymity is requested
- We follow responsible disclosure practices

Thank you for helping keep IterFlow secure!