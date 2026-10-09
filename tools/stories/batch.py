# The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
# The story batch driver for the doubling program (2026-09-24). Usage:
#   1. Copy tools/stories/batch-example.py to /tmp/batch.py and replace NEW with a dict per module id:
#        dict(about=..., title=..., alt=<main picture>, bg=<minimalist scene word>,
#             more=[(<picture alt>, <paragraph index it follows>), ...],   # pre-K three extras, K to 2 four, grade 3 up five
#             (a picture whose scene moves away from bg names its own: (<alt>, <after>, <bg>); alt_bg does it for the main picture)
#             words=[<paragraph>, ...])                                    # apostrophes written as APOS
#   2. Run: python3 tools/stories/batch.py /tmp/batch.py
#   3. node tests/stories.test.mjs (fix read-aloud slips and picture spread from its output), node tests/ledger.test.mjs,
#      node tools/story-length.mjs > docs/STORY-LENGTH.md, node tools/prompts-csv.mjs > docs/LEONARDO-PROMPTS.csv
# The driver keeps a story's old picture serials in order, mints new ones after the ledger's highest S serial and appends
# their rows (in Mikey's subject template) before the Course stories heading; it handles both story forms in src/stories.mjs
# (STORIES['id'] = { ... } and the literal 'id': { ... } inside the top object, where cast stories such as count-to-3 live).
# Hand-written rows are kept (pass MB, the picture check's second read): a row whose picture keeps its alt is left whole, check
# note, hand-written prompt and extra negative words and all; and when an alt changes on a row written by hand (a check note,
# a prompt that is not the template's, or extra negative words), the driver writes nothing and lists those serials, so their
# rows are rewritten by hand, never silently replaced by the template.
import sys
p = 'src/stories.mjs'; s = open(p).read()
NEW = {}
exec(open(sys.argv[1]).read().replace("\\'", "APOS"))
import re, json, subprocess
SUBJECT = json.loads(subprocess.check_output(['node', '-e', "import('./src/logic.mjs').then((L)=>console.log(JSON.stringify(Object.fromEntries(L.MODULES.map((m)=>[m.id,(L.getCourse(m.courseId)||{}).subject||''])))))"]).decode())
MOD = { 'Science': ('wonder-filled and vibrant', 'dynamic close-up, soft shadows'), 'History': ('friendly and whimsical yet respectful', 'heroic composition, soft cinematic lighting'), 'Math': ('cheerful and neat', 'distinct geometric shapes'), 'Reading': ('imaginative and expressive', 'character-focused, dreamy lighting'), 'Writing': ('imaginative and expressive', 'character-focused, dreamy lighting') }
NEG = 'text, words, letters, labels, numbers, logos, watermark, signature, blurry, extra fingers, extra limbs, deformed hands, photorealistic skin'
def prompt(scene, subject, bg):
    mod, anchor = MOD.get(subject, ('wonder-filled and vibrant', 'dynamic close-up'))
    return f"{scene}, {mod}. Style: Clean 3D vector illustration, vibrant and engaging color palette, minimalist {bg} background, balanced lighting. Professional educational graphic style, clear focal point, uncluttered layout, {anchor}."
L = open('docs/ART-REQUESTS.md').read()
next_serial = max(int(x) for x in re.findall(r"^\| S(\d+) \|", L, flags=re.M)) + 1
new_rows = []
manual = []   # serials whose hand-written rows need a hand rewrite because their alts changed
for mid, d in NEW.items():
    m = re.search(r"STORIES\['" + re.escape(mid) + r"'\] = \{.*?\n\};\n", s, re.S)
    literal = None
    if not m:   # the older literal form inside export const STORIES = { 'id': { ... }, }
        literal = re.search(r"^  '" + re.escape(mid) + r"': \{\n.*?\n  \},\n", s, re.S | re.M); assert literal, mid
    block = (m or literal).group(0); art = re.search(r"art: '(S\d+)'", block).group(1); castm = re.search(r"cast: (\[[^\]]*\])", block); cast = castm.group(1) if castm else "['Mike']" if 'Mike' in block else '[]'
    have = re.findall(r"serial: '(S\d+)'", block)
    serials = []
    for k, (alt, aft, *_) in enumerate(d['more']):
        if k < len(have): serials.append(have[k])
        else: serials.append(f"S{next_serial}"); next_serial += 1
    more = "[" + ", ".join(f"{{ serial: '{ser}', after: {aft}, alt: '{alt}' }}" for ser, (alt, aft, *_) in zip(serials, d['more'])) + "]"
    words = "\n".join("    '" + w + "'," for w in d['words'])
    if literal:
        new = (f"  '{mid}': {{\n  about: '{d['about']}',\n    title: '{d['title']}', art: '{art}', cast: {cast}, more: {more},\n    alt: '{d['alt']}',\n    words: [\n{words}\n    ],\n  }},\n").replace('APOS', "\\'")
    else:
        new = (f"STORIES['{mid}'] = {{\n  about: '{d['about']}',\n  more: {more},\n  title: '{d['title']}', art: '{art}', cast: {cast},\n  alt: '{d['alt']}',\n  words: [\n{words}\n  ],\n}};\n").replace('APOS', "\\'")
    s = s.replace(block, new)
    # Each picture's own background where its scene moves (pass LX); otherwise the story's.
    pics = [(art, d['alt'], d.get('alt_bg', d.get('bg', 'scene')))] + [(ser, m[0], m[2] if len(m) > 2 else d.get('bg', 'scene')) for ser, m in zip(serials, d['more'])]
    for ser, alt, bg in pics:
        alt1 = alt.replace('APOS', "'")
        old = re.search(r"^\| " + ser + r" \| .*$", L, flags=re.M)
        if old:
            cells = old.group(0).split(' | '); old_scene = re.sub(r' \(check: .*\)$', '', cells[2])
            if old_scene == alt1: continue   # the picture keeps its alt: its row stays whole, whoever wrote it
            hand = '(check:' in cells[2] or cells[4] != NEG or not cells[3].startswith(old_scene + ', ' + MOD.get(SUBJECT.get(mid, ''), ('wonder-filled and vibrant',))[0] + '.')
            if hand: manual.append(ser); continue
        # A kept character-sheet note ends the prompt (pass LX: it used to land after the negative prompt).
        sheet = re.search(r"Character: C\d+(?:, C\d+)*\.", old.group(0)) if old else None
        row = f"| {ser} | {mid} | {alt1} | {prompt(alt1, SUBJECT.get(mid, ''), bg)}{(' ' + sheet.group(0)) if sheet else ''} | {NEG} | Needed |"
        if old: L = L.replace(old.group(0), row, 1)
        else: new_rows.append(row)
if manual:
    print('Stopped: these pictures have hand-written ledger rows and new alts. Rewrite their rows by hand (scene, check note, prompt), then run the driver again:', ', '.join(manual)); sys.exit(1)
open(p, 'w').write(s.replace('APOS', "\\'"))
if new_rows:
    anchor = "\n\n## Course stories (CS serials)"
    assert L.count(anchor) == 1
    L = L.replace(anchor, "\n" + "\n".join(new_rows) + anchor, 1)
open('docs/ART-REQUESTS.md', 'w').write(L); print('stories', len(NEW), 'new rows', len(new_rows), 'next serial', next_serial)
