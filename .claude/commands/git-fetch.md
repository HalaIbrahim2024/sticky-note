# Git Fetch

Fetch updates from remote repository without merging.

## Instructions

Follow these steps:

1. **Run git fetch**: Execute `git fetch` to download remote changes
2. **Specify remote (optional)**: Ask user if they want to fetch from specific remote (default: origin)
3. **Show fetched changes**: Run `git status` or `git log` to show what was fetched
4. **Inform user**: Explain that fetch downloads changes but doesn't merge them

## Example commands

```bash
# Fetch from default remote (origin)
git fetch

# Fetch from specific remote
git fetch origin

# Fetch all remotes
git fetch --all

# Fetch and prune deleted remote branches
git fetch --prune

# Fetch specific branch
git fetch origin main

# Check what was fetched
git status
git log HEAD..origin/main
```

## Understanding fetch vs pull

- **fetch**: Downloads changes but doesn't merge them (safe)
- **pull**: Downloads and merges changes (fetch + merge)

Use fetch when you want to see remote changes before merging them into your local branch.