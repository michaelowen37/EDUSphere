# The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
# Long-story batch driver (2026-09-24): doubles course stories. Run: python3 tools/stories/long-batch.py <batch.py>
# The batch file holds NEW = { courseId: dict(about, alt, mood, more=[(scene, after) x5], words=[...]) } and BG = { courseId: 'background' },
# apostrophes written APOS. It rewrites each one-line entry in COURSE_STORIES (about, scene, words, five more pictures with
# CS serials after the last one in the ledger), updates the main ledger row's scene and adds five rows in Mikey's template. Since
# round one's code read of pass NY a main row whose scene changes takes the story's mood with it, where it had kept the mood written
# for the scene it replaced; a main row whose scene is the same keeps its own.
# Since Mikey's answer to Q128 (pass NY, November 23, 2026: "Q128- C (let's prioritize this because I will be working on
# images soon).") each of the five rows carries its course subject's whole "Playful modifier" cell from docs/LEONARDO-BRIEF.md's
# table, then the scene's mood: mood is the story's, two to four words of tools/stories/batch.py's MOOD_WORDS for the feeling of
# its scenes, and a picture whose feeling differs names its own as a third item, (scene, after, mood). A row with no mood it can
# use stops the driver before anything is written, its serials listed. Since his answers to Q132 and Q133 (the same afternoon) a
# row's words and anchor are style_for's, batch.py's rule: a beat in a Math course without Math's "cheerful and", and a subject
# the table gives no words of its own Reading's where the scene shows a person and Science's where it shows things; a main row
# whose scene changes takes the words and anchor of its new scene with the story's mood.
# Apply a batch of doubled long stories: story data, ledger rows, and (once) the tests and the printed book.
import re, json, subprocess, sys
NEW = {}; BG = {}; exec(open(sys.argv[1]).read())
s = open('src/stories.mjs', encoding='utf-8').read(); L = open('docs/ART-REQUESTS.md', encoding='utf-8').read()
q = lambda t: t.replace('APOS', "\\'")
next_cs = max(int(x) for x in re.findall(r'^\| CS(\d+) \|', L, flags=re.M)) + 1
subj = json.loads(subprocess.check_output(['node', '-e', "import('./src/logic.mjs').then((L)=>console.log(JSON.stringify(Object.fromEntries(L.COURSES.map((c)=>[c.id,c.subject])))))"]).decode())
# The subject table, the bans and the mood words are tools/stories/batch.py's, read from its file, so the two drivers write one rule.
b = open('tools/stories/batch.py').read(); MOD = eval(re.search(r'^MOD = (\{.*\})$', b, re.M).group(1)); NEG = re.search(r"^NEG = '([^']*)'", b, re.M).group(1)
MOOD_WORDS = re.search(r"^MOOD_WORDS = '([a-z ]+)'\.split\(\)$", b, re.M).group(1).split(); MOOD_JOINERS = re.search(r"^MOOD_JOINERS = '([a-z ]+)'\.split\(\)$", b, re.M).group(1).split()
# What is wrong with a scene's mood, or None when nothing is, by batch.py's rule (its mood_problem): two to four words of
# MOOD_WORDS, a joining word only between two of them, never two together and no word said twice (since round one's code read of
# pass NY, as batch.py's).
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
# A row's words and anchor, by batch.py's rule (Mikey's answers to Q132 and Q133, pass NY, November 23, 2026: "Q132 - A", "Q133 - A"): its subject's
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
# A row's prompt: the scene, its words (style_for), the scene's mood, the house style and its anchor.
def prompt(scene, subject, bg, mood):
    mod, anchor = style_for(subject, scene, mood)
    return f"{scene}, {mod}, {mood}. Style: Clean 3D vector illustration, vibrant and engaging color palette, minimalist {bg} background, balanced lighting. Professional educational graphic style, clear focal point, uncluttered layout, {anchor}."
rows = []
moodless = []   # serials whose rows would carry no mood the driver can use (Mikey's answer to Q128), each with why
for cid, d in NEW.items():
    # Each long story sits on one line: 'id': { title: ..., about: ..., art: ..., alt: ..., cast: [...], words: [...] },
    m = re.search(r"^[ \t]*'" + re.escape(cid) + r"': \{.*\},?$", s, re.M)
    if not m: raise SystemExit('line not found ' + cid)
    block = m.group(0); art = re.search(r"art: '(CS\d+)'", block).group(1)
    old_alt = re.search(r"alt: '((?:[^'\\]|\\.)*)'", block).group(1).replace("\\'", "'")
    nb = re.sub(r"about: '(?:[^'\\]|\\.)*'", lambda _: "about: '" + q(d['about']) + "'", block, count=1)
    nb = re.sub(r"alt: '(?:[^'\\]|\\.)*'", lambda _: "alt: '" + q(d['alt']) + "'", nb, count=1)
    have = re.findall(r"serial: '(CS\d+)'", nb)
    serials = have[:5] if len(have) == 5 else [f'CS{next_cs + k}' for k in range(5)]
    if len(have) != 5: next_cs += 5
    nb = re.sub(r", more: \[.*?\}\]", "", nb, count=1) if have else nb
    words = "words: [" + ", ".join("'" + q(w) + "'" for w in d['words']) + "]"
    more = "more: [" + ", ".join(f"{{ serial: '{ser}', after: {aft}, alt: '{q(alt)}' }}" for ser, (alt, aft, *_) in zip(serials, d['more'])) + "]"
    nb, n = re.subn(r"words: \[(?:'(?:[^'\\]|\\.)*'(?:, )?)*\]", lambda _: words + ", " + more, nb, count=1)
    assert n == 1 and nb.count("more: [") == 1, cid
    s = s.replace(block, nb, 1)
    lines = L.split('\n'); k = next(i for i, x in enumerate(lines) if x.startswith(f'| {art} |'))
    new_alt = d['alt'].replace('APOS', "'"); lines[k] = lines[k].replace(old_alt, new_alt); ch = re.search(r'Character: (C\d+)\.', lines[k]); lead = ch.group(1) if ch else None
    # A new scene takes the story's mood (round one's code read of pass NY): the mood after the subject's cell, up to ". Style:", is the
    # story's once the scene changes, and a story mood the driver cannot use stops it as a picture's does.
    if new_alt != old_alt and d.get('mood'):
        problem = mood_problem(d['mood'])
        if problem: moodless.append(f'{art} ({problem})')
        else:
            # The row as the template wrote it for its old scene (its words for that scene and a mood), rewritten with its new
            # scene's words, the story's mood and the new scene's anchor (Q133: a scene that comes to show a person takes Reading's).
            cells = lines[k].split(' | '); head = cells[3].split('. Style:')[0]; old_mood = head.split(', ')[-1]
            old_cell, old_anchor = style_for(subj[cid], old_alt, old_mood)
            if head == new_alt + ', ' + old_cell + ', ' + old_mood and '. Style:' in cells[3] and ('uncluttered layout, ' + old_anchor + '.') in cells[3]:
                cell, anchor = style_for(subj[cid], new_alt, d['mood'])
                cells[3] = new_alt + ', ' + cell + ', ' + d['mood'] + '. Style:' + cells[3].split('. Style:', 1)[1].replace('uncluttered layout, ' + old_anchor + '.', 'uncluttered layout, ' + anchor + '.', 1); lines[k] = ' | '.join(cells)
    lines = [x for x in lines if not any(x.startswith(f'| {ser} |') for ser in serials)]
    # Each picture's mood is the story's, or its own third item where its feeling differs (Q128); a row without one is listed.
    for ser, (alt, aft, *own) in zip(serials, d['more']):
        mood = own[0] if own else d.get('mood'); problem = mood_problem(mood)
        if problem: moodless.append(f'{ser} ({problem})'); continue
        a = alt.replace('APOS', "'"); tag = f' Character: {lead}.' if lead and re.search(r'\b(boy|girl|brother|brothers)\b', a) else ''
        rows.append(f"| {ser} | {cid} | {a} | {prompt(a, subj[cid], BG[cid], mood)}{tag} | {NEG} | Needed |")
    L = '\n'.join(lines)
# Nothing is written while a row needs a mood: the list is printed, and the driver stops.
if moodless:
    print("Stopped: these pictures need a mood, two to four words of tools/stories/batch.py's MOOD_WORDS (Mikey's answer to Q128). Give the story mood=..., or a picture its own as a third item, then run the driver again:", '; '.join(moodless)); sys.exit(1)
lines = L.split('\n'); last = max(i for i, x in enumerate(lines) if re.match(r'^\| CS\d+ \|', x)); lines[last + 1:last + 1] = rows; L = '\n'.join(lines)
L = L.replace('One picture each, delivered like story art', 'One picture each until a story is doubled, then six (2026-09-24), delivered like story art', 1)
open('src/stories.mjs', 'w', encoding='utf-8').write(s); open('docs/ART-REQUESTS.md', 'w', encoding='utf-8').write(L)
print('long stories written; rows', len(rows), 'next CS', next_cs)
