---
name: illustrations
description: How pictures come into EduSphere: the Leonardo prompt template, serials, file paths, sizes, and placeholders. Use whenever a picture is requested, received, or wired into a screen.
---
# Illustrations

## The prompt template (Mikey's rule)

`[Core Subject Concept], [Playful Modifier]. Style: Clean 3D vector illustration, vibrant and engaging color palette, minimalist background, balanced lighting. Professional educational graphic style, clear focal point, uncluttered layout, [Visual Anchor].`

Fill it by subject: science (wonder-filled, vibrant, stylized; dynamic close-up, glowing elements, soft shadows), history (whimsical yet respectful, stylized historical accuracy; heroic composition, soft cinematic lighting), math (colorful, geometric, cheerful, neat; high-contrast, distinct geometric shapes, no text labels), reading and writing (imaginative, storybook style, expressive; character-focused, dreamy lighting, central framing).

Lesson paintings (P rows, pass MF, Mikey's answer to Q8): a lesson painting shows a real thing a lesson line names, so it keeps the house style and never takes a story subject's anchor; its framing follows what it shows: a dynamic close-up for one thing, a straight-on view (never "flat", which can read as flat design) where a shape, a size or a length must read true, a wide view where a whole landmark or place must show, each ending on soft shadows, and a thing that lies flat is seen from directly above. A painting that replaces a drawing on a line that states a count names that count. The ledger test holds the framings.

Three golden rules: forbid text in every row's bans (text, words, letters, labels, numbers); one model for the whole set (Nano Banana 2 in Leonardo, style preset None, Prompt Enhance off); minimalist or solid backgrounds. Anything with writing on it (a periodic table, a graph, a clock face) is drawn by the app, not requested.

Nano Banana 2 has no negative prompt, so the bans reach it through `docs/LEONARDO-PROMPTS.csv` (pass MC): `tools/prompts-csv.mjs` folds them into closing sentences that say what the picture is, names the character sheets to attach only where the scene shows a person, and marks the pictures EARMARKS A6 lists Re-plan first (A6). Write every prompt the same way, as what the picture is, never what it is not ("only green leaves on the water", not "no lily flowers"); the ledger test holds the old rows that still say what a picture is not to a ceiling that only falls. Rebuild the spreadsheet after any ledger change.

## Serials and files

Serials: S story scene, C character sheet, I item picture, G game or coloring page, L logo, U shelf picture for the app's own screens (since pass MG: U1, the Surprise me row on Let's Read, at 52 pixels, so square and bold; until it is saved the app draws four overlapping question marks, SurpriseThumb, and no placeholder shows). Numbers never change. The ledger is `docs/ART-REQUESTS.md`.

Story scenes are raster: Mikey uploads PNG or JPG, Claude resizes to about 1200 px wide and converts to WebP (`python3` with Pillow, which the sandbox has), and saves it as `art/stories/<serial>.webp`. They are loaded only when a story opens, so index.html does not grow. Never inline them as base64.

Icons and coloring pages are vector: ask Leonardo for flat, solid-color, no-gradient art, vectorize, and keep them small; a vectorized 3D render is huge and blurry and is refused.

## Reuse

A story picture belongs to one story. A drawn diagram kind may serve several lessons only with its own parameters each time (a different bar, a different angle); an identical picture on two lessons fails the rules test. Across modules, courses, stories and grades the aim is that nothing feels recycled.

## Placeholders

A story whose picture is missing shows a dashed frame with its serial. Coloring pages never show a placeholder; a page without art simply is not listed.
