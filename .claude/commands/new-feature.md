# New Feature

Create a new feature with automated branch creation and PR workflow.

## Usage

```
/new-feature <task-name> <project-name> <task-details>
```

Example: `/new-feature add-user-auth TodoApp "Add user authentication with NextAuth"`

## Instructions

Follow these steps:

1. **Parse Arguments**:
   - Extract task name from first argument
   - Extract project name from second argument
   - Extract task details from remaining arguments

2. **Create GitHub Issue**:
   ```bash
   gh issue create --title "<task-name>" --body "**Project**: <project-name>\n\n**Details**: <task-details>\n\n---\n\nThis issue was created automatically via /new-feature command."
   ```
   - Capture the issue number from the output

3. **Check Current Status**:
   ```bash
   git status
   git branch --show-current
   ```
   - Verify we're on main/master branch
   - Ensure clean working directory (or ask user to commit/stash changes)

4. **Create Feature Branch**:
   - Generate branch name from task name: `feature/<issue-number>-<task-name-slugified>`
   - Example: `feature/5-add-user-auth`
   ```bash
   git checkout -b feature/<issue-number>-<task-name-slug>
   ```

5. **Create Todo List**:
   - Use TodoWrite tool to create task tracking
   - Break down the feature into sub-tasks
   - Example todos:
     - Research and plan implementation
     - Create necessary files/components
     - Implement core functionality
     - Add tests
     - Update documentation
     - Create pull request

6. **Display Task Summary**:
   Show user:
   - Issue number and link
   - Branch name
   - Project name
   - Task details
   - Todo list

7. **Implement Feature**:
   - Work through the todo list
   - Make necessary code changes
   - Test the implementation
   - Update TodoWrite as you progress

8. **Commit Changes**:
   ```bash
   git add .
   git commit -m "$(cat <<'EOF'
   feat: <task-name>

   <task-details>

   Project: <project-name>
   Implements #<issue-number>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

9. **Push Branch**:
   ```bash
   git push -u origin feature/<issue-number>-<task-name-slug>
   ```

10. **Create Pull Request**:
    ```bash
    gh pr create --title "feat: <task-name>" --body "$(cat <<'EOF'
    ## Summary
    <task-details>

    ## Project
    <project-name>

    ## Changes
    - List of changes made
    - ...

    ## Testing
    - [ ] Tested locally
    - [ ] No console errors
    - [ ] Functionality working as expected

    Closes #<issue-number>

    🤖 Generated with [Claude Code](https://claude.com/claude-code)
    EOF
    )" --assignee @me
    ```

11. **Display Success Message**:
    Show user:
    - PR link
    - Branch name
    - Issue number
    - Next steps (review, merge, etc.)

## Example Workflow

```bash
# User runs:
/new-feature add-dark-mode StickyNotes "Implement dark mode toggle with theme persistence"

# This will:
# 1. Create issue #5 "add-dark-mode"
# 2. Create branch: feature/5-add-dark-mode
# 3. Show todo list with implementation steps
# 4. Implement the feature
# 5. Commit with message: "feat: add-dark-mode"
# 6. Push to origin/feature/5-add-dark-mode
# 7. Create PR that closes #5
```

## Branch Naming Convention

- Format: `feature/<issue-number>-<task-name-slug>`
- Task name is converted to lowercase with hyphens
- Examples:
  - `feature/1-add-user-auth`
  - `feature/2-dark-mode-toggle`
  - `feature/3-export-notes-csv`

## Commit Message Format

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Auto-closing Keywords

The PR body includes `Closes #<issue-number>` which will automatically close the issue when the PR is merged.

## Important Notes

- Always start from a clean working directory
- Default base branch is main (or master if main doesn't exist)
- The command will guide you through implementation step by step
- Todo list helps track progress
- All changes are made in a feature branch (never directly on main)

## Error Handling

If any step fails:
1. Display clear error message
2. Show user what went wrong
3. Provide recovery steps
4. Ask if user wants to continue or abort

## Required Tools

- `gh` - GitHub CLI (for issues and PRs)
- `git` - Git version control
- Clean working directory or ability to stash/commit