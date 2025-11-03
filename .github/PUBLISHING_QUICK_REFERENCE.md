# Publishing Quick Reference

## Most Common Commands

```bash
# 🚀 Full Release (Build + Version + Publish)
yarn release              # Interactive - asks for version type
yarn release:patch        # 1.6.1 → 1.6.2 (bug fixes)
yarn release:minor        # 1.6.1 → 1.7.0 (new features)
yarn release:major        # 1.6.1 → 2.0.0 (breaking changes)
```

## Prerequisites Checklist

```bash
✓ npm whoami                    # Check you're logged in
✓ git status                    # Working directory is clean
✓ git branch --show-current     # On main/master
✓ yarn test                     # All tests pass
✓ yarn build                    # Build succeeds
```

## Two-Step Process (Advanced)

```bash
# Step 1: Version only (updates version, creates tag, pushes)
yarn version:patch

# Step 2: Publish to npm
yarn publish:npm
```

## Pre-release / Beta

```bash
# Create beta version (1.6.1 → 1.6.2-beta.0)
lerna version prerelease --preid beta --no-private

# Publish with 'next' tag
yarn publish:next
```

## Commit Message Format

```bash
# Patch (1.6.1 → 1.6.2)
git commit -m "fix: description"

# Minor (1.6.1 → 1.7.0)
git commit -m "feat: description"

# Major (1.6.1 → 2.0.0)
git commit -m "feat: description

BREAKING CHANGE: explain what breaks"
```

## After Publishing

```bash
# Verify published version
npm view @mirrorstate/nestjs-trpc version

# View all versions
npm view @mirrorstate/nestjs-trpc versions

# Check what was published
npm view @mirrorstate/nestjs-trpc
```

## Emergency: Wrong Version Published

```bash
# Deprecate (within 72 hours)
npm deprecate @mirrorstate/nestjs-trpc@1.6.2 "Use 1.6.3 instead"

# Publish correct version
yarn version:patch
yarn publish:npm
```

## Current Status

- **Package**: `@mirrorstate/nestjs-trpc`
- **Current Version**: `1.6.1`
- **Next Version**: `1.6.2` (patch)
- **Registry**: https://registry.npmjs.org/

---

**Need more details?** See [PUBLISHING.md](../PUBLISHING.md)