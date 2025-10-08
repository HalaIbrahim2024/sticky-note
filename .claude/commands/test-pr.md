# Test Pull Request

Test a pull request locally by checking out its branch and running tests/build.

## Usage

```
/test-pr <repo-name> <pull-number>
```

Example: `/test-pr sticky-note 2`

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
   - Display checks status

3. **Check Current State**:
   ```bash
   git status
   git branch --show-current
   ```
   - Warn if there are uncommitted changes
   - Ask user to commit/stash or continue anyway

4. **Fetch PR Branch**:
   ```bash
   gh pr checkout <pull-number>
   ```
   - This automatically checks out the PR branch locally
   - Alternative manual approach:
   ```bash
   git fetch origin pull/<pull-number>/head:pr-<pull-number>
   git checkout pr-<pull-number>
   ```

5. **Display Branch Info**:
   - Show current branch name
   - Show latest commit
   ```bash
   git log -1 --oneline
   ```

6. **Run Tests and Build**:
   - Check for test scripts in package.json
   - Run available tests:
   ```bash
   npm run test (if exists)
   npm run lint (if exists)
   npm run build
   ```
   - Capture results and display pass/fail status

7. **Code Review**:
   - Show changed files:
   ```bash
   gh pr diff <pull-number>
   ```
   - List modified files:
   ```bash
   gh pr view <pull-number> --json files -q '.files[].path'
   ```
   - Offer to read specific files for review

8. **Check CI/CD Status**:
   ```bash
   gh pr checks <pull-number>
   ```
   - Display all checks and their status
   - Show any failing checks

9. **Generate Test Report**:
   Create a summary showing:
   - ✅/❌ Build status
   - ✅/❌ Lint status
   - ✅/❌ Test status
   - ✅/❌ CI checks status
   - 📝 Files changed count
   - 📊 Lines added/removed

10. **Ask for Next Steps**:
    - View specific files?
    - Add review comment?
    - Approve PR?
    - Request changes?
    - Return to previous branch?

## Example Workflow

```bash
# User runs:
/test-pr sticky-note 2

# Output:
# 📋 Pull Request #2
# Title: feat: Add search and filter functionality
# Author: @HalaIbrahim2024
# Status: Open
# Branch: feature/1-add-search-filter
#
# Checking out PR branch...
# ✓ Switched to branch 'feature/1-add-search-filter'
#
# Running tests...
# ✓ Build: PASSED
# ✓ Lint: PASSED
# ✓ Tests: PASSED (if available)
# ✓ CI Checks: All passing
#
# Files changed: 1
# +107 -18 lines
#
# Ready to review! What would you like to do next?
```

## Detailed Steps

### 1. Fetch and Display PR Info
```bash
gh pr view <pr-number> --json number,title,author,state,headRefName,additions,deletions,files
```

### 2. Checkout PR Branch
```bash
# Recommended: Use gh CLI (handles everything)
gh pr checkout <pr-number>

# Alternative: Manual checkout
git fetch origin pull/<pr-number>/head:pr-<pr-number>
git checkout pr-<pr-number>
```

### 3. Install Dependencies (if needed)
```bash
npm install
```

### 4. Run Test Suite
Check package.json for available scripts:
```bash
npm run test || echo "No tests found"
npm run lint || echo "No lint script"
npm run build
```

### 5. Check PR Checks Status
```bash
gh pr checks <pr-number>
```

### 6. Review Files
```bash
# List all changed files
gh pr view <pr-number> --json files -q '.files[].path'

# Show diff
gh pr diff <pr-number>
```

### 7. Cleanup (Optional)
After testing, offer to:
```bash
git checkout main
git branch -D pr-<pr-number>
```

## Interactive Options

After testing, prompt user:

1. **View Files**: Read specific changed files
2. **Add Comment**: Add review comment to PR
   ```bash
   gh pr comment <pr-number> --body "Test results: ✅ All checks passed"
   ```
3. **Approve**: Approve the PR
   ```bash
   gh pr review <pr-number> --approve --body "LGTM! Tests passed locally."
   ```
4. **Request Changes**: Request changes
   ```bash
   gh pr review <pr-number> --request-changes --body "Found issues: ..."
   ```
5. **Merge**: Merge the PR (if you have permissions)
   ```bash
   gh pr merge <pr-number> --merge
   ```
6. **Return**: Go back to previous branch

## Error Handling

- If PR doesn't exist, show error and list available PRs
- If repo doesn't exist, show error
- If tests fail, show detailed error output
- If checks are failing, highlight which ones and why
- If there are merge conflicts, warn the user

## Notes

- Automatically detects the repository if in a git directory
- Can work with PRs from forks
- Preserves your working directory state
- Shows real-time test output
- Integrates with GitHub CLI for seamless experience

## Required Tools

- `gh` - GitHub CLI
- `git` - Git version control
- `npm` - Node package manager (for Node projects)

## Tips

- Use this before reviewing PRs to ensure code quality
- Run this in CI/CD pipelines for automated testing
- Combine with code review tools for comprehensive analysis
- Great for checking if PRs are safe to merge