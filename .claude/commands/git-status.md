# Git Status

Check the current status of the git repository.

## Instructions

Follow these steps:

1. **Run git status**: Execute `git status` to see:
   - Current branch
   - Staged changes
      - Unstaged changes
   - Untracked files
   - Branch sync status with remote
2. **Display results**: Show the user the current state of their working directory

## Example commands

```bash
# Basic status
git status

# Short format (concise output)
git status -s

# Show branch tracking information
git status -sb
```

## What the output shows

- **On branch <name>**: Current branch you're on
- **Changes to be committed**: Staged files ready for commit
- **Changes not staged for commit**: Modified files not yet staged
- **Untracked files**: New files not tracked by git
- **Your branch is ahead/behind**: Sync status with remote branch

Always run `git status` before committing to verify what will be included in the commit.