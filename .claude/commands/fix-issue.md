# Fix Issue

Workflow to fix a GitHub issue by issue number.

## Usage

```
/fix-issue <issue-number>
```

Example: `/fix-issue 1`

## Instructions

Follow these steps:

1. **Get issue number**: Extract issue number from the command arguments
2. **Fetch issue details**: Run `gh issue view <issue-number>` to get issue information including:
   - Issue title
   - Issue description
   - Labels
   - Current status
3. **Check authentication**: Run `gh auth status` to verify GitHub CLI access
4. **Check current branch**: Run `git status` and `git branch --show-current`
5. **Verify clean working directory**: Ensure no uncommitted changes with `git status`
6. **Create fix branch**:
   - Ask user for branch name or suggest: `fix/issue-<number>-<short-description>`
   - Run `git checkout -b <branch-name>`
7. **Display issue details**: Show the issue information to the user
8. **Guide the fix**:
   - Ask user what files need to be changed
   - Make necessary code changes
   - Test the fix
9. **Commit changes**: Use conventional commit format:
   ```
   fix: resolve issue #<number> - <issue-title>

   <description of fix>

   Fixes #<number>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
10. **Push branch**: Run `git push -u origin <branch-name>`
11. **Ask about PR**: Ask if user wants to create a pull request
12. **Create PR** (if requested): Run `gh pr create` with issue reference

## Example commands

```bash
# View issue details
gh issue view 1

# Check authentication
gh auth status

# Check current status
git status

# Create fix branch
git checkout -b fix/issue-1-login-credentials

# After making changes, stage files
git add .

# Commit with issue reference
git commit -m "$(cat <<'EOF'
fix: resolve issue #1 - login credential validation

Fixed login validation logic to properly check credentials.
Updated error handling for invalid login attempts.

Fixes #1

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Push branch
git push -u origin fix/issue-1-login-credentials

# Create PR that will close the issue
gh pr create --title "Fix: Login credential validation" --body "Fixes #1" --assignee @me
```

## Important notes

- **Issue reference**: Using `Fixes #<number>` in commit/PR will auto-close the issue when merged
- **Branch naming**: Use descriptive names like `fix/issue-<number>-<description>`
- **Conventional commits**: Use `fix:` for bug fixes, `feat:` for new features
- **Clean working directory**: Always start from a clean state
- **Base branch**: Make sure you're creating branch from the correct base (usually main/master)

## Auto-closing keywords

Use these in commits or PR descriptions to auto-close issues:
- `Fixes #<number>`
- `Resolves #<number>`
- `Closes #<number>`

The issue will be automatically closed when the PR is merged.