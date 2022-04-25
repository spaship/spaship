#!/usr/bin/env bash

if [[ -f ".env/local.env" ]]; then
  source .env/local.env
fi

next dev -p 2468