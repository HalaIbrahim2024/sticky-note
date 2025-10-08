# Git Push

Push local commits to remote repository.

## Instructions

Follow these steps:

1. **Check current branch**: Run `git branch --show-current` to see current branch
2. **Check status**: Run `git status` to verify there are commits to push
3. **Gather push details**: Ask the user for:
   - Branch name to push to (default: current branch)
   - Remote name (default: origin)
   - Force push? (yes/no) - **WARNING: Use with extreme caution**
4. **Push commits**: Execute appropriate git push command
5. **Confirm push**: Display success message with branch and remote info

## Example commands

```bash
# Push current branch to remote
git push

# Push to specific branch (first time)
git push -u origin branch-name

# Push to specific branch (subsequent times)
git push origin branch-name

# Push all branches
git push --all

# Push tags
git push --tags

# Force push (DANGEROUS - use with caution)
git push --force origin branch-name

# Force push with lease (safer alternative)
git push --force-with-lease origin branch-name

# Check current branch before pushing
git branch --show-current

# Check status before pushing
git status
```

## Important notes

- **First push**: Use `-u` (or `--set-upstream`) to set up tracking
- **Force push**: Only use when absolutely necessary and you understand the consequences
- **Force with lease**: Safer than force push, fails if remote has changes you don't have
- **Never force push to main/master**: Can cause problems for other developers

Always verify you're on the correct branch before pushing.