<!-- cSpell:ignore NxtWave devPort DSM lcm Dₙ -->
# The Principle of Exclusion: slide-wise plan

**STATUS: SIGNED OFF 2026-11-27 · PUBLISHED 2026-11-27** (signed off by the user in conversation)

| | |
|---|---|
| Source | Google Doc "DSM : The Principle of Exclusion" (`1ZhKv5G2OHc-VkHP5aodKwU8kN90gPUGXG7igeSOTE_s`), 6 sections, 31 drafted slides, no images |
| Deck project | `Outputs/dsm/principle_of_exclusion/` (copied from `slide-kit/slide-template`) |
| Deck file | `src/decks/exclusionDeck.tsx` |
| `name` / `htmlName` | `dsm-principle-of-exclusion` |
| Built file | `Outputs/dsm/principle_of_exclusion/dist-single/dsm-principle-of-exclusion.html` |
| `devPort` | **5287** |
| Content slides | **31** (one per TR slide) |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **46** |
| Branch | `deck/principle-of-exclusion`, built on `main` |
| Artifact | https://claude.ai/artifact/Gvh2y75VKYxpN8UGxLs2AW (private; Editor controls) |

Every count was recomputed by `verify_tr.py` by direct counting (every integer
up to 1,000, every bit string, PIN, arrangement and gift distribution, every
derangement up to n = 7) and by the formula: **all 29 checks correct**.

## 1. How the cut keeps the source

- **Six sections stay six concepts**; agenda and Key Takeaways match (rule 20).
- **One TR slide, one deck slide** (31 → 31).
- **No cross-session phrases** (user rule): the subheading "A Problem From Our
  First Counting Session" becomes "Two Clubs, Some Shared Members"; notes that
  name "Basics of Counting" and "the Repetitions session" name the idea instead
  (the sum rule; "one each first" for identical objects); "Slide 17" becomes
  "The General Principle".
- **Running threads:** the clubs (C1) answer becomes the two-set formula (C5);
  the survey (C12) is filled region by region (C13) and reused in practice
  (C16); D₄ = 9 is listed (C23), derived (C24, C25) and reused (C27).
- **One shared figure:** a Venn diagram drawn as text-free SVG circles with
  every region number a real page element (two or three sets, optional
  universe rectangle, regions lit per press).

## 2. Concepts

| # | Agenda item | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | Counting with Overlaps | 4MAT | C1 to C3 | S1 to S3 |
| 2 | Inclusion–Exclusion for Two Sets | Merrill | C4 to C9 | S4 to S9 |
| 3 | Inclusion–Exclusion for Three Sets | Merrill | C10 to C16 | S10 to S16 |
| 4 | Applying Inclusion–Exclusion | Merrill | C17 to C21 | S17 to S21 |
| 5 | Derangements | Merrill | C22 to C27 | S22 to S27 |
| 6 | Putting It All Together | Merrill (Application) | C28 to C31 | S28 to S31 |

## 3. Slide by slide

| # | C | Title | Source | Visual |
|---|---|---|---|---|
| 1 to 3 | | Brand, Welcome, Agenda (6 items) | | fixtures |
| 4 | | divider 01 | | |
| 5 | C1 | Counting Club Members | S1 | Venn: 7 / 3 / 5, overlap flashes "counted twice" |
| 6 | C2 | Overlaps Are Everywhere | S2 | three mini cards, each with A, B and the shared part |
| 7 | C3 | Include, Then Exclude | S3 | three-step strip: counted 2 times → minus → every region 1 time |
| 8 | | divider 02 | | |
| 9 | C4 | Three Regions, Two Circles | S4 | Venn regions labelled 1, 2, 1 |
| 10 | C5 | Inclusion–Exclusion for Two Sets | S5 | boxed formula; Venn in U with "neither" shaded |
| 11 | C6 | Cricket and Football | S6 | Venn in 40: 15, 10, 8, outside 7, filled centre out |
| 12 | C7 | How Many Multiples? | S7 | number strip 1 to 30: multiples of 2 blue, 3 orange, 6 both |
| 13 | C8 | Numbers Divisible by 2 or 3 | S8 | Venn in 100: 34, 16, 17, outside 33 |
| 14 | C9 | Add, Subtract the Overlap | S9 | practice table |
| 15 | | divider 03 | | |
| 16 | C10 | Seven Regions | S10 | three-circle Venn labelled 1, 2, 3; centre 3 − 3 + 1 = 1 |
| 17 | C11 | Inclusion–Exclusion for Three Sets | S11 | formula with singles / pairs / triple coloured |
| 18 | C12 | A Student Survey | S12 | givens beside the circles M, P, C; result 88, none 12 |
| 19 | C13 | Region by Region | S13 | the same Venn filled centre outwards, one region per press |
| 20 | C14 | Divisible by 3, 5 or 7 | S14 | count table; 543 and 457 |
| 21 | C15 | Working Backwards | S15 | equation with x box on a balance |
| 22 | C16 | Singles, Pairs, Triple | S16 | practice table |
| 23 | | `QuizTimeSlide` | | |
| 24 | | divider 04 | | |
| 25 | C17 | Any Number of Sets | S17 | sign ladder: 1 set +, 2 sets −, 3 sets +, 4 sets − |
| 26 | C18 | Two Forbidden Places | S18 | slots "not 1", "not 2"; bad = 42 of 120, good 78 |
| 27 | C19 | No Child Left Empty-Handed | S19 | three gift bags; bad 93 of 243, good 150 |
| 28 | C20 | At Least One of Each | S20 | PIN pad with 0 and 1 lit; 10,000 − 9,026 = 974 |
| 29 | C21 | Name the Sets First | S21 | practice table |
| 30 | | divider 05 | | |
| 31 | C22 | Every Letter in the Wrong Envelope | S22 | three letters, three envelopes, crossed arrows |
| 32 | C23 | Derangements for n = 1, 2, 3 | S23 | six arrangement cards, 231 and 312 lit, fixed points circled |
| 33 | C24 | Inclusion–Exclusion on Fixed Points | S24 | row with k locked positions, the rest shuffled; alternating sum |
| 34 | C25 | The Derangement Formula | S25 | formula, Dₙ and n! for n = 1 to 6 as paired bars |
| 35 | C26 | A Surprising Constant | S26 | ratios settling onto a 1/e line |
| 36 | C27 | Use the Table or the Formula | S27 | practice table |
| 37 | | divider 06 | | |
| 38 | C28 | A Decision Guide | S28 | six clue → form cards |
| 39 | C29 | Avoid These Errors | S29 | five warning rows, red wrong, green right |
| 40 | C30 | Plan, Then Solve | S30 | practice table |
| 41 | C31 | Where Programmers Meet It | S31 | four app-style tiles |
| 42 to 46 | | Quiz Time, Key Takeaways (labels only), Feedback (formless), Thank You, All the Best | | fixtures |

## 4. Term ledger

Carried in: sum rule, complement, set union and intersection, n!, C(n, k),
nʳ distributions. New: overlap, inclusion–exclusion (C3, C5), floor ⌊n / k⌋
and lcm (C7), the general principle and its signs (C17), derangement Dₙ (C22),
1/e (C26).

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, one slide per TR slide (46 total) | **Keep** |
| B | Agenda and Key Takeaways: the source's six items | **Keep** |
| C | Reword the cross-session phrases (user rule) | **Yes** |
| D | Two Quiz Time frames; private claude.ai link with Editor controls | **Yes** |
