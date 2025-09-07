#!/bin/sh
set -e
echo "PWD: $(pwd)"
echo "Listing /app"; ls -la /app || true
echo "Listing /app/server"; ls -la /app/server || true
echo "Listing /app/server/src"; ls -la /app/server/src || true
echo "Starting: $@"
exec "$@"