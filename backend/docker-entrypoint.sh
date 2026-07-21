#!/bin/sh
set -eu

if [ "$(id -u)" = "0" ]; then
  LOG_DIR="${LOG_DIR:-/home/node/app/logs}"

  mkdir -p "$LOG_DIR"
  chown -R node:node "$LOG_DIR"

  if command -v gosu >/dev/null 2>&1; then
    exec gosu node "$@"
  fi

  exec su -s /bin/sh node -c 'exec "$@"' -- "$@"
fi

exec "$@"
