#!/usr/bin/env bash

if [[ -f ".env" ]]; then
  source .env
fi

npm run lerna run start
