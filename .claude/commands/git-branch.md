# Git Branch

Create new branches or switch between existing branches.

## Instructions

Follow these steps:

1. **Determine action**: Ask the user what they want to do:
   - Create and switch to new branch
   - Switch to existing branch
   - List all branches
2. **For new branch**:
   - Ask for branch name
   - Run `git checkout -b <branch-name>` to create and switch
   - Confirm creation
3. **For switching branch**:
   - Run `git branch` to show available branches
   - Ask for branch name to switch to
   - Check for uncommitted changes with `git status`
   - Run `git checkout <branch-name>` to switch
   - Confirm switch
4. **Display current branch**: Run `git branch --show-current`

## Example commands

```bash
# List all local branches
git branch

# List all branches (including remote)
git branch -a

# Show current branch
git branch --show-current

# Create new branch and switch to it
git checkout -b new-branch-name

# Create new branch from specific commit/branch
git checkout -b new-branch-name main

# Switch to existing branch
git checkout branch-name

# Switch to previous branch
git checkout -

# Delete local branch
git branch -d branch-name

# Force delete local branch
git branch -D branch-name

# Check status before switching
git status
```

## Important notes

- **Uncommitted changes**: Switching branches with uncommitted changes may fail or carry changes over
- **Branch naming**: Use descriptive names (e.g., `feature/login`, `fix/auth-bug`)
- **Creating from specific branch**: Make sure you're on the right base branch or specify it
- **Deleting branches**: Use `-d` for safe delete (merged only), `-D` to force delete

Always check `git status` before switching branches to avoid losing work.
