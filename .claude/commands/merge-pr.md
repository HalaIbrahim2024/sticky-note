# Merge Pull Request

Merge a pull request after verifying checks and status.

## Usage

```
/merge-pr <repo-name> <pull-number>
```

Example: `/merge-pr sticky-note 2`

## Instructions

Follow these steps:

1. **Parse Arguments**:
   - Extract repo name from first argument
   - Extract pull number from second argument
   - Build full repo path: `<current-user>/<repo-name>` or use provided full path

2. **Fetch PR Details**:
   ```bash
   gh pr view <pull-number> --repo <repo-name>
   ```
   - Display PR title, author, status, and description
   - Show changed files count
   - Display base and head branches
   - Show additions/deletions

3. **Check PR Status**:
   ```bash
   gh pr checks <pull-number> --repo <repo-name>
   ```
   - Verify all CI/CD checks are passing
   - Show any failing checks
   - Warn if checks are not complete

4. **Verify Mergability**:
   ```bash
   gh pr view <pull-number> --repo <repo-name> --json mergeable,mergeStateStatus
   ```
   - Check if PR is mergeable
   - Check for merge conflicts
   - Verify PR is approved (if required)
   - Ensure PR is not in draft state

5. **Display Merge Preview**:
   Show summary:
   - PR title and number
   - Author
   - Base branch (usually main/master)
   - Head branch (feature branch)
   - Files changed
   - Commits count
   - Reviewers and approvals

6. **Confirm Merge**:
   - Ask user to confirm merge operation
   - Show merge method options:
     - `merge`: Create a merge commit (default)
     - `squash`: Squash and merge
     - `rebase`: Rebase and merge

7. **Execute Merge**:
   ```bash
   gh pr merge <pull-number> --repo <repo-name> --merge
   # OR
   gh pr merge <pull-number> --repo <repo-name> --squash
   # OR
   gh pr merge <pull-number> --repo <repo-name> --rebase
   ```
   - Use `--delete-branch` flag to delete the head branch after merge
   - Use `--auto` flag for auto-merge when checks pass

8. **Post-Merge Actions**:
   - Confirm successful merge
   - Show merged commit SHA
   - Display option to delete local branch if it exists:
   ```bash
   git branch -D <branch-name>
   ```
   - Suggest pulling latest changes to main:
   ```bash
   git checkout main
   git pull origin main
   ```

9. **Generate Merge Report**:
   Create a summary showing:
   - ✅ PR merged successfully
   - 🔀 Merge method used
   - 🗑️  Branch deletion status
   - 📊 Files changed count
   - 📝 Commits merged count
   - 🔗 Link to merged PR

## Example Workflow

```bash
# User runs:
/merge-pr sticky-note 2

# Output:
# 📋 Pull Request #2
# Title: feat: Add search and filter functionality
# Author: @HalaIbrahim2024
# Status: Open
# Base: main ← Head: feature/1-add-search-filter
#
# ✓ All checks passing (3/3)
# ✓ Approved by 1 reviewer
# ✓ No merge conflicts
#
# Files changed: 1
# +107 -18 lines
# Commits: 2
#
# Ready to merge! Select merge method:
# 1. Merge commit (preserves all commits)
# 2. Squash and merge (combines into one commit)
# 3. Rebase and merge (rebases commits)
#
# [After user confirms]
# ✅ PR #2 merged successfully!
# 🔀 Method: squash
# 🗑️  Branch deleted: feature/1-add-search-filter
# 📝 Merged 2 commits into main
```

## Merge Methods

### Merge Commit (Default)
```bash
gh pr merge <pr-number> --merge --delete-branch
```
- Creates a merge commit
- Preserves all individual commits from the PR
- Maintains complete history

### Squash and Merge
```bash
gh pr merge <pr-number> --squash --delete-branch
```
- Combines all commits into a single commit
- Cleaner history
- Good for feature branches with many small commits

### Rebase and Merge
```bash
gh pr merge <pr-number> --rebase --delete-branch
```
- Rebases commits onto base branch
- Linear history
- No merge commit created

## Additional Options

### Auto-Merge
Enable auto-merge (merges when all checks pass):
```bash
gh pr merge <pr-number> --auto --squash
```

### Custom Commit Message
```bash
gh pr merge <pr-number> --squash --subject "Custom title" --body "Custom description"
```

### Admin Override
Force merge (requires admin permissions):
```bash
gh pr merge <pr-number> --admin --squash
```

## Safety Checks

Before merging, verify:

1. **CI/CD Status**: All required checks must pass
2. **Review Status**: PR must be approved (if required by repo settings)
3. **Merge Conflicts**: No conflicts with base branch
4. **Draft Status**: PR must not be in draft mode
5. **Branch Protection**: Respect branch protection rules

## Error Handling

- If PR doesn't exist, show error and list available PRs:
  ```bash
  gh pr list --repo <repo-name>
  ```
- If PR is not mergeable, explain why:
  - Failing checks
  - Merge conflicts
  - Missing required approvals
  - Branch protection rules
- If merge fails, show detailed error message
- If repo doesn't exist or no access, show error

## Cleanup Options

After successful merge, offer to:

1. **Delete Local Branch**:
   ```bash
   git branch -D <branch-name>
   ```

2. **Switch to Main**:
   ```bash
   git checkout main
   git pull origin main
   ```

3. **Delete Remote Branch** (if not auto-deleted):
   ```bash
   git push origin --delete <branch-name>
   ```

4. **Prune Remote References**:
   ```bash
   git fetch --prune
   ```

## Interactive Options

Prompt user to choose:

1. **Merge Method**:
   - Merge commit
   - Squash and merge
   - Rebase and merge

2. **Delete Branch**:
   - Yes (recommended)
   - No (keep branch)

3. **Custom Commit Message**:
   - Use default
   - Provide custom message (for squash)

## Required Tools

- `gh` - GitHub CLI (authenticated)
- `git` - Git version control

## Notes

- Requires write access to repository
- Respects branch protection rules
- Cannot merge draft PRs
- Automatically closes linked issues if commit message contains "fixes #N"
- Works with PRs from forks (if you have permissions)

## Tips

- Use `--squash` for feature branches with many commits
- Use `--merge` for important feature merges to preserve history
- Use `--rebase` for maintaining linear history
- Always verify checks before merging
- Delete merged branches to keep repo clean
- Pull latest main after merging to stay up to date
