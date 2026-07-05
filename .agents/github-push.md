# GitHub Push Instructions

All agents working on this project should use these details to push to GitHub.

## Repository
- **Owner:** hake-acc
- **Repo:** extoartsdeveloper
- **URL:** https://github.com/hake-acc/extoartsdeveloper

## Token
```
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
```

## How to Push

```bash
# Set the remote with the token embedded in the URL
git remote set-url origin https://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@github.com/hake-acc/extoartsdeveloper.git

# Stage all changes
git add -A

# Commit
git commit -m "your commit message"

# Push
git push origin HEAD
```

## Notes
- Branch: `main`
- No SSH, no OAuth — use the token in the HTTPS remote URL as shown above.
- If the working tree is already clean (nothing to commit), just run `git push origin HEAD` directly.
