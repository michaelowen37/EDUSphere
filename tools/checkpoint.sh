#!/bin/bash
# -----------------------------------------------------------------------------------------------------------------
# A mid-pass checkpoint zip (pass MD, Mikey: "Can you create checkpoints more often so we don't lose as much work when
# this happens? Maybe they can be mid-cycle dandruff documents that can be re- uploaded into the chat.", handoff documents, as he meant). In plain
# terms: a pass runs for hours, and a chat can stop in the middle (a usage limit, a lost turn). This zips the whole
# project as it stands, with a CHECKPOINT folder on top: CHECKPOINT/CHECKPOINT.md says which step of the pass is
# done and what comes next, and CHECKPOINT/work holds the pass's working files from the scratchpad (the checks'
# reports, the patch scripts, the diff packets), so a new chat can unzip it, read CHECKPOINT.md and carry on where
# the last one stopped. The delivery zip (tools/changes-zip.sh) never carries the CHECKPOINT folder.
#
# Usage, from the project folder:
#   bash tools/checkpoint.sh <label> <output-dir> [scratch-folder ...]
#     label            a short name for the file, such as md-3-second-reads
#     output-dir       where edusphere-checkpoint-<label>.zip is written
#     scratch-folder   folders whose files are copied into CHECKPOINT/work (reports, patch scripts, packets)
#   bash tools/checkpoint.sh --clean     removes the CHECKPOINT folder before a delivery
# It stops unless CHECKPOINT/CHECKPOINT.md exists and was written in the last two hours, so a checkpoint never ships
# a stale account of where the work stands.
# -----------------------------------------------------------------------------------------------------------------
set -eu
HERE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$HERE"
if [ "${1:-}" = "--clean" ]; then rm -rf CHECKPOINT; echo "CHECKPOINT folder removed"; exit 0; fi
if [ -z "${1:-}" ] || [ -z "${2:-}" ]; then echo "usage: bash tools/checkpoint.sh <label> <output-dir> [scratch-folder ...]   or   bash tools/checkpoint.sh --clean"; exit 1; fi
LABEL="$1"; OUT="$2"; shift 2
NOTE="CHECKPOINT/CHECKPOINT.md"
if [ ! -f "$NOTE" ]; then echo "write $NOTE first (where the pass stands, what comes next)"; exit 1; fi
# Older than two hours is stale (find's -mmin works the same on a Mac and on Linux, where stat's flags differ).
if [ -n "$(find "$NOTE" -mmin +120 -print)" ]; then echo "$NOTE is more than two hours old: update it first"; exit 1; fi
rm -rf CHECKPOINT/work && mkdir -p CHECKPOINT/work
for d in "$@"; do
  [ -d "$d" ] || continue
  name="$(basename "$d")"
  mkdir -p "CHECKPOINT/work/$name"
  # Working files only: reports, patch scripts, diffs and notes; never screenshots, copies of the tree or logs.
  find "$d" -maxdepth 2 -type f \( -name '*.md' -o -name '*.py' -o -name '*.mjs' -o -name '*.diff' -o -name '*.json' -o -name '*.txt' -o -name '*.sh' \) \
    -not -path '*/agents/*' -not -path '*/pre-p*/*' -not -path '*/mut/*' -not -path '*/walk*/*' -not -path '*/shots*/*' -print0 \
    | while IFS= read -r -d '' f; do rel="${f#"$d"/}"; mkdir -p "CHECKPOINT/work/$name/$(dirname "$rel")"; cp "$f" "CHECKPOINT/work/$name/$rel"; done
done
mkdir -p "$OUT"
ZIP="$OUT/edusphere-checkpoint-$LABEL.zip"
rm -f "$ZIP"
zip -qr "$ZIP" . -x "dist/*" "tests/e2e/out/*" "tests/e2e/art/*" "tests/e2e/page.html" "tests/e2e/page-licensed.html" "*.DS_Store" "node_modules/*" ".git/*"
echo "wrote $ZIP ($(du -h "$ZIP" | cut -f1)), with $(find CHECKPOINT/work -type f | wc -l) working files"
