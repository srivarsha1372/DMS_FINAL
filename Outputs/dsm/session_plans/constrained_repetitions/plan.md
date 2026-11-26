<!-- cSpell:ignore NxtWave devPort DSM nPr nCr -->
# Enumerating Permutation with Constrained Repetitions: slide-wise plan

**STATUS: SIGNED OFF 2026-11-27 · PUBLISHED 2026-11-27** (signed off by the user in conversation; up to 55 slides allowed if needed, 46 kept as one per TR slide)

| | |
|---|---|
| Source | Google Doc "DSM : Enumerating Permutation with Constrained Repetitions" (`1tqfKpl05t0dBlu_5z6ZhahwLCGXjzzqzodR7cdZMjgw`), 6 sections, 31 drafted slides, no images |
| Deck project | `Outputs/dsm/constrained_repetitions/` (copied from `slide-kit/slide-template`) |
| Deck file | `src/decks/constrainedDeck.tsx` |
| `name` / `htmlName` | `dsm-constrained-repetitions` |
| Built file | `Outputs/dsm/constrained_repetitions/dist-single/dsm-constrained-repetitions.html` |
| `devPort` | **5285** |
| Content slides | **31** (one per TR slide) |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **46** (under the 50 cap) |
| Branch | `deck/constrained-repetitions`, built on `main` |
| Artifact | https://claude.ai/artifact/RXVPRrStugBTgcmv2rPM3Z (private; Editor controls) |

Every count was recomputed by `verify_tr.py` by brute-force listing of distinct
arrangements (BOOK, BANANA, LETTER, APPLE, COMPUTER, BALLOON, MONDAY, PENCIL,
grid paths, every round-table seating and necklace up to rotation and flip):
**all 36 checks correct**.

## 1. How the cut keeps the source

- **Six sections stay six concepts**; agenda and Key Takeaways match (rule 20).
- **One TR slide, one deck slide** (31 → 31).
- **No cross-session phrases** (user rule): the note "A quick recap from the
  Enumeration session" and the "Recap:" heading become "Glue Them Into a Block"
  with a note that names the block method itself.
- **Running threads:** BOOK (C1) is answered on C3; BANANA runs from C5 to C24;
  COMPUTER's three conditions sit side by side on C23; the round table (C10)
  returns with a block on C25.

## 2. Concepts

| # | Agenda item | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | Arranging Objects That Are Not All Different | 4MAT | C1 to C3 | S1 to S3 |
| 2 | The Multiset Formula | Merrill | C4 to C9 | S4 to S9 |
| 3 | Circular Permutations | Merrill | C10 to C14 | S10 to S14 |
| 4 | Restrictions on Positions | Merrill | C15 to C19 | S15 to S19 |
| 5 | Together and Not Together | Merrill | C20 to C26 | S20 to S26 |
| 6 | Putting It All Together | Merrill (Application) | C27 to C31 | S27 to S31 |

## 3. Slide by slide

| # | C | Title | Source | Visual |
|---|---|---|---|---|
| 1 to 3 | | Brand, Welcome, Agenda (6 items) | | fixtures |
| 4 | | divider 01 | | |
| 5 | C1 | Rearranging a Word | S1 | tiles B O O K; two rows with the O's swapped, "same word" |
| 6 | C2 | Tag the Copies | S2 | six tagged rows in three coloured pairs merging into AAB, ABA, BAA |
| 7 | C3 | Dividing Out the Swaps | S3 | funnel: 4! = 24 → ÷ 2! → 12 words |
| 8 | | divider 02 | | |
| 9 | C4 | The Formula | S4 | colour-grouped tiles with n₁ … nₖ, matching coloured factorials |
| 10 | C5 | Rearranging BANANA | S5 | tiles sorted into piles B, AAA, NN; LETTER try-it card |
| 11 | C6 | MISSISSIPPI | S6 | 11 colour-coded tiles, count table, shrinking arrow 39,916,800 → 34,650 |
| 12 | C7 | Repeated Objects Everywhere | S7 | flags, a 7-bit string, a two-colour shelf; nCr link |
| 13 | C8 | Walking on a Grid | S8 | 4 × 3 street grid with two coloured paths and their R/U words |
| 14 | C9 | Count, Then Divide | S9 | practice table; STATISTICS count table on reveal |
| 15 | | divider 03 | | |
| 16 | C10 | A Round Table | S10 | three rotated tables equal, a fourth (ACB) different |
| 17 | C11 | Fix One Person, Arrange the Rest | S11 | table with one fixed seat; slot row (n − 1) … 1 |
| 18 | C12 | Six Guests at Dinner | S12 | round table 120 beside a bench 720 |
| 19 | C13 | When Flipping Changes Nothing | S13 | necklace and its flip, table of people that cannot flip |
| 20 | C14 | Row, Circle or Necklace? | S14 | practice: bench / table / necklace choice |
| 21 | | `QuizTimeSlide` | | |
| 22 | | divider 04 | | |
| 23 | C15 | Handle the Rule First | S15 | six slots, first locked with M |
| 24 | C16 | Start and End With a Vowel | S16 | ends in one colour (2, 1), middle in another (4, 3, 2, 1) |
| 25 | C17 | Forming Even Numbers | S17 | five digit boxes, last one "2 or 4" filled first |
| 26 | C18 | Rules With Repeated Letters | S18 | BANANA slots with B locked, remaining tiles above |
| 27 | C19 | Restricted Places First | S19 | practice table |
| 28 | | divider 05 | | |
| 29 | C20 | Glue Them Into a Block | S20 | [AB] with C, D, E; zoom bubble AB / BA |
| 30 | C21 | Total Minus Together | S21 | rectangle 120 split into 48 and 72 |
| 31 | C22 | No Two of Them Side by Side | S22 | four boys with five gap markers, girls dropping in |
| 32 | C23 | Read the Condition Carefully | S23 | three COMPUTER strings: block, one pair adjacent, all apart |
| 33 | C24 | BANANA With Conditions | S24 | B, N, N with four gaps, three identical A's |
| 34 | C25 | Blocks Work in Circles Too | S25 | round table with a double seat PQ; second table apart |
| 35 | C26 | Block, Complement or Gaps? | S26 | practice table |
| 36 | | divider 06 | | |
| 37 | C27 | A Decision Guide | S27 | six clue cards, each with its tool |
| 38 | C28 | A Multi-Step Problem | S28 | BALLOON slots: B locked, [LL] wide tile, ÷ 2! for O's |
| 39 | C29 | Avoid These Errors | S29 | five warning rows, red wrong, green right |
| 40 | C30 | Identify the Clues, Then Solve | S30 | practice table |
| 41 | C31 | Where Programmers Meet These Counts | S31 | four app-style tiles |
| 42 to 46 | | Quiz Time, Key Takeaways (labels only), Feedback (formless), Thank You, All the Best | | fixtures |

## 4. Term ledger

Carried in: n!, nPr, nCr, block method, complement.
New: tagging (C2); multiset, n! / (n₁! … nₖ!) (C4); circular permutation, (n − 1)! (C11);
necklace, (n − 1)! / 2 (C13); restricted position (C15); gap method (C22).

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, one slide per TR slide (46 total) | **Keep** |
| B | Agenda and Key Takeaways: the source's six items | **Keep** |
| C | Reword the cross-session phrase (user rule) | **Yes** |
| D | Two Quiz Time frames; private claude.ai link with Editor controls | **Yes** |
