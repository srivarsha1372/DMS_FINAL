<!-- cSpell:ignore NxtWave devPort DSM nPr nCr Ravi Sita -->
# Enumerating Combinations and Permutations with Repetitions: slide-wise plan

**STATUS: SIGNED OFF 2026-11-26 · PUBLISHED 2026-11-27** (signed off by the user in conversation)

| | |
|---|---|
| Source | Google Doc "DSM : Enumerating Combinations and Permutations with Repetitions" (`1mFzpKf_WjUAjq5OgByvyGdGpRC7FntPscWRW6gqucxo`), 6 sections, 31 drafted slides, no images |
| Deck project | `Outputs/dsm/combinations_with_repetition/` (copied from `slide-kit/slide-template`) |
| Deck file | `src/decks/repetitionDeck.tsx` |
| `name` / `htmlName` | `dsm-combinations-with-repetition` |
| Built file | `Outputs/dsm/combinations_with_repetition/dist-single/dsm-combinations-with-repetition.html` |
| `devPort` | **5284** |
| Content slides | **31** (one per TR slide) |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **46** (under the 50 cap) |
| Branch | `deck/combinations-with-repetition`, built on `main` |
| Artifact | https://claude.ai/artifact/DvGp9LQErZ1Vgvtr5YHCJ5 (private; Editor controls) |

Every count was recomputed by `verify_tr.py`, by brute-force listing where
feasible (all 10 cups, all star-bar rows, every 7-chocolate sharing, all 10⁴
PINs, the loop triples, and the stars-and-bars formula for every n ≤ 5, r ≤ 6):
**all 24 checks correct**.

## 1. How the cut keeps the source

- **Six sections stay six concepts**; agenda and Key Takeaways match (rule 20).
- **One TR slide, one deck slide** (31 → 31).
- **No cross-session phrases** (user rule, 2026-11-26): "nPr (last session)",
  "Our map for the module", "the complement method from last session" and
  "linking back to the Functions session" are reworded to name the idea itself
  (for example "the complement method", "a function from a 5-element set to a
  3-element set", "a one-to-one matching").
- **Running threads:** the suitcase lock (C1) is answered on C6; the 2 × 2
  order / repetition grid (C3) is filled on C28; the ice cream cups (C11 to C13)
  become stars and bars (C17 to C19) and return as the wrong-formula check (C22).

## 2. Concepts

| # | Agenda item | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | When Repetition Is Allowed | 4MAT | C1 to C3 | S1 to S3 |
| 2 | Permutations with Repetition | Merrill | C4 to C10 | S4 to S10 |
| 3 | Combinations with Repetition | Merrill | C11 to C16 | S11 to S16 |
| 4 | The Stars and Bars Method | Merrill | C17 to C22 | S17 to S22 |
| 5 | Distributing Identical Objects | Merrill | C23 to C27 | S23 to S27 |
| 6 | Choosing the Right Formula | Merrill (Application) | C28 to C31 | S28 to S31 |

## 3. Slide by slide

| # | C | Title | Source | Visual |
|---|---|---|---|---|
| 1 to 3 | | Brand, Welcome, Agenda (6 items) | | fixtures |
| 4 | | divider 01 | | |
| 5 | C1 | Is Repetition Allowed? | S1 | three-wheel suitcase lock; codes 482 and 337 |
| 6 | C2 | Where Repeats Happen | S2 | two marble jars (put back vs kept aside), then the four situations |
| 7 | C3 | Order and Repetition | S3 | 2 × 2 tile grid: nPr, nCr filled, two "?" tiles |
| 8 | | divider 02 | | |
| 9 | C4 | Codes From a, b, c | S4 | tree a, b, c → 9 leaves, aa / bb / cc highlighted |
| 10 | C5 | n Choices for Every Position | S5 | slot rows: n, n, n vs n, n − 1, n − 2 |
| 11 | C6 | How Much Does Repetition Add? | S6 | paired bars per row, lock beside 1,000 |
| 12 | C7 | Repeated Experiments | S7 | three dice with "6" labels, sequence strip; coin strip |
| 13 | C8 | Every Job Picks a Printer | S8 | 5 job cards, each with 3 arrows; slot row of 3s |
| 14 | C9 | Which Number Goes on Top? | S9 | "each ___ picks one of ___" cards, wrong version crossed |
| 15 | C10 | n Choices, r Times | S10 | practice table |
| 16 | | divider 03 | | |
| 17 | C11 | Three Scoops, Three Flavours | S11 | three tubs, a cup; VVC = VCV |
| 18 | C12 | Listing Every Cup | S12 | ten coloured cups in three pattern rows |
| 19 | C13 | A Cup Is a List of Counts | S13 | cups beside V / C / S counters |
| 20 | C14 | Combination with Repetition | S14 | three bins marked ∞, a cup collecting r scoops |
| 21 | C15 | Selections With Repeats | S15 | four scenes with n and r tags |
| 22 | C16 | Order? Repetition? | S16 | sort into the four grid cells |
| 23 | | `QuizTimeSlide` | | |
| 24 | | divider 04 | | |
| 25 | C17 | Stars for Items, Bars as Dividers | S17 | three bins and two dividers fading to a star-bar row; four coded cups |
| 26 | C18 | A Perfect Match | S18 | five positions, 3 chosen for stars |
| 27 | C19 | The Stars and Bars Formula | S19 | labelled row: r stars, n − 1 bars, brace n + r − 1 |
| 28 | C20 | A Box of Doughnuts | S20 | 6-space box above its code row |
| 29 | C21 | Find n and r First | S21 | practice table |
| 30 | C22 | Why Not nʳ or nCr? | S22 | three formula cards: two crossed, one ticked |
| 31 | | divider 05 | | |
| 32 | C23 | Identical Chocolates, Different Children | S23 | three bowls behind two dividers, ★★★ \| ★ \| ★★★ |
| 33 | C24 | Two Stories, One Count | S24 | selection story ⇄ distribution story pairs |
| 34 | C25 | No Child Left Out | S25 | bowls pre-filled with one each, 4 left to share |
| 35 | C26 | Identical or Different Objects? | S26 | split: numbered balls with arrows vs plain balls as a code row |
| 36 | C27 | Stars, Bars and One-Each-First | S27 | practice table |
| 37 | | divider 06 | | |
| 38 | C28 | All Four Kinds of Counting | S28 | the grid filled with formulas and n = 3, r = 2 outcomes |
| 39 | C29 | A Fruit Stall | S29 | one stall, four questions, each lighting a grid cell |
| 40 | C30 | Avoid These Errors | S30 | five warning rows: red wrong, green right |
| 41 | C31 | Where Programmers Meet These Counts | S31 | four app-style tiles |
| 42 to 46 | | Quiz Time, Key Takeaways (labels only), Feedback (formless), Thank You, All the Best | | fixtures |

## 4. Term ledger

Carried in: product rule, nPr, nCr, complement method.
New: repetition allowed / with replacement (C2); nʳ (C5); r-combination with
repetition (C14); stars and bars, C(n + r − 1, r) (C17 to C19); distribution of
identical objects, one each first (C23, C25).

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, one slide per TR slide (46 total) | **Keep** |
| B | Agenda and Key Takeaways: the source's six items | **Keep** |
| C | Reword every cross-session phrase (user rule) | **Yes** |
| D | Two Quiz Time frames; private claude.ai link with Editor controls | **Yes** |
