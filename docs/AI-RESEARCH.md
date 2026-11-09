# AI research, week by week

Mikey, pass NC (2026-11-08): "I also want you to continuously improve over time.  One time every week, as we do our passes, research the newest emerging techniques in AI development whether through Claude documentation, breakthroughs in mathematics, quantum algorithms, testing techniques etc.  As you know, progress is happening fast in these fields."

Once a week, as the passes go, a pass researches what is new in Claude's documentation and engineering posts, testing and verification techniques, agent workflows, mathematics and quantum algorithms where a practical takeaway exists, and learning science for the app's own scheduling and mastery rules. Each sweep is an entry below, newest first, headed by its date and its pass: what it found, each with the page it read, and what the pass tried or changed because of it, or why nothing. The docs sync test fails a DECISIONS entry dated more than seven days after the newest sweep (RULES-AUDIT section 9).

## 2026-11-08 (pass NC)

The first sweep, run on a Sonnet 5.5 agent that reported only pages it fetched; the lead read the two Anthropic sources again before using them. Vendor claims and preprints are marked as such.

| Area | Finding | Source |
| --- | --- | --- |
| Claude | Memory works best when the model is told what memory is for, not how to use it; for stronger models a fixed rule ("record only failures") lost much of what memory gave, and an offline pass over the logs ("dreaming") corrected a wrong note that had sent a run back down the same route three times (Anthropic's own measures). | [The components of agent memory](https://www.anthropic.com/research/components-of-agent-memory), Nov 6, 2026 |
| Claude | Newer models were overconstrained by system prompts, CLAUDE.md files and skills; delete rules the model can judge from context, keep CLAUDE.md light, split long skills into files, give verifier agents rubrics, and right-size with /doctor (vendor guidance). | [The new rules of context engineering](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models), Jul 24, 2026 |
| Testing | Across 21 model judges and about 541,000 judgments, a judge can be very consistent (test-retest above 0.95) and still biased by position, and plain agreement overstates chance-corrected agreement by 33 to 41 points: a stable judge is not a valid one (preprint). | [Reliability without Validity](https://arxiv.org/html/2606.19544), Jun 2026 |
| Testing | Generated properties for smart contracts, scored by mutation testing, killed fewer mutants than human-written ones (25.99 against 31.75 percent); the method, a mutation score as the measure of a test set, transfers (preprint, narrow domain). | [alphaxiv 2607.23308](https://www.alphaxiv.org/abs/2607.23308), Jul 2026 |
| Agents | A reviewer told to disagree, with a critic auditing the review, beat plain review, which drifted into false consensus (workshop paper, abstract only, unreplicated); a reflector that sees only the diff mattered more than a different model in another team's tool (authors' own benchmark). | [Adversarial Review](https://aiunderstanding.org/news/adversarial-review-tests-structured-disagreement-for-agentic-code-review), Aug 2026; [OpenCodeReview](https://www.alphaxiv.org/abs/2608.09290.md), Aug 2026 |
| Mathematics | Hundreds of AI-written manuscripts with Lean formalizations were released; a formal proof checks the claim as stated, not whether the statement captures what was meant, the same gap as a test suite that passes (claims largely unchecked by others). | [DataCamp's summary](https://www.datacamp.com/blog/openai-math-breakthroughs-what-the-latest-results-mean), Oct 8, 2026 |
| Quantum | A review finds no reproducible quantum advantage for sample-based diagonalization, a classical method having matched a 77-qubit result on a laptop: a claim of advantage needs its strongest classical baseline first. No use for the app. | [arXiv 2608.05314](https://arxiv.org/pdf/2608.05314), Sep 18, 2026 |
| Learning | In a randomized trial with undergraduates, retrieval-based practice, adaptive or fixed, beat learner-directed AI study at seven weeks (summary of the abstract only; not K to 12), which is the app's own design. | [Stanford SCALE repository](https://scale.stanford.edu/ai/repository/do-gains-generative-ai-enabled-adaptive-pretesting-persist-evidence-retention-study), Jun 2026 |

What pass NC tried because of it: every reader's brief now asks it to assume at least one defect is there and to name its strongest objection before calling anything clean (docs/INDEPENDENT-CHECKS.md, How, item 2), from the reviewer studies above; pass NC's third read is the first briefed that way.

What waits, each to be measured before it is kept:
- A planted-defect set for the readers: about thirty items with known mistakes and clean controls, so each reader's brief and model is scored by what it catches and by chance-corrected agreement, not by how sure it sounds.
- A mutation score for the rules tests: small changes made to each answer's computation by a script (off by one, a swapped comparison, a dropped guard), each to be caught, which is the house's near misses made by machine.
- CLAUDE.md, CLAUDE-PART-2 and the briefs read against the July guidance, rules a model can judge from context cut and long ones moved into files of their own; CLAUDE.md's existing lines change only at Mikey's word, so this goes to him as a question first.
- The memory checkpoint rewritten around what it is for, a page per topic, and a check of its notes against each delivery's record, so a stale note cannot steer a later pass.

Not found in the window, so nothing is claimed: Claude Code documentation changes, research on flaky browser tests, and new evidence on spaced-repetition scheduling.
