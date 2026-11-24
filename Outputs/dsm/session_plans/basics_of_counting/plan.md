<!-- cSpell:ignore NxtWave devPort DSM combinatorics IPv4 -->
# Basics of Counting: slide-wise plan

**STATUS: SIGNED OFF 2026-11-25** (signed off by the user in conversation; decisions in section 7 accepted as proposed)

| | |
|---|---|
| Source | Google Doc "DSM : Basics of Counting" (`17sq7fBIxemlaTeWdOgIzeqlCcHwjaprG1wI9Evm4Q68`), 5 sections, 24 drafted slides, no images |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/basics_of_counting/` (copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/basics_of_counting/plan.md` |
| Deck file | `src/decks/basicsOfCountingDeck.tsx` |
| `name` / `htmlName` | `dsm-basics-of-counting` |
| `devPort` | **5277** (5276 is the highest taken) |
| Content slides | **51** |
| Compulsory frames | **14** (brand, welcome, agenda, 5 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **65** |
| Branch | `deck/basics-of-counting`, built on `main` |
| Delivery | `dist-single/` HTML in the repo, and a private claude.ai link with the Editor controls (edit text, hide, delete, restore), like the other DSM decks |

Every count in the source (sums, products, the overlap, PINs, plates, bit
strings, restricted digits, mixed problems, passwords, IPv4, loops) was
recomputed by `verify_tr.py` beside this file, by brute force where small:
**all 21 checks correct**.

---

## 1. How the cut keeps the source

The plan keeps **every idea, worked example, analogy and practice item, in
the source's order**, and changes four things:

- **Five sections stay five concepts.** Agenda and Key Takeaways already
  match in the source (rule 20).
- **Each concept opens on a felt need** (pedagogy §2). Added slides: C2, C11,
  C23, C37 (second opening slides) and C21, C35, C46 (Merrill Integration),
  from the source's notes.
- **One new term per slide** (pedagogy §2b). Split: S3 (task, then way or
  outcome, then mutually exclusive), S5 (rule, then set form, then many
  tasks), S10 (rule, then set form), S13 (PIN, then plate), S14 (no repeats,
  then leading digit and even), S15 (3 bits, then 2ⁿ and the byte), S20
  (codes, then usernames), S23 and S24 (more than one slide each).
- **Copy follows the content rules.** Titles two or three words, no full
  stops, no leading "The" (decision B).

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Why Count Systematically | **4MAT** | a motivation and a vocabulary | C1 to C9 (9) | section 1, S1 to S3 |
| 2 | Sum Rule | **Merrill** | a skill: count "or" choices | C10 to C21 (12) | section 2, S4 to S8 |
| 3 | Product Rule | **Merrill** | a skill: count "and" choices | C22 to C35 (14) | section 3, S9 to S16 |
| 4 | When to Add and When to Multiply | **Merrill** | a skill: pick and combine the rules | C36 to C46 (11) | section 4, S17 to S23 |
| 5 | Counting in Computing | **4MAT** | an application | C47 to C51 (5) | section 5, S24 |

**The chain.** Concept 1 ends on "rules instead of lists"; the first rule is
for one choice from separate groups (concept 2). Concept 2 ends on one choice;
concept 3 asks about several choices in a row. Concept 3 ends with two rules;
concept 4 asks which one a problem needs. Concept 4 ends on mixed problems;
concept 5 finds the same counts in passwords, addresses and loops.

## 3. Slide by slide

C = content slide; Sn = the source's slide n. Visuals compose figures on
`main`: `DataTable` (stepped rows, revealed cells), `RelationGraph` (route
maps and the tree), numbered cards, digit-slot boxes, `CodeBlock`, `Callout`.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Basics of Counting |
| 3 | `AgendaSlide` | the five items of §2, static (rule 44) |

### Concept 1: Why Count Systematically (4MAT)

| # | C | Move | Title | Content (from source) | Visual |
|---|---|---|---|---|---|
| 4 | | | divider 01 | Why Count Systematically | fixture |
| 5 | C1 | Why 1 | Think First | How many outfits from a few shirts and trousers? Guess before counting (S1) | question card |
| 6 | C2 | Why 2 | Counting Questions | PINs, routes, menu combos: everyday "how many" questions (S1) | three cards |
| 7 | C3 | What | Combinatorics | The mathematics of counting without listing every case (S1) | definition callout |
| 8 | C4 | How | Listing Works | 2 shirts × 2 trousers: all 4 outfits listed (S2) | stepped table |
| 9 | C5 | How | Listing Breaks | 4-digit PIN: 10,000 cases, too many to list (S2) | 4 digit slots |
| 10 | C6 | What | Task | A job to finish, like picking an outfit (S3) | term card |
| 11 | C7 | What | Ways and Outcomes | Each possible result of a task; counting finds how many (S3) | term card |
| 12 | C8 | What | Mutually Exclusive | Options that cannot happen together (S3) | two separate groups |
| 13 | C9 | What if | Rules over Lists | Two rules count without listing: one for "or", one for "and" (S3 note) | two-card bridge |

### Concept 2: Sum Rule (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 14 | | | divider 02 | Sum Rule | fixture |
| 15 | C10 | Problem | Lunch Choice | 3 veg or 4 non-veg dishes, pick one: how many choices? (S4) | menu table |
| 16 | C11 | Activation | One Dish Only | One choice; the groups share no dish (S4) | two groups, no overlap |
| 17 | C12 | Demonstration | Counting the Menu | 3 + 4 = 7 (S4) | table cells light, total |
| 18 | C13 | Demonstration | Sum Rule | m ways or n ways, never both: m + n (S5) | formula card |
| 19 | C14 | Demonstration | Set Form | \|A ∪ B\| = \|A\| + \|B\| when A and B are disjoint (S5) | two sets |
| 20 | C15 | Demonstration | Many Tasks | n₁ + n₂ + … + nₖ (S5) | formula card |
| 21 | C16 | Demonstration | Travel Routes | Hyderabad to Chennai by bus, train or flight: 4 + 3 + 2 = 9 (S6) | route map |
| 22 | C17 | Demonstration | Electives | 5 + 3 + 4 = 12 (S6) | stepped table |
| 23 | C18 | Demonstration | Overlap | Clubs of 10 and 8, 3 in both: 10 + 8 − 3 = 15 (S7) | two sets, shared part |
| 24 | C19 | Application | Practice 1 | 6 + 4 = 10; 5 + 3 + 2 = 10 (S8) | stepped answers |
| 25 | C20 | Application | Practice 2 | 7 + 5 = 12; 25 + 20 = 45; the 12 − 2 = 10 note (S8) | stepped answers |
| 26 | C21 | Integration | Sum Rule Check | One choice, separate groups: add (S8 note) | two-check card |

### Concept 3: Product Rule (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 27 | | | divider 03 | Product Rule | fixture |
| 28 | C22 | Problem | Outfits | 3 shirts and 2 trousers, wear both (S9) | 3 × 2 grid, empty |
| 29 | C23 | Activation | Every Pairing | Each shirt goes with every trouser (S9) | grid fills: 6 |
| 30 | C24 | Demonstration | Product Rule | m ways then n ways: m × n (S10) | formula card |
| 31 | C25 | Demonstration | Set Form | \|A × B\| = \|A\| × \|B\| (S10) | pair table |
| 32 | C26 | Demonstration | Tree Diagram | 3 roads then 2 roads: 6 routes, px to ry (S11) | tree, one level per press |
| 33 | C27 | Demonstration | Three Tasks | 3 × 4 × 2 = 24 (S12) | three slots |
| 34 | C28 | Demonstration | Slots | PIN: 10 × 10 × 10 × 10 = 10,000 (S13) | 4 slots |
| 35 | C29 | Demonstration | Number Plates | 26² × 10⁴ = 6,760,000 (S13) | 6 slots |
| 36 | C30 | Demonstration | No Repeats | 10 × 9 × 8 × 7 = 5,040 (S14) | slots shrink |
| 37 | C31 | Demonstration | Restricted Slots | 3-digit: 9 × 10 × 10 = 900; even: 9 × 10 × 5 = 450 (S14) | slots |
| 38 | C32 | Demonstration | Bit Strings | 3 bits: 2³ = 8, all listed (S15) | 8-row table |
| 39 | C33 | Demonstration | Length n | 2ⁿ; a byte: 2⁸ = 256 (S15) | slots |
| 40 | C34 | Application | Practice | 4 × 3 = 12; 26³ = 17,576; 9 × 9 = 81; 2¹⁰ = 1,024 (S16) | stepped answers |
| 41 | C35 | Integration | Product Rule Check | Steps in a row, each with a fixed count: multiply | two-check card |
| 42 | | | `QuizTimeSlide` | "Quiz Time!" only | fixture |

### Concept 4: When to Add and When to Multiply (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 43 | | | divider 04 | When to Add and When to Multiply | fixture |
| 44 | C36 | Problem | Same Wardrobe | 3 shirts, 2 jackets: wear one item, or one of each? (S18) | two questions |
| 45 | C37 | Activation | Or and And | One item: 3 + 2 = 5; one of each: 3 × 2 = 6 (S18) | answers side by side |
| 46 | C38 | Demonstration | Add or Multiply | The decision table (S17) | stepped table |
| 47 | C39 | Demonstration | Both Rules | A to C direct (2) or through B (3 × 2): 8 (S19) | route map |
| 48 | C40 | Demonstration | Codes | 3 or 4 digits: 10³ + 10⁴ = 11,000 (S20) | two slot rows |
| 49 | C41 | Demonstration | Usernames | 1 or 2 letters: 26 + 676 = 702 (S20) | two slot rows |
| 50 | C42 | Demonstration | Two Plate Formats | 676,000 + 1,757,600 = 2,433,600 (S21) | two slot rows |
| 51 | C43 | Demonstration | Common Mistakes | The mistakes table (S22) | stepped table |
| 52 | C44 | Application | Practice 1 | S23 items 1 to 3 (7; 14; 10⁴ + 10⁶ = 1,010,000) | stepped answers |
| 53 | C45 | Application | Practice 2 | S23 items 4 and 5 ((2 + 1) × 3 = 9; 4⁵ = 1,024) | stepped answers |
| 54 | C46 | Integration | Choosing a Rule | Split into cases: add; steps in a row: multiply | two-step card |

### Concept 5: Counting in Computing (4MAT)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 55 | | | divider 05 | Counting in Computing | fixture |
| 56 | C47 | Why | Passwords | 8 characters from 62: 62⁸ ≈ 218 trillion (S24) | slots |
| 57 | C48 | What | IPv4 Addresses | 32 bits: 2³² ≈ 4.3 billion (S24) | slots |
| 58 | C49 | How | Nested Loops | A loop inside a loop: m × n runs (S24) | `CodeBlock` |
| 59 | C50 | How | Loops in a Row | One after the other: m + n runs (S24) | `CodeBlock` |
| 60 | C51 | What if | Loop Counts | 10 and 5: nested 50, in a row 15 (S24) | two outputs |

### Close

| # | Type | Content |
|---|---|---|
| 61 | `QuizTimeSlide` | "Quiz Time!" only |
| 62 | `KeyTakeawaysSlide` | the five agenda items |
| 63 | `FeedbackSlide` `formless` | rule 41 |
| 64 | `ThankYouSlide` | fixture |
| 65 | `ThankYouSlide` | `title="All the Best"` |

51 content slides and 14 frames: `slideCount` **65**.

## 4. Term ledger

Carried in: **set, union, disjoint, Cartesian product, |A|, power, bit,
byte, loop**.

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| combinatorics | C3 | counting without listing |
| task | C6 | a job to finish |
| way / outcome | C7 | one possible result of a task |
| mutually exclusive | C8 | cannot happen together |
| sum rule | C13 | one choice from separate groups: add |
| overlap | C18 | the part counted twice, taken off once |
| product rule | C24 | one choice after another: multiply |
| tree diagram | C26 | one branch per choice, level by level |
| slot | C28 | one position to fill |
| bit string | C32 | a row of 0s and 1s |

## 5. Changes to the source

- **Added C2, C11, C23, C37** (second opening slides) and **C21, C35, C46**
  (Merrill Integration), from the source's notes, new wording. **Please
  check them.**
- **Overlap** (S7) stays one example with a plain subtraction; the name
  inclusion-exclusion goes in the speaker notes only (rule 4).
- **The "—" cell** in the S4 menu table becomes an empty cell.
- **"≈"** stays for 218 trillion and 4.3 billion, with the exact values
  (218,340,105,584,896 and 4,294,967,296) in the speaker notes.

## 6. No new figure

Every visual composes figures already on `main`, and avoids `StatusList`,
`VennMini` and `CodeOutput`, whose small labels fall under the 16px floor.
Digit slots are plain boxes in a flex row.

## 7. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Five concepts, the source's sections, frameworks as §2 | **Keep** |
| B | Agenda and Key Takeaways: the source's five items, with "The" dropped from "The Sum Rule" and "The Product Rule" | **Drop "The"** |
| C | No "Where We Left Off", "Initial Setup" or Next Session: the TR has none | **Left out** |
| D | Publish as a private claude.ai link with the Editor controls, like the other DSM decks | **Yes** |
