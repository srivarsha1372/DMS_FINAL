<!-- cSpell:ignore NxtWave devPort DSM Tremblay Manohar Grimaldi Aadhaar injective surjective bijective -->
# Functions: slide-wise plan

**STATUS: SIGNED OFF 2026-11-23** (signed off by the user in conversation; decisions in section 7 accepted as proposed)

| | |
|---|---|
| Source | Google Doc "DSM : Functions" (`1b_QeGAZY-wgTwLoVRJGcOLlZENuc0CbC8VRJvZS2mb0`), 5 sections, 32 drafted slides, no images |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/functions/` (to be copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/functions/plan.md` |
| Deck file | `src/decks/functionsDeck.tsx` |
| `name` / `htmlName` | `dsm-functions` |
| `devPort` | **5273** (5272 is the highest taken) |
| Content slides | **55** |
| Compulsory frames | **14** (brand, welcome, agenda, 5 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **69** |
| Branch | `deck/functions`, cut from `kit/structures-figures` (it needs `RelationGraph`, `BitStrip`, the stepped `DataTable` and the formless feedback slide) |

Every mapping, image, range, classification, equality, composition and
inverse in the source was recomputed by `verify_tr.py` beside this file:
**all 25 checks correct**.

---

## 1. How the cut keeps the source

The plan keeps **every idea, worked example, analogy and practice item, in
the source's order**, and changes four things:

- **Five sections stay five concepts.** The agenda is the source's agenda,
  reworded to content words (TEXT_GUIDELINES 4a): "What Is a Function" becomes
  "Function Definition and Notation". Key Takeaways repeats the five items
  verbatim (rule 20), replacing the source's shorter takeaway list.
- **Each concept opens on a felt need** (pedagogy §2). Added slides: C2 is
  the source's own non-examples; C11, C12, C29, C34, C44, C45 are new
  second-opening slides; C27, C43 are new Merrill Integration slides. All are
  written from the source's notes and analogies (section 5).
- **One new term per slide** (pedagogy §2b). Source slides carrying two or
  more terms are split: S4 (notation, then image and preimage), S5 (domain and
  codomain, then range), S7, S10, S11, S21, S22, S23, S25, S26.
- **Copy follows the content rules.** Rendered slide pointers removed
  (rule 22: "Slides 8 and 11", "Slide 13", "Slide 15", "Slide 3", "Section 5");
  titles two or three words (rule 29); no full stops (rule 36).

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways, verbatim) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Function Definition and Notation | **4MAT** | a definition and its notation; nothing to perform yet | C1 to C10 (10) | section 1, S1 to S6 |
| 2 | Types of Functions | **Merrill** | a skill: classify a function and prove it | C11 to C27 (17) | section 2, S7 to S17 |
| 3 | Equality of Functions | **4MAT** | one definition and its condition | C28 to C32 (5) | section 3, S18, S19 |
| 4 | Composition of Functions | **Merrill** | a skill: evaluate g ∘ f | C33 to C43 (11) | section 4, S20 to S24 |
| 5 | Identity and Inverse Functions | **Merrill** | a skill: find and check an inverse | C44 to C55 (12) | section 5, S25 to S32 |

**The chain.** Concept 1 closes on the quick check, where h shares an output
and misses one: those two gaps open concept 2. Concept 2 closes on "the sets
decide the type", which opens concept 3: two rules can only be compared once
their sets match. Concept 3 closes on comparing outputs input by input; concept
4 opens on feeding one output into a second machine. Concept 4 closes on the
two-step machine; concept 5 opens on running a machine backwards.

## 3. Slide by slide

C = content slide; Sn = the source's slide n. Assets: **kit** = exists,
**BUILD** = a new figure (section 6). An "arrow diagram" is the kit's
`RelationGraph` with `columns()` and a `groups` oval round each set, so the
whole deck uses the dots and arrows the room met last session.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Functions |
| 3 | `AgendaSlide` | the five items of §2, static (rule 44) |

### Concept 1: Function Definition and Notation (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 4 | | | divider 01 | Function Definition and Notation | fixture | kit |
| 5 | C1 | Why 1 | Rules We Use | Roll number to student name · student to date of birth · barcode to price: each input gives one answer (S1) | three input/output pairs, one per press | kit (`RelationGraph`) |
| 6 | C2 | Why 2 | One Input, Two Outputs | Person to phone number: some people have two numbers. A vending machine that gives chips or a biscuit for B2 cannot be trusted (S1 analogy and note) | one dot with two arrows out, crossed | kit (`RelationGraph`) |
| 7 | C3 | What | Function | Gloss first: "every input, exactly one output". A relation from X to Y where every x ∈ X has exactly one image: every input used, only one output (S2) | X and Y ovals; one arrow leaves each element of X; one y gets two arrows, one gets none, both allowed | kit |
| 8 | C4 | How | Function or Not? | X = {1, 2, 3}, Y = {a, b, c}: four relations, verdict and reason, one row per press (S3) | stepped `DataTable` beside a small arrow diagram per row, the problem element ringed | kit |
| 9 | C5 | How | Matrix Test | In the relation matrix every row has exactly one 1. The graph version is the vertical line test (S3 bullet and note) | `BitStrip` of row 1 and row 3, the bad row lit | kit |
| 10 | C6 | How | Function Notation | f: X → Y names the function, its domain side and its codomain side; y = f(x); x ↦ x² (S4) | the notation with labels pinned to each part | kit (`SyntaxBreakdown`) |
| 11 | C7 | How | Images and Preimages | f(x) = x² on R: f(3) = 9; preimages of 9 are 3 and −3; −4 has none. One image each, any number of preimages (S4 example and note) | arrows 3 ↦ 9, −3 ↦ 9, −4 alone | kit |
| 12 | C8 | How | Domain and Codomain | Domain X, all inputs; codomain Y, where outputs may land. X = {1, 2, 3, 4}, Y = {1, …, 10}, f(x) = 2x (S5) | the two ovals, arrows to 2, 4, 6, 8 | kit |
| 13 | C9 | How | Range | Outputs that actually occur: {2, 4, 6, 8}, a subset of the codomain. Exam hall: every seat is the codomain, filled seats are the range (S5) | the same diagram, range shaded inside Y | kit |
| 14 | C10 | What if | Find the Three Sets | x² on R · \|x\| on Z · h on {a, b, c}: range revealed one row per press. Why is 2 not in the range of h? (S6) | stepped `DataTable`, Range column hidden | kit |

### Concept 2: Types of Functions (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 15 | | | divider 02 | Types of Functions | fixture | kit |
| 16 | C11 | Activation 1 | Shared and Missed | **Added.** In h, a and b share the output 1, and 2 is never reached (S6 note) | h's arrow diagram, the shared output and the missed one marked | kit |
| 17 | C12 | Activation 2 | Two Questions | **Added.** Is any output shared? Is any output missed? Without names for the answers we cannot classify or reverse a function (S14 note) | the two questions as cards | kit |
| 18 | C13 | Demonstration | One-to-One | Different inputs, different outputs: f(x₁) = f(x₂) ⇒ x₁ = x₂. Arrow test: no two arrows meet (S7) | ticked diagram beside crossed one | kit |
| 19 | C14 | Demonstration | Testing One-to-One | 2x + 3 on Z is one-to-one; x² is not, g(2) = g(−2). Aadhaar numbers (S7) | the two rules as arrow pairs | kit |
| 20 | C15 | Demonstration | Proving One-to-One | 3x − 5 on R: suppose f(a) = f(b), one line per press, to a = b. To disprove: one counterexample (S8) | `StepList`, one line per press | kit |
| 21 | C16 | Demonstration | Many-to-One | Not one-to-one: two inputs share an output. Student to grade; x² on Z; h on {1, 2, 3}. Still a function (S9) | h with the meeting arrows lit | kit |
| 22 | C17 | Demonstration | Onto | Every y has a preimage: range = codomain. Arrow test: every element of Y gets an arrow. Every seat filled (S10) | ticked beside crossed | kit |
| 23 | C18 | Demonstration | Testing Onto | x + 1 on Z: y comes from y − 1. 2x on Z misses 3 (S10) | the two rules, the odd number left alone | kit |
| 24 | C19 | Demonstration | Proving Onto | 3x − 5 on R: take any y, solve x = (y + 5)/3, check f(x) = y (S11) | `StepList` | kit |
| 25 | C20 | Demonstration | Sets Decide | The same rule on Z is not onto: y = 0 needs x = 5/3. Read the sets before the formula (S11) | same rule, codomain R beside codomain Z | kit |
| 26 | C21 | Demonstration | Into | Not onto: some codomain element has no preimage. 1 ↦ a, 2 ↦ b, 3 ↦ c into {a, b, c, d}; 2x on Z (S12) | d shaded, tagged "no preimage" | kit |
| 27 | C22 | Demonstration | Bijective | One-to-one and onto: every y reached exactly once. 3x − 5 on R; exam seats; finite sets need \|X\| = \|Y\| (S13) | two equal ovals paired | kit |
| 28 | C23 | Demonstration | Four Combinations | 2 × 2 grid on X = {1, 2, 3}: rows one-to-one / many-to-one, columns onto / into (S14) | four arrow diagrams, one per press | kit |
| 29 | C24 | Demonstration | Same Rule, Four Ways | x² on R → R, R → [0, ∞), [0, ∞) → R, [0, ∞) → [0, ∞) (S15) | four small plots, one per row | **BUILD** `FunctionPlot` |
| 30 | C25 | Demonstration | Counting Helps | \|X\| > \|Y\|: not one-to-one; \|X\| < \|Y\|: not onto; \|X\| = \|Y\|: one-to-one exactly when onto. n ↦ n + 1 on N is the infinite exception (S16) | 5 to 4, 3 to 5, 4 to 4 dots | kit |
| 31 | C26 | Application | Your Turn | x + 5, n + 1 on N, x² on Z, x³ on R: vote, then one row per press (S17) | stepped `DataTable` | kit |
| 32 | C27 | Integration | Back to h | **Added.** h from the quick check is many-to-one and into; shrinking its codomain to {1, 3} makes it onto (S6 note, S15 note) | h redrawn with the smaller codomain | kit |
| 33 | | | `QuizTimeSlide` | "Quiz Time!" only. Mid-deck: the types are used by everything after | fixture | kit |

### Concept 3: Equality of Functions (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 34 | | | divider 03 | Equality of Functions | fixture | kit |
| 35 | C28 | Why 1 | Two Formulas | x² and 3x − 2 on {1, 2}: both give 1, then 4 (S18 example) | two input-output tables side by side | kit |
| 36 | C29 | Why 2 | Same Function? | **Added.** The formulas look different; looking at the formulas alone cannot say whether these are one function or two (S18 note) | the two tables with a question mark between | kit |
| 37 | C30 | What | Equal Functions | Same domain, same codomain, f(x) = g(x) for every x. So x² = 3x − 2 on {1, 2} (S18) | three condition chips, ticked in turn | kit |
| 38 | C31 | How | Domain Comes First | (x² − 1)/(x − 1) and x + 1 are not equal on R: the first is undefined at 1 (S18 non-example) | the gap at x = 1 marked | **BUILD** `FunctionPlot` |
| 39 | C32 | What if | Your Turn | x³ and x on {−1, 0, 1}; \|x\| and x² on {−1, 0, 1}, then on {−2, …, 2} (S19) | stepped `DataTable` | kit |

### Concept 4: Composition of Functions (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 40 | | | divider 04 | Composition of Functions | fixture | kit |
| 41 | C33 | Activation 1 | One After Another | Washing machine: dirty to wet. Dryer: wet to dry (S20 analogy) | two machines in a row | kit (`MemoryMap` `chain`) |
| 42 | C34 | Activation 2 | Output Becomes Input | **Added.** The dryer only takes what the washer gives out. We need one name for the two-step machine (S20, S21 notes) | the same chain with the handoff lit | kit |
| 43 | C35 | Demonstration | Composition | f: X → Y, g: Y → Z: (g ∘ f)(x) = g(f(x)), f first. Read right to left. Last session's R ∘ S was R first: check the convention (S20) | X, Y, Z ovals, f and g arrows, one long g ∘ f arrow | kit (`RelationGraph` three columns) |
| 44 | C36 | Demonstration | Follow the Arrows | X = {1, 2, 3}, Y = {a, b}, Z = {p, q}: table x, f(x), g(f(x)) one row per press (S21) | each two-step path traced in turn | kit |
| 45 | C37 | Demonstration | When It Fails | f ∘ g is not defined here: p and q are not inputs of f (S21) | g's outputs with no arrow into X | kit |
| 46 | C38 | Demonstration | With Formulas | f(x) = x + 2, g(x) = x²: (g ∘ f)(x) = (x + 2)², (f ∘ g)(x) = x² + 2 (S22) | two machine chains | kit (`MemoryMap` `chain`) |
| 47 | C39 | Demonstration | Order Matters | At x = 3: 25 against 11. Not commutative. Socks, then shoes (S22) | both chains fed 3 | kit |
| 48 | C40 | Demonstration | Associative | h ∘ (g ∘ f) = (h ∘ g) ∘ f. 2x, x + 3, x²: (2x + 3)² either way (S23) | three machines, brackets drawn two ways | kit |
| 49 | C41 | Demonstration | Types Carry Over | One-to-one ∘ one-to-one is one-to-one; onto ∘ onto is onto; so bijection ∘ bijection is a bijection (S23) | `StatusPointsSlide` rows | kit |
| 50 | C42 | Application | Your Turn | 3x − 1 and x² + 1: (f ∘ g)(2), (g ∘ f)(2), (f ∘ f)(x), (g ∘ g)(1), inside out (S24) | stepped `DataTable`, Answer hidden | kit |
| 51 | C43 | Integration | Back to the Laundry | **Added.** Washer then dryer is dryer ∘ washer: the first machine is written last (S20 note) | the chain relabelled f, g, g ∘ f | kit |

### Concept 5: Identity and Inverse Functions (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 52 | | | divider 05 | Identity and Inverse Functions | fixture | kit |
| 53 | C44 | Activation 1 | Undoing a Step | **Added.** Encryption scrambles a message; decryption must give back exactly the original (S26, S32) | message, locked, then the same message back | kit |
| 54 | C45 | Activation 2 | When Undo Fails | **Added.** If two inputs share an output, going back cannot know which one to pick (S27, S32 hash note) | two arrows into one dot, reversed, a question mark | kit |
| 55 | C46 | Demonstration | Identity Function | I_X(x) = x for every x. On {1, 2, 3}: each element to itself. Bijective (S25) | loops on every dot | kit |
| 56 | C47 | Demonstration | Identity in Composition | f ∘ I_X = f and I_Y ∘ f = f, like multiplying by 1 (S25) | a chain with the identity machine passing x through | kit |
| 57 | C48 | Demonstration | Inverse Function | f bijective: f⁻¹(y) = x exactly when f(x) = y. 1 ↦ b, 2 ↦ c, 3 ↦ a reversed: a ↦ 3, b ↦ 1, c ↦ 2 (S26) | f in brand, reversed arrows in teal, one per press | kit |
| 58 | C49 | Demonstration | Checking an Inverse | f⁻¹ ∘ f = I_X, f ∘ f⁻¹ = I_Y. f(1) = b and f⁻¹(b) = 1. f⁻¹ is not 1/f (S26) | a round trip 1 to b to 1 | kit |
| 59 | C50 | Demonstration | When an Inverse Exists | Exactly when f is bijective. Reverse a not one-to-one, a not onto and a bijective f (S27) | three reversed diagrams, problems ringed, one per press | kit |
| 60 | C51 | Demonstration | Inverse From a Formula | 3x − 5: y = 3x − 5, x = (y + 5)/3, f⁻¹(x) = (x + 5)/3, check (S28) | `StepList`, check line in a `Callout` | kit |
| 61 | C52 | Demonstration | Restricting the Sets | x² on R has no inverse; on [0, ∞) → [0, ∞) it is bijective, inverse √x. Why √ means the non-negative root (S29) | parabola, left half faded, √x mirrored in y = x | **BUILD** `FunctionPlot` |
| 62 | C53 | Demonstration | Inverse of a Composition | (g ∘ f)⁻¹ = f⁻¹ ∘ g⁻¹. 2x then x + 3, undone by − 3 then ÷ 2. Check with 4 and 11 (S30) | forward chain, backward chain under it | kit |
| 63 | C54 | Application | Your Turn | 2x + 1 and x³: f⁻¹, g⁻¹, (g ∘ f)(1), (g ∘ f)⁻¹(27), f⁻¹(f(5)) (S31) | stepped `DataTable`, Answer hidden | kit |
| 64 | C55 | Integration | Functions in Computing | Hashing many-to-one; encryption and ASCII bijective; pipelines are compositions (S32) | stepped `DataTable` with a house icon per row | kit |

### Close

| # | Type | Content |
|---|---|---|
| 65 | `QuizTimeSlide` | "Quiz Time!" only |
| 66 | `KeyTakeawaysSlide` | the five agenda items, verbatim (rule 20) |
| 67 | `FeedbackSlide` `formless` | rule 41 as amended 2026-11-21 |
| 68 | `ThankYouSlide` | fixture |
| 69 | `ThankYouSlide` | `title="All the Best"` |

55 content slides and 14 frames: `slideCount` **69**.

## 4. Term ledger

Carried in from earlier in this course, never re-explained: **set, element,
subset, ordered pair, Cartesian product, relation, relation matrix, digraph,
domain and range of a relation, composition of relations R ∘ S, integers Z,
reals R, natural numbers N, absolute value, square root, cube root**.

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| function | C3 | every input, exactly one output |
| f: X → Y, f(x), x ↦ | C6 | f takes X to Y · the output for x · "goes to" |
| image, preimage | C7 | the output of x · an input that gives y |
| domain, codomain | C8 | all inputs · where outputs may land |
| range | C9 | outputs that actually occur |
| one-to-one (injective) | C13 | different inputs, different outputs |
| many-to-one | C16 | two inputs share an output |
| onto (surjective) | C17 | every output is reached |
| into | C21 | some output is missed |
| bijective | C22 | one-to-one and onto |
| equal functions | C30 | same sets, same output for every input |
| composition g ∘ f | C35 | f first, then g |
| commutative | C39 | order does not matter |
| associative | C40 | grouping does not matter |
| identity function I_X | C46 | each element to itself |
| inverse f⁻¹ | C48 | every arrow reversed |
| restriction | C52 | the same rule on smaller sets |

## 5. Changes to the source

- **Added C11, C12, C29, C34, C44, C45** (the second opening slide of each
  concept, and C11/C12 for concept 2 which had none) **and C27, C43**
  (Merrill's Integration). Written from the source's notes and analogies, new
  wording. **Please check them.**
- **Agenda wording:** "What Is a Function" becomes "Function Definition and
  Notation" (no helping verb or article in an agenda item). Key Takeaways
  uses the five agenda items, not the source's shorter list.
- **Rendered slide pointers removed (rule 22):** "Slides 8 and 11",
  "Slide 13", "Slide 15", "Slide 3", "Section 5" become the thing's name.
- **The vending-machine picture (S1)** is drawn as an input/output pair, not
  a vending machine illustration; the analogy stays in words (rule 8).
- **The Grimaldi convention note (S20)** stays in the speaker notes; the slide
  carries only "last session's R ∘ S was R first".
- **S32 moved from a stand-alone close to concept 5's Integration**, so the
  deck ends on the quiz and takeaways like every other deck.
- **Titles shortened** to two or three words; each checked for wrapping.

## 6. One new figure (kit PR)

Every arrow diagram, matrix and table is already in the kit (`RelationGraph`,
`BitStrip`, stepped `DataTable`, `MemoryMap` `chain` for the machines).
Nothing draws **a graph of y = f(x)**:

| Figure | Draws | Used on |
|---|---|---|
| `FunctionPlot` | axes, a curve drawn only over its domain, the codomain marked on the y-axis, a faded part, an open-circle gap, an optional mirror line y = x and a second curve | C24, C31, C52 |

It goes into `src/ui/structures/` with the others, on `kit/structures-figures`,
with a gallery slide and a registry row.

## 7. Decisions (answered 2026-11-23: all as proposed)

| | Decision | Proposed |
|---|---|---|
| A | Five concepts, the source's five sections, frameworks as §2 | **Keep** |
| B | Relations, matrices, digraphs, R ∘ S carried in from last session, not re-taught | **Yes** |
| C | "Where We Left Off", "Initial Setup", Next Session | **Left out**: the TR doc has none (2026-11-23 rule) |
| D | New figure `FunctionPlot` for the three graph slides | **Build it**, into the kit by PR. Alternative: draw those three as tables only |
