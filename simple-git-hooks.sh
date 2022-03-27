#!/bin/sh

DIRNAME=$(dirname "$0")
CONFIG="$DIRNAME/.base.simple-git-hooks.json"
NPM_BIN=$(npm bin)

# NOTE(motss): This is a workaround for the fact that the `simple-git-hooks` does not support
# custom configuration file.
#
# 1. To temporarily copy the configuration file to `pwd`
cp "$CONFIG" ./.simple-git-hooks.json

# 2. Run the `simple-git-hooks`
"$NPM_BIN"/simple-git-hooks

# 3. Remove the configuration file from `pwd`
rm -rf ./.simple-git-hooks.json
