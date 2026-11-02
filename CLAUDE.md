@AGENTS.md

## Workflow

- Merge finished work into `main` and push it; don't leave other branches or open PRs behind. Delete the working branch once it's merged.
- Netlify deploys production from `main` (project `lucia-gelato`). The free plan has 300 credits a month and each production deploy costs 15, so read build logs before redeploying rather than deploying to debug.
