# Publishing Guide for @mirrorstate/nestjs-trpc

This guide explains how to publish new versions of the `@mirrorstate/nestjs-trpc` package using Lerna.

## Prerequisites

1. **NPM Account**: You must have an npm account with publish access to `@mirrorstate/nestjs-trpc`
2. **NPM Authentication**: Login to npm in your terminal:
   ```bash
   npm login
   ```
3. **Git Clean State**: Ensure your working directory is clean (all changes committed)
4. **Main Branch**: Be on the `main` or `master` branch
5. **Latest Code**: Pull the latest changes from remote

## Current Version

The package is currently at version **1.6.1** and will be bumped to **1.6.2** on the next release.

## Quick Publishing Commands

### Option 1: Interactive Release (Recommended for First Time)

This will prompt you to select the version bump type:

```bash
# Build, version, and publish in one command
yarn release
```

Lerna will:
1. Show you what will be published
2. Ask you to select version bump (patch/minor/major)
3. Generate changelog based on conventional commits
4. Create a git tag
5. Push to git
6. Publish to npm

### Option 2: Specific Version Bumps

For automated releases or when you know the version type:

```bash
# Patch release (1.6.1 -> 1.6.2) - for bug fixes
yarn release:patch

# Minor release (1.6.1 -> 1.7.0) - for new features
yarn release:minor

# Major release (1.6.1 -> 2.0.0) - for breaking changes
yarn release:major
```

## Two-Step Publishing Process

If you want more control, you can separate versioning and publishing:

### Step 1: Version Only (No Publish)

```bash
# Interactive - prompts for version type
yarn version

# Or specific version bumps
yarn version:patch  # 1.6.1 -> 1.6.2
yarn version:minor  # 1.6.1 -> 1.7.0
yarn version:major  # 1.6.1 -> 2.0.0
```

This will:
- Update version in `packages/nestjs-trpc/package.json`
- Generate changelog
- Create git commit
- Create git tag
- Push to remote

### Step 2: Publish to NPM

```bash
# Publish the versioned package
yarn publish:npm

# Or publish with 'next' tag (for beta/rc releases)
yarn publish:next
```

## Publishing Pre-releases

For beta or release candidate versions:

```bash
# Create a pre-release version
lerna version prerelease --preid beta --no-private

# Publish with 'next' tag
yarn publish:next
```

Examples:
- `1.6.1` -> `1.6.2-beta.0`
- `1.6.2-beta.0` -> `1.6.2-beta.1`

## Conventional Commits

Lerna uses conventional commits to automatically determine version bumps and generate changelogs.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types and Version Bumps

- `fix:` - Patch release (1.6.1 -> 1.6.2)
- `feat:` - Minor release (1.6.1 -> 1.7.0)
- `BREAKING CHANGE:` in footer - Major release (1.6.1 -> 2.0.0)
- `chore:`, `docs:`, `style:`, `refactor:`, `test:` - No version bump

### Examples

**Patch Release (Bug Fix):**
```bash
git commit -m "fix: resolve subscription cleanup issue"
```

**Minor Release (New Feature):**
```bash
git commit -m "feat: add @Subscription decorator for tRPC v11"
```

**Major Release (Breaking Change):**
```bash
git commit -m "feat: upgrade to tRPC v11

BREAKING CHANGE: Requires @trpc/server ^11.0.0
```

## What Gets Published

Only the `@mirrorstate/nestjs-trpc` package in `packages/nestjs-trpc` will be published. The following are excluded:

- ✅ `packages/nestjs-trpc` - **PUBLISHED**
- ❌ `examples/*` - Excluded (marked as private)
- ❌ `docs` - Excluded (marked as private)
- ❌ Root workspace - Excluded (marked as private)

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass: `yarn test`
- [ ] Build succeeds: `yarn build`
- [ ] Linting passes: `yarn lint`
- [ ] All changes are committed
- [ ] You're on the `main` or `master` branch
- [ ] You've pulled the latest changes
- [ ] Version number is correct
- [ ] Changelog looks correct
- [ ] You're logged into npm: `npm whoami`

## Complete Publishing Workflow

Here's a complete workflow from development to publishing:

```bash
# 1. Make your changes and commit with conventional commits
git add .
git commit -m "feat: add new feature"

# 2. Ensure everything works
yarn test
yarn build

# 3. Pull latest changes
git pull origin main

# 4. Release (version + publish)
yarn release:minor

# 5. Verify on npm
npm view @mirrorstate/nestjs-trpc
```

## Manual Publishing (Not Recommended)

If you need to manually publish without Lerna:

```bash
cd packages/nestjs-trpc

# Update version manually in package.json
# Then build and publish
yarn build
npm publish --access public
```

## Troubleshooting

### "Working tree has uncommitted changes"

Commit or stash all changes before publishing:
```bash
git status
git add .
git commit -m "chore: prepare for release"
```

### "You must be logged in to publish packages"

Login to npm:
```bash
npm login
```

### "You do not have permission to publish"

Ensure you have publish access to the `@mirrorstate` scope on npm.

### "Version already exists"

You're trying to publish a version that's already on npm. Bump the version:
```bash
yarn version:patch
```

### Published wrong version

You can deprecate (but not unpublish after 24h):
```bash
npm deprecate @mirrorstate/nestjs-trpc@1.6.2 "Accidentally published, use 1.6.3 instead"
```

Then publish the correct version:
```bash
yarn version:patch
yarn publish:npm
```

## Checking Published Package

After publishing, verify:

```bash
# Check latest version
npm view @mirrorstate/nestjs-trpc version

# Check all versions
npm view @mirrorstate/nestjs-trpc versions

# Check package info
npm view @mirrorstate/nestjs-trpc

# Install and test in a new project
mkdir test-install
cd test-install
npm init -y
npm install @mirrorstate/nestjs-trpc
```

## Versioning Strategy

We follow [Semantic Versioning (SemVer)](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): New features, backward compatible
- **PATCH** (0.0.X): Bug fixes, backward compatible

### When to Bump

- **Patch** (1.6.2):
  - Bug fixes
  - Documentation updates
  - Internal refactoring
  - Performance improvements (non-breaking)

- **Minor** (1.7.0):
  - New features
  - New decorators
  - New APIs (additive)
  - Deprecations (with backward compatibility)

- **Major** (2.0.0):
  - Breaking API changes
  - Removing deprecated features
  - Changing peer dependencies (breaking)
  - Incompatible changes

## Git Tags

Lerna automatically creates git tags:

```bash
# List all tags
git tag

# View tag details
git show @mirrorstate/nestjs-trpc@1.6.2

# Push tags (usually automatic)
git push --tags
```

## Next Release

The next version will be **1.6.2** (patch) unless you choose a different bump type.

To see what will be released:

```bash
# Dry run (doesn't actually publish)
lerna version --no-push --no-git-tag-version
```

## Support

- **Issues**: [GitHub Issues](https://github.com/secretyouth/nestjs-trpc/issues)
- **Documentation**: [nestjs-trpc.io](https://nestjs-trpc.io)

---

**Happy Publishing! 🚀**