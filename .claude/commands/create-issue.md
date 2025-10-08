# Create GitHub Issue

Create a GitHub issue using the GitHub CLI.

## Instructions

Follow these steps:

1. **Verify GitHub CLI authentication**: Run `gh auth status` to ensure the user is authenticated
2. **Check repository context**: Run `gh repo view` to see if we're in a repository context, or ask the user for the repository name in format `owner/repo`
3. **Gather issue details**: Ask the user for:
   - Issue title (required)
   - Issue body/description (optional)
   - Labels (optional, comma-separated)
   - Assignees (optional, comma-separated usernames)
   - Milestone (optional)
4. **Create the issue**: Use `gh issue create` with the appropriate flags:
   - `--repo` (if not in a git repository)
   - `--title`
   - `--body`
   - `--label` (can be used multiple times)
   - `--assignee` (can be used multiple times)
   - `--milestone`
5. **Confirm creation**: Display the created issue number and URL

## Example commands

```bash
# Check auth
gh auth status

# Check repo context
gh repo view

# Create issue with all options
gh issue create --repo owner/repo --title "Issue title" --body "Issue description" --label bug --label urgent --assignee username

# Create issue interactively if details not provided
gh issue create --repo owner/repo
```

Always verify authentication and repository context before attempting to create the issue.