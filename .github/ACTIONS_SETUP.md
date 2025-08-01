# GitHub Actions Setup Guide

This document explains how to set up the automated CI/CD pipeline for the n8n-nodes-kraken project.

## 🔧 Required Secrets

To enable automatic npm publishing, you need to add the following secret to your GitHub repository:

### NPM_TOKEN
1. Go to [npmjs.com](https://www.npmjs.com) and log in to your account
2. Click on your profile → "Access Tokens"
3. Click "Generate New Token" → "Automation"
4. Copy the generated token
5. In your GitHub repository, go to Settings → Secrets and variables → Actions
6. Click "New repository secret"
7. Name: `NPM_TOKEN`
8. Value: Paste your npm token
9. Click "Add secret"

## 🚀 Workflows Overview

### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)
**Triggers:**
- Push to master/main branch
- Pull requests to master/main branch
- Published releases

**What it does:**
- Tests code on Node.js 20.x and 22.x
- Runs linting and formatting checks
- Builds the project
- Runs comprehensive test suite
- Performs security audit
- Publishes to npm on releases
- Comments on PRs with test results

### 2. Release Management (`.github/workflows/release.yml`)
**Triggers:**
- Manual workflow dispatch
- Push to version tags (v*)

**What it does:**
- Creates new releases with version bumping
- Generates changelog
- Validates package versions
- Creates GitHub releases

### 3. Dependency Management (`.github/workflows/dependencies.yml`)
**Triggers:**
- Weekly schedule (Mondays at 9 AM UTC)
- Manual workflow dispatch
- Changes to package.json/package-lock.json

**What it does:**
- Checks for security vulnerabilities
- Updates patch versions automatically
- Creates PRs for dependency updates
- Tests Node.js compatibility across versions

## 📋 Available npm Scripts

```bash
# Building
npm run build          # Build the project
npm run dev           # Watch mode for development

# Testing
npm run test          # Run all tests
npm run test:api      # Run basic API tests
npm run test:enhanced # Run enhanced asset pairs tests
npm run test:comprehensive # Run comprehensive test suite
npm run test:ci       # Run full CI pipeline locally

# Code Quality
npm run lint          # Run ESLint
npm run lintfix       # Fix ESLint errors
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without fixing
```

## 🎯 How to Use

### For Pull Requests
1. Create a branch and make your changes
2. Push to GitHub
3. Create a pull request
4. The CI pipeline will automatically:
   - Run all tests
   - Check code quality
   - Post results as a comment

### For Releases
#### Automatic Release (Recommended)
1. Go to Actions → "Release Management"
2. Click "Run workflow"
3. Select release type (patch/minor/major)
4. Enter version or let it auto-increment
5. The workflow will:
   - Run full test suite
   - Update package.json version
   - Create git tag
   - Create GitHub release
   - Trigger npm publishing

#### Manual Release
1. Update version in package.json
2. Create and push a git tag: `git tag v1.2.0 && git push origin v1.2.0`
3. Create a GitHub release from the tag
4. The CI pipeline will automatically publish to npm

### For Development
```bash
# Local testing before push
npm run test:ci

# Watch mode during development
npm run dev

# Fix code style issues
npm run lintfix
npm run format
```

## 🔍 Monitoring

### Build Status
- Check the "Actions" tab in your GitHub repository
- Green checkmarks indicate successful builds
- Red X marks indicate failures

### npm Publishing
- Published packages appear at: https://www.npmjs.com/package/n8n-nodes-kraken
- Check the "Packages" section in your GitHub repository

### Security
- Weekly dependency scans report vulnerabilities
- Failed security checks prevent publishing
- Dependabot creates PRs for security updates

## 🛠️ Troubleshooting

### Publishing Fails
- Check that `NPM_TOKEN` secret is set correctly
- Verify you have publishing rights to the npm package
- Ensure version in package.json is higher than published version

### Tests Fail
- Check the test output in the Actions tab
- Run tests locally: `npm run test`
- Ensure Kraken API is accessible (tests use public endpoints)

### Build Fails
- Check TypeScript compilation errors
- Verify all dependencies are installed
- Run locally: `npm run build`

## 📈 Best Practices

1. **Always create PRs** - Don't push directly to master
2. **Let CI run** - Wait for green checks before merging
3. **Use semantic versioning** - patch.minor.major
4. **Test locally first** - Run `npm run test:ci` before pushing
5. **Keep dependencies updated** - Review dependency PRs weekly

## 🎉 Benefits

- ✅ **Automated testing** on every PR and push
- ✅ **Automatic npm publishing** on releases
- ✅ **Security monitoring** with dependency scanning
- ✅ **Code quality enforcement** with linting and formatting
- ✅ **Multi-version testing** across Node.js versions
- ✅ **Automated dependency updates** with testing
- ✅ **Release management** with changelog generation
