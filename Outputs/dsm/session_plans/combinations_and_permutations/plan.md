<!-- cSpell:ignore NxtWave devPort DSM nPr nCr Chitra Asha Bala -->
# Combinations and Permutations: slide-wise plan

**STATUS: SIGNED OFF 2026-11-25 · PUBLISHED 2026-11-25** (signed off by the user in conversation; decisions in section 7 accepted as proposed. Rev 2: cut to 50 slides at the user's request; rev 1 with 61 slides kept as `plan.rev1.md`)

| | |
|---|---|
| Source | Google Doc "DSM : Combinations and Permutations" (`1AJEpNM7kQlNkz22PpKkRDmS101Ced2vYDnknU0zjZcU`), 6 sections, 32 drafted slides, no images |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/combinations_and_permutations/` (copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/combinations_and_permutations/plan.md` |
| Deck file | `src/decks/combinationsAndPermutationsDeck.tsx` |
| `name` / `htmlName` | `dsm-combinations-and-permutations` |
| `devPort` | **5278** (5277 is the highest taken) |
| Content slides | **35** |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **50** (the user's maximum) |
| Branch | `deck/combinations-and-permutations`, built on `main` |
| Delivery | `dist-single/` HTML in the repo, and a private claude.ai link with the Editor controls (edit text, hide, delete, restore), like the other DSM decks |
| Artifact | https://claude.ai/artifact/FXwawkTCUSWD6TVbkJbn3q (private; Editor controls) |

Every count in the source (listings, factorials, every nPr and nCr, the
solve-for-n and solve-for-r problems, the committee and computing tables)
was recomputed by `verify_tr.py` beside this file, by brute force where
small: **all 31 checks correct**.

---

## 1. How the cut keeps the source

The plan keeps **every idea, worked example, Try it, quick check and practice
row, in the source's order**, within a 50-slide cap set by the user
(2026-11-25):

- **Six sections stay six concepts.** Agenda and Key Takeaways already match
  in the source (rule 20).
- **One TR slide, one deck slide, in most places** (32 TR slides → 35 content
  slides). Where a TR slide holds two steps, they become two reveals on one
  slide rather than two slides (S4 comparison then swap test, S6 slots then
  the six orders, S7 n! then 0!, S10 product form then factorial form, S16
  pairs then ÷ 2!, S17 formula then notations, S22 rule then 5P3).
- **Split into two slides only where the visual changes:** S1 to S3 (question,
  tree, pairing), S8 (bar chart, then cancellation strip), S23 (table, then
  bars).
- **Try it items stay on their worked example's slide** as a last reveal.
- **No added Integration slides** (cut for the cap); each concept's last
  practice slide carries its takeaway in the speaker notes instead.

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Arrangement Versus Selection | **4MAT** | a distinction to feel before any formula | C1 to C5 (5) | S1 to S5 |
| 2 | Factorial Notation | **Merrill** | a skill: write and cancel n! | C6 to C9 (4) | S6 to S8 |
| 3 | Permutations (nPr) | **Merrill** | a skill: count arrangements | C10 to C16 (7) | S9 to S15 |
| 4 | Combinations (nCr) | **Merrill** | a skill: count selections | C17 to C22 (6) | S16 to S21 |
| 5 | Relationship Between nPr and nCr | **Merrill** | a skill: move between the two | C23 to C27 (5) | S22 to S25 |
| 6 | Solving Standard Problems | **Merrill** (Application-heavy) | decide, then compute | C28 to C35 (8) | S26 to S32 |

**The chain.** Concept 1 ends on "order matters or not"; arranging *all* the
objects needs a name for 3 × 2 × 1 (concept 2). Concept 2 ends on n!;
arranging only *some* objects stops the product early (concept 3). Concept 3
counts ordered outcomes; dropping the order divides them (concept 4).
Concept 4's ÷ r! becomes the rule nPr = nCr × r! (concept 5). Concept 6 uses
both in exam-style problems.

## 3. Slide by slide

C = content slide; Sn = the source's slide n. Visual formats are varied on
purpose (user feedback 2026-11-25: no deck-long run of "table with hidden
columns"). All compose figures on `main`: `DataTable`, `RelationGraph`, slot
boxes, cards, `Callout`, `FlowChart`, plain SVG bars.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Combinations and Permutations |
| 3 | `AgendaSlide` | the six items of §2, static (rule 44) |

### Concept 1: Arrangement Versus Selection (4MAT)

| # | C | Move | Title | Content (from source) | Visual |
|---|---|---|---|---|---|
| 4 | | | divider 01 | Arrangement Versus Selection | fixture |
| 5 | C1 | Why | Two Questions | A, B, C: President and Secretary? A 2-member team? Same answer? (S1) | split screen: two labelled chairs vs one "Team of 2" box, "?" on each |
| 6 | C2 | What | Positions | 6 outcomes AB … CB; AB ≠ BA; 3 × 2 (S2) | tree grows one level per press, 6 leaves |
| 7 | C3 | What | A Team | {A,B}, {A,C}, {B,C}: 3, half of 6 (S3) | the 6 leaf cards slide together into 3 coloured pairs |
| 8 | C4 | How | Swap Test | permutation (arrangement) vs combination (selection), AB/BA, 6 vs 3; then the swap test: new outcome → permutation, same → combination (S4) | podium vs basket columns; then two chips cross over and each side's verdict lights |
| 9 | C5 | What if | Order or Not | the 5 situations (S5) | card-sorting: each card drops into a "P" or "C" bin per press |

### Concept 2: Factorial Notation (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 10 | | | divider 02 | Factorial Notation | fixture |
| 11 | C6 | Problem | Books on a Shelf | 3 books: 3 × 2 × 1 = 6, all six orders; 4 books 24, 5 books 120 (S6) | shelf slots fill 3, 2, 1; then six rows of coloured book spines |
| 12 | C7 | Demonstration | n Factorial | n! = n × (n − 1) × … × 1; then 0! = 1 (empty arrangement, and n! = n × (n − 1)!) (S7) | staircase of factors ending in boxed n!; then a two-reason card for 0! |
| 13 | C8 | Demonstration | Factorials Grow | n! for n = 0 to 7 (S8 table) | bar chart, bars rise after n = 5 |
| 14 | C9 | Application | Cancel First | 10!/8! = 90; 100!/98! = 9,900; 7!/(3! × 4!) = 35 (S8) | cancellation strip, common tail struck out |

### Concept 3: Permutations (nPr) (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 15 | | | divider 03 | Permutations (nPr) | fixture |
| 16 | C10 | Problem | Medal Podium | 8 runners, gold/silver/bronze: 8 × 7 × 6 = 336 (S9) | podium with slots 8, 7, 6 |
| 17 | C11 | Demonstration | nPr | n × (n − 1) × … × (n − r + 1), r factors; then nPr = n!/(n − r)!, 8P3 = 8!/5!; P(n, r) (S10) | row of r slots; then factorial strip with the (n − r)! tail shaded and crossed |
| 18 | C12 | Demonstration | Edge Cases | nPn = n!, nP1 = n, nP0 = 1; 5P5, 7P1, 9P0 (S11) | three mini slot diagrams |
| 19 | C13 | Application | Evaluating nPr | 5P2 … 4P4 (S12) | stepped table, working then value |
| 20 | C14 | Application | Stage Seating | 7 students, 4 numbered chairs: 840; Try it: band of 5, 120 (S13) | stage with 4 chairs, slots 7 6 5 4 |
| 21 | C15 | Application | Letter Codes | COMPUTER, 3-letter codes: 336; Try it: MATH, 24 (S14) | 8 letter tiles over 3 slots |
| 22 | C16 | Application | Working Backwards | nP2 = 56 → n = 8; Try it nP3 = 120 → n = 6 (S15) | number line, consecutive pair lit |
| 23 | | | `QuizTimeSlide` | "Quiz Time!" only | fixture |

### Concept 4: Combinations (nCr) (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 24 | | | divider 04 | Combinations (nCr) | fixture |
| 25 | C17 | Problem | Teams from Four | A, B, C, D: 4P2 = 12 ordered pairs; each team counted twice: 12 ÷ 2 = 6 (S16) | 12 pair cards, then they stack into 6 boxed columns with a "÷ 2!" arrow |
| 26 | C18 | Demonstration | nCr | nPr/r! = n!/(r!(n − r)!); 4C2 = 6; then nCr, C(n, r), stacked form, "n choose r" (S17) | boxed formula with "÷ r!" pointer; then three notation cards |
| 27 | C19 | Demonstration | Edge Cases | nC0 = 1, nC1 = n, nCn = 1 (S18) | three baskets: empty, one, all |
| 28 | C20 | Application | Evaluating nCr | 5C2 … 12C5 (S19) | stepped table, one row's cancellation expanded |
| 29 | C21 | Application | Handshakes | 10 people: 10C2 = 45; Try it 6 points, 15 lines (S20) | 5 people, all 10 lines drawn (`RelationGraph`) |
| 30 | C22 | Application | Choosing Questions | any 8 of 10: 45; Try it 52C5 = 2,598,960 (S21) | question paper, 10 boxes, 8 ticked |

### Concept 5: Relationship Between nPr and nCr (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 31 | | | divider 05 | Relationship Between nPr and nCr | fixture |
| 32 | C23 | Demonstration | Select, Then Arrange | step 1 nCr, step 2 r!; nPr = nCr × r!; then 5P3 = 10 × 6 = 60 (S22) | flow: basket → podium → nPr, numbers fill in on the last press |
| 33 | C24 | Demonstration | Side by Side | 5Pr, 5Cr, r! for r = 0 to 5 (S23) | stepped table |
| 34 | C25 | Demonstration | Gap Grows | paired bars; equal only at r = 0, 1 (S23) | paired bar chart |
| 35 | C26 | Application | Find n and r | nPr = 720, nCr = 120 → r = 3, n = 10, check (S24) | three-rung solution ladder, green tick |
| 36 | C27 | Application | Practice | the 4 rows of S25, plus n = 4 (notes) | exit-ticket card, one answer per press |

### Concept 6: Solving Standard Problems (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 37 | | | divider 06 | Solving Standard Problems | fixture |
| 38 | C28 | Demonstration | Four-Step Method | identify, swap test, choose formula, compute and check (S26) | flowchart with "Does order matter?" diamond |
| 39 | C29 | Demonstration | Signal Words | arrange/line up/rank … vs select/choose/team …; a committee with a chair is an arrangement (S26) | two word groups, one "trap" card |
| 40 | C30 | Application | Arranging People | queue 720, chairs 120, offices 1,320, prizes 6,840 (S27) | stepped table |
| 41 | C31 | Application | Forming Committees | 126, 792, 1,365, 120 (S28) | round table, unlabelled seats + table |
| 42 | C32 | Application | Committee or Office-Bearers | 8 members: 8C3 = 56 vs 8P3 = 336 = 56 × 3! (S29) | split screen: plain circle vs badges P, T, S |
| 43 | C33 | Application | Common Mistakes | the 4 mistakes (S30) | marking sheet: wrong working struck in red, fix in green |
| 44 | C34 | Application | Practice | the 5 rows of S31 | P/C vote chips, then the answer |
| 45 | C35 | Application | In Computing | 100C2 = 4,950; 50P3 = 117,600; 20C3 = 1,140; 5! = 120; 1,000 files 499,500 (S32) | four app-style tiles |

### Close

| # | Type | Content |
|---|---|---|
| 46 | `QuizTimeSlide` | "Quiz Time!" only |
| 47 | `KeyTakeawaysSlide` | the six agenda items |
| 48 | `FeedbackSlide` `formless` | rule 41 |
| 49 | `ThankYouSlide` | fixture |
| 50 | `ThankYouSlide` | `title="All the Best"` |

35 content slides and 15 frames: `slideCount` **50**.

## 4. Term ledger

Carried in: **product rule, slot, tree diagram, set, {…} braces**.

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| permutation / arrangement | C4 | order matters |
| combination / selection | C4 | order does not matter |
| swap test | C4 (second reveal) | swap two chosen objects and see |
| n! (factorial), 0! | C7 | n × (n − 1) × … × 1; 0! = 1 |
| nPr | C11 | r positions filled from n |
| nCr, C(n, r), n choose r | C18 | r picked from n, no order |

## 5. Changes to the source

- **Merged into one slide each, as reveals:** S4, S6, S7, S10, S16, S17, S22
  (two steps of one idea).
- **"Repeated letters need a different method"** (S14 note) stays in speaker
  notes only; no multiset formula on slides (later session).
- **Slide 1 callback** in S29 notes becomes the visual echo on C32.
- **Signal words caveat** (S26 notes, "a committee with a chair and a
  secretary is an arrangement") is promoted onto C29 as the trap card.

## 6. No new figure

Every visual composes figures already on `main` and avoids `StatusList`,
`VennMini` and `CodeOutput` (labels under the 16px floor). Slots, cards, bars
and baskets are plain boxes and SVG.

## 7. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, the source's sections, frameworks as §2 | **Keep** |
| B | Agenda and Key Takeaways: the source's six items verbatim | **Keep** |
| C | No "Where We Left Off" or Next Session: the TR has none | **Left out** |
| D | Publish as a private claude.ai link with the Editor controls, like the other DSM decks | **Yes** |
| E | 50-slide cap: keep both Quiz Time frames (cut content merges instead) | **Keep both** |
