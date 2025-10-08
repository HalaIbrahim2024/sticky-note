# Git Commit

Create a git commit following conventional commit standards.

## Instructions

Follow these steps:

1. **Check git status**: Run `git status` to see current changes
2. **Show diff**: Run `git diff` to show both staged and unstaged changes
3. **Stage files if needed**: If there are unstaged changes, ask the user which files to stage, or use `git add .` for all files
4. **Gather commit details**: Ask the user for:
   - Commit type (required): Choose from:
     - `feat`: A new feature
     - `fix`: A bug fix
     - `docs`: Documentation only changes
     - `style`: Changes that don't affect code meaning (formatting, missing semicolons, etc.)
     - `refactor`: Code change that neither fixes a bug nor adds a feature
     - `perf`: Performance improvement
     - `test`: Adding or updating tests
     - `chore`: Changes to build process or auxiliary tools
     - `ci`: Changes to CI configuration files and scripts
   - Scope (optional): Component or module affected (e.g., `auth`, `api`, `ui`)
   - Short description (required): Brief description of the change (imperative mood, lowercase, no period)
   - Breaking change (optional): Is this a breaking change? (yes/no)
   - Detailed description (optional): Longer description explaining the change
5. **Format commit message**: Format as:
   ```
   <type>(<scope>): <description>

   <detailed description if provided>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
   - If breaking change: Add `BREAKING CHANGE:` in the footer
6. **Create commit**: Use heredoc syntax for proper formatting:
   ```bash
   git commit -m "$(cat <<'EOF'
   <commit message>
   EOF
   )"
   ```
7. **Confirm commit**: Run `git status` after committing to verify

## Examples

```bash
# Check status
git status

# Show changes
git diff

# Stage all files
git add .

# Commit with conventional format
git commit -m "$(cat <<'EOF'
feat(auth): add login validation

Added email and password validation to login form.
Improved error messages for better user experience.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Example with breaking change
git commit -m "$(cat <<'EOF'
feat(api): update user endpoint response format

BREAKING CHANGE: User API now returns nested user object

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## Conventional Commit Format

- **Type**: Required, must be one of the types listed above
- **Scope**: Optional, describes the section of codebase
- **Description**: Required, short summary in present tense
- **Body**: Optional, detailed explanation
- **Footer**: Required Claude Code attribution, optional breaking changes

Always check git status before and after committing.