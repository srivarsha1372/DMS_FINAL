<!-- cSpell:ignore NxtWave devPort DSM Tollens Ponens Ravi Manohar -->
# Theory of Inference for the Statement Calculus: slide-wise plan

**STATUS: SIGNED OFF 2026-11-26 · PUBLISHED 2026-11-26** (signed off by the user in conversation; decisions in section 7 accepted as proposed)

| | |
|---|---|
| Source | Google Doc "DSM : Theory of Inference for the Statement Calculus" (`1SwU_m_GjFDkfoTwzBlZjF7SBVJuFmmp9naeOI1JdjE8`), 7 sections, 28 drafted slides, no images |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/theory_of_inference/` (copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/theory_of_inference/plan.md` |
| Deck file | `src/decks/theoryOfInferenceDeck.tsx` |
| `name` / `htmlName` | `dsm-theory-of-inference` |
| Built file | `Outputs/dsm/theory_of_inference/dist-single/dsm-theory-of-inference.html` |
| `devPort` | **5280** (5279 is the highest taken) |
| Content slides | **28** |
| Compulsory frames | **16** (brand, welcome, agenda, 7 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **44** (under the 50 cap) |
| Branch | `deck/theory-of-inference`, built on `main` |
| Delivery | `dist-single/` HTML in the repo, and a private claude.ai link with the Editor controls, like the other DSM decks |
| Artifact | https://claude.ai/artifact/7rUcvbiHg5CpMiYhHNFmem (private; Editor controls) |

Every validity verdict, counterexample row, rule and proof line in the
source was checked by brute force over all truth assignments in
`verify_tr.py` beside this file: **all 30 checks correct**.

---

## 1. How the cut keeps the source

- **Seven sections stay seven concepts.** Agenda and Key Takeaways already
  match in the source (rule 20).
- **One TR slide, one deck slide** (28 → 28). Proof tables build one line
  per press; practice answers reveal one row per press.
- **Running threads:** the rain argument (C1 to C3) returns as Modus Ponens
  (C12); the water tanker (C6) returns as the counterexample row (C9) and in
  Spot the Error (C27).
- **Reference-deck mentions** ("W1_S6", "W1_S7", "W1_S8") stay in speaker
  notes only; slide subheadings that name them are reworded without the code.

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Arguments | **4MAT** | feel "follows" before defining it | C1 to C3 (3) | S1 to S3 |
| 2 | Valid and Invalid Arguments | **4MAT** | a distinction, with traps | C4 to C6 (3) | S4 to S6 |
| 3 | Testing Validity with Truth Tables | **Merrill** | a mechanical skill | C7 to C10 (4) | S7 to S10 |
| 4 | Rules of Inference | **Merrill** | eight patterns to recognise | C11 to C17 (7) | S11 to S17 |
| 5 | Testing Validity with Rules of Inference | **Merrill** | a skill: formal proofs | C18 to C23 (6) | S18 to S23 |
| 6 | Deriving Conclusions from Multiple Premises | **Merrill** | strategies | C24 to C26 (3) | S24 to S26 |
| 7 | Putting It All Together | **Merrill** (Application) | errors and mixed practice | C27 to C28 (2) | S27 to S28 |

**The chain.** An argument is premises plus a conclusion (1) → it is valid
when the conclusion cannot fail (2) → a truth table checks that row by row
(3) → valid patterns become reusable rules (4) → rules chain into proofs that
beat 32-row tables (5) → strategies find and prove conclusions (6) → mistakes
and mixed practice (7).

## 3. Slide by slide

C = content slide; Sn = source slide n. Visual formats vary on purpose. All
are DOM figures (cards, chips, tables, step lists) built from kit parts on
`main`.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Theory of Inference for the Statement Calculus |
| 3 | `AgendaSlide` | the seven items of §2, static (rule 44) |

### Concept 1: Arguments (4MAT)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 4 | | | divider 01 | Arguments | fixture |
| 5 | C1 | Why | From Facts to a Conclusion | Think First rain example; conclusion follows (S1) | detective corkboard: two cards joined by string to a "Follows" card |
| 6 | C2 | What | The Parts of an Argument | premises, conclusion, argument; stacked p → q, p, line, ∴ q (S2) | layered cake: premise layers, ∴ icing line, conclusion topper |
| 7 | C3 | What | An Argument as One Formula | (P₁ ∧ … ∧ Pₙ) → C; rain → (p ∧ (p → q)) → q (S3) | funnel: premise cards joined by ∧, → pipe, conclusion box |

### Concept 2: Valid and Invalid Arguments (4MAT)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 8 | | | divider 02 | Valid and Invalid Arguments | fixture |
| 9 | C4 | What | Validity | definition; tautology; ⟹; fallacy (S4) | two vaults: valid always opens on treasure, invalid sometimes empty |
| 10 | C5 | So what | Form Versus Facts | 7-is-even and cat rows; sound argument (S5) | 2 × 2 quadrant board, sticky notes placed per press |
| 11 | C6 | What if | Two Famous Fallacies | affirming the consequent, denying the antecedent; tanker counterexample (S6) | split screen: each fallacy's form and story; tanker card crosses out "rain" |

### Concept 3: Testing Validity with Truth Tables (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 12 | | | divider 03 | Testing Validity with Truth Tables | fixture |
| 13 | C7 | Demonstration | Check Every Possibility | 4-step critical-row method (S7) | numbered step cards with a "detector" badge on step 2 |
| 14 | C8 | Demonstration | Modus Tollens by Table | p → q, ¬q ∴ ¬p table, one critical row (S8) | table builds row by row; critical row ringed green, PASS stamp |
| 15 | C9 | Demonstration | Affirming the Consequent by Table | p → q, q ∴ p, row 3 fails (S9) | same layout; one green and one red critical row, FAIL stamp |
| 16 | C10 | Application | Valid or Invalid? | 4 rows of S10 | polygraph strips: calm line (valid) or spike at the counterexample |

### Concept 4: Rules of Inference (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 17 | | | divider 04 | Rules of Inference | fixture |
| 18 | C11 | Demonstration | The Rules at a Glance | 8 rules: premises, conclusion, tautology (S11) | fan of 8 rule cards (premises over a line over conclusion), one per press |
| 19 | C12 | Demonstration | Modus Ponens | form, exam example, "affirms" (S12) | domino run p → q, last domino falls |
| 20 | C13 | Demonstration | Modus Tollens | form, alarm example, contrapositive (S13) | silent alarm card and a technician's verdict |
| 21 | C14 | Demonstration | Two Syllogisms | HS and DS with examples (S14) | left: chain p–q–r, middle ring fades; right: two doors, "bag" crossed out |
| 22 | C15 | Demonstration | Building Up and Breaking Down | Addition, Simplification, Conjunction (S15) | three brick actions: add a brick, snap one off, click two together |
| 23 | C16 | Demonstration | Resolution | form, cancelling p, why it works by cases (S16) | two jigsaw pieces p ∨ q and ¬p ∨ r lock, leaving q ∨ r |
| 24 | C17 | Application | Name That Rule | 6 rows of S17 | quiz-show buzzer: rule name lights per press |
| 25 | | | `QuizTimeSlide` | "Quiz Time!" only | fixture |

### Concept 5: Testing Validity with Rules of Inference (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 26 | | | divider 05 | Testing Validity with Rules of Inference | fixture |
| 27 | C18 | Demonstration | A Proof Is a Numbered List | three columns; ends at the conclusion; 32 rows vs a few lines (S18) | ledger with No. / Statement / Reason columns |
| 28 | C19 | Demonstration | The Canoe Trip | 5 variables, 4 premises, 8 steps (S19) | trail map: signposts per step, sunset at the end |
| 29 | C20 | Demonstration | Saturday Sports | 9 steps to r ∨ t (S20) | scoreboard, one play per press |
| 30 | C21 | Demonstration | Sherlock Holmes | 6 premises, 5 steps to w (S21) | detective notebook, rule in the margin |
| 31 | C22 | Demonstration | Using Resolution | ¬R → S in 5 steps (S22) | translate to clauses, resolve, translate back |
| 32 | C23 | Application | Fill In the Reasons | p → q, q → r, ¬r ∴ ¬p (S23) | worksheet: Reason column fills in per press |

### Concept 6: Deriving Conclusions from Multiple Premises (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 33 | | | divider 06 | Deriving Conclusions from Multiple Premises | fixture |
| 34 | C24 | Demonstration | What Follows? | f → w, h → f, h, ¬m ∨ t, m; conclusions w and t (S24) | mind map: premise bubbles, rule-labelled arrows to two centre bubbles |
| 35 | C25 | Demonstration | Strategies for p → q | CP, contrapositive, indirect; CP example (S25) | three doors to one treasure room |
| 36 | C26 | What if | True for Free | vacuous and trivial proofs (S26) | p → q truth table as a signal panel: green rows, one red row |

### Concept 7: Putting It All Together (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 37 | | | divider 07 | Putting It All Together | fixture |
| 38 | C27 | Application | What Went Wrong? | 5 mistakes of S27 | referee's yellow cards: mistake, then whistle note with the fix |
| 39 | C28 | Application | Test, Prove and Derive | 5 tasks of S28 | board-game track of five squares to a trophy |

### Close

| # | Type | Content |
|---|---|---|
| 40 | `QuizTimeSlide` | "Quiz Time!" only |
| 41 | `KeyTakeawaysSlide` | the seven agenda items (labels only) |
| 42 | `FeedbackSlide` `formless` | rule 41 |
| 43 | `ThankYouSlide` | fixture |
| 44 | `ThankYouSlide` | `title="All the Best"` |

## 4. Term ledger

Carried in: **¬ ∧ ∨ → ↔, ≡, truth table, tautology, contrapositive, clause (Normal Forms)**.

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| premise, conclusion, argument, ∴ | C2 | starting facts; what follows; "therefore" |
| valid, invalid / fallacy, ⟹ | C4 | conclusion cannot fail when premises hold |
| sound | C5 | valid with true premises |
| critical row | C7 | a row where every premise is true |
| MP, MT, HS, DS, Add, Simp, Conj, Res | C11 to C16 | named on their own slides |
| conditional proof (Rule CP), indirect proof | C25 | assume p, derive q; assume the negation, reach a contradiction |
| vacuous, trivial proof | C26 | p false; q true |

## 5. Changes to the source

- **Reference-deck codes** (W1_S6 to W1_S8) move from subheadings into notes.
- **Holmes step reasons** cite premises by formula, as in the source.
- **Speaker notes kept**, including the Rule P / Rule T naming note.

## 6. No new figure

Every visual composes figures on `main`. No `StatusList`, `VennMini` or
`CodeOutput` (labels under the 16px floor).

## 7. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Seven concepts, the source's sections, frameworks as §2 | **Keep** |
| B | Agenda and Key Takeaways: the source's seven items verbatim | **Keep** |
| C | No "Where We Left Off" or Next Session: the TR has none | **Left out** |
| D | Publish as a private claude.ai link with the Editor controls | **Yes** |
| E | Two Quiz Time frames (after concepts 4 and 7) | **Keep** |
