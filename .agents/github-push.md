# GitHub Push Instructions

All agents working on this project should use these details to push to GitHub.
**Never store the token in this file or any other file in the repo.**

## Repository
- **Owner:** hake-acc
- **Repo:** extoartsdeveloper
- **Branch:** main
- **URL:** https://github.com/hake-acc/extoartsdeveloper

## How to Push

Ask the user for the current Personal Access Token (repo scope) each time you need to push.
Then run:

```bash
# Set remote with token (never commit this command to history)
git remote set-url origin https://<TOKEN>@github.com/hake-acc/extoartsdeveloper.git

# Push
git push origin HEAD

# Remove token from remote URL immediately after pushing
git remote set-url origin https://github.com/hake-acc/extoartsdeveloper.git
```

## Notes
- No SSH, no OAuth — use the token in the HTTPS remote URL as shown above.
- Always clear the token from the remote URL after pushing.
- If the working tree is already clean (nothing to commit), just run `git push origin HEAD`.
