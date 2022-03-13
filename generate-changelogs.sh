#!/bin/sh

HEADER='# Changelog\n\nAll notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.\n\n\n\n'

FULL_CHANGELOG_OUTPUT="FULL_CHANGELOG.md"
FULL_CHANGELOG=$(npm x -y -- conventional-changelog-cli@latest -u -p eslint -r 0)

RECENT_CHANGELOG_OUTPUT="CHANGELOG.md"
RECENT_RELEASE_LIMIT=50
RECENT_CHANGELOG=$(npm x -y -- conventional-changelog-cli@latest -u -p eslint -r $RECENT_RELEASE_LIMIT)

# Write header
printf "%b" "$HEADER" > $FULL_CHANGELOG_OUTPUT
printf "%b" "$HEADER" > $RECENT_CHANGELOG_OUTPUT

# Append generated changelog
printf "%b" "$FULL_CHANGELOG" >> $FULL_CHANGELOG_OUTPUT
printf "%b" "$RECENT_CHANGELOG" >> $RECENT_CHANGELOG_OUTPUT
