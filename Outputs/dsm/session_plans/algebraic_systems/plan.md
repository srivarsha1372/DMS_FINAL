<!-- cSpell:ignore NxtWave devPort DSM Tremblay Manohar idempotent idempotence -->
# Algebraic Systems: slide-wise plan

**STATUS: SIGNED OFF 2026-11-24** (signed off by the user in conversation, with two changes: Key Takeaways follows the TR's five items; concept 1 cut to five slides)

| | |
|---|---|
| Source | Google Doc "DSM : Algebraic Systems" (`14h1c4zTcoitoPbNEKHQfBR3nTw4kw7bumJmvcPZ60iM`), 6 sections, 24 drafted slides, no images |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/algebraic_systems/` (copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/algebraic_systems/plan.md` |
| Deck file | `src/decks/algebraicSystemsDeck.tsx` |
| `name` / `htmlName` | `dsm-algebraic-systems` |
| `devPort` | **5275** (5274 is the highest taken) |
| Content slides | **49** |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **64** |
| Branch | `deck/algebraic-systems`, built on `main` |

Every formula, operation table, identity, inverse, idempotent element and
counterexample in the source was recomputed by `verify_tr.py` beside this
file: **all 30 checks correct**.

---

## 1. How the cut keeps the source

The plan keeps **every idea, worked example, analogy and practice item, in
the source's order**, and changes four things:

- **Six sections stay six concepts**, with the agenda's six names unchanged.
  **Key Takeaways lists the source's five items**, leaving out "Examples and
  Verification", by the user's decision at sign-off (overrides rule 20 for
  this deck).
- **Each concept opens on a felt need** (pedagogy §2). Added slides: C2, C9,
  C17, C18, C28, C37, C42, C43 (second opening slides) and C16, C26, C35,
  C51 (Merrill Integration), from the source's own notes and analogies.
- **One new term per slide** (pedagogy §2b). Split: S6 (definition, then the
  subtraction break), S7 (proof, then disproof), S8 (definition, then the
  table test), S11 (four facts, one slide each), S12 and S14 (one example per
  slide), S16 (definition, then examples).
- **Copy follows the content rules.** Slide pointers removed (rule 22:
  "from Slide 5", "Slide 12"), titles two or three words (rule 29), no full
  stops (rule 36), "Assoc." and "Comm." spelled out (no abbreviations).

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways, verbatim) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Algebraic Systems and Binary Operations | **4MAT** | definitions, mostly recap from last session | C1, C2, C3, C5, C7 (5) | section 1, S1 to S5 |
| 2 | Associative and Commutative Properties | **Merrill** | a skill: prove or disprove each property | C8 to C16 (9) | section 2, S6 to S9 |
| 3 | Identity Element | **Merrill** | a skill: find e, or show there is none | C17 to C26 (10) | section 3, S10 to S12 |
| 4 | Inverse Elements | **Merrill** | a skill: find a⁻¹ where it exists | C27 to C35 (9) | section 4, S13 to S15 |
| 5 | Idempotent Property | **4MAT** | one definition and a table test | C36 to C41 (6) | section 5, S16, S17 |
| 6 | Examples and Verification (agenda only, not in Key Takeaways) | **Merrill** | a skill: verify every property of a given system | C42 to C51 (10) | section 6, S18 to S24 |

**The chain.** Concept 1 closes on the ×₄ table, which every later concept
reads (symmetry, identity row, inverse cells, diagonal). Concept 2 closes on
"brackets can be dropped"; concept 3 opens on elements that change nothing.
Concept 3 closes on "e must not depend on a"; concept 4 needs that e. Concept
4 closes on "all, some or none"; concept 5 opens on another element-by-element
question. Concept 5 closes on the diagonal; concept 6 gathers every test.

## 3. Slide by slide

C = content slide; Sn = the source's slide n. All visuals compose figures on
`main` (section 6). An "operation machine" is `RelationGraph` drawn as pills,
as in the last deck. Operation tables are `DataTable`, with the cells a test
uses lit.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Algebraic Systems |
| 3 | `AgendaSlide` | the first five items of §2, static (rule 44); "Examples and Verification" left off the agenda (user, 2026-11-24), though its concept and divider stay |

### Concept 1: Algebraic Systems and Binary Operations (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 4 | | | divider 01 | Algebraic Systems and Binary Operations | fixture | kit |
| 5 | C1 | Why 1 | Pieces and Rules | A board game is a set of pieces plus the rules for moving them (S1 analogy) | pieces pill plus rule-card pill | kit |
| 6 | C2 | Why 2 | New Rules, New Game | **Added.** Change the pieces or the rules and you have a different game; the same holds for sets and operations (S1 analogy) | the same pieces with a second rule card | kit |
| 7 | C3 | What | Algebraic System | A non-empty set S with one or more operations, (S, f₁, …, fₖ); its underlying set (carrier) is the set whose elements are combined. (Z, +), (Z, ×), ({0, 1}, ∧, ∨), strings: set and operations; (Z, +) and (Z, ×) differ (S1, S2) | stepped `DataTable` | kit |
| 8 | C5 | How | Binary Operations | Every pair, exactly one answer, in S (closure, from last session). a + b + ab: 2 ∗ 3 = 11. Closure rows: − on N, × on evens, + on {1, 2, 3}; ÷ on Z is not an operation (S3, S4) | machine (2, 3) → 11 beside a closure `DataTable` | kit |
| 9 | C7 | What if | Operation Tables | ×₄ on {0, 1, 2, 3}; row a, column b; 2 ×₄ 3 = 2; closed. Used again in every concept (S5) | `DataTable`, the row 2 / column 3 cell lit | kit |

### Concept 2: Associative and Commutative Properties (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 10 | | | divider 02 | Associative and Commutative Properties | fixture | kit |
| 11 | C8 | Activation 1 | Adding Three Bills | (₹100 + ₹50) + ₹20 and ₹100 + (₹50 + ₹20): same total (S6 analogy) | two bracketings, one result | kit |
| 12 | C9 | Activation 2 | Grouping Can Break | **Added** from S6: (8 − 4) − 2 = 2 but 8 − (4 − 2) = 6 | two bracketings, two results | kit |
| 13 | C10 | Demonstration | Associative | (a ∗ b) ∗ c = a ∗ (b ∗ c) for all a, b, c. Examples; − and ÷ fail (S6) | `DataTable` yes / no | kit |
| 14 | C11 | Demonstration | Proving Associativity | a + b + ab: expand both sides, both a + b + c + ab + ac + bc + abc (S7) | two columns, one line per press | kit |
| 15 | C12 | Demonstration | Disproving Associativity | a + 2b: a + 2b + 2c against a + 2b + 4c; a = b = 0, c = 1 gives 2 and 4 (S7) | `StepCards` | kit |
| 16 | C13 | Demonstration | Commutative | a ∗ b = b ∗ a for all a, b. Examples; −, concatenation, matrices, a + 2b fail (S8) | `DataTable` yes / no | kit |
| 17 | C14 | Demonstration | Symmetric Table | Table test: symmetric about the main diagonal. ×₄ is symmetric, so commutative (S8) | ×₄ table, mirror cells lit in pairs | kit |
| 18 | C15 | Application | Independent Properties | +, concatenation, \|a − b\|, −: vote, then reveal both columns (S9) | `DataTable` revealed per row | kit |
| 19 | C16 | Integration | Dropping Brackets | **Added** from S6's note: associativity is why a + b + c needs no brackets; − and ÷ need them | two chains, one with brackets | kit |

### Concept 3: Identity Element (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 20 | | | divider 03 | Identity Element | fixture | kit |
| 21 | C17 | Activation 1 | Changing Nothing | **Added.** Adding 0, multiplying by 1: the number comes back unchanged (S10 examples) | two machines returning their input | kit |
| 22 | C18 | Activation 2 | Not Always 0 | **Added.** Under a ∗ b = a + b − 3, 5 ∗ 0 = 2: zero changes things here. Which element does nothing? (S12) | machine (5, 0) → 2, crossed | kit |
| 23 | C19 | Demonstration | Identity Element | e ∗ a = a ∗ e = a for every a. Six systems and their identities (S10) | stepped `DataTable` | kit |
| 24 | C20 | Demonstration | Both Sides | a − 0 = a but 0 − a ≠ a: 0 is only a right identity; (Z, −) has none (S11) | two machines, one ticked, one crossed | kit |
| 25 | C21 | Demonstration | Only One Identity | e = e ∗ e′ = e′, one equality per press (S11) | `StepCards` | kit |
| 26 | C22 | Demonstration | Identity Must Be in S | Even integers under ×: 1 would work, but 1 is not even (S11) | set oval of evens, 1 outside | kit |
| 27 | C23 | Demonstration | Identity in a Table | The row of e repeats the column headings, and its column the row headings. ×₄: e = 1 (S11) | ×₄ table, row and column 1 lit | kit |
| 28 | C24 | Demonstration | Solving for e | a + b − 3: a + e − 3 = a gives e = 3; check 3 ∗ a = a (S12) | `StepCards`, check boxed | kit |
| 29 | C25 | Application | Your Turn | a + b + ab: find e (0). And OR on {0, 1} (0) (S12, S10 note) | `DataTable`, answers per press | kit |
| 30 | C26 | Integration | e Cannot Depend on a | **Added** from S12's note: e must work for every a; e = a means no identity | callout | kit |
| 31 | | | `QuizTimeSlide` | "Quiz Time!" only. Mid-deck | fixture | kit |

### Concept 4: Inverse Elements (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 32 | | | divider 04 | Inverse Elements | fixture | kit |
| 33 | C27 | Activation 1 | Back to Zero | 5 + (−5) = 0: combining gets back to the identity (S13 visual) | 5 and −5 meeting at 0 | kit |
| 34 | C28 | Activation 2 | No Way Back | **Added.** In (Z, ×), 2 × ? = 1 has no integer answer (S13 table) | machine (2, ?) → 1, crossed | kit |
| 35 | C29 | Demonstration | Inverse Element | a ∗ b = b ∗ a = e, written a⁻¹. Needs an identity first (S13) | pairs meeting at e | kit |
| 36 | C30 | Demonstration | Which Have Inverses | (Z, +) all; (Q without 0, ×) all; (Z, ×) only ±1; (P(S), ∪) only ∅ (S13) | stepped `DataTable` | kit |
| 37 | C31 | Demonstration | Inverses From a Formula | a + b − 3, e = 3: x = 6 − a, always an integer; 5⁻¹ = 1 (S14) | `StepCards` | kit |
| 38 | C32 | Demonstration | When It Fails | a + b + ab, e = 0: x = −a/(1 + a), an integer only for 0 and −2; (−2) ∗ (−2) = 0 (S14) | `StepCards` plus a small value table | kit |
| 39 | C33 | Demonstration | Inverses in a Table | ×₅ on {1, 2, 3, 4}: find 1 in each row; 2⁻¹ = 3, 3⁻¹ = 2, 4⁻¹ = 4 (S15) | ×₅ table, each 1 lit in turn | kit |
| 40 | C34 | Application | Your Turn | ×₄: which rows contain 1? Rows 0 and 2 do not, so 0 and 2 have no inverse (S15 note) | ×₄ table, rows revealed | kit |
| 41 | C35 | Integration | All, Some or None | **Added** from S13's note: every element, a few, or no identity at all | three cards | kit |

### Concept 5: Idempotent Property (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 42 | | | divider 05 | Idempotent Property | fixture | kit |
| 43 | C36 | Why 1 | Pressing Twice | Pressing a lift's call button twice does not call two lifts (S16 analogy) | press, press → one lift | kit |
| 44 | C37 | Why 2 | Paying Twice | **Added** from S16's note: clicking "Pay now" twice must not charge twice | two clicks → one charge | kit |
| 45 | C38 | What | Idempotent | a is idempotent if a ∗ a = a; ∗ is idempotent if every element is (S16) | machine (A, A) → A | kit |
| 46 | C39 | How | Examples | ∪, ∩, AND, OR, max, min are; + (only 0) and × (only 0, 1) are not (S16) | `DataTable` | kit |
| 47 | C40 | How | Diagonal Test | The main diagonal repeats the headings. ×₆: 0, 1, 4, 3, 4, 1, so 0, 1, 3, 4 (S16, S17) | ×₆ diagonal lit, matches ticked | kit |
| 48 | C41 | What if | Find Them | ×₄, ×₆, a + b − 3, (P(S), ∪): idempotent elements, one row per press (S17) | `DataTable` revealed per row | kit |

### Concept 6: Examples and Verification (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 49 | | | divider 06 | Examples and Verification | fixture | kit |
| 50 | C42 | Activation 1 | Six Checks | **Added.** Closure, associative, commutative, identity, inverses, idempotent: everything so far | six chips | kit |
| 51 | C43 | Activation 2 | Order Matters | **Added** from S21's note: inverses cannot be checked before an identity is found | chips with arrows, one crossed | kit |
| 52 | C44 | Demonstration | Properties at a Glance | Condition and table test for each property (S18) | stepped `DataTable` | kit |
| 53 | C45 | Demonstration | Familiar Systems | Seven systems against five properties (S19) | `DataTable` | kit |
| 54 | C46 | Demonstration | Non-Examples | N with −, Z with ÷, odd + , {0, 1} with +, Q with ÷ (S20) | `DataTable` | kit |
| 55 | C47 | Demonstration | Verifying a Formula | a + b − 3: the six checks, one row per press (S21) | `DataTable` revealed per row | kit |
| 56 | C48 | Demonstration | Verifying a Table | {x, y}: closed, commutative, not associative, no identity, not idempotent (S22) | 2 × 2 table beside the checks | kit |
| 57 | C49 | Demonstration | The Average | (a + b)/2 on Q: commutative and idempotent, not associative, no identity (S23) | `DataTable` revealed per row | kit |
| 58 | C50 | Application | Your Turn | a + b + 1 on Z: six checks, one per press; 3⁻¹ = −5 (S24) | `StepCards` | kit |
| 59 | C51 | Integration | Exam Order | Closure, associative, commutative, identity, inverses (only with an identity), idempotent (S21 note) | numbered `StepCards` | kit |

### Close

| # | Type | Content |
|---|---|---|
| 60 | `QuizTimeSlide` | "Quiz Time!" only |
| 61 | `KeyTakeawaysSlide` | the source's five takeaway items (user, at sign-off) |
| 62 | `FeedbackSlide` `formless` | rule 41 as amended 2026-11-21 |
| 63 | `ThankYouSlide` | fixture |
| 64 | `ThankYouSlide` | `title="All the Best"` |

## 4. Term ledger

Carried in, never re-explained: **set, element, subset, power set,
union, intersection, complement, ordered pair, S × S, integers Z, naturals
N, rationals Q, modulo, AND, OR, max, string, concatenation, matrix,
algebraic structure, binary operation, closure, operation table** (the last
five from the Introduction session, recapped in concept 1).

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| algebraic system | C3 | a set with its operations; the same as an algebraic structure |
| underlying set (carrier) | C3 | the set whose elements are combined |
| associative | C10 | grouping does not matter |
| counterexample | C12 | (carried in; reused) |
| commutative | C13 | order does not matter |
| main diagonal, symmetric table | C14 | the cells a ∗ a · each cell matches its mirror |
| identity element e | C19 | the element that changes nothing |
| right identity | C20 | works on one side only |
| inverse a⁻¹ | C29 | the element that gets a back to e |
| idempotent element | C38 | combined with itself, gives itself |
| idempotent operation | C38 | every element is idempotent |

## 5. Changes to the source

- **Added C2, C9, C17, C18, C28, C37, C42, C43** (second opening slides) and
  **C16, C26, C35, C51** (Merrill Integration), from the source's notes and
  analogies, new wording. **Please check them.**
- **Concept 1 is five slides** (user, at sign-off): the underlying set joins
  the definition slide, and closure joins binary operations. C4 and C6 are
  merged into C3 and C5; later C numbers are kept so they still match S numbers.
- **Slide pointers removed (rule 22):** "from Slide 5" becomes "the ×₄ table";
  "from Slide 12" becomes the failure's own words.
- **S19's "Assoc." and "Comm."** are written out in full.
- **The board-game, lift and payment pictures** are drawn as labelled pills,
  not illustrations (rule 8).
- **Long tables** (S18 with six rows, S19 with seven systems and six columns)
  are checked for fit when built; if one overflows it is split across two
  slides rather than shrunk.

## 6. No new figure

Every visual composes figures already on `main`: `RelationGraph` (machines,
set ovals), `DataTable` (stepped rows, revealed columns, lit cells),
`Callout`, numbered cards. No `StatusList`, `VennMini` or `CodeOutput`, whose
small labels fall under the 16px type floor.

## 7. Decisions (answered 2026-11-24)

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, the source's six sections, frameworks as §2 | **Keep** |
| B | Key Takeaways lists all six agenda items | **No**: the source's five items only (user) |
| C | Concept 1, a recap of last session | **Five slides** (user); no "Where We Left Off" slide |
| D | No "Initial Setup" or Next Session slide: the TR has none | **Left out** |
