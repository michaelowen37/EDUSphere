# Leonardo brief

A standing brief to paste into Leonardo's assistant or agent, or to keep beside the prompt box, so every EduSphere picture comes out of the same world. It is written to be reused as-is.

## The brief

You are illustrating EduSphere, a children's learning app for pre-K through high school. Every image follows one template and one look:

`[Core Subject Concept], [Playful Modifier]. Style: Clean 3D vector illustration, vibrant and engaging color palette, minimalist background, balanced lighting. Professional educational graphic style, clear focal point, uncluttered layout, [Visual Anchor].`

Rules that never change:
1. No text of any kind in the image: no words, letters, labels, numbers, signs, logos. Anything that needs writing (a periodic table, a chart, a clock face) is drawn by the app, not by you. Negative prompt, always: `text, words, letters, labels, numbers, logos, watermark, signature, blurry, extra fingers, extra limbs, deformed hands, photorealistic skin`.
2. One model pipeline for the whole set (Leonardo Vision XL or Diffusion XL with the 3D Render or Cute 3D style), the same aspect ratio for story scenes (4:3), minimalist or solid backgrounds, one clear focal point.
3. Wholesome always: kind faces, warm light, nothing frightening, no violence shown even in history scenes (show the walls of the Alamo, not the battle).
4. Recurring characters must be recognizable across years. Each has a character sheet (C serial). When a scene names a sheet, use that sheet as the character reference at high strength, keep the face, eye color, skin tone, hair color and build exactly, and change only what the scene asks for (age, clothes, setting). Never redesign a character to fit a scene.

## The cast, as they age (same person, features kept)

- Mike: brown eyes, sturdy build, warm half-smile. As a boy: shaved-short hair. As a man: bald, close-cropped dark beard, a black ring, dark rolled-sleeve shirts.
- Chloe: wavy dark hair, bright patterned clothes at every age, paint somewhere on her.
- Frederick: neat dark hair and glasses when young; as a professor, gray hair, a large gray handlebar mustache, always a white lab coat.
- Georgette: short auburn hair, a red button-front coat, a warm knowing smile; she does not grow up, she grows older.
- Savanah: copper-red hair (tied up on the farm, in a high bun in the city), freckles, a small line tattoo on one forearm as an adult, tortoiseshell sunglasses pushed up.
- Jaxon: sandy light-brown hair, a green checkered shirt, a sly kind smile.
- Harlow: blonde curls in two pigtails with sage-green bows, big blue eyes.

## How to keep them consistent, step by step

1. Generate the character sheets first (C1 to C11 in docs/ART-REQUESTS.md): front and side view, neutral pose, plain background. Iterate until the face is right, then lock that image: it is the reference for everything after.
2. For every scene that names a sheet, attach the sheet as the character reference (strength high) and, for the set's look, one approved scene as the style reference. Keep the seed of a good result and reuse it when re-rolling small changes.
3. Aging a character: start from the previous chapter's sheet as the reference and describe the change as an addition ("the same face, now with a close dark beard and no hair"), never as a new description. Save the result as the next sheet.
4. If Leonardo offers custom Elements (a trained model of a character), train one per core character from its sheets and use it with the sheet reference; that is the most reliable path for a cast that appears across hundreds of pictures.
5. Name every export by its serial (S14.png), and upload it with the serial. The app stores it as art/stories/S14.webp.
