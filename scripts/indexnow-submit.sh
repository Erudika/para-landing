#!/usr/bin/env bash
set -euo pipefail

SITEMAP="dist/sitemap-0.xml"
HOST="paraio.org"
KEY="9e8a3c1dd6f74299b282569f9408c0a7"
BING_URL="https://www.bing.com/indexnow"

if [ ! -f "$SITEMAP" ]; then
  echo "Sitemap not found at $SITEMAP. Run 'astro build' first."
  exit 1
fi

mapfile -t urls < <(grep -oP '(?<=<loc>)[^<]+' "$SITEMAP")
total="${#urls[@]}"
echo "Found $total URLs in sitemap."

if [ "$total" -eq 0 ]; then
  echo "No URLs found. Exiting."
  exit 0
fi

submitted=0
for ((i=0; i<total; i+=10000)); do
  chunk=("${urls[@]:i:10000}")
  payload=$(jq -n \
    --arg host "$HOST" \
    --arg key "$KEY" \
    --argjson urls "$(printf '%s\n' "${chunk[@]}" | jq -R . | jq -s .)" \
    '{host: $host, key: $key, urlList: $urls}')

  echo "Submitting ${#chunk[@]} URLs (batch $((submitted / 10000 + 1)))..."
  status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BING_URL" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "$payload")

  if [ "$status" = "200" ] || [ "$status" = "202" ]; then
    echo "  OK (HTTP $status)"
  else
    echo "  Failed (HTTP $status)"
  fi
  submitted=$((submitted + ${#chunk[@]}))
done

echo "Done. Submitted $submitted URLs to IndexNow."
