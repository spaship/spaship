#!/usr/bin/env bash

if [[ -f ".env/.env.dev" ]]; then
  source .env/.env.dev
fi

next dev -p 2468