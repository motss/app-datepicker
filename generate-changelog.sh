#!/bin/sh

CHANGELOG=$(npm x -y -- conventional-changelog-cli@latest -u -r 0 -p eslint)
HEADER='# Changelog\n\nAll notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.\n\n\n\n'

# Write header
printf "%b" "$HEADER" > CHANGELOG.md

# Append generated changelog
printf "%b" "$CHANGELOG" >> CHANGELOG.md
