# What changed

Paste the lines below as the commit message. Unzip this file onto the repository folder; it overwrites only the files listed.

- (2026-09-15) The quick-checks switch is its own stored setting (`edusphere_v1_quickchecks`), not a field on the educator profile. That is why it would not move under the testing pin: with no profile saved, the toggle was writing to nothing. Its card carries Mikey's wording, with the longer explanation and the note behind the i.
- (2026-09-15) One rectangular two-piece toggle (`SegToggle`) is used for Core / Electives on the assign page, Core / Electives on the Standards map, and By grade / By subject on the map: equal halves, square corners, butted together, full width on a phone.
- (2026-09-15) Art is the first elective subject: Looking and making (grade 3) and Color, shape and story (grade 4), three modules each, marked `elective: true`, cited against the Texas fine arts TEKS (§117.111 and §117.114, Adopted 2013) by knowledge statement and the National Core Arts Standards anchor codes. They exist so the Core / Electives toggles have something real to show, and because an elective is what the flag was built for.
- (2026-09-15) More of Mikey's phone review: the report's closing lines centered one sentence per line; the note box spans the card with Save note centered below on a phone and the explanation under it, centered; the writing check names the student and is centered; "Switching a course off" centered; the notes search placeholder centered; the student card's name, grade and links now share one left edge beside the picture. The print check now reads the PDF, because the DOM's textContent shows print-hidden text too.

## Files
- src/ui.jsx
- src/logic.mjs
- src/curriculum.mjs
- index.html
- tests/logic.test.mjs
- tests/e2e/click-through.mjs
- tools/changes-zip.sh
- docs/DECISIONS.md
