#!/usr/bin/env bash

if [[ -f ".env/.env.local" ]]; then
  source .env/.env.local
fi

next dev -p 2468