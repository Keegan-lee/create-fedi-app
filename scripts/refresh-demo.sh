#!/usr/bin/env bash
# Regenerate create-fedi-app-demo from the local CLI and sync into DEMO_REPO.
#
# Usage:
#   bun run build --filter=create-fedi-app   # or: cd apps/cli && bun run build
#   DEMO_REPO=../create-fedi-app-demo ./scripts/refresh-demo.sh
#
# Requires: bun, rsync, DEMO_REPO pointing at a git clone of the demo repository.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck disable=SC1091
source "$ROOT/scripts/demo-profile.env"

: "${DEMO_REPO:?Set DEMO_REPO to the clone path of the demo repository}"

if [[ ! -d "$DEMO_REPO/.git" ]]; then
  echo "DEMO_REPO must be a git repository: $DEMO_REPO" >&2
  exit 1
fi

CLI_ENTRY="$ROOT/apps/cli/dist/index.js"
if [[ ! -f "$CLI_ENTRY" ]]; then
  echo "CLI not built. Run from repo root: cd apps/cli && bun run build" >&2
  exit 1
fi

STAGING_DIR="$(mktemp -d)"
trap 'rm -rf "$STAGING_DIR"' EXIT

echo "Scaffolding ${DEMO_PROJECT_NAME}…"

AI_RULES_FLAG=()
if [[ "${DEMO_AI_RULES:-1}" == "0" ]]; then
  AI_RULES_FLAG=(--no-ai-rules)
fi

SCAFFOLD_ARGS=(
  --project-name "$DEMO_PROJECT_NAME"
  --database "${DEMO_DATABASE:-none}"
  --modules "${DEMO_MODULES}"
  --package-manager "${DEMO_PACKAGE_MANAGER:-bun}"
  --lnurl-pay-address "${DEMO_LNURL_PAY_ADDRESS}"
  --skip-install
)

if [[ ${#AI_RULES_FLAG[@]} -gt 0 ]]; then
  SCAFFOLD_ARGS+=("${AI_RULES_FLAG[@]}")
fi

if [[ -n "${DEMO_AI_PROVIDER:-}" ]]; then
  SCAFFOLD_ARGS+=(--ai-provider "$DEMO_AI_PROVIDER")
fi

(
  cd "$STAGING_DIR"
  node "$CLI_ENTRY" "${SCAFFOLD_ARGS[@]}"
)

GENERATED="$STAGING_DIR/$DEMO_PROJECT_NAME"
if [[ ! -d "$GENERATED" ]]; then
  echo "Scaffold output not found at $GENERATED" >&2
  exit 1
fi

echo "Syncing into ${DEMO_REPO}…"
rsync -a --delete \
  --exclude .git \
  --exclude .env.local \
  --exclude .vercel \
  "$GENERATED/" "$DEMO_REPO/"

echo "Installing dependencies…"
(cd "$DEMO_REPO" && bun install)

echo "Verifying build…"
(cd "$DEMO_REPO" && bun run build && bun run typecheck)

CLI_VERSION="$(node -p "require('$ROOT/apps/cli/package.json').version")"
echo "Demo refreshed from create-fedi-app v${CLI_VERSION}"
