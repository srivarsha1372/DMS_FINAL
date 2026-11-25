<!-- cSpell:ignore NxtWave devPort DSM Ravi Manohar Socrates -->
# The Predicate Calculus: slide-wise plan

**STATUS: SIGNED OFF 2026-11-26 · PUBLISHED 2026-11-26** (signed off by the user in conversation at 54 slides: only two merges kept, S10 + S11 and S16 + S17)

| | |
|---|---|
| Source | Google Doc "DSM : The Predicate Calculus" (`1sZS07Rqw02q6sux3o8V9mZTRUvbsFZ5G-I4KD3DMA4w`), 8 sections, 39 drafted slides, no images |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/predicate_calculus/` (copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/predicate_calculus/plan.md` |
| Deck file | `src/decks/predicateCalculusDeck.tsx` |
| `name` / `htmlName` | `dsm-predicate-calculus` |
| Built file | `Outputs/dsm/predicate_calculus/dist-single/dsm-predicate-calculus.html` |
| `devPort` | **5281** (5280 is the highest taken) |
| Content slides | **37** (39 TR slides, two pairs merged) |
| Compulsory frames | **17** (brand, welcome, agenda, 8 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **54** (approved by the user above the usual 50) |
| Branch | `deck/predicate-calculus`, built on `main` |
| Delivery | `dist-single/` HTML in the repo, and a private claude.ai link with the Editor controls |
| Artifact | https://claude.ai/artifact/Ay7AXKmXSUXsYqL9k5zsE4 (private; Editor controls) |

Every truth value, witness, counterexample and equivalence in the source was
checked in `verify_tr.py` beside this file (equivalences over every predicate
on a 3-element universe; integers on a window holding every named witness):
**all 29 checks correct**.

---

## 1. How the cut keeps the source

- **Eight sections stay eight concepts.** Agenda and Key Takeaways already
  match in the source (rule 20).
- **50-slide cap.** One deck slide per TR slide would be 56. Six pairs that
  argue one idea become one slide each, the second half arriving as a reveal:
  S5 + S6 (statement functions, then n places), S7 + S8 (domain, then the
  universe dial), S10 + S11 (∀ and ∃ side by side), S16 + S17 (∀ with →, ∃
  with ∧), S27 + S28 (free and bound, then renaming), S30 + S31 (the flip
  rule, then the classroom examples). Nothing is dropped.
- **Running threads:** "every even number is divisible by 2" (C1) is answered
  on C17; the pairing rule (∀ with →, ∃ with ∧) returns on C27 and C32; the
  ∀∃ game (C29) returns in Mixed Practice (C33).
- **Reference-deck codes** (W1_S4, W1_S5) move from subheadings into notes.

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways) | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | Limits of Propositional Logic | **4MAT** | C1 to C3 (3) | S1 to S3 |
| 2 | Predicates and Statement Functions | **Merrill** | C4 to C7 (4) | S4 to S9 |
| 3 | Quantifiers | **Merrill** | C8 to C12 (5) | S10 to S15 |
| 4 | English to Predicate Logic | **Merrill** | C13 to C18 (6) | S16 to S22 |
| 5 | Predicate Logic to English | **Merrill** | C19 to C21 (3) | S23 to S25 |
| 6 | Free and Bound Variables | **Merrill** | C22 to C24 (3) | S26 to S29 |
| 7 | Negating Quantified Statements | **Merrill** | C25 to C27 (3) | S30 to S33 |
| 8 | Nested Quantifiers | **Merrill** (ends in Application) | C28 to C33 (6) | S34 to S39 |

## 3. Slide by slide

> **Rev 2 (sign-off):** the user approved 54 slides. S5, S6, S7, S8, S27, S28, S30 and S31 are each their own slide again (C5 to C8, C25 and C26, C28 and C29); the only merges are S10 + S11 (C10) and S16 + S17 (C15). Visuals per slide are as listed below for each source slide. Final content numbering: C1 to C3 (S1 to S3), C4 to C9 (S4 to S9), C10 (S10 + S11), C11 to C14 (S12 to S15), C15 (S16 + S17), C16 to C20 (S18 to S22), C21 to C23 (S23 to S25), C24 to C27 (S26 to S29), C28 to C31 (S30 to S33), C32 to C37 (S34 to S39).

C = content slide; Sn = source slide n. All DOM figures from kit parts on `main`.

| # | C | Title | Content (source) | Visual |
|---|---|---|---|---|
| 1 | | `BrandSlide` | Welcome! | fixture |
| 2 | | `WelcomeSlide` | The Predicate Calculus | fixture |
| 3 | | `AgendaSlide` | eight items | fixture |
| 4 | | divider 01 | Limits of Propositional Logic | fixture |
| 5 | C1 | A Gap in Our Logic | Think First: p, q, can we reach "8 is divisible by 2"? (S1) | two sealed boxes p, q; X-ray reveals 2, 4, 6, 8 … and 8 |
| 6 | C2 | All Humans Are Mortal | Socrates table; invalid as p, q ∴ r (S2) | three-panel comic strip, confused "propositional logic" robot |
| 7 | C3 | Two New Ingredients | predicates, variables, ∀, ∃; ∀x (E(x) → D(x)) (S3) | toolbox: old connectives plus three new tools |
| 8 | | divider 02 | Predicates and Statement Functions | fixture |
| 9 | C4 | Splitting a Sentence | subject / predicate table, S(r), P(7), L(h, p) (S4) | paper strips cut into blue subject and orange predicate pieces |
| 10 | C5 | Sentences With a Blank | P(x): x > 3; P(5) T, P(2) F, P(x) none; then 1-, 2-, 3-place predicates (S5 + S6) | fill-in slot with grey / green / red light; then 1-, 2-, 3-pin sockets |
| 11 | C6 | Where Can x Come From? | domain, universe of discourse; x² = 2; then the five-row universe table (S7 + S8) | two fenced playgrounds; then a universe dial N, Z, Q with truth lights |
| 12 | C7 | Statement or Statement Function? | 5 rows (S9) | grey / green / red card per row |
| 13 | | divider 03 | Quantifiers | fixture |
| 14 | C8 | For All and There Exists | ∀ (counterexample, x² ≥ 0) and ∃ (witness, 3x + 2 = 8; x = x + 3) (S10 + S11) | split screen: roll call that turns red on one absence vs treasure hunt that stops at the first coin |
| 15 | C9 | A Big AND, a Big OR | universe {1, 2, 3}, P(x): x < 3 (S12) | series vs parallel switch circuits |
| 16 | C10 | Truth Conditions | true when / false when; prove vs disprove (S13) | judge's scorecard, prove and disprove columns |
| 17 | C11 | Which Equivalences Hold? | 4 equivalences; even/odd counterexample (S14) | verdict table, then blue/orange integer tiles |
| 18 | C12 | Witness or Counterexample? | 6 rows (S15) | swipe cards: verdict and witness on the back |
| 19 | | `QuizTimeSlide` | | fixture |
| 20 | | divider 04 | English to Predicate Logic | fixture |
| 21 | C13 | All Uses →, Some Uses ∧ | ∀x (S(x) → L(x)) not ∀x (S ∧ L); ∃x (S(x) ∧ L(x)) not ∃x (S → L) (S16 + S17) | split screen: spotlight on lanyard wearers vs one circled witness, warning for the silly reason |
| 22 | C14 | None and Not All | 2 rows with equivalent forms (S18) | two class photos: "0 fails" stamp vs one "did not pass" |
| 23 | C15 | The Four Standard Forms | all / no / some / some not (S19) | square of four corner cards |
| 24 | C16 | Mathematical Sentences | 4 rows (S20) | chalkboard: English in white, formula in yellow |
| 25 | C17 | Everyday Sentences | 5 rows incl. "only" (S21) | street-scene speech bubbles |
| 26 | C18 | Translate to Symbols | birds and penguins, 5 rows (S22) | zoo-sign sticky notes, one per press |
| 27 | | divider 05 | Predicate Logic to English | fixture |
| 28 | C19 | Say It Naturally | literal vs natural, 3 rows (S23) | translation-app screen: grey literal, bold natural |
| 29 | C20 | Computers and Friends | ∀x (C(x) ∨ ∃y (C(y) ∧ F(x, y))) (S24) | school map: laptop dots, friendship lines |
| 30 | C21 | Formulas to Sentences | 5 rows (S25) | reverse-dictionary page, answers per press |
| 31 | | divider 06 | Free and Bound Variables | fixture |
| 32 | C22 | How Far Does ∀ Reach? | scope; two bracketings (S26) | umbrella over the whole bracket vs over P(x) only |
| 33 | C23 | Bound, Free and Renamed | bound/free table; then renaming rules (S27 + S28) | balloons on strings vs loose; then find-and-replace box |
| 34 | C24 | Free or Bound? | 4 rows (S29) | highlighter: bound green, free pink |
| 35 | | divider 07 | Negating Quantified Statements | fixture |
| 36 | C25 | The Quantifier Flips | ¬∀ ≡ ∃¬, ¬∃ ≡ ∀¬; then the two classroom examples (S30 + S31) | ¬ frog hops a lily pad that flips; then a register with crosses |
| 37 | C26 | Negating With → and ∧ | 4-line derivation (S32) | negation machine: three stations |
| 38 | C27 | Write the Negation | 4 rows (S33) | mirror worksheet |
| 39 | | divider 08 | Nested Quantifiers | fixture |
| 40 | C28 | Two of the Same Kind | ∀x ∀y commutativity; ∃x ∃y x + y = xy (S34) | x by y grid: all green, then one gold cell (2, 2) |
| 41 | C29 | Order Matters | ∀x ∃y vs ∃x ∀y, x + y = 0 (S35) | two board-game turns: you win, you lose |
| 42 | C30 | Nested Sentences | 4 rows (S36) | nested folder frames |
| 43 | C31 | Flip Every Quantifier | ¬∀x ∃y (xy = 1), 4 lines (S37) | marble flips each domino |
| 44 | C32 | What Went Wrong? | 5 mistakes (S38) | red edit mark, then green check per row |
| 45 | C33 | Every Idea in One Set | 6 tasks (S39) | escape-room door with six locks |
| 46 | | `QuizTimeSlide` | | fixture |
| 47 | | `KeyTakeawaysSlide` | eight items, labels only | fixture |
| 48 | | `FeedbackSlide` `formless` | rule 41 | fixture |
| 49 | | `ThankYouSlide` | | fixture |
| 50 | | `ThankYouSlide` | All the Best | fixture |

## 4. Term ledger

Carried in: **¬ ∧ ∨ → ↔, ≡, rules of inference, valid, counterexample (Theory of Inference)**.

| Term | Introduced | Gloss |
|---|---|---|
| predicate, subject | C4 | the property said about the subject |
| statement function, n-place predicate | C5 | a sentence with a blank; n blanks |
| domain, universe of discourse | C6 | where the variables take values |
| ∀, ∃, witness | C8 | for all; there exists; the element that works |
| scope, bound, free | C22, C23 | how far a quantifier reaches; captured or loose |
| nested quantifiers | C28 | two quantifiers, read left to right |

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Eight concepts, the source's sections | **Keep** |
| B | Agenda and Key Takeaways: the source's eight items verbatim | **Keep** |
| C | Slide count | **54, approved: merge only S10 + S11 and S16 + S17** |
| D | Keep both Quiz Time frames | **Keep** |
| E | Publish as a private claude.ai link with the Editor controls | **Yes** |
