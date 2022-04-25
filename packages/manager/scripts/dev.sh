#!/usr/bin/env bash

if [[ -f ".env/dev.env" ]]; then
  source .env/dev.env
fi

next dev -p 2468