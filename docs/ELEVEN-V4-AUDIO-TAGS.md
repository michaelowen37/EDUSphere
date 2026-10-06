# Eleven v4 audio tags: the rules we write by

Recorded 2026-10-06 (pass LE) from Mikey's screenshots of the ElevenLabs documentation (the Audio Tags guide, the Eleven v4 launch page and its FAQ). This is the reference for every `audio` line in src/stories.mjs and every lesson line in the audio ledger. Read it before tagging a story. Where a line says "ours", it is The Wise Human's own convention on top of Eleven's rules.

## What a tag is

- An audio tag is a natural-language cue in square brackets, written inline in the script. Eleven v4 reads it as a performance marker: direction that changes how it delivers the words that follow. Tags work through the API on Eleven v4, Eleven v4 Turbo and Eleven v3; v4 follows tag sequences more reliably than v3, sound effects included.
- Tags are not a fixed list. Any direction written in plain words works, and single-word tags are only the starting point.

## The four rules of placement

1. **Place a tag before the words it affects.** "[shouts] I can't believe you said that to me" shouts the whole line.
2. **Emotion carries forward.** A tag's emotion carries across the line until another tag shifts it, so add a new tag only where the delivery should change: "[proud] I've been cooking for over a decade. I know how to boil an egg. [startled] What's that burning smell?" Ours: tag the turns of a paragraph, never every sentence.
3. **Combine tags to layer direction.** Separate tags with a comma inside one set of brackets: [whispering, playful], [low, threatening], [tense, cautious]. Ours: the closing moral of every early-years story is [slowly, warmly].
4. **Pair tags with punctuation.** Tags set mood and delivery; punctuation shapes pacing. Ellipses, dashes and capitals shape the prosody of a line, and doubling up (a pacing tag plus the punctuation) gives full control: "[slowly] Ten... nine... eight... seven... [rushed] Wait, wait". Ours: our stories carry no em dashes and few ellipses, so pacing comes from the tag and the sentence length.

## The kinds of tag, with Eleven's examples

| Kind | What it does | Examples from the guide |
|---|---|---|
| Emotion | the feeling behind a line; any emotion in natural language | [jittery], [excited], [nervous], [proud], [startled] |
| Delivery and volume | how loud or intense, independent of the emotion; layer with an emotion for more control | [whispers] Don't move, it's right behind you. [shouts] Everybody evacuate the building, now! [softly] You did everything you could. [quietly] I think they've gone. [low, threatening] You really shouldn't have come here. [hushed] Eighteenth hole. |
| Pacing | the speed of a line, for suspense or a comic beat | [slowly] And the winner is... [rushed] Sorry, I'm late, the train broke down, I ran the whole way. [pause] Then the phone rang. [drawn out] Nooo way. |
| Human-like reactions | laughter, gasps, crying, coughs, sighs, so the voice sounds like a person and not a script; v4 adds small touches (a stammer, a groan) on its own when the emotion calls for them | [laughs] You actually fell for that? [sighs] Fine. I'll do the dishes. [gasps] Is that a real diamond? [clears throat] If I could have everyone's attention. [crying] I didn't think you'd come back. |
| Accent and character | shifts a voice into a persona while keeping its qualities; one voice can play a whole cast in one generation | [British accent] Fancy a cup of tea? [French accent] Welcome to my little café. [Australian accent] No worries, mate. [pirate voice] Hoist the sails and pass the rum. |
| Sound effects | non-speech events inside the generation, so a scene needs no separate effects track | [thunder rumbling] It's getting closer. [footsteps] Someone's coming up the stairs. [door creaking] Hello? Is anyone home? [clapping] Thank you, thank you. [owl hooting] [nervous] Did you hear that? [gulp] It's just... |

## Writing your own tag

When no single word captures it, write a fuller direction:

- Combine emotions and qualities: [tense, cautious], [whispering, fearful].
- Describe the manner: [like a sports commentator, speeding up].
- Describe the situation: [out of breath after running up the stairs].
- Describe the character: [a tired detective who has heard it all before].
- Describe the shift: [starting calm, then losing patience].
- Or a whole mood: [hushed and reverent, like a nature documentary narrator].

Ours: a story's sound effects are written this way, as a short phrase that names the sound the story names ([a dice rattling and landing], [bottle caps clinking], [a marker squeaking on a whiteboard]), one to three per story, never on the moral.

## Pauses, pronunciation, limits and the API (from the FAQ)

- Pauses: write [pause] or [long pause] where a break belongs. SSML such as <break> is disabled in Eleven v4; natural-language tags replace it.
- Pronunciation: pronunciation dictionaries still define how names and technical terms are spoken. Ours: a name a voice could misread (Noor, Zara, Raj, Georgette) goes in the dictionary when the audio is made, not in the text.
- Length: a single generation supports up to 10,000 characters. For long-form content, context stitching keeps pacing and delivery consistent across generations: a full audiobook sounds like a single take. Ours: tools/audio-generate.mjs sends each clip with the words before and after it (previous_text and next_text) for exactly this reason, and the ledger reports the longest clip (508 characters) and the longest story (3,420), far under the limit. There is no reason to shorten a story for Eleven's sake; the early-years limits exist for the child, not the voice.
- Regeneration: a line can be redone any number of times without vocal drift; speaker stability holds across dialogue and narration.
- Voices: Professional Voice Clones are supported in v4 (they were not in v3) with the full emotional range in every language.
- API: streaming and non-streaming endpoints, with TypeScript and Python SDKs. Eleven v4 Turbo is the realtime model for agents; Eleven v4 is the quality model, and ours.

## Our conventions in one place

- The `audio` array of a story is its `words` with tags inserted and nothing else changed; a test holds the two equal once the brackets are stripped.
- Tags go before the words they color, at the turns of the paragraph; the emotion carries forward, so a paragraph usually needs one to three tags, not one per sentence.
- The closing moral of an early-years story is [slowly, warmly].
- One to three sound effects per story, written as a phrase, only where the story itself names the sound.
- Voice directions by age band come from the audio ledger (a warm storyteller for pre-K to grade 2, and so on); a story's tags refine them, never fight them.
- Every clip stays under 10,000 characters by a wide margin; clips are stitched with their neighbors when generated.
