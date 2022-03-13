#!/bin/sh

# Grab last commit git message
LAST_COMMIT_MESSAGE=$(git log -1 --format=%s)

# Update changelog and commit the changes
sh generate-changelogs.sh
git add -- *CHANGELOG.md
git commit -m 'doc: update changelogs' --no-verify

# Soft reset and commit all the changes
git reset --soft HEAD~2
git commit -m "$LAST_COMMIT_MESSAGE" --no-verify

# Push new commit
git push origin "$(git_current_branch)"
