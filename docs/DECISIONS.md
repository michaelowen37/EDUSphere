# EduSphere — decisions, phase 1 plan, compliance, costs

Approved by Mikey on 2026-09-04 unless marked "proposed".

## Decisions
- Schools remain the core plan. (Considered a pure direct-to-families/home-supplement pivot on 2026-09-05 — weaker core promise since a home tool adds practice time rather than reclaiming school-day time, plus a crowded market with free incumbents like Khan Academy — and decided against pivoting away from schools.)
- Two consent paths, both in scope, sharing the same product: institutional (schools and formally-organized microschools, consenting under COPPA's school exception) and direct-family (homeschool families, via standard parental consent — a parent creates the account, verified the usual way with a payment card). No new build for either; only the signup/consent flow differs.
- Marketing focus is deliberately narrow for now: microschools and homeschool families, because the mastery/reclaim-the-day philosophy is the actual differentiator for them. Marketing to traditional-school families who want supplemental practice on top of normal school is deferred, not rejected — that segment buys on content breadth and price against free incumbents, not philosophy, and the library isn't broad enough yet to win that fight. Self-serve signup isn't blocked to that audience if they find it on their own; the decision is not to spend marketing effort chasing them yet. Revisit once the coverage map is wider and the aligned segments have produced case studies.
- Branching into specialized trades and corporate training stays a goal either way. Already supported structurally: `subject` and `audience` on each course in `logic.mjs` are plain strings, not a K-12-specific enum, exactly so a course can later be "Electrical safety" for "New hires" as easily as "Math" for "Grade 3." No rework needed to add a vertical — just new courses.
- Texas first, so standards alignment is TEKS first; Common Core codes are kept as secondary tags.
- Rostering and sign-in through what schools run (Clever, ClassLink, Google Workspace for Education) are phase 1 requirements, not extras.
- Student identifier = school-issued ID created by an admin or imported from rostering. Students pick from a class list and never type an ID. Admins can edit, rename, deactivate, and merge (a merge is one event that re-tags two histories; nothing is deleted).
- Content: white-glove first (we build early customers' modules), then tiers — Standard (our library + course switches), Plus (AI-assisted upload with admin approval), Enterprise (white-glove onboarding, custom content, SSO, scheduled reports).
- Uploads never design a sequence from scratch: customers place material into a standards-aligned skeleton per grade that is already ordered foundational → advanced; the pedagogy check flags out-of-order material.
- No public ledger (Hedera or other) in the core product. Nothing about a child ever goes on an immutable public chain. Revisit only for anchoring completed credentials, if a customer asks; signed verifiable credentials come first.
- Coverage is proven, not assumed: a coverage map per grade (every standard → modules) with a test that fails while any standard has no module, and a pilot measured against an outside assessment.
- "Wonder" reflection block: open questions with no right answer; typed for readers, pick-a-picture or tell-an-adult for younger children; never graded, never gating; followed by four respectful voices (scientist, artist, grandparent of faith, skeptic) with none declared right, ending on an open question; every prompt and perspective human-approved before publication; must never imply religion or non-belief is wrong.
- Minutes per day is a first-class metric (the efficiency claim). Fun through variety, pictures, and stories — no streak pressure on young children, no dark patterns.
- Design: dark theme as a toggle (default on for educators, light by default for young learners), a modern readable sans (Lexend or Atkinson Hyperlegible), playfulness through color and illustration, no licensed characters. Done after foundations.
- The confidence score is a printed rubric tuned from data, not a copy of any other product's formula.

## Phase 1 plan (needs Mikey's approval before any service is purchased)
- Stack: Python + FastAPI, PostgreSQL, React. Managed Postgres with row-level security so an educator can only read their own students' rows — enforced by the database, not app code.
- Data: `schools`, `classes`, `learners` (ID only), `enrollments`, `courses/modules/questions`, one append-only `events` table (app role: INSERT and SELECT only). Reports are SQL views over `events`; each view's definition is printed on the report; scheduled reports run the same view on a timer and deliver CSV/email.
- Sign-in: class code + pick your ID (+ PIN for older grades); district SSO. No child emails or passwords held by us.
- Backups: the managed database's automated daily backups and point-in-time recovery. No spreadsheets.
- The educator sign-in screen needs a "Forgot password" link once real accounts exist. In the prototype there is only a shared PIN, so there is nothing to recover yet.
- Sign-in fail-safes (raised 2026-09-05, both impossible in the single-device prototype and both real once the app is centralized):
  - Two students signing in as the same person at once: the later sign-in takes over and the earlier session is ended. Both sessions are written to the event log, so an educator can see it happened and when. Whether that also raises an alert is a decision for the pilot, once we know how often it actually occurs.
  - A student picking the wrong name from the list: three protections, in order of cost. The name is shown prominently on the very next screen, so a mistake is visible within seconds. Backing out to the list costs nothing and records no progress against the wrong student. On shared devices, each student gets a short PIN or a picture password, which is how schools already handle this. If work does land on the wrong record, merging is already built and nothing is lost.
- Review scheduling: spaced review across days/weeks using the confidence score (the "reroute by confidence" behavior).
- Voice: device voice now; a paid text-to-speech service is a phase 1 choice (only question text is sent).
- Phase 2 content pipeline (a graph, not a line): Intake → Structurer (modules, order, standards) → checkers: facts (every claim cited), age-appropriateness, coverage (5+ question types, by code) → pedagogy/order check → human lead-admin approval → publish. Any checker can send the draft back with notes. Every step logged. No agent states a fact it cannot cite; practice is computable or sourced. Teacher-suggested edits enter the same flow.

## Compliance rules (every decision is made with these in mind)
- COPPA: schools consent under the school exception; we collect the minimum; parents and schools can request export and deletion; retention is limited to the agreed period.
- FERPA: we act as a school official under a data-processing agreement; data is used only for the school's purposes; never re-shared.
- State laws: Texas student-privacy law and each customer state's equivalent; sign the district's standard data privacy agreement.
- Collected: school-issued ID, class, and events. Never: names, emails, photos, audio, free text from children, ads, trackers. Read-aloud is output only; there is no microphone.
- Before real students: privacy policy, DPA template, parental/school consent flow, review by an education-privacy attorney. Later: a COPPA Safe Harbor program.
- Accessibility: public schools are held to it — readable type, contrast, screen-reader support, captions for any audio.

## When money starts (rough, changeable)
- Phase 0: $0.
- Phase 1 pilot: managed database + small backend host $15–50/month; domain ~$15/year; text-to-speech pennies per thousand characters; content-pipeline AI calls cents to a few dollars per uploaded document.
- Non-software: privacy attorney review (hundreds to a couple thousand dollars); school-required liability insurance; much later a formal security audit (tens of thousands) when a customer requires it.

## Working method (from the Claude Code best-practices guide, adopted)
- CLAUDE.md stays short: commands, rules, gotchas. Detailed how-tos live in `.claude/skills/` and are loaded on demand.
- Every change ends with `./check.sh`; a Stop hook in `.claude/settings.json` runs it automatically (verify the hook with `/hooks` on first use).
- Explore → plan → implement → check for anything larger than a one-sentence diff.
- Larger changes get a fresh-context review by `.claude/agents/reviewer.md`, gaps only.
- `/clear` between unrelated tasks; after two failed corrections, start a clean session with a better prompt.

## Built on 2026-09-04 (free improvements)
- Browser click-through test found and fixed a real bug: the educator's learner list did not refresh during a session.
- Reading course (Kindergarten, Letters): letter names, order, first letters, counting letters, big/small matching — all computable, read aloud, tap only.
- Wonder block: one typed question after fractions mastery, one pick question for kindergarten courses, four voices, closing question; words never stored; counted as reflections on the educator report.

- Transcript: a printable record of every course a student has worked on, kept whether or not the course is still switched on. Courses never opened are left out, because an untouched course says nothing about a student. It carries the school-issued identifier, the modules, the dates and the confidence figures, and nothing a student wrote. That keeps it inside what a school may share under FERPA and what we may hold under COPPA.
- Mastery is defined per module rather than platform-wide. Five questions suits counting to ten; a twelfth grade physics module may want three longer ones. Courses and modules can override both the number asked and the number needed.

- Life skills are suggestions for educators rather than content for students. Nothing is graded, tracked, or shown to a child, which keeps the section outside the student record entirely.
- They are listed as one sequence from earliest to most mature rather than assigned to grades. Grade assignment implies a precision nobody has, and a mixed age classroom has no single grade to look under. The sequence is an order, not a schedule. This also removes most of the reason an administrator would need to edit the list, so editing is not built for now.
- The screen shades each skill from the palest green at the top to deep forest green at the bottom, so the sequence is visible before a word is read. Four stage markers (Early, Growing up, Teen, Nearly grown) break up a long column without splitting the sequence.
- Educators can mark a skill as covered. This belongs to the classroom, never to a student, so no soft judgment about any child enters a record a parent could request. Covered skills are ticked and muted in place rather than moved, with a Hide toggle for when the list gets long. The word is "covered" rather than "complete", because most of these are never really finished.

- Reflection questions require approval by the school before any student sees one. This is the most sensitive content in the platform, so approval is opt in rather than opt out: an unreviewed question simply never appears. An educator reads the prompt, all four voices and the closing question, then approves, removes, or leaves it. Approval can be withdrawn at any time. This is also a selling point worth stating plainly to schools, since no reflection content reaches a child that somebody there has not read.
- There is nothing for an educator to review in a student's own reflection answers, because those are never saved.

- Onboarding asks for a rough starting level (Early years, Elementary, Middle school, High school and beyond) so the placement check begins near the child and an older student never sees pre-K questions. It is a starting point the check adjusts, not a label.
- Only the early years are asked for a sign-in picture, at the moment of adding, and it can be added or changed later from the roster. Pictures are drawn in the app from a fixed set of eight; photo upload is deliberately not offered.
- Courses containing a module that needs a touch screen carry a warning where the educator assigns them.
- For pre-reader courses, finished modules fold behind one star row so the next thing to do is seen first.

- Sign-in pictures are twelve drawn animals on six background colours, seventy-two in all, so a large school never needs two children to share one. Adding a young student suggests an unused picture automatically, and a duplicate is flagged rather than forbidden.
- Operations are written down in docs/RUNBOOK.md: managed services for everything in phase 1, a developer on retainer, a status page, and a downtime procedure that starts with rollback.

- Development in phase 1 is done through Claude Code against this repository, with `./check.sh` as the gate, rather than a developer on retainer. One human (Mikey) holds the production credentials and the three buttons: roll back, restore a backup, post to the status page. A freelancer's name is kept on file for hands-on help by the half day.
- Phase 1 hosting: Supabase for the database and sign-in (managed Postgres, automatic backups, point-in-time restore, a readable dashboard, a signable data processing agreement) and Vercel for the app (deploy from the repository, one-click rollback). Chosen for status pages and rollback buttons a non-technical owner can use.

- Local-first, decided 2026-09-10 in answer to Mikey's question. The record of what happened is the whole truth, so a file holding every record is a complete backup, and restoring it recreates the classroom on any device. This removes the database, the accounts, the hosting bill and, most importantly, any child's record on a server we would have to protect. The cost is a habit: someone presses Download backup, and the app nags after seven days. Restoring merges by student id and joins event logs, so it can only ever add history. A server is deferred until a customer genuinely needs cross-device sync, which is a large-school problem, not a microschool one. Automatic emailing of reports is not possible without a server; a downloaded file the educator emails to themselves is the equivalent.

- Backup cannot email itself without a server. On a phone or iPad the Share button opens the device's own sheet, where Mail is one tap away; elsewhere it downloads. File names carry the device name, the student count and the date (edusphere-ipad-3-12-students-2026-09-10.json) so a folder from ten devices reads at a glance. A touchless auto-save to a chosen file is possible in Chrome and on Chromebooks and is a next step; iPads do not support it.
- Educators stay signed in while active. After four quiet minutes a warning appears; after five the PIN is asked again. Returning within five minutes of the last activity skips the PIN.

- Loop-back routing, built 2026-09-10: two failed rounds in a row on a module reopen its nearest prerequisite for a quick check, even one mastered before. The result screen says so in plain words and offers it as the one thing to do. It is recorded as an event so the educator's module story mentions it. The prerequisite graph is what makes this reach across grades once content exists there.
- An educator creates an account once, from a Create account link under Educator Login: they choose a PIN (four to six digits, a convenience lock stored scrambled on the device), name the device, and pick their state, with an i tip explaining why the state matters. After that, Educator Login asks for the PIN and nothing else. The prototype PIN 2468 still opens the door on a device with no account, so testers are never locked out.
- The Classroom page no longer shows the coverage line; the state and a Change state link sit under the i tip beside the roster text.

- Content written 2026-09-10 while Mikey was away: kindergarten math gained one more/one less, joining and taking away (story word problems), comparing numbers, and shapes; kindergarten reading gained letter sounds and rhymes. Every new generator is re-derived independently in the tests from the question's own words, across 300 seeds. Kindergarten math now covers 13 of 18 TEKS standards, kindergarten reading 5 of 10.
- Word lists for reading (SOUND_WORDS, RHYME_FAMILIES) use only words a kindergartener says and hears. Adding to them is how reading content grows; the tests check every combination automatically.

- All states, decided 2026-09-10: a module is the unit and a standard is a label, so every standard in the plan carries a framework (TEKS or CCSS) and every course is mapped to both. An educator chooses their state once at first sign-in; the Classroom page shows coverage against that state's framework. Fifty states plus DC are listed. Adding a framework means adding its codes to the standards, not new content.
- Updates reach educators by opening the site, because the app is served from a static address and holds no accounts. A backup fixture per format version is kept in tests/fixtures and must restore forever.
- Onboarding documents for whoever comes next: CLAUDE.md now opens with a reading order; docs/VISION.md holds the why; docs/ALGORITHMS.md explains every number and marks which are judgements.

- The class view ("Who needs help"), built 2026-09-10: every active student ranked by a need score built only from what is in their record (modules stuck on, loop backs, guessing flags, low confidence on mastered work, time since last practice), with the reasons listed in words so the score is never a mystery, three bands (needs help now, keep an eye on, on track), a one-sentence summary at the top, and Open report on every row.
- The spoken Wonder for pre-readers: one spoken question, large tap targets, two short voices shown one at a time and spoken as they appear, offered once after a mastery and only when approved.

- Letter tracing, built 2026-09-10, is the first touch-screen module and the answer to "how do they learn to write without paper". Twelve capital letters are defined as strokes on a 100 by 100 grid; the pad shows them faintly with a green starting dot and an arrow; the finger's path is checked by arithmetic: every stroke must be visited in order within a tolerance that forgives a wobbly hand, and most of the drawing must lie on the letter so a scribble fails. The Letters course now carries the touch-screen warning. Lowercase letters and curves beyond O and C are the next step.

- Reflection answers stay unsaved, decided again 2026-09-10 after the move to local-first. The legal exposure shrank, but two reasons stand: a child who knows a teacher will read it writes to perform rather than to think, and anything stored travels in backup files that get emailed around. If Mikey wants it, the honest form is an educator switch, off by default, with answers excluded from backups unless explicitly included.
- "Arithmetic, not AI" means: built from checked rules and word lists, never composed by a language model at question time. Open writing is the stated exception: prompts from templates, structure checked by rule, quality judged by a person or an AI assistant with a teacher confirming.
- Browser account sync does not share EduSphere data: browsers sync settings, not a site's storage. One device per student, or restore before switching. Subscription tiers by device count are fine; sync is not to be promised.
- Selling and sign-in without a server of ours: a static landing page with Buy and Log in, purchase through a payment service that issues a license key at checkout, the key checked offline by the app. The only thing maintained is the payment dashboard. The page also lists permissions (allow downloads for backups; no microphone; no account) and device advice (Chromebook or desktop Chrome for touchless backup, iPad for finger tracing).
- Pre-K courses are non-linear: parallel activities where only named prerequisites apply. Pre-K standards come from the Texas Prekindergarten Guidelines and the federal Head Start Early Learning Outcomes Framework.

- Reflection answers: confirmed unsaved, 2026-09-10.
- A vendor-held copy of every backup: declined 2026-09-10. It would make EduSphere the custodian of every child's record from every school, which is the server-side data the local-first design avoids, and it needs a data agreement under FERPA and COPPA. Support instead runs on the school's own cloud folder (touchless backup into Drive) and files shared on request. A per-school opt-in under a data agreement is a phase 1 possibility, after the attorney review.

- The product ships as `index.html`, built by `tools/build-site.mjs` with React bundled in and storage on the browser's localStorage, so GitHub Pages or any plain host can serve it and nothing is fetched at run time. The `.jsx` artifact remains for the chat preview only. A test reloads the standalone page in a real browser and checks a student survives the reload.

- Desktop layout: the content column widens to 720px on screens over 1000px, the welcome card sits lower, and on screens over 1240px a pair of quiet arcs in the logo's green fill the edges without ever touching a tap target. The backup link glows in place when a backup is due, rather than carrying a halo.

- A forgotten PIN is reset only with a backup file of this classroom, decided 2026-09-11 after Mikey pointed out that a student on a shared device could otherwise reset the PIN and tamper with records. Every backup carries a recovery code made when the account was created; the reset checks it. A student does not have the educator's backup file. Each reset is recorded in the profile and shown on the Classroom page. The PIN itself is never in a backup or a file name. Two limits stated plainly: a brand-new account with no backup cannot be reset (the Classroom page nudges for a first backup), and a student who knows browser developer tools can read anything stored locally, which is the floor for any offline app and why the PIN is called a convenience lock.
- Sign out on the Classroom page ends the educator session at once, so the next person at a shared device meets the PIN screen.
- Contact us opens a small popup with the address and an email button, rather than showing the address beside the link.

- The recovery code sits first in every backup file with a note saying what it is for, shows on the Backup page to a signed-in educator, and can be typed on the Forgot PIN screen instead of choosing the file. Nobody has to open a backup to find it, but anyone who does sees it at once.

- Reflections come round after every two mastered modules (Mikey asked for every two or three, 2026-09-11), drawn from a pool shared across courses at the same stage and rotated so the least recently answered comes first. Six more questions were written so the rotation has something to rotate through: three for the early years, three for grades 3 to 5. The logo is now the browser-tab icon, built from the same drawing.

- A reflection question is never offered a third time to the same student (WONDER_MAX_REPEATS = 2), decided 2026-09-11. Once every approved question in a stage has been answered twice, the reflection is skipped rather than repeated. Pool size therefore governs how often reflections appear, never whether one repeats. The pool grew to 36 (17 early years, 19 grades 3 to 5) and should keep growing; the teen and grown stages have none yet because no courses exist there.

- Reflection themes, decided 2026-09-11 from Mikey's list: world (curiosity), failure (failure is how learning happens), feelings (naming and handling them), ups-and-downs (hard days are normal and we get through them, without getting tied up in our own narratives). Every question carries one. The cadence counts finished rounds, pass or fail, not masteries, so a struggling child meets reflections more often; after a failed round the failure, feelings and ups-and-downs questions come first. The pool is 56 and a coverage check notes any stage with fewer questions than modules, so the pool keeps pace as the curriculum grows.

- Three.js is not used, decided 2026-09-11 when Mikey offered it. It weighs about 600 KB and needs a graphics context that some locked-down school devices disable, so it would slow the first load and fail quietly on the machines a microschool is likely to have. The 3D look is achieved with gradients in the SVG drawings we already use (shaded solids and counting balls), which weigh nothing and render everywhere. Three.js stays an option for one specific future screen, such as a solid a child can spin, loaded only there.

- Young learners, redefined 2026-09-11 on Mikey's instruction: a student with ANY early-years course (pre-K to grade 2) still unfinished gets the handheld screens, whatever else is assigned. Early courses list first in every subject, the prerequisite graph keeps advanced work locked until the early work it depends on is mastered, and the star row counts only early modules. Once every early course is complete the student graduates to the regular screens.
- A new student starts on the recommended courses for their level (the two lowest grades of their band), not on every course. Course lists on the report run pre-K first, college last.
- Every user-facing string is checked for American spelling and house style by tests/spelling.test.mjs (step 3 of check.sh). Contractions are welcome. Mikey's exact wording is never overridden once given.
- The educator report: a collapsible bulleted summary (open by default), a collapsible Assigned now list (closed), all per-course progress behind one Progress by course dropdown with an i tip (closed), and Key Words - Explained with each term folded until tapped. Reviewed Wonder questions fold under a Reviewed row per stage so the next awaiting question is always at the top. Every i tip shares one gradient look and closes on sign out and on leaving a screen.

- index.html stays one generated file on purpose: it runs from GitHub Pages, a USB stick or a double-click with nothing to fetch, and its length costs nothing because nobody edits it. The sources are already split (src/logic.mjs, src/curriculum.mjs, src/ui.jsx) and those are what get edited.
- New students start on the lowest grade of their band only (pre-K for early years). Finishing every module of a course switches on the next course up in that subject automatically, recorded as a courses_enabled event so the educator sees it and can change it. A placement check, once built, will jump further.
- Young learners' subject cards breathe (a gentle scale and soft shadow on the card itself) instead of carrying a halo that grew beyond the screen; locked modules are not shown to them; the finished-modules fold sits below the available modules. Reflection screens open with a sliding "Let's Wonder!" title. The matching lesson shows two shapes side by side.
- The test browser runs with reduced motion, because a card that breathes forever never looks still to an automated click.

- The zip is the repository: it unpacks without a wrapper folder and contains exactly what GitHub should hold (no dist/). A .gitignore keeps .DS_Store and test output out. The tab icon is a bold drawing of its own (green disc, gold arc, white E) because the full logo's arcs vanish at sixteen pixels. On laptops the welcome page is a full-height column: logo a third bigger, a taller sign-in box, the three links at the foot and larger, and the side arcs wider; the pointer fades letters as well as arcs.

## Open items
- Verify audio plays inside the chat artifact sandbox (works in a normal browser).
- Common Core / TEKS codes on existing modules to be checked against the official lists.
- (done 2026-09-04) Browser click-through tests: 22 checks in headless Chromium, run by check.sh.
