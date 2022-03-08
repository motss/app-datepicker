#!/bin/sh

# NOTE: THere is a discrepancy in the npx cache in npm between 8.4.1 and 8.1.4.
# There is an additional zx found in the npx cache when compared to the local npx cache using 8.1.4.

NPX_CACHE_DIR="$(npm config get cache)/_npx"

if [ -d "$NPX_CACHE_DIR" ]; then
  FILES=$(find "$NPX_CACHE_DIR" -type f | grep -v 'node_modules' | grep -v 'package-lock.json')
  # FILES=$(find "$NPX_CACHE_DIR" -type f | grep -v 'node_modules')

  printf '[INFO] Listing all files in the npx cache...\n'
  for a in $FILES
  do
    printf "::group::%s\n" "$a"
    cat "$a"
    printf "::endgroup::\n"
  done
else
  printf '[INFO] npx cache not found!\n'
fi

# NOTE: List all files with human readable size in the npm cache

# NPM_CACHE_DIR="$(npm config get cache)"

# if [ -d "$NPM_CACHE_DIR" ]; then
#   FILES=$(ls -lhR "$NPM_CACHE_DIR")

#   printf "::group::%s\n" "$FILES"
#   printf "::endgroup::"
# fi
