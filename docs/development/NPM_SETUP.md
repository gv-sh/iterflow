# npm Token Setup

This document provides the setup steps required to enable npm publishing for the iterflow package using NPM_TOKEN authentication.

## Setup Steps

### 1. Generate npm Access Token
1. Go to https://www.npmjs.com/settings/tokens
2. Click **"Generate New Token"**
3. Select **"Granular Access Token"** (recommended) or **"Classic Token"**
4. Configure token permissions:
   - **Package**: `iterflow`
   - **Permission**: `publish` (read/write)
   - **Expiration**: Set appropriate expiration date

### 2. Add Token to GitHub Secrets
1. Go to https://github.com/gv-sh/iterflow/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `NPM_TOKEN`
4. Value: Paste the npm token generated in step 1
5. Click **"Add secret"**

## What This Enables

- **Secure Publishing**: npm token stored securely in GitHub secrets
- **Automatic Publishing**: Publishes when version in package.json changes on main branch
- **Access Control**: Token has limited scope to iterflow package only

## How It Works

1. When you push to main branch with a new version in package.json
2. GitHub Actions runs the publish workflow
3. The `publish` job uses the NPM_TOKEN secret to authenticate
4. Package is published if version differs from npm

## Verification

After setup, you can verify by:

1. Update package.json version
2. Push to main branch
3. Check GitHub Actions logs for successful publish
4. Verify package on https://www.npmjs.com/package/iterflow

## Security Considerations

- **Token rotation**: Regularly rotate npm tokens for security
- **Minimal permissions**: Use granular access tokens with publish-only permissions
- **Secure storage**: GitHub secrets are encrypted and only accessible to workflows
- **Audit trail**: All publishes are logged in GitHub Actions and npm