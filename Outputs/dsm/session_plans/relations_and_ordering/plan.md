<!-- cSpell:ignore NxtWave devPort DSM poset posets Hasse lcm gcd Tremblay Manohar Rosen -->
# Relations and Ordering: slide-wise plan

**STATUS: SIGNED OFF 2026-11-23** (signed off by the user in conversation; decisions in section 7)

| | |
|---|---|
| Source | Google Doc "DSM : Relations and Ordering" (`1AzKY5-pmFIhvgiRQ2NVOAjiPMGQjMSe8PeVVYwx54oU`), extracted in full to `tr.md` beside this file (656 lines, 8 sections, 48 drafted slides, no images) |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/relations_and_ordering/` (to be copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/relations_and_ordering/plan.md` |
| Deck file | `src/decks/relationsAndOrderingDeck.tsx` |
| `name` / `htmlName` | `relations-and-ordering` |
| `devPort` | **5272** (5271 is the highest taken) |
| Content slides | **57** |
| Compulsory frames | **13** (brand, welcome, agenda, 4 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **70** |
| Branch | `deck/relations-and-ordering`, cut from `kit/structures-figures` (it needs that branch's figures and the formless feedback slide) |
| Artifact | (filled in at stage E) |

Every pair, count, property verdict, composition, class, bound and Hasse edge in
the source was recomputed by `verify_tr.py` beside this file: **all 22 checks
correct**.

---

## 1. How the cut keeps the source

The plan keeps **every idea, worked example, analogy and practice item, in
the source's order**, except for one move (decision A), and changes four
things:

- **Eight sections become four concepts** (hard rule 20). Sections 1 and 2
  join (a relation, then how to write one down); section 6, composition, joins
  the properties, because its last result, "R is transitive exactly when
  R² ⊆ R", is a property test (decision A); sections 4 and 5 join (both group
  related elements, and the source ends section 5 comparing them); sections 7
  and 8 join (special elements only exist inside a poset).
- **Each concept opens on a felt need** (pedagogy §2). Five slides are added
  for this: C2, C13, C14, C30, C42. One closing slide is added: C57. All are
  written from the source's own speaker notes and analogies (section 5).
- **One new term per slide** (pedagogy §2b). The source already puts one
  property per slide; nothing is split.
- **Copy follows the content rules.** Slide numbers in rendered copy are
  removed (rule 22: "from Slide 9", "Slide 20", "Slide 28", "Slide 39",
  "Slide 40", "Slide 42"); titles become two or three words (rule 29); no full
  stops (rule 36); em dashes in the source's word diagram are dropped (rule 1).

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways, verbatim) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Relations and Their Representations | **4MAT** | a definition and its notations; nothing to perform yet | C1 to C12 (12) | sections 1 and 2, slides 1 to 11 |
| 2 | Properties and Composition | **Merrill** | a skill the learner performs: test a relation for each property | C13 to C28 (16) | section 3 (slides 12 to 20), section 6 (slides 31 to 34) |
| 3 | Equivalence and Compatibility | **4MAT** | two definitions and what they build: classes, partitions, blocks | C29 to C40 (12) | sections 4 and 5, slides 21 to 30 |
| 4 | Partial Orders and Posets | **Merrill** | a skill the learner performs: draw and read a Hasse diagram | C41 to C57 (17) | sections 7 and 8, slides 35 to 48 |

**The chain.** C12 closes concept 1 on "three views of one relation": the
matrix and the digraph are exactly the tests concept 2 uses. Concept 2 closes
on which combinations of properties have names (C28): reflexive, symmetric and
transitive opens concept 3; reflexive, antisymmetric and transitive opens
concept 4. Concept 3 closes on the comparison table; concept 4 opens on
ordering, which grouping cannot express.

## 3. Slide by slide

C = content slide; Sn = the source's slide n. Assets: **kit** = exists,
**BUILD** = a new figure (section 6). Matrices are drawn with the kit's
`BitStrip` (row labels, a column header, one lit cell for each 1), which is
exactly a relation matrix's shape.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Relations and Ordering |
| 3 | `AgendaSlide` | the four items of §2, static (rule 44) |

### Concept 1: Relations and Their Representations (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 4 | | | divider 01 | Relations and Their Representations | fixture | kit |
| 5 | C1 | Why 1 | Things That Connect | Asha is enrolled in DM · 3 is less than 7 · Hyderabad has a direct train to Chennai. Instagram "follows" (S1) | three pairs joined by labelled arrows | **BUILD** `RelationGraph` |
| 6 | C2 | Why 2 | Order Matters | **Added.** "Asha follows Ravi" is not "Ravi follows Asha". Words alone do not say which pairs are connected and which are not (S1 note) | two arrows, one each way, one crossed | **BUILD** (same) |
| 7 | C3 | Why 2 | All Possible Pairs | A × B = {(a, b) \| a ∈ A, b ∈ B}. S = {Asha, Ravi}, C = {DM, DS}: 4 pairs (S2) | `DataTable` 2 × 2 grid of pairs | kit |
| 8 | C4 | What | A Relation Is a Subset | Gloss first: "the pairs we choose from A × B". That choice is a relation R. Asha R DM; Asha R̸ DS; 3 of 4 pairs (S3) | the same grid, three cells ticked, one crossed, one per press | kit |
| 9 | C5 | How | Counting Relations | mn pairs, each in or out: 2^(mn). 2^4 = 16; the empty and the universal relation (S4) | four on/off switches: 2 × 2 × 2 × 2 = 16 | kit (`BitStrip` as switches) |
| 10 | C6 | How | Binary Relations | A relation from A to itself. On {1, 2, 3}: "less than", "equal to" (the identity); 2^(n²) = 512 for n = 3 (S5) | 3 × 3 grid, "less than" cells and the diagonal shaded differently | kit (`BitStrip`) |
| 11 | C7 | How | Domain and Range | Domain = first elements used, range = second elements used. R = {(1, 2), (1, 4), (2, 4), (3, 6)}: domain {1, 2, 3}, range {2, 4, 6}, 5 in neither (S6) | two columns 1 to 6, arrows for the four pairs | **BUILD** (`RelationGraph`, two columns) |
| 12 | C8 | How | From Rule to List | "x divides y" on {1, 2, 3, 4}: 8 pairs, one per press. Try it: x + y = 5 → {(1, 4), (2, 3), (3, 2), (4, 1)} (S7) | pairs as cards, appearing in turn | kit (`DataTable` stepped) |
| 13 | C9 | How | The Relation Matrix | mᵢⱼ = 1 if aᵢ R bⱼ, else 0. The divides matrix; 8 ones (S8) | `BitStrip` 4 × 4, rows x, columns y | kit |
| 14 | C10 | How | Matrix to Pairs | Each 1 is a pair. A = {a, b, c} matrix → {(a, b), (b, c), (c, a)}. A rectangular matrix when \|A\| ≠ \|B\| (S9) | `BitStrip` 3 × 3, answer revealed on a press | kit |
| 15 | C11 | How | Digraph Representation | A dot for each element, an arrow for each pair, a loop for (a, a). Divides: 4 loops, 1 → 2, 1 → 3, 1 → 4, 2 → 4 (S10) | dots on a square, loops, arrows | **BUILD** (`RelationGraph` with loops) |
| 16 | C12 | What if | Three Views | Ordered pairs · relation matrix · directed graph: what each looks like and is best for. Try it: the triangle a → b → c → a (S11) | `DataTable`, then the triangle digraph | kit + **BUILD** |

### Concept 2: Properties and Composition (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 17 | | | divider 02 | Properties and Composition | fixture | kit |
| 18 | C13 | Activation 1 | Relations We Know | **Added.** Divides, less than, "is a sibling of": three relations the room already uses (S12, S13, S14 examples) | three small digraphs | **BUILD** |
| 19 | C14 | Activation 2 | Alike, but How? | **Added.** Some have a loop at every dot; some always point back. Without names for these patterns we cannot test or compare relations (S19 note) | the same three, one pattern circled in each | **BUILD** |
| 20 | C15 | Demonstration | Reflexive | (a, a) ∈ R for every a. Matrix: diagonal all 1. Digraph: loop everywhere. Non-example: (3, 3) missing (S12) | divides matrix diagonal lit beside its digraph's loops | kit + **BUILD** |
| 21 | C16 | Demonstration | Irreflexive | (a, a) ∉ R for every a. "<", "is a parent of". Table on {1, 2}: the "neither" row (S13) | three small digraphs beside the table | kit + **BUILD** |
| 22 | C17 | Demonstration | Symmetric | (a, b) ∈ R ⇒ (b, a) ∈ R. Matrix equals its transpose. Facebook friend compared with Instagram follows (S14) | matrix mirrored on its diagonal; pairs of opposite arrows | kit + **BUILD** |
| 23 | C18 | Demonstration | Antisymmetric | (a, b), (b, a) ∈ R ⇒ a = b. ≤, divides, ⊆ (S15) | one-way arrows and loops; a crossed two-way pair | **BUILD** |
| 24 | C19 | Demonstration | Not Opposites | Four relations on {1, 2, 3}: both, symmetric only, antisymmetric only, neither (S16) | `DataTable` stepped, a small digraph per row | kit + **BUILD** |
| 25 | C20 | Demonstration | Transitive | (a, b), (b, c) ∈ R ⇒ (a, c) ∈ R. Every two-arrow path has a shortcut. Trains Hyderabad, Vijayawada, Chennai (S17) | a → b → c, then the shortcut a → c drawn on a press | **BUILD** |
| 26 | C21 | Demonstration | A Systematic Check | Chain every matching pair. Example 1: four chains, all close. Example 2: (1, 2), (2, 1) needs (1, 1): not transitive (S18) | chain table filled one row per press | kit |
| 27 | C22 | Demonstration | Properties at a Glance | Five properties: condition, matrix test, digraph test (S19) | `DataTable`, one row per press | kit |
| 28 | C23 | Demonstration | Chaining Relations | R from A to B, S from B to C: R ∘ S = {(a, c) \| some b: (a, b) ∈ R, (b, c) ∈ S}. Flights: home to hub, hub to destination. Convention note (S31) | three columns of dots, a two-step path replaced by one dashed arrow | **BUILD** |
| 29 | C24 | Demonstration | Computing R ∘ S | A = {1, 2, 3}, B = {x, y}, C = {p, q}: R ∘ S = {(1, p), (2, p), (3, p), (3, q)}, one row per press (S32) | the three-column diagram, each path traced in turn | **BUILD** |
| 30 | C25 | Demonstration | Boolean Product | M_R ⊙ M_S with OR for + and AND for ×; the three matrices (S33) | three `BitStrip` matrices in a row | kit |
| 31 | C26 | Demonstration | Order Matters | R ∘ S = {(1, 1), (2, 3)}, S ∘ R = {(2, 2)}; associative; R² = {(1, 3)}; transitive exactly when R² ⊆ R (S34) | two arrow diagrams side by side | **BUILD** |
| 32 | C27 | Application | Your Turn | R₁ and R₂ on {1, 2, 3}: all five properties, one column per press (S20) | `DataTable` with `revealColumn` per column | kit |
| 33 | C28 | Integration | Named Combinations | **Added.** Reflexive + symmetric + transitive: equivalence. Reflexive + symmetric: compatibility. Reflexive + antisymmetric + transitive: partial order (S19, S20 notes) | three rows of property chips | kit |
| 34 | | | `QuizTimeSlide` | "Quiz Time!" only. Mid-deck: both later concepts are built from these properties | fixture | kit |

### Concept 3: Equivalence and Compatibility (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 35 | | | divider 03 | Equivalence and Compatibility | fixture | kit |
| 36 | C29 | Why 1 | Alike in One Way | Students with the same birth month; integers with the same remainder (S21 examples) | student dots coloured by month | kit |
| 37 | C30 | Why 2 | Clean Groups | **Added.** To sort by "alike", the groups must not partly overlap, or one student sits in two sections (S21 analogy, S24) | two sections overlapping, crossed | **BUILD** |
| 38 | C31 | What | Equivalence Relations | Reflexive, symmetric and transitive. Equal to; same birth month; same remainder by 3; R₁ from the practice (S21) | property chips: R, S, T | kit |
| 39 | C32 | How | Congruence Modulo 3 | 3 divides a − b; the three proofs; 7 ≡ 1, 8 ≢ 3 (S22) | `StepList` of the three proofs, a clock with 0, 1, 2 | kit |
| 40 | C33 | How | Equivalence Classes | [a] = {x \| x R a}. Mod 3 on {1 … 9}: {1, 4, 7}, {2, 5, 8}, {3, 6, 9}; [4] = [7] = [1] (S23) | nine numbers sorted into three baskets, one class per press | kit (`BitStrip` rows) |
| 41 | C34 | How | How Classes Behave | Never empty; a R b exactly when [a] = [b]; equal or disjoint; each element in exactly one class (S24) | two allowed pictures, one crossed overlap | **BUILD** (`VennMini`-style) |
| 42 | C35 | How | Partitions | Blocks non-empty, disjoint, covering A. A/R for mod 3 (S25) | a rectangle cut into three regions | kit |
| 43 | C36 | How | Partition to Relation | Same block means related. {{a, b}, {c}}: 5 pairs, its matrix (S26) | partition, digraph and `BitStrip` matrix | kit + **BUILD** |
| 44 | C37 | How | Your Turn | R on {1, 2, 3, 4}: reflexive, symmetric, transitive; classes {1, 3} and {2, 4}, one check per press (S27) | two-cluster digraph | **BUILD** |
| 45 | C38 | How | Compatibility Relations | Reflexive and symmetric only. sun, nut, tea, ear: share a letter. Not transitive: sun R nut, nut R tea, sun and tea share none (S28) | four words joined by plain lines, no arrowheads | **BUILD** (`RelationGraph` undirected) |
| 46 | C39 | How | Maximal Blocks | Every two related; not inside a larger block. {sun, nut}, {nut, tea}, {tea, ear}: they overlap, a covering (S29) | the word diagram with three ovals, one per press | **BUILD** |
| 47 | C40 | What if | Equivalence or Compatibility | Properties, groups, overlap, what the groups form. Verdict: transitivity is what forbids overlap (S30) | `DataTable` stepped + verdict line | kit |

### Concept 4: Partial Orders and Posets (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 48 | | | divider 04 | Partial Orders and Posets | fixture | kit |
| 49 | C41 | Activation 1 | Things in Order | Course prerequisites: some courses must come before others (S35 analogy) | a small prerequisite chart | **BUILD** |
| 50 | C42 | Activation 2 | Not Every Pair | **Added.** Two courses may have no required order, and an equivalence relation only groups, it never orders (S35 note) | the chart with an unordered pair circled | **BUILD** |
| 51 | C43 | Demonstration | Partial Order | Reflexive, antisymmetric, transitive; (A, ≼) is a poset. (Z, ≤), (Z⁺, \|), (P(S), ⊆). Why "<" and divides on Z fail (S35) | `DataTable` of three posets | kit |
| 52 | C44 | Demonstration | Divides Is a Partial Order | The three proofs, and where "positive" is used (S36) | three ticked boxes, one per press | kit |
| 53 | C45 | Demonstration | Comparable or Not | 3 \| 6 comparable; 4 and 6 incomparable; {a}, {b}; total order and chain (S37) | linked pair and crossed pair | **BUILD** |
| 54 | C46 | Demonstration | Hasse Diagrams | Remove loops; remove implied arrows (keep covers); draw upward, no arrowheads. ({1, 2, 4}, \|) in three stages (S38) | the three stages, one per press | **BUILD** (`RelationGraph` layered) |
| 55 | C47 | Demonstration | Divisors of 12 | Cover table; levels 1; 2, 3; 4, 6; 12. 7 edges for 18 pairs (S39) | the Hasse diagram built level by level | **BUILD** |
| 56 | C48 | Demonstration | Power Set Hasse | P({a, b, c}) under ⊆: the cube, 12 edges (S40) | the cube, level by level | **BUILD** |
| 57 | C49 | Demonstration | Reading the Order | a ≼ b exactly when an upward path exists. 1 ≼ 12 yes; 3 and 4 incomparable; 2 ≼ 12 yes (S41) | divisors of 12, path lit per question | **BUILD** |
| 58 | C50 | Demonstration | Minimal and Maximal | {2, 3, 4, 6, 12, 18} under divides: minimal 2, 3; maximal 12, 18 (S42) | its Hasse diagram, minimal and maximal marked | **BUILD** |
| 59 | C51 | Demonstration | Least and Greatest | Below or above everything; unique. Divisors of 12: 1 and 12. The other poset: none (S43) | the two diagrams side by side | **BUILD** |
| 60 | C52 | Demonstration | Four Special Elements | Four posets, four columns (S44) | `DataTable` stepped | kit |
| 61 | C53 | Demonstration | Upper and Lower Bounds | {2, 3}: upper 6, 12; lower 1. {4, 6}: upper 12; lower 1, 2 (S45) | divisors of 12 with B lit, bounds outlined | **BUILD** |
| 62 | C54 | Demonstration | Supremum and Infimum | Least upper bound, greatest lower bound. {2, 3}: 6, 1. {4, 6}: 12, 2. lcm and gcd; ∪ and ∩ (S46) | the diagram with {4, 6} meeting at 12 and 2 | **BUILD** |
| 63 | C55 | Demonstration | When Bounds Are Missing | {12, 18}: no upper bound, infimum 6. {2, 3}: supremum 6, no lower bound (S47) | the diagram twice | **BUILD** |
| 64 | C56 | Application | Your Turn | The cube with B = {{a}, {b}}: bounds, supremum {a, b}, infimum ∅, min and max, one per press (S48) | cube with B lit | **BUILD** |
| 65 | C57 | Integration | Back to Prerequisites | **Added.** The prerequisite chart is a poset: its Hasse diagram is a valid course order, and a minimal course is one with no prerequisite (S35 analogy, S42 note) | the chart redrawn as a Hasse diagram | **BUILD** |

### Close

| # | Type | Content |
|---|---|---|
| 66 | `QuizTimeSlide` | "Quiz Time!" only |
| 67 | `KeyTakeawaysSlide` | the four agenda items, verbatim (rule 20) |
| 68 | `FeedbackSlide` `formless` | no form, no QR, content left and centred (rule 41 as amended 2026-11-21) |
| 69 | `ThankYouSlide` | fixture |
| 70 | `ThankYouSlide` | `title="All the Best"` |

## 4. Term ledger

Carried in from earlier in this course, never re-explained: **set, element,
subset, power set P(S), ordered pair, Cartesian product, union,
intersection, divides, remainder, integers Z, positive integers Z⁺,
matrix, lcm, gcd, AND, OR**. The Cartesian product gets one recap slide (C3),
as the source asks, and is not re-taught.

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| relation, a R b | C4 | the pairs we choose from A × B |
| empty, universal relation | C5 | no pairs · every pair |
| binary relation, identity relation | C6 | a relation from a set to itself · each element with itself only |
| domain, range | C7 | first elements used · second elements used |
| relation matrix | C9 | a grid with 1 where a pair is in R |
| digraph, vertex, loop | C11 | dots and arrows · a dot · an arrow back to the same dot |
| reflexive | C15 | every element related to itself |
| irreflexive | C16 | no element related to itself |
| symmetric, transpose | C17 | every connection goes both ways · the matrix flipped on its diagonal |
| antisymmetric | C18 | no two-way connection between different elements |
| transitive | C20 | two steps imply a shortcut |
| composition R ∘ S | C23 | R first, then S |
| Boolean product | C25 | matrix product with OR and AND |
| equivalence relation | C31 | reflexive, symmetric and transitive |
| congruence modulo n | C32 | same remainder on division by n |
| equivalence class [a] | C33 | everything related to a |
| partition, block, A/R | C35 | non-empty, non-overlapping blocks that cover the set |
| compatibility relation | C38 | reflexive and symmetric only |
| compatibility block, maximal block, covering | C39 | a group where every two are related · one inside no larger group · blocks that cover but may overlap |
| partial order, poset | C43 | reflexive, antisymmetric, transitive · a set with one |
| comparable, incomparable, total order, chain | C45 | one is below the other · neither is · every pair comparable |
| cover, Hasse diagram | C46 | directly above, nothing between · the order drawn with covers only |
| minimal, maximal | C50 | nothing strictly below · nothing strictly above |
| least, greatest | C51 | below everything · above everything |
| upper bound, lower bound | C53 | above every element of B · below every element of B |
| supremum, infimum | C54 | the least upper bound · the greatest lower bound |

## 5. Changes to the source

- **Moved: section 6 (composition) into concept 2**, after the transitivity
  slides and before the practice (decision A). Nothing in it needs
  equivalence or compatibility; its last result is a transitivity test.
- **Added C2, C13, C14, C30, C42** (the second opening slide of each concept)
  **and C28, C57** (Merrill's Integration). Written from the source's notes
  and analogies, but new wording. **Please check them.**
- **Rendered slide pointers removed (rule 22):** "from Slide 9", "R₁ from
  Slide 20", "from Slide 28", "Slide 39", "Slide 40", "Slide 42" become the
  thing's name ("the same matrix", "R₁ from the practice", "the words
  relation", "divisors of 12", "the cube").
- **C44 table fix:** the source's "Divisors of 12 under |" lost its "|" into
  an extra table column. The deck writes "divides".
- **The Rosen and Tremblay and Manohar convention note (S31)** stays in the
  speaker notes, not on the slide.
- **The source's 2 × 2 grid of "photos"** (S2) is drawn as a table of names:
  the deck has no photos of real students and will not invent them.
- **Titles shortened** to two or three words; each checked for wrapping.

## 6. One new figure (kit PR)

The kit now has `MemoryMap` (cells and arrows), but nothing draws **dots with
labelled arrows, loops, undirected edges, or a layered upward layout**. One
figure covers every graph in this deck:

| Figure | Draws | Used on |
|---|---|---|
| `RelationGraph` | vertices as labelled dots; arrows, loops, plain lines; free, two-column, three-column or layered (Hasse) layout; frames like the other structures figures; optional ovals round a group | C1, C2, C7, C11 to C14, C16 to C20, C23, C24, C26, C30, C34, C36 to C39, C41, C42, C45 to C51, C53 to C57 |

It goes into `src/ui/structures/` with the others, on `kit/structures-figures`
(still open as a PR), with a gallery slide and a registry row.

## 7. Decisions (answered 2026-11-23)

| | Decision | Answer |
|---|---|---|
| A | Four concepts, composition moved into concept 2 | **Agreed** |
| B | Sets, Cartesian products, power sets, divides, lcm, gcd carried in | **Yes**, already taught |
| C | "Where We Left Off", "Initial Setup", Next Session | **Left out.** User: create such slides only if the TR doc mentions them |
| D | New figure `RelationGraph` | **Build it**, into the kit by PR |
