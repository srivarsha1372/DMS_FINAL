<!-- cSpell:ignore NxtWave devPort DSM nPr nCr -->
# Enumeration of Combinations and Permutations: slide-wise plan

**STATUS: SIGNED OFF 2026-11-26 · PUBLISHED 2026-11-26** (signed off by the user in conversation)

| | |
|---|---|
| Source | Google Doc "DSM : Enumeration of Combinations and Permutations" (`1U64-CO5bTNJAXK73KAvq4GK2FSVzq5YmkU_8ls5xGDI`), 6 sections, 31 drafted slides, no images |
| Deck project | `Outputs/dsm/enumeration_of_combinations/` (copied from `slide-kit/slide-template`) |
| Deck file | `src/decks/enumerationDeck.tsx` |
| `name` / `htmlName` | `dsm-enumeration-of-combinations` |
| Built file | `Outputs/dsm/enumeration_of_combinations/dist-single/dsm-enumeration-of-combinations.html` |
| `devPort` | **5283** |
| Content slides | **31** (one per TR slide) |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **46** (under the 50 cap; first draft miscounted the frames as 16) |
| Branch | `deck/enumeration-of-combinations`, built on `main` |
| Artifact | https://claude.ai/artifact/T7DmJJU6Qtt1Y786i9opug (private; Editor controls) |

Every count was recomputed by `verify_tr.py`, by brute-force listing wherever
feasible (all 252 committees, all 8! arrangements of COMPUTER, all 9! shelf
orders, the 252 "pick one first" routes to 175 selections): **all 30 checks correct**.

## 1. How the cut keeps the source

- **Six sections stay six concepts**; agenda and Key Takeaways match (rule 20).
- **One TR slide, one deck slide** (31 → 31). Steps reveal one per press;
  practice tables reveal one row per press after a pause.
- **Running threads:** the opening "exactly 2 girls" question (C1) is answered on
  C16; the 6-boys-4-girls committee carries C16 to C24; the bulbs of C25 come
  back as the trap on C26 and in Common Mistakes (C30).
- **Visual variety** (user feedback 2026-11-25): baskets, tree, two-route
  arrows, slot boxes, banded line-ups, block tiles with a zoom bubble, coloured
  shelf blocks, seat zones, a bar chart, a number line, a shaded rectangle, a
  balance scale, a double-count stamp, pipelines, warning cards.

## 2. Concepts

| # | Agenda item | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | A Strategy for Counting Problems | 4MAT | C1 to C3 | S1 to S3 |
| 2 | Select, Then Arrange | Merrill | C4 to C9 | S4 to S9 |
| 3 | Items Grouped Together | Merrill | C10 to C15 | S10 to S15 |
| 4 | Exactly k of a Type | Merrill | C16 to C20 | S16 to S20 |
| 5 | At Least and At Most | Merrill | C21 to C27 | S21 to S27 |
| 6 | Putting It All Together | Merrill (Application) | C28 to C31 | S28 to S31 |

## 3. Slide by slide

| # | C | Title | Source | Visual |
|---|---|---|---|---|
| 1 to 3 | | Brand, Welcome, Agenda (6 items) | | fixtures |
| 4 | | divider 01 | | |
| 5 | C1 | Real Problems Mix Ideas | S1 | toolbox of four tools beside the problem card, "exactly 2 girls" highlighted |
| 6 | C2 | Our Toolkit | S2 | five tool cards, example revealed per press |
| 7 | C3 | Four Questions to Ask | S3 | flowchart: cases? → steps → order matters? → nPr / nCr → multiply → check |
| 8 | | divider 02 | | |
| 9 | C4 | A Committee From Two Groups | S4 | two baskets, 5C2 × 4C3 = 40 |
| 10 | C5 | List Small to Check | S5 | tree M₁, M₂ → three women-pairs, six leaves |
| 11 | C6 | A Team With a Captain | S6 | two routes to one answer box 1,260 |
| 12 | C7 | Choose Letters, Then Form Words | S7 | three-stage pipeline with slots 3, 2, 1 |
| 13 | C8 | Choose and Display | S8 | shelf slots 4, 3, 2, 1 under two piles |
| 14 | C9 | Write the Steps First | S9 | practice table |
| 15 | | divider 03 | | |
| 16 | C10 | Two Friends Who Stay Together | S10 | six line-ups, valid ones banded, others faded |
| 17 | C11 | Glue the Group Into One Block | S11 | block [AB] beside C; outer and inner views |
| 18 | C12 | Siblings Together in a Photo | S12 | five slots, one wide slot with two figures |
| 19 | C13 | Vowels Together in COMPUTER | S13 | six tiles, one wide [O U E] tile, zoom bubble of 6 orders |
| 20 | C14 | Every Subject Stays Together | S14 | shelf with three coloured blocks and their factorials |
| 21 | C15 | Count the Units, Then the Insides | S15 | practice table |
| 22 | | `QuizTimeSlide` | | |
| 23 | | divider 04 | | |
| 24 | C16 | Back to the Opening Problem | S16 | five seats in two coloured zones |
| 25 | C17 | A General Recipe | S17 | two pools A and B flowing k and r − k into one box |
| 26 | C18 | Every Possible Number of Girls | S18 | bar chart 6, 60, 120, 60, 6 under a "252" bracket |
| 27 | C19 | Questions From Two Parts | S19 | question paper with two ticked panels; Try it card |
| 28 | C20 | Fix Both Types, Then Multiply | S20 | practice table |
| 29 | | divider 05 | | |
| 30 | C21 | Reading the Condition | S21 | number line 0 to 4 with a shaded interval per condition |
| 31 | C22 | Direct Method | S22 | two case boxes joined by + |
| 32 | C23 | Complement Method | S23 | rectangle 252 with shaded corner 6 |
| 33 | C24 | Direct or Complement? | S24 | balance scale per row, lighter pan lit |
| 34 | C25 | At Least One Faulty Bulb | S25 | box of 10 bulbs, 3 marked; total minus all-good |
| 35 | C26 | Why "Pick One First" Overcounts | S26 | the same selection drawn twice, "counted twice!" stamp |
| 36 | C27 | Choose the Method, Then Compute | S27 | Direct / Complement vote, then answer |
| 37 | | divider 06 | | |
| 38 | C28 | A Multi-Step Problem | S28 | pipeline; part (b) with the girls' block |
| 39 | C29 | Cases First, Steps Inside | S29 | two case boxes with mini pipelines, + to 132 |
| 40 | C30 | Avoid These Errors | S30 | five warning cards: red wrong working, green fix |
| 41 | C31 | Plan, Then Solve | S31 | name the plan, then the answer |
| 42 to 46 | | Quiz Time, Key Takeaways (labels only), Feedback (formless), Thank You, All the Best | | fixtures |

## 4. Term ledger

Carried in: sum rule, product rule, nPr, nCr, n!, select-then-arrange (nPr = nCr × r!).
New: case, step (C3); block, unit (C11); exactly k (C17); at least, at most, complement (C21, C23).

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, one slide per TR slide (46 total) | **Keep** |
| B | Agenda and Key Takeaways: the source's six items | **Keep** |
| C | Two Quiz Time frames; private claude.ai link with Editor controls | **Yes** |
