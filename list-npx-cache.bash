#!/bin/bash

# NOTE: THere is a discrepancy in the npx cache in npm between 8.4.1 and 8.1.4.
# There is an additional zx found in the npx cache when compared to the local npx cache using 8.1.4.

NPX_CACHE_DIR="$(npm config get cache)/_npx"

if [[ -d $NPX_CACHE_DIR ]]; then
  FILES=$(find $NPX_CACHE_DIR -type f | grep -v 'node_modules' | grep -v 'package-lock.json')
  # FILES=$(find $NPX_CACHE_DIR -type f | grep -v 'node_modules')

  echo '[INFO] Listing all files in the npx cache...'

  for a in $FILES
  do
    echo "::group::$a"
    cat $a
    echo $'\n'
    echo "::endgroup::"
  done
else
  echo '[INFO] npx cache not found!'
fi

# NOTE: List all files with human readable size in the npm cache

# echo "::group::$(ls -lhR $(npm config get cache) || echo 'nil')"
# echo "::endgroup::"
