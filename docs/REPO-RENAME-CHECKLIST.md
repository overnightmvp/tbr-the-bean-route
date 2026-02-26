# REPO-RENAME-CHECKLIST.md

Target rename:
- From: `overnightmvp/cbw-coffee-club`
- To: `overnightmvp/tbr-the-bean-route`

## 1) Rename on GitHub
```bash
gh repo rename tbr-the-bean-route --repo overnightmvp/cbw-coffee-club
```

## 2) Update local git remotes
```bash
git remote -v
# If needed:
git remote set-url origin git@github.com:overnightmvp/tbr-the-bean-route.git
# or HTTPS:
# git remote set-url origin https://github.com/overnightmvp/tbr-the-bean-route.git
```

## 3) Verify CI and PR checks
- Open/create PR to ensure GitHub Actions still run.
- Confirm status checks are required on `main`.

## 4) Vercel project alignment
- In Vercel, confirm Git repo is linked to renamed repository.
- Trigger a deployment and confirm build succeeds.
- Re-check environment variables are present for all environments.

## 5) External references update
- Update links in README and docs.
- Update any bookmarks/scripts using old repo slug.
- Update issue/PR templates if they contain old slug references.

## 6) Optional cleanup
- Rename local folder to match repository name:
```bash
cd ..
mv cbw-coffee-club tbr-the-bean-route
```

## 7) Final verification
- `git fetch origin`
- `git branch -vv`
- `npm run build`
- Run smoke checks from `docs/DEPLOYMENT.md`
