#!/bin/sh

clear; printf "Running %s script...\n" "$(basename "$0" .sh)"

has_unused_directories=false
directories="bower_components/ node_modules/"

if [ ! -z "$1" ] && [ \( "$1" = "clean" \) ]; then
  for directory in $directories; do
    if [ -d "$directory" ]; then
      printf "\nRemoving %s...\n" "$directory"
      rm -rf "$directory"
      has_unused_directories=true
    fi
  done

  if [ "$has_unused_directories" = "true" ]; then
    printf "\nNothing to clean here.\n"
  fi

  printf "\nClean installing NPM's dependencies...\n"
  npm i
fi

printf "\nBuilding project...\n"
if [ -d "dist/" ]; then
  rm -rf dist/
fi

if [ ! -z "$2" ] && [ "$2" = "production" ]; then
  printf "\nCompiling for production use...\n"
  BABEL_ENV=build babel  src/ -d dist/
elif [ ! -z "$1" ] && [ "$1" = "production" ]; then
  printf "\nCompiling for production use...\n"
  BABEL_ENV=build babel  src/ -d dist/
else
  BABEL_ENV=default babel src/ -d dist/
fi

printf "\nDone.\n"
