# The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
# The story batch driver for the doubling program (2026-09-24). Usage:
#   1. Copy tools/stories/batch-example.py to /tmp/batch.py and replace NEW with a dict per module id:
#        dict(about=..., title=..., alt=<main picture>, bg=<minimalist scene word>,
#             mood=<the scene's mood: two to four words of MOOD_WORDS for its feeling, such as 'delighted and warm'>,
#             more=[(<picture alt>, <paragraph index it follows>), ...],   # pre-K three extras, K to 2 four, grade 3 up five
#             (a picture whose scene moves away from bg names its own: (<alt>, <after>, <bg>); alt_bg does it for the main picture;
#              a picture whose feeling differs names its own mood: (<alt>, <after>, <bg, or None for the story's>, <mood>);
#              alt_mood does it for the main picture)
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
# A row's modifier and the scene's mood (Mikey's answer to Q128, pass NY, November 23, 2026: "Q128- C (let's prioritize this
# because I will be working on images soon)."): every row the driver writes carries its subject's whole "Playful modifier"
# cell from docs/LEONARDO-BRIEF.md's table (MOD below, held equal to the brief's cells by the ledger test), then the scene's
# mood, so the house style the table names and the feeling each scene needs both reach the painter:
#   "<scene>, imaginative and expressive, storybook style, delighted and warm. Style: ...".
# The driver writes no row without a mood: a picture whose row it would write with none, or with a mood that is not two to
# four words of MOOD_WORDS, stops it before anything is written, its serials listed. Since Mikey's word of the same morning
# ("all rows should be updated throughout") every story row carries both (the lead applied two writers' moods to the 4,445 that
# had none). At his answers to Q132 and Q133 of the same afternoon a beat in a Math course carries Math's words without "cheerful
# and", and a subject the table gives no words of its own Reading's words where the scene shows a person and Science's where it
# shows things (style_for, below). The driver still reads a row in the older form, the cell's first clause alone, as the
# template's (template_start), though no row carries it since pass NY.
import sys
p = 'src/stories.mjs'; s = open(p).read()
NEW = {}
exec(open(sys.argv[1]).read().replace("\\'", "APOS"))
import re, json, subprocess
SUBJECT = json.loads(subprocess.check_output(['node', '-e', "import('./src/logic.mjs').then((L)=>console.log(JSON.stringify(Object.fromEntries(L.MODULES.map((m)=>[m.id,(L.getCourse(m.courseId)||{}).subject||''])))))"]).decode())
# Each subject's playful modifier, the whole cell of docs/LEONARDO-BRIEF.md's table word for word (the ledger test fails when the
# two differ), and its visual anchor. A subject with no words of its own in the table takes Reading's or Science's, by style_for
# below (Mikey's answer to Q133).
MOD = { 'Science': ('wonder-filled and vibrant, stylized, curious', 'dynamic close-up, soft shadows'), 'History': ('friendly and whimsical yet respectful, stylized historical accuracy', 'heroic composition, soft cinematic lighting'), 'Math': ('cheerful and neat, colorful, geometric', 'distinct geometric shapes'), 'Reading': ('imaginative and expressive, storybook style', 'character-focused, dreamy lighting'), 'Writing': ('imaginative and expressive, storybook style', 'character-focused, dreamy lighting') }
NEG = 'text, words, letters, labels, numbers, logos, watermark, signature, blurry, extra fingers, extra limbs, deformed hands, photorealistic skin'
# The words a scene's mood is made of: the words the ledger's moods use, feelings and a few words for the scene's look (simple,
# clear, neat, busy, detailed), never a thing the picture shows, so a scene's last words can never pass for its mood. A new
# feeling word is added here; tools/stories/long-batch.py and the ledger test read these two lists from this file.
MOOD_WORDS = 'bright busy calm careful cheerful clear cozy curious delighted detailed eager excited focused full funny gentle happy hopeful imaginative joyful kind lively neat patient peaceful playful proud puzzled simple sunny thoughtful warm wonder'.split()
MOOD_JOINERS = 'and yet of'.split()
# What is wrong with a scene's mood, or None when nothing is: two to four words of MOOD_WORDS, a joining word only between two of
# them ('gentle and warm', 'full of wonder'), and no comma, since a comma would split the mood from the words before it. Since round
# one's code read of pass NY two joining words together ('calm and and warm', 'calm yet of warm') and a word said twice ('calm calm'),
# which the first and last words alone had let through, are refused too; none of the ledger's 431 moods then had either. Since round
# two's code read a mood with no joining word ('calm patient') is refused as well: the spreadsheet reads patient as a mood only beside
# a joining word, so such a row would read as a person there and in the ledger test, though the driver reads the scene alone; none of
# the 431 had one.
def mood_problem(mood):
    if not mood: return 'no mood'
    words = str(mood).split(' ')
    if not 2 <= len(words) <= 4: return 'not two to four words'
    odd = [w for w in words if w not in MOOD_WORDS and w not in MOOD_JOINERS]
    if odd: return 'not words of MOOD_WORDS: ' + ' '.join(odd)
    if words[0] in MOOD_JOINERS or words[-1] in MOOD_JOINERS: return 'begins or ends on a joining word'
    if any(a in MOOD_JOINERS and b in MOOD_JOINERS for a, b in zip(words, words[1:])): return 'two joining words together'
    said = [w for w in words if w not in MOOD_JOINERS]
    if len(set(said)) < len(said): return 'one word said twice'
    if not any(w in MOOD_JOINERS for w in words): return 'no joining word'
    return None
# A row's words and anchor (Mikey's answers to Q132 and Q133, pass NY, November 23, 2026: "Q132 - A", "Q133 - A"): its subject's
# from MOD; a beat (its mood "gentle and warm") without the "cheerful and" its subject's words begin with (Math's), since no beat
# is painted cheerful (RULES-AUDIT's row on each face named): "<scene>, neat, colorful, geometric, gentle and warm"; and a subject
# the table gives no words of its own (Art, Music, Technology, Health, Economics, Philosophy, Psychology, Speech, Agriculture and
# Business, the table's last row: "as Reading for people, as Science for things") Reading's words and anchor where the scene shows
# a person and Science's where it shows things, by the spreadsheet's own reading of a person (shows_person).
BEAT = 'gentle and warm'
def style_for(subject, scene, mood):
    if subject not in MOD: return MOD['Reading'] if shows_person(scene) else MOD['Science']
    cell, anchor = MOD[subject]
    if mood == BEAT and cell.startswith('cheerful and '): cell = cell[len('cheerful and '):]
    return cell, anchor
# Whether a scene shows a person: tools/prompts-csv.mjs's hasPerson, the reading that tells the painter "Hands have five fingers,
# and bodies look natural." and attaches a row's character sheets, run in node so the driver and the spreadsheet never differ.
_PERSON = {}
def shows_person(scene):
    if scene not in _PERSON:
        _PERSON[scene] = subprocess.check_output(['node', '-e', "import('./tools/prompts-csv.mjs').then((P) => process.stdout.write(P.hasPerson(process.argv[1]) ? 'yes' : 'no'))", scene]).decode() == 'yes'
    return _PERSON[scene]
# Whether a prompt begins as the template writes it, so a row the driver wrote is never taken for hand-written: the scene, then
# its subject's first clause alone (every template row written before Mikey's answer to Q128, none since pass NY), or the
# scene, the words style_for gives it and a mood (since).
def template_start(text, scene, subject):
    cell = MOD.get(subject, MOD['Science'])[0]
    if text.startswith(scene + ', ' + cell.split(', ')[0] + '.'): return True
    head = text.split('. Style:')[0]; mood = head.split(', ')[-1]
    return head.startswith(scene + ', ') and mood_problem(mood) is None and head == scene + ', ' + style_for(subject, scene, mood)[0] + ', ' + mood
# A story row's prompt in Mikey's template: the scene, its words (style_for), the scene's mood, the house style with its
# background word, and its anchor.
def prompt(scene, subject, bg, mood):
    mod, anchor = style_for(subject, scene, mood)
    return f"{scene}, {mod}, {mood}. Style: Clean 3D vector illustration, vibrant and engaging color palette, minimalist {bg} background, balanced lighting. Professional educational graphic style, clear focal point, uncluttered layout, {anchor}."
L = open('docs/ART-REQUESTS.md').read()
next_serial = max(int(x) for x in re.findall(r"^\| S(\d+) \|", L, flags=re.M)) + 1
new_rows = []
manual = []   # serials whose hand-written rows need a hand rewrite because their alts changed
moodless = []   # serials whose rows the driver would write with no mood it can use (Mikey's answer to Q128), each with why
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
    # Each picture's own background where its scene moves (pass LX), and its own mood where its feeling differs (Q128);
    # otherwise the story's.
    pics = [(art, d['alt'], d.get('alt_bg', d.get('bg', 'scene')), d.get('alt_mood', d.get('mood')))] + [(ser, m[0], m[2] if len(m) > 2 and m[2] else d.get('bg', 'scene'), m[3] if len(m) > 3 else d.get('mood')) for ser, m in zip(serials, d['more'])]
    for ser, alt, bg, mood in pics:
        alt1 = alt.replace('APOS', "'")
        old = re.search(r"^\| " + ser + r" \| .*$", L, flags=re.M)
        if old:
            cells = old.group(0).split(' | '); old_scene = re.sub(r' \(check: .*\)$', '', cells[2])
            if old_scene == alt1: continue   # the picture keeps its alt: its row stays whole, whoever wrote it
            hand = '(check:' in cells[2] or cells[4] != NEG or not template_start(cells[3], old_scene, SUBJECT.get(mid, ''))
            if hand: manual.append(ser); continue
        # Every row the driver writes carries the scene's mood after the table's words (Mikey's answer to Q128).
        problem = mood_problem(mood)
        if problem: moodless.append(f'{ser} ({problem})'); continue
        # A kept character-sheet note ends the prompt (pass LX: it used to land after the negative prompt).
        sheet = re.search(r"Character: C\d+(?:, C\d+)*\.", old.group(0)) if old else None
        row = f"| {ser} | {mid} | {alt1} | {prompt(alt1, SUBJECT.get(mid, ''), bg, mood)}{(' ' + sheet.group(0)) if sheet else ''} | {NEG} | Needed |"
        if old: L = L.replace(old.group(0), row, 1)
        else: new_rows.append(row)
# Nothing is written while a row needs a hand rewrite or a mood: each list is printed, and the driver stops.
if manual:
    print('Stopped: these pictures have hand-written ledger rows and new alts. Rewrite their rows by hand (scene, check note, prompt), then run the driver again:', ', '.join(manual))
if moodless:
    print("Stopped: these pictures need a mood, two to four words of MOOD_WORDS (Mikey's answer to Q128). Give the story mood=..., or a picture its own (alt_mood, or a fourth item in more), then run the driver again:", '; '.join(moodless))
if manual or moodless: sys.exit(1)
open(p, 'w').write(s.replace('APOS', "\\'"))
# New rows end the story scenes, just before the Course stories heading, with one blank line before it whether or not the ledger
# had one (pass NY: S4228's row had come to touch the heading, and the anchor, which asked for the blank line, stopped every batch
# that added a picture).
if new_rows:
    heading = "\n## Course stories (CS serials)"
    assert L.count(heading) == 1
    before, after = L.split(heading)
    L = before.rstrip('\n') + "\n" + "\n".join(new_rows) + "\n" + heading + after
open('docs/ART-REQUESTS.md', 'w').write(L); print('stories', len(NEW), 'new rows', len(new_rows), 'next serial', next_serial)
