#!/bin/bash
# Remux every portfolio video for faststart (moov atom moved to front).
# Lossless — re-containers the existing video/audio streams, doesn't
# re-encode them, so quality and file size stay essentially the same.
# Only fixes "video takes a while to start playing" after clicking play.
# One file failing doesn't stop the rest — failures are listed at the end.

cd "$(dirname "$0")/.."

fail=()

find assets/client-work assets/personal-work -name "*.mp4" | while IFS= read -r f; do
  tmp="${f%.mp4}.faststart.mp4"
  echo "Remuxing: $f"
  if ffmpeg -y -i "$f" -c copy -movflags +faststart "$tmp" -loglevel error && [ -s "$tmp" ]; then
    mv "$tmp" "$f"
  else
    echo "  FAILED: $f"
    rm -f "$tmp"
    echo "$f" >> /tmp/faststart-failures.txt
  fi
done

echo "Done."
if [ -f /tmp/faststart-failures.txt ]; then
  echo "Failed files:"
  cat /tmp/faststart-failures.txt
  rm -f /tmp/faststart-failures.txt
fi
