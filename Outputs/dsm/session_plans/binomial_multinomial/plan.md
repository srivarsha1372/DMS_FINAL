<!-- cSpell:ignore NxtWave devPort DSM nPr nCr -->
# The Binomial and Multinomial Theorems: slide-wise plan

**STATUS: SIGNED OFF 2026-11-27 · PUBLISHED 2026-11-27** (signed off by the user in conversation)

| | |
|---|---|
| Source | Google Doc "DSM : The Binomial and Multinomial Theorems" (`1ups6UG4hDKBLRFNSmTX1whQ6WreXPaBb68oGKuTtkZ8`), 6 sections, 31 drafted slides, no images |
| Deck project | `Outputs/dsm/binomial_multinomial/` (copied from `slide-kit/slide-template`) |
| Deck file | `src/decks/binomialMultinomialDeck.tsx` |
| `name` / `htmlName` | `dsm-binomial-multinomial` |
| Built file | `Outputs/dsm/binomial_multinomial/dist-single/dsm-binomial-multinomial.html` |
| `devPort` | **5287** (5286 is taken by the Binomial Coefficient deck) |
| Content slides | **31** (one per TR slide) |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **46** (under the 50 cap) |
| Branch | `deck/binomial-multinomial`, built on `main` in its own worktree |
| Artifact | https://claude.ai/artifact/1UJwJttX7o5EqeLb59RP9Y (private; Editor controls) |

Every expansion, term, coefficient, sum and count in the TR was recomputed by
`verify_tr.py` with a hand-written polynomial multiplier (fractions, negative
powers for 1/x) and brute-force listing of bit strings and arrangements:
**all 81 checks correct**.

## 1. How the cut keeps the source

- **Six sections stay six concepts**; agenda and Key Takeaways match (rule 20),
  Key Takeaways as labels only.
- **One TR slide, one deck slide** (31 → 31).
- **No cross-session phrases** (user rule). Rewritten in speaker notes:
  S2 "Last session we met C(n, r)…" → "We know C(n, r) as a count of subsets";
  S3 "tools from earlier sessions" → "our counting toolkit";
  S17 "Last session we proved…" → "Subset counting gives the same 2ⁿ";
  S22 "the multiset formula from the Constrained Repetitions session" → "the multiset formula";
  S26 "links three sessions together" → "links stars and bars, multisets and this theorem".
- **Running threads:** (x + y)³ from C1 is the tree on C3 and the proof on C6;
  row 5 (C5, C7) returns on C18; x²yz in (x + y + z)⁴ runs C22 → C26 → C29;
  the Slide 5 four checks are referenced on C10 and C29.
- **Visuals vary by slide** (no run of hidden-column tables): staircase,
  bracket choosers, colour-banded formula, term-box rows, substitution ladders,
  place-value columns, 3 × 3 grid, letter tiles, triangle of terms, star-bar row.
  Practice slides keep the TR's reveal tables (that is the activity).

## 2. Concepts

| # | Agenda item | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | Expanding Powers of a Binomial | 4MAT | C1 to C3 | S1 to S3 |
| 2 | The Binomial Theorem | Merrill | C4 to C10 | S4 to S10 |
| 3 | The General Term | Merrill | C11 to C16 | S11 to S16 |
| 4 | Applications of the Binomial Theorem | Merrill | C17 to C20 | S17 to S20 |
| 5 | The Multinomial Theorem | Merrill | C21 to C27 | S21 to S27 |
| 6 | Putting It All Together | Merrill (Application) | C28 to C31 | S28 to S31 |

## 3. Slide by slide

| # | C | Title | Source | Visual |
|---|---|---|---|---|
| 1 to 3 | | Brand, Welcome, Agenda (6 items) | | fixtures |
| 4 | | divider 01 | | |
| 5 | C1 | Powers of (x + y) | S1 | Think First card; staircase of expansions n = 0 … 4 revealed row by row, coefficients in accent colour |
| 6 | C2 | The Coefficients Are Familiar | S2 | Pascal rows 2–4 on the left, expansions on the right, matching rows joined; "binomial = two-term" chip |
| 7 | C3 | One Letter From Each Bracket | S3 | three-level x/y tree, 8 leaves grouped by colour 1 · 3 · 3 · 1 |
| 8 | | divider 02 | | |
| 9 | C4 | The Binomial Theorem | S4 | long banner: C(n, k) / falling xⁿ⁻ᵏ / rising yᵏ in three colours, sigma form on reveal |
| 10 | C5 | What Every Expansion Looks Like | S5 | (x + y)⁵ with falling x-power arrow, rising y-power arrow, mirror line; four check chips |
| 11 | C6 | Why the Theorem Is True | S6 | row of n bracket boxes, k lit as "y", rest "x"; label C(n, k) |
| 12 | C7 | A Full Expansion: (x + y)⁵ | S7 | row 5 above the expansion, each coefficient dropping into its term |
| 13 | C8 | Expanding (2x + 3)³ | S8 | four term cards k = 0…3, (2x)³⁻ᵏ highlighted; result line |
| 14 | C9 | Expanding (a − b)⁵ | S9 | signs in alternating green/red with (−1)ᵏ tags; Try it card (x + 1/x)⁴ |
| 15 | C10 | Expand Fully | S10 | practice table, Expansion column revealed per row |
| 16 | | `QuizTimeSlide` | | |
| 17 | | divider 03 | | |
| 18 | C11 | Going Straight to One Term | S11 | term boxes T₁ … Tₙ₊₁ with k = 0 … n under each; off-by-one callout |
| 19 | C12 | The 4th Term of (x + 2)⁷ | S12 | substitution ladder n = 7, k = 3, x, 2 in four colours; Try it card |
| 20 | C13 | The Coefficient of x⁵ in (2x − 1)⁸ | S13 | three-step ladder: general term → 8 − k = 5 → k = 3, boxed −1,792 |
| 21 | C14 | The Constant Term | S14 | power simplified step by step to 12 − 3k, number line 0…6 marking k = 4; Try it card |
| 22 | C15 | Finding the Middle | S15 | two term-box rows: 9 boxes (5th lit) and 8 boxes (4th, 5th lit) |
| 23 | C16 | General Term First | S16 | practice table, k and Answer revealed per row |
| 24 | | divider 04 | | |
| 25 | C17 | Put x = y = 1 | S17 | (x + y)⁶ terms collapsing into 1 + 6 + 15 + 20 + 15 + 6 + 1 = 64 |
| 26 | C18 | Put x = 1, y = −1 | S18 | row 5 tiles in two alternating colours, two sums of 16 |
| 27 | C19 | Using the Expansion for Arithmetic | S19 | place-value columns building 14641; fading tail for 1.01⁵; 99³ line |
| 28 | C20 | Substitute or Approximate | S20 | practice table, Method and Answer revealed per row |
| 29 | | divider 05 | | |
| 30 | C21 | Expanding (x + y + z)² | S21 | Think First; 3 × 3 multiplication grid, diagonal one colour, mirror pairs shared colours |
| 31 | C22 | Counting Ways to Build x²yz | S22 | four bracket boxes with several fillings (x x y z, x y x z, z x y x …), count 4! / 2! = 12 |
| 32 | C23 | The Multinomial Theorem | S23 | statement box; below, k = 2 case box joined by "special case" arrow |
| 33 | C24 | Coefficient of a³b²c in (a + b + c)⁶ | S24 | coloured blocks a a a · b b · c → 60; Try it line with constants 2², (−1)³, 3 → −720 |
| 34 | C25 | A Full Trinomial Expansion | S25 | triangle of 10 terms: cubes at corners, x²y types on edges, xyz centre; pattern table |
| 35 | C26 | Counting the Terms | S26 | star-bar row ★★ ǀ ★ ǀ ★ for x²yz; small table of term counts |
| 36 | C27 | Check the Powers, Then Apply the Formula | S27 | practice table, Working and Answer revealed per row (trap row last) |
| 37 | | divider 06 | | |
| 38 | C28 | A Decision Guide | S28 | six clue → method cards in a flow from "Read the question" |
| 39 | C29 | Avoid These Errors | S29 | five warning rows, wrong struck in red, correct in green |
| 40 | C30 | Binomial and Multinomial | S30 | mixed practice table, Answer revealed per row |
| 41 | C31 | Where Programmers Meet These Coefficients | S31 | four app-style tiles: bit string, all strings, word over {a, b, c}, computer algebra |
| 42 to 46 | | Quiz Time, Key Takeaways (labels only), Feedback (formless), Thank You, All the Best | | fixtures |

## 4. Term ledger

Carried in: C(n, r), Pascal's Triangle, subsets, multiset arrangements, stars and bars.
New: binomial (C2); binomial theorem, sigma form (C4); general term Tₖ₊₁ (C11);
term independent of x (C14); middle term (C15); multinomial coefficient (C23).

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, one slide per TR slide (46 total) | **Keep** |
| B | Agenda and Key Takeaways: the source's six items | **Keep** |
| C | Reword the five cross-session phrases (user rule) | **Yes** |
| D | Two Quiz Time frames; private claude.ai link with Editor controls | **Yes** |
