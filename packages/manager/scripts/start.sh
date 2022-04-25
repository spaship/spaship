#!/usr/bin/env bash

if [[ -f ".env/.env" ]]; then
  source .env/.env
fi

next start -p 2468