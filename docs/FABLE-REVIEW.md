# The writing review, for Fable

Written 2026-10-03 (pass JE) from Mikey's review of the newest lessons on his Mac. Mikey decided that Fable 5.1 does this rewrite, and asked that this file say plainly what he wants. Read it with docs/NEW-CHAT.md before the first rewrite. The work list, in order, is docs/REVIEW-LEDGER.md.

## What Mikey said, in his words

- "It reads robotically and has grammatical issues."
- "It reads as if it is just a bulleted list of facts rather than flowing nicely, looking at information from various perspectives and truly focusing on getting an idea across. Sounds more like it's attempting to check a box that the fact was presented."
- "I don't care if long explanatory text increases length, the ability to truly learn the information is priority. Not shooting for memorization."
- "Maybe lessons can read like stories and be more explanatory with greater context. We want thorough understanding not merely mapping to and crossing off of standards."
- "The stories are written a little better but are just kind of off a little. Maybe make them sound even more natural. The varying sentence length is good but the constant use of colons, odd starting points and assumptions."
- "We can cut back a lot on colons in our writing and cut back a little with semi colons too."
- "Maybe an example or short explanation can be added to some of these questions for context? Only the early learners need shorter questions but even those should prioritize context and flow over character limits."

## Why the old writing came out this way

The house rules and the pace produced it. Teaching text was written one idea per line. A test requires every quiz answer to appear in the lesson, which rewarded naming terms over explaining them. Prompts were capped at 70 characters. Each pass shipped a whole course in one turn, and no check measured whether a lesson reads well. Pass JE lifted the prompt cap and rewrote the house rule. Keep the good parts of the old rules (every answer is taught before it is asked, sentences stay at 32 words or fewer and key ideas at 28) and drop the habits.

## What good looks like

### Lessons, grade 3 and up

- Explain the idea as a system. Say what it is, why it exists, how its parts connect, where it shows up in a reader's life, and what goes wrong without it, in the order a curious person would ask.
- Write connected paragraphs, the way a good teacher talks, never a stack of one-line facts. Length is welcome when it buys understanding.
- Show the idea from more than one side. Give a worked example with real context, an everyday comparison, and the view of someone who would see it differently.
- Define a word in the sentence where it first matters, then use it again so it sticks.
- Every answer in the module's question bank is still taught in the lesson (tools/untaught.mjs), but taught by explaining it, never by listing it.
- Colons rarely, semicolons sparingly. A colon joining two thoughts is usually two sentences, or one sentence with "because".

### Early years, pre-K to grade 2

Short, spoken, and shown rather than told, as now, but natural. Context and flow come before length.

### Questions

- Ask in natural, complete sentences, the way a teacher would say them aloud. Write answers the way a person would say them.
- Give context when a question needs it, with a short example or the bank entry's setup line (returned as `story`). There is no character limit now. A 400-character guard only catches a pasted paragraph.
- Never trade accuracy for flow. Mikey's own example shows the trap. "As prices rise, what happens to demand? It falls." mixes up the exact idea the course teaches. A rising price lowers the quantity demanded, a move along the curve. A fall in demand means the whole curve shifted because something else changed, like income or tastes. A version that flows and stays right is "When the price of something rises, what usually happens to the amount people want to buy? It falls." In the same way, "Which word best describes when supply equals demand?" reads well but blurs the idea, so ask "What do economists call the price where the amount buyers want matches the amount sellers offer?"
- Mikey's other examples, to fix first: the production possibilities frontier question about the frontier moving outward (it needs a picture in words of what moved and why), "Comparing the benefit and cost of one more unit" (too blunt; give a small example, such as deciding whether to bake one more batch of cookies), "Where quantity supplied equals quantity demanded is called what" (sounds machine-made), and the lesson line "A cold snap raises demand for heaters while a new factory raises their supply: the quantity sold rises for sure, and the price depends on which shift is bigger." (explain each shift in its own sentence, then what the two do together).

### Stories

- A natural voice, varied sentence lengths and few colons. Open where a reader can follow, not on an odd detail.
- Never assume the reader knows something. "Adam Smith opened the Wealth of Nations" never says it is a book, Smith's 1776 book about what makes nations rich, and a line about "the day the transmission goes" assumes a car-repair idiom. Say what a thing is the first time it appears, and let the story grow when that is what it takes. The pin factory deserves the room.
- Keep the Miniature Gladwell arc, the cast rules and the true-story checks (every fact verified by web). Keep every picture beside the paragraph it shows (the art audit); a rewritten paragraph may need its picture's caption and prompt updated in docs/ART-REQUESTS.md.

## How to work

1. One small batch a pass. Three or four modules (lesson, story and questions together), more for the early years. Slow is the point.
2. For each module, read the lesson, the story and the bank, then rewrite them together. Check every fact by web, with the newest research and older findings kept as history with their date. Read every sentence aloud.
3. Keep the standards citations exactly as they are unless one is wrong. Keep the bank at least as large as it is, since questions are never reduced, and keep every answer taught.
4. Mark each item in docs/review-status.json with the pass name, then run node tools/review-ledger.mjs > docs/REVIEW-LEDGER.md. The ledger's colon counts show the change.
5. Deliver the pass the usual way (docs/NEW-CHAT.md and CLAUDE.md), and say in the DECISIONS entry what changed in each module.
6. After the first batch, ask Mikey whether the new voice is what he wants before going wide.
7. New courses after the review (PHIL 1301 and the rest) are written this way from the start.

## Learned in pass JF, from the first rewritten module

- The screen used to break every lesson paragraph into one sentence per line (formatTeachingText), which is a large part of why lessons read like checklists. Set `prose: true` on every rewritten lesson so its paragraphs stay whole, and put each key term in bold (**term**) where it is defined.
- Scarcity, trade and markets (college macroeconomics: the lesson, the story S3596 and the bank macro-markets) is the first rewrite and the reference for the new style. Read it before writing, and change it too if Mikey asks.
- A question that needs a situation gets a setup line, the bank entry's fifth item, and its prompt names the setup with "this". The untaught check reads answers of three words or fewer, so those words must appear in the lesson's paragraphs or key idea (for example "it falls" and "it moves outward").
- A short story may run to 350 words. If one truly needs more room, ask Mikey before raising STORY_WORD_LIMIT.

## Order

docs/REVIEW-LEDGER.md lists the four modules Mikey named first, then every module from college down to pre-K, then the long stories, the games and the Wonder questions. Mikey may reorder it.
