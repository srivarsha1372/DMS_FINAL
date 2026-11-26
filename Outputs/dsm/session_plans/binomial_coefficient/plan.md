<!-- cSpell:ignore NxtWave devPort DSM nCr Asha Tremblay Grimaldi Koshy -->
# Binomial Coefficient: slide-wise plan

**STATUS: SIGNED OFF 2026-11-27 · PUBLISHED 2026-11-27** (signed off by the user in conversation)

| | |
|---|---|
| Source | Google Doc "DSM : Binomial Coefficient" (`1YKnBRVtH0Lm6sv9nkWmHPmyv71RkOseXwKqSTfd_r20`), 6 sections, 29 drafted slides, no images |
| Deck project | `Outputs/dsm/binomial_coefficient/` (copied from `slide-kit/slide-template`) |
| Deck file | `src/decks/binomialDeck.tsx` |
| `name` / `htmlName` | `dsm-binomial-coefficient` |
| Built file | `Outputs/dsm/binomial_coefficient/dist-single/dsm-binomial-coefficient.html` |
| `devPort` | **5286** |
| Content slides | **29** (one per TR slide) |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **44** (under the cap) |
| Branch | `deck/binomial-coefficient`, built on `main` |
| Artifact | https://claude.ai/artifact/2qvqdAxUUW4ZGdDkthmYsk (private; Editor controls) |

Every value and identity was recomputed by `verify_tr.py` (subset listing for
small cases; symmetry and Pascal's identity for every n ≤ 40; Pascal's Triangle
rows 0 to 10 built by the rule and compared with the formula; the 21! overflow
and C(30, 15) claims): **all 26 checks correct**.

## 1. How the cut keeps the source

- **Six sections stay six concepts**; agenda and Key Takeaways match (rule 20).
- **One TR slide, one deck slide** (29 → 29).
- **No cross-session phrases** (user rule): "the idea from the Functions
  session" becomes "a one-to-one matching (a bijection)"; slide-number
  references in notes ("Slide 3") become slide names.
- **Running threads:** the skyline 1, 4, 6, 4, 1 (C3) returns as row 4 (C7),
  as the mirror (C11) and as the total 16 (C22); Pascal's identity is previewed
  (C9), proved (C18, C19) and becomes an algorithm (C29).
- **One shared figure:** a DOM Pascal's Triangle (one circle per entry, rows
  centred) used with different highlights on C6 to C11, C16, C22, C24 and C26.

## 2. Concepts

| # | Agenda item | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | The Binomial Coefficient | 4MAT | C1 to C5 | S1 to S5 |
| 2 | Pascal's Triangle | Merrill | C6 to C10 | S6 to S10 |
| 3 | The Symmetry Property | Merrill | C11 to C15 | S11 to S15 |
| 4 | Pascal's Identity | Merrill | C16 to C21 | S16 to S21 |
| 5 | Patterns in Pascal's Triangle | Merrill | C22 to C25 | S22 to S25 |
| 6 | Putting It All Together | Merrill (Application) | C26 to C29 | S26 to S29 |

## 3. Slide by slide

| # | C | Title | Source | Visual |
|---|---|---|---|---|
| 1 to 3 | | Brand, Welcome, Agenda (6 items) | | fixtures |
| 4 | | divider 01 | | |
| 5 | C1 | Choosing Toppings | S1 | four topping chips, six two-topping slices |
| 6 | C2 | The Binomial Coefficient | S2 | boxed formula; three notation cards incl. stacked (n over r) |
| 7 | C3 | Counting Subsets | S3 | five columns of subset cards, skyline 1, 4, 6, 4, 1 |
| 8 | C4 | Values to Know by Heart | S4 | four cards: empty basket, full basket, one item, handshake |
| 9 | C5 | Cancel, Then Multiply | S5 | practice table |
| 10 | | divider 02 | | |
| 11 | C6 | One Simple Rule | S6 | triangle builds row by row; 3 + 3 = 6 arrows in row 4 |
| 12 | C7 | The First Eight Rows | S7 | triangle rows 0 to 7 with row labels |
| 13 | C8 | Every Entry Is a C(n, r) | S8 | triangle with 15 and 35 circled, C(6, 2), C(7, 3) |
| 14 | C9 | The Rule Behind the Triangle | S9 | three-entry mini triangle, symbols then 4, 6, 10 |
| 15 | C10 | Fill In the Missing Entries | S10 | rows 6 to 9 with blank circles filled per press |
| 16 | | divider 03 | | |
| 17 | C11 | A Mirror in Every Row | S11 | triangle with a dashed mirror line, matching pairs lit |
| 18 | C12 | Choosing r Is Choosing n − r | S12 | boxed statement; one row with r counted from both ends |
| 19 | C13 | Swap the Two Factorials | S13 | three working lines, (n − r)! and r! in two colours |
| 20 | C14 | Who Goes Decides Who Stays | S14 | six students split: 2 to the bus, 4 at the gate; swap |
| 21 | C15 | Symmetry Saves Work | S15 | practice table with the a + b = n hook |
| 22 | | `QuizTimeSlide` | | |
| 23 | | divider 04 | | |
| 24 | C16 | The Rule That Builds the Triangle | S16 | triangle with three targets and their parents in matching colours |
| 25 | C17 | With a or Without a | S17 | two boxes of 2-subsets, a highlighted |
| 26 | C18 | A Committee and a Special Member | S18 | Asha in / Asha out branches joined by + |
| 27 | C19 | Adding Two Fractions | S19 | four working lines, r and (n − r) adding to n |
| 28 | C20 | No Factorials Needed | S20 | staircase of three rows, each answer reused |
| 29 | C21 | Symmetry or Pascal? | S21 | vote, then reveal |
| 30 | | divider 05 | | |
| 31 | C22 | Every Row Sums to a Power of 2 | S22 | triangle with row totals 1 to 32, doubling arrows |
| 32 | C23 | Counting All Subsets Two Ways | S23 | in / out switches vs columns by size |
| 33 | C24 | Hidden Sequences | S24 | four coloured diagonals; dot triangles 1, 3, 6, 10 |
| 34 | C25 | Use the Patterns | S25 | practice table |
| 35 | | divider 06 | | |
| 36 | C26 | Row 9 of Pascal's Triangle | S26 | row 8 above row 9 with sum arrows; mirror line |
| 37 | C27 | Avoid These Errors | S27 | four warning rows, red wrong, green right |
| 38 | C28 | Definition, Triangle and Identities | S28 | practice table, tool named per row |
| 39 | C29 | Pascal's Identity as an Algorithm | S29 | DP table i, j 0 to 6 filled in triangle shape; pseudocode |
| 40 to 44 | | Quiz Time, Key Takeaways (labels only), Feedback (formless), Thank You, All the Best | | fixtures |

## 4. Term ledger

Carried in: nCr, sum rule, product rule, subset, bijection.
New: binomial coefficient, C(n, r), "n choose r" (C2); Pascal's Triangle, row
and position from 0 (C6, C8); symmetry property (C12); Pascal's identity (C16);
combinatorial proof (C14, C18, C23); triangular and tetrahedral numbers (C24);
dynamic programming (C29).

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, one slide per TR slide (44 total) | **Keep** |
| B | Agenda and Key Takeaways: the source's six items | **Keep** |
| C | Reword the cross-session phrase (user rule) | **Yes** |
| D | Two Quiz Time frames; private claude.ai link with Editor controls | **Yes** |
