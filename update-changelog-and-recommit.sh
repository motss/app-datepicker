#!/bin/sh

# Grab last commit git message
# LAST_COMMIT_MESSAGE=$(git log -1 --format=%s)

printf "%b" "$(git log --oneline)"

# Update changelog and commit the changes
sh generate-changelogs.sh
git add -- *CHANGELOG.md
git commit -m 'chore(changelog): update changelogs' --no-verify

# Soft reset and commit all the changes
# git reset --soft HEAD~2
# git commit -m "$LAST_COMMIT_MESSAGE" --no-verify

# Force push the new commit
# git push origin "$(git branch --show-current)" --force
