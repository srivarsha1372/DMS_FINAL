<!-- cSpell:ignore NxtWave devPort DSM Cayley XOR -->
# Introduction to Algebraic Structures: slide-wise plan

**STATUS: SIGNED OFF 2026-11-24** (signed off by the user in conversation; decisions in section 7 accepted as proposed)

| | |
|---|---|
| Source | Google Doc "DSM : Introduction to Algebraic Structures" (`1-rwVmoDmAF4s3l-oHp4Tv9ETBv1uTnjpPeDooFQCxkg`), 4 sections, 17 drafted slides, no images |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/introduction_to_algebraic_structures/` (copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/introduction_to_algebraic_structures/plan.md` |
| Deck file | `src/decks/algebraicStructuresDeck.tsx` |
| `name` / `htmlName` | `dsm-introduction-to-algebraic-structures` |
| `devPort` | **5274** (5273 is the highest taken) |
| Content slides | **35** |
| Compulsory frames | **13** (brand, welcome, agenda, 4 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **48** |
| Branch | `deck/introduction-to-algebraic-structures`, cut from `main` (which now has every DSM figure and the formless feedback slide) |

Every closure claim, operation table, truth table and Python result in the
source was recomputed by `verify_tr.py` beside this file: **all 25 checks
correct**.

---

## 1. How the cut keeps the source

The plan keeps **every idea, worked example, analogy and practice item, in
the source's order**, and changes four things:

- **Four sections stay four concepts.** Agenda items lose their articles
  (TEXT_GUIDELINES 4a): "Meaning of an Algebraic Structure" becomes "Meaning of
  Algebraic Structures", "The Closure Property" becomes "Closure Property". Key
  Takeaways repeats the four items verbatim (rule 20); the source's long
  takeaway sentences go to the speaker notes.
- **Each concept opens on a felt need** (pedagogy §2). Added slides: C11,
  C20, C21, C30 (second opening slides) and C19, C28 (Merrill Integration),
  all written from the source's own notes and analogies.
- **One new term per slide** (pedagogy §2b). Split: S2 (binary operation,
  then operation as a function), S3 (unary, then n-ary), S4 (definition, then
  notation), S7 (prove, disprove, odd times odd), S13 (strings, then
  matrices), S17 (division, then overflow).
- **Copy follows the content rules.** Titles two or three words (rule 29),
  no full stops (rule 36), no slide pointers (rule 22).

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways, verbatim) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Meaning of Algebraic Structures | **4MAT** | definitions: operation, structure; nothing to perform yet | C1 to C9 (9) | section 1, S1 to S4 |
| 2 | Closure Property | **Merrill** | a skill: prove or disprove closure | C10 to C19 (10) | section 2, S5 to S9 |
| 3 | Examples of Algebraic Structures | **Merrill** | a skill: test a set and operation for closure | C20 to C28 (9) | section 3, S10 to S14 |
| 4 | Importance of Algebraic Structures | **4MAT** | why the idea matters; nothing new to perform | C29 to C35 (7) | section 4, S15 to S17 |

**The chain.** Concept 1 closes on "same set, different operation, different
structure", which raises the question every structure must answer first: does
the result stay in the set? That opens concept 2. Concept 2 closes on clock
arithmetic, a familiar closed structure; concept 3 opens on other familiar
sets. Concept 3 closes on the match between sets and logic, which opens
concept 4: many sets behave the same way.

## 3. Slide by slide

C = content slide; Sn = the source's slide n. Assets: **kit** = exists. No
new figure is needed (section 6). An "operation machine" is the kit's
`RelationGraph` drawn as pills (the chains of the Functions deck); a "set
circle" is a `RelationGraph` group oval with the elements as dots.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Introduction to Algebraic Structures |
| 3 | `AgendaSlide` | the four items of §2, static (rule 44) |

### Concept 1: Meaning of Algebraic Structures (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 4 | | | divider 01 | Meaning of Algebraic Structures | fixture | kit |
| 5 | C1 | Why 1 | Sets That Combine | Integers add and multiply; true and false combine with AND and OR; sets combine with union and intersection (S1) | three pairs of elements, each with its combined result, one per press | kit (`RelationGraph` pills) |
| 6 | C2 | Why 2 | Pieces and Rules | A box of LEGO bricks is just pieces; the snapping rule is what lets you build. A set alone cannot combine anything (S1 analogy) | loose pieces, then two snapping into one, labelled "set + rule" | kit (`RelationGraph` pills) |
| 7 | C3 | What | Binary Operation | Gloss first: "two elements in, one element out, of the same set". Every ordered pair (a, b) of S gets exactly one a ∗ b in S (S2) | a machine with two input slots and one output, a dashed oval "stays in S" | kit |
| 8 | C4 | How | Operations as Functions | ∗: S × S → S. Addition on Z, union on P(S), AND on {0, 1}, one per press (S2) | the three as machine rows | kit |
| 9 | C5 | How | Unary Operations | One input: negation on Z, complement on P(S), NOT on {0, 1} (S3) | one-slot machine | kit |
| 10 | C6 | How | n-ary Operations | n inputs, f: Sⁿ → S. max(a, b, c) on Z is ternary. Binary is the one this unit uses (S3) | three-slot machine | kit |
| 11 | C7 | What | Algebraic Structure | A non-empty set together with one or more operations on it, also called an algebraic system (S4) | set circle plus operation chips | kit |
| 12 | C8 | How | Writing a Structure | (Z, +), (Z, +, ×), ({0, 1}, ∨, ∧, ¬), (P(S), ∪, ∩, ′), one row per press (S4) | stepped `DataTable` | kit |
| 13 | C9 | What if | Same Set, New Structure | (Z, +) and (Z, ×) are two different structures on one set (S4 note) | two notation cards side by side | kit |

### Concept 2: Closure Property (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 14 | | | divider 02 | Closure Property | fixture | kit |
| 15 | C10 | Activation 1 | Where the Answer Lands | 3 − 5 can be calculated: −2 (S5 note) | machine 3, 5 → −2 | kit |
| 16 | C11 | Activation 2 | Leaving the Set | **Added.** In N = {0, 1, 2, …}, the answer −2 is outside. A members-only club where two members team up and produce an outsider (S5 analogy) | set circle N, result dot landing outside | kit |
| 17 | C12 | Demonstration | Closure | S is closed under ∗ when a ∗ b ∈ S for all a, b ∈ S. Z closed under +; N not closed under − (S5) | closed circle beside not-closed circle | kit |
| 18 | C13 | Demonstration | Closure Comes First | No closure, no operation, no structure. (N, −) fails at the first step. Later properties wait for closure (S6) | checklist: Closure first, crossed; the rest greyed | kit (`StatusList`) |
| 19 | C14 | Demonstration | Proving Closure | Even + even: 2m + 2n = 2(m + n), even. Take arbitrary elements; examples alone never prove it (S7) | `StepCards`, the 2m form lit | kit |
| 20 | C15 | Demonstration | Disproving Closure | Odd + odd: 1 + 3 = 4, not odd. One counterexample is enough (S7) | one machine, result outside "odd" | kit |
| 21 | C16 | Demonstration | Odd Times Odd | (2m + 1)(2n + 1) = 2(2mn + m + n) + 1, odd, so closed (S7) | `StepCards` | kit |
| 22 | C17 | Demonstration | Operation Tables | {0, 1, 2, 3} with +₄: the 4 × 4 table, filled row by row; every entry in S. With ordinary +, 2 + 3 = 5 ∉ S. Also called a Cayley table (S9) | stepped `DataTable` table, the 5 in a red callout | kit |
| 23 | C18 | Application | Closed or Not? | Seven rows from N, + to {−1, 0, 1}, ×: vote, then one row per press (S8) | `DataTable`, last two columns revealed per row | kit |
| 24 | C19 | Integration | Clock Arithmetic | **Added.** A clock is addition modulo 12: 9 + 5 o'clock is 2 o'clock; the hours are closed (S9 note) | clock face as 12 dots on a ring, 9 → 2 | kit (`RelationGraph`) |
| 25 | | | `QuizTimeSlide` | "Quiz Time!" only. Mid-deck: closure is used by everything after | fixture | kit |

### Concept 3: Examples of Algebraic Structures (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 26 | | | divider 03 | Examples of Algebraic Structures | fixture | kit |
| 27 | C20 | Activation 1 | Familiar Sets | **Added.** Integers, true and false, subsets, strings: sets met in earlier sessions and in code | four set chips | kit |
| 28 | C21 | Activation 2 | Which Ones Count? | **Added.** Each counts as a structure only after its operations pass the closure check | the four chips with a pending check mark | kit |
| 29 | C22 | Demonstration | Integers | (Z, +), (Z, ×), (Z, +, ×), (Z, −) closed; (Z, ÷) not: 1 ÷ 2 ∉ Z (S10) | stepped `DataTable` | kit |
| 30 | C23 | Demonstration | Boolean Values | B = {0, 1}: the OR, AND, NOT truth table; every result is 0 or 1 (S11) | `DataTable` truth table, row per press | kit |
| 31 | C24 | Demonstration | Power Sets | S = {a, b}: {a} ∪ {b} = {a, b}, {a} ∩ {b} = ∅, {a}′ = {b}, all in P(S) (S12) | Venn regions lit per operation | kit (`VennMini`) |
| 32 | C25 | Demonstration | Strings | Strings over {0, 1} under concatenation: 01 · 110 = 01110 (S13) | two strings joined into one | kit (`RelationGraph` pills) |
| 33 | C26 | Demonstration | Matrices | 2 × 2 real matrices closed under + and ×; invertible ones not under +: I + (−I) is the zero matrix (S13) | stepped `DataTable` | kit |
| 34 | C27 | Application | Your Turn | aᵇ, max, (a + b)/2, ordinary + and XOR on {0, 1}, × on {1, −1, i, −i}: vote, then reveal (S14) | `DataTable`, last two columns per row | kit |
| 35 | C28 | Integration | Sets Match Logic | **Added** from S12's note: ∪ behaves like OR, ∩ like AND, ′ like NOT | two tables side by side, matching rows lit | kit |

### Concept 4: Importance of Algebraic Structures (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 36 | | | divider 04 | Importance of Algebraic Structures | fixture | kit |
| 37 | C29 | Why 1 | Same Behaviour | Integers under +, clock arithmetic and matrices under + behave alike (S15) | three cards pointing to one label | kit |
| 38 | C30 | Why 2 | Proving Again | **Added.** Without a shared name, every fact must be proved again for each set (S15) | the three cards, one proof each, repeated | kit |
| 39 | C31 | What | Power of Abstraction | Group sets by how their operations behave; a fact proved once holds for every set of that type. Like writing a function once (S15 and note) | one proof feeding three sets | kit |
| 40 | C32 | How | Structures in Computing | Boolean values, integers modulo n, bit strings with XOR, strings, sets: one row per press (S16) | stepped `DataTable` | kit |
| 41 | C33 | How | Division in Python | `7 / 2` gives `3.5`; `7 // 2` gives `3`; `"ab" + "cd"` gives `"abcd"` (S17) | `CodeBlock` labelled Python, real output | kit |
| 42 | C34 | How | Integer Overflow | int + int in C or Java wraps around: a fixed-size int is arithmetic modulo 2³² (S17) | stepped `DataTable` row, no invented terminal | kit |
| 43 | C35 | What if | Set, Operation, Closure | The common thread behind every example: a set, an operation, and closure (S16 note) | three chips joined | kit |

### Close

| # | Type | Content |
|---|---|---|
| 44 | `QuizTimeSlide` | "Quiz Time!" only |
| 45 | `KeyTakeawaysSlide` | the four agenda items, verbatim (rule 20) |
| 46 | `FeedbackSlide` `formless` | rule 41 as amended 2026-11-21 |
| 47 | `ThankYouSlide` | fixture |
| 48 | `ThankYouSlide` | `title="All the Best"` |

## 4. Term ledger

Carried in from earlier in this course, never re-explained: **set, element,
subset, power set P(S), complement, union, intersection, ordered pair,
Cartesian product S × S, function f: X → Y, integers Z, natural numbers N,
rationals Q, reals, AND, OR, NOT, modulo, matrix**. "Binary operation" uses
the Functions session's f: X → Y directly (S2 note).

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| binary operation, a ∗ b | C3 | two elements in, one element out, in the same set |
| unary operation | C5 | one element in |
| n-ary, ternary | C6 | n elements in · three in |
| algebraic structure (algebraic system) | C7 | a non-empty set with one or more operations |
| closed, closure | C12 | every result stays in the set |
| counterexample | C15 | one pair whose result leaves the set |
| operation table (Cayley table) | C17 | every result of a finite set, in a grid |
| concatenation | C25 | joining two strings end to end |
| abstraction | C31 | one fact for every set that behaves the same way |
| overflow | C34 | a result too large for its type wraps around |

## 5. Changes to the source

- **Added C11, C20, C21, C30** (second opening slides) **and C19, C28**
  (Merrill Integration), from the source's notes and analogies, new wording.
  **Please check them.**
- **Agenda wording** loses its articles; Key Takeaways shows the four agenda
  items, and the source's long takeaway sentences go to the speaker notes.
- **S9 moved before S8**: the operation table is a demonstration, so it sits
  before the "Closed or Not?" practice, as Merrill orders them.
- **The LEGO picture (S1)** is drawn as labelled pills, not a LEGO
  illustration; the analogy stays in words (rule 8).
- **Light-switch wiring (S11)** stays in the speaker notes; the truth table
  is the visual.
- **S17's code** is shown as a Python panel with the real output (run while
  planning: `3.5`, `3`, `abcd`); the C overflow row is a table row, since no
  C run is shown and output is never invented.

## 6. No new figure

Every visual composes figures already on `main`: `RelationGraph` (machines,
set circles, the clock ring), `DataTable` (stepped and revealed columns),
`VennMini`, `StatusList`, `CodeBlock`, `Callout`.

## 7. Decisions (answered 2026-11-24: all as proposed)

| | Decision | Proposed |
|---|---|---|
| A | Four concepts, the source's four sections, frameworks as §2 | **Keep** |
| B | Sets, power sets, functions, modulo carried in from earlier sessions | **Yes** |
| C | No "Where We Left Off", "Initial Setup" or Next Session: the TR has none | **Left out** (2026-11-23 rule) |
| D | Operation table moved before the closure practice | **Move** |
