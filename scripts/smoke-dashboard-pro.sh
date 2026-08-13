#!/usr/bin/env bash
set -euo pipefail
curl -sS http://localhost:4000/api/dashboard/pro | jq . || true
