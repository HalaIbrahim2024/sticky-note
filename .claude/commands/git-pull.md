# Git Pull

Pull and merge changes from remote repository.

## Instructions

Follow these steps:

1. **Check current branch**: Run `git branch --show-current` to see current branch
2. **Check status**: Run `git status` to verify working directory is clean
3. **Gather pull details**: Ask the user for:
   - Remote name (default: origin)
   - Branch name (default: current branch)
   - Rebase instead of merge? (optional)
4. **Pull changes**: Execute appropriate git pull command
5. **Handle conflicts**: If merge conflicts occur, inform user and show conflicted files
6. **Confirm pull**: Display success message or conflict resolution instructions

## Example commands

```bash
# Pull from current branch's remote tracking branch
git pull

# Pull from specific remote and branch
git pull origin main

# Pull with rebase (cleaner history)
git pull --rebase

# Pull with rebase from specific branch
git pull --rebase origin main

# Check current branch before pulling
git branch --show-current

# Check status before pulling
git status

# If conflicts occur, check conflicted files
git status

# After resolving conflicts (merge)
git add .
git commit

# After resolving conflicts (rebase)
git add .
git rebase --continue

# Abort merge if needed
git merge --abort

# Abort rebase if needed
git rebase --abort
```

## Understanding pull

- **pull = fetch + merge**: Downloads and merges changes in one command
- **pull --rebase**: Downloads and rebases your commits on top of remote changes
- **Conflicts**: May occur if you and remote have changes to same files

## Important notes

- **Clean working directory**: Commit or stash changes before pulling
- **Rebase vs merge**: Rebase creates cleaner history, merge preserves exact history
- **Conflicts**: Must be resolved before continuing
- **Never pull with uncommitted changes**: May cause conflicts or loss of work

Always ensure your working directory is clean before pulling.
