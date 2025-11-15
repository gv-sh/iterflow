# npm Trusted Publishing Setup

This document provides the one-time setup steps required to enable secure, token-free publishing for the IterFlow package.

## Setup Steps on npmjs.org

### 1. Access Publishing Settings
1. Go to https://www.npmjs.com/package/iterflow/access
2. Make sure you're logged in with publish permissions for the iterflow package

### 2. Configure Trusted Publisher
1. Click on the **"Publishing access"** tab
2. Click **"Add a trusted publisher"**
3. Select **"GitHub Actions"** as the publisher type

### 3. Fill in Configuration Details
```
Repository: gv-sh/iterflow
Workflow filename: ci.yml
Job: publish
```

### 4. Save Configuration
Click **"Add trusted publisher"** to save the configuration.

## What This Enables

- **Secure Publishing**: No npm tokens stored in GitHub secrets
- **OIDC Authentication**: Uses OpenID Connect for secure authentication
- **Provenance Generation**: Cryptographic proof of package authenticity
- **Automatic Publishing**: Publishes when version in package.json changes on main branch

## How It Works

1. When you push to main branch with a new version in package.json
2. GitHub Actions runs the CI workflow
3. The `publish` job authenticates to npm using OIDC
4. Package is published with provenance if version differs from npm

## Verification

After setup, you can verify by:

1. Update package.json version
2. Push to main branch
3. Check GitHub Actions logs for successful publish
4. Verify package on https://www.npmjs.com/package/iterflow

## Security Benefits

- **No stored secrets**: Eliminates risk of token compromise
- **Short-lived authentication**: OIDC tokens are temporary
- **Provenance tracking**: Cryptographic attestation of build process
- **Audit trail**: Clear link between GitHub commits and published packages