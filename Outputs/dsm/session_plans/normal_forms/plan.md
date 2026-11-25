<!-- cSpell:ignore NxtWave devPort DSM PDNF PCNF minterm minterms maxterm maxterms -->
# Normal Forms: slide-wise plan

**STATUS: SIGNED OFF 2026-11-25 · PUBLISHED 2026-11-26** (signed off by the user in conversation; decisions in section 7 accepted as proposed)

| | |
|---|---|
| Source | Google Doc "DSM : Normal Forms" (`1YnG2qhDXTog091lVZbCjhhiKxNf_niujBcUcsIxwqEY`), 7 sections, 28 drafted slides, no images |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/normal_forms/` (copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/normal_forms/plan.md` |
| Deck file | `src/decks/normalFormsDeck.tsx` |
| `name` / `htmlName` | `dsm-normal-forms` |
| `devPort` | **5279** (5278 is the highest taken) |
| Content slides | **28** |
| Compulsory frames | **16** (brand, welcome, agenda, 7 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **44** (under the 50 cap) |
| Branch | `deck/normal-forms`, built on `main` |
| Delivery | `dist-single/` HTML in the repo, and a private claude.ai link with the Editor controls, like the other DSM decks |
| Artifact | https://claude.ai/artifact/VBTRPR8L8FSyxsu96fBUZ7 (private; Editor controls) |

Every equivalence, DNF, CNF, PDNF, PCNF and the Σ shorthand in the source
was checked by truth table in `verify_tr.py` beside this file:
**all 23 checks correct**.

---

## 1. How the cut keeps the source

- **Seven sections stay seven concepts.** Agenda and Key Takeaways already
  match in the source (rule 20).
- **One TR slide, one deck slide** (28 → 28). Two-step slides (a definition
  then its example, a table then its read-off) become reveals on one slide.
- **Practice answers reveal one row per press**, after a pause prompt.
- **Running thread:** Slide 1's three formulas (P → Q, ¬P ∨ Q, ¬Q → ¬P) come
  back on C26, where one shared PDNF answers the opening question.

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Why Normal Forms | **4MAT** | motivation before any definition | C1 to C3 (3) | S1 to S3 |
| 2 | Building Blocks | **Merrill** | vocabulary to recognise | C4 to C6 (3) | S4 to S6 |
| 3 | DNF and CNF | **Merrill** | shapes to recognise | C7 to C10 (4) | S7 to S10 |
| 4 | Converting to DNF and CNF | **Merrill** | a skill: the three-step recipe | C11 to C15 (5) | S11 to S15 |
| 5 | Principal Normal Forms | **Merrill** | a skill: full minterms | C16 to C20 (5) | S16 to S20 |
| 6 | Using Truth Tables | **Merrill** | a mechanical method | C21 to C24 (4) | S21 to S24 |
| 7 | Uniqueness and Ordering | **4MAT** (What if) | uses of what was built | C25 to C28 (4) | S25 to S28 |

**The chain.** Equivalent formulas look different (1) → a standard shape
needs pieces (2) → pieces join into DNF/CNF (3) → any formula reaches them by
a recipe (4) → but DNFs are not unique, so full minterms give PDNF/PCNF (5)
→ a truth table reads them off directly (6) → uniqueness turns them into
tests (7).

## 3. Slide by slide

C = content slide; Sn = source slide n. Visual formats are varied on purpose
(user feedback 2026-11-25). All compose figures on `main`: `DataTable`,
`FlowChart`, `SplitCompare`, `Callout`, cards, chips and plain SVG.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Normal Forms |
| 3 | `AgendaSlide` | the seven items of §2, static (rule 44) |

### Concept 1: Why Normal Forms (4MAT)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 4 | | | divider 01 | Why Normal Forms | fixture |
| 5 | C1 | Why | Same Meaning, Different Look | Think First; P → Q, ¬P ∨ Q, ¬Q → ¬P; all equivalent; need a standard shape (S1) | three formula cards in different colours; then one shared "fingerprint" strip T F T T under all three |
| 6 | C2 | What | A Standard Shape | definition (¬, ∧, ∨ only); four uses: compare, test, circuits, SAT solvers (S2) | machine: messy formula (→, ↔, nested brackets) in, neat ∧/∨ blocks out; four use chips appear one per press |
| 7 | C3 | What | The Laws We Need | implication, biconditional, double negation, De Morgan, distributive (S3) | toolbox: five labelled tool cards, one per press |

### Concept 2: Building Blocks (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 8 | | | divider 02 | Building Blocks | fixture |
| 9 | C4 | Demonstration | Literals | variable or its negation; P, ¬P, Q, ¬R; not P ∧ Q, ¬(P ∨ Q) (S4) | single bricks in a tray; two joined blocks outside, labelled "not one brick" |
| 10 | C5 | Demonstration | Products and Sums | elementary product (∧), elementary sum / clause (∨), examples; one literal is both (S5) | two bead strings, ∧ clasps vs ∨ clasps |
| 11 | C6 | Application | Name the Piece | the 5 rows of S6 | card-sorting: each tile drops into Literal / Product / Sum / None bin per press |

### Concept 3: DNF and CNF (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 12 | | | divider 03 | DNF and CNF | fixture |
| 13 | C7 | Demonstration | OR of ANDs | DNF definition, example, pattern, "one way to be true" (S7) | parallel circuit: branches of series switches, bulb lights when a branch closes |
| 14 | C8 | Demonstration | AND of ORs | CNF definition, example, pattern, "a condition that must hold" (S8) | clipboard checklist, one clause per line, ticks fill in |
| 15 | C9 | Application | Check the Shape | the 6 rows of S9 | click-to-reveal matrix: DNF? / CNF? cells turn green or red per press |
| 16 | C10 | What if | More Than One DNF | P ∨ (P ∧ Q) ≡ P; (P ∧ Q) ∨ (P ∧ ¬Q) ≡ P; need a unique form (S10) | three "photos" of one formula, all stamped DNF, "which is the ID photo?" |

### Concept 4: Converting to DNF and CNF (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 17 | | | divider 04 | Converting to DNF and CNF | fixture |
| 18 | C11 | Demonstration | Three Steps | remove → ↔; push ¬ inwards; distribute; then simplify (S11) | `ProceduralStepsSlide` with three numbered steps and the laws per step |
| 19 | C12 | Demonstration | Converting to DNF | ¬(P → Q) ∨ (P ∧ R), 4 lines with reasons; CNF P ∧ (¬Q ∨ R) in notes (S12) | tracked-changes derivation: struck parts in red, inserted parts in green, one line per press |
| 20 | C13 | Demonstration | Converting to CNF | (P ∧ Q) ∨ ¬R → (P ∨ ¬R) ∧ (Q ∨ ¬R); check by cases (S13) | ¬R sticker copied onto P and onto Q, one bracket splits into two clauses |
| 21 | C14 | Demonstration | Both Forms for P ↔ Q | CNF (¬P ∨ Q) ∧ (P ∨ ¬Q); DNF (P ∧ Q) ∨ (¬P ∧ ¬Q); two readings (S14) | `SplitCompare`: checklist face vs circuit face |
| 22 | C15 | Application | Use the Recipe | the 4 rows of S15 | countdown card per formula, answer revealed on the next press |
| 23 | | | `QuizTimeSlide` | "Quiz Time!" only | fixture |

### Concept 5: Principal Normal Forms (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 24 | | | divider 05 | Principal Normal Forms | fixture |
| 25 | C16 | Demonstration | Minterms | each variable exactly once; 4 minterms of P, Q; 2ⁿ; true in exactly one row (S16) | corridor of 4 doors (rows); each minterm key opens one door |
| 26 | C17 | Demonstration | PDNF | disjunction of distinct minterms; sum of products; P ∨ Q example (S17) | same corridor, true-row doors lit, their keys joined by ∨ links |
| 27 | C18 | Demonstration | Maxterms and PCNF | maxterm false in one row; PCNF; rows TT, FF table (S18) | mirror of the corridor: each maxterm is a lock on one door |
| 28 | C19 | Demonstration | Filling In Missing Variables | P ∨ (¬P ∧ Q), 3 lines with reasons (S19) | jigsaw: piece P has a gap, (Q ∨ ¬Q) fills it, piece splits into two |
| 29 | C20 | Application | Complete the Minterms | the 3 rows of S20 | worksheet with dotted blanks; missing literals fill in green |

### Concept 6: Using Truth Tables (Merrill)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 30 | | | divider 06 | Using Truth Tables | fixture |
| 31 | C21 | Demonstration | Read Off the Forms | true rows → minterms → PDNF; false rows → maxterms → PCNF; each row used once (S21) | receipt-style truth table, green highlighter tab "PDNF", orange tab "PCNF" |
| 32 | C22 | Demonstration | A Classic Example | ¬(P ∨ Q) ↔ (P ∧ Q) table; PDNF, PCNF (S22) | truth table builds column by column; arrows sweep true rows to PDNF box, false rows to PCNF box |
| 33 | C23 | Demonstration | Eight Rows | (P ∧ Q) ∨ (¬P ∧ R), 8 rows with terms; PDNF, PCNF; "if P then Q, else R" (S23) | spreadsheet view: green/orange rows, a formula bar shows the term of the selected row |
| 34 | C24 | Application | Build the Table | the 3 rows of S24 | pair-work card: Partner A table, Partner B forms; answers per press |

### Concept 7: Uniqueness and Ordering (4MAT)

| # | C | Move | Title | Content | Visual |
|---|---|---|---|---|---|
| 35 | | | divider 07 | Uniqueness and Ordering | fixture |
| 36 | C25 | What if | One Official Form | uniqueness (not a contradiction / tautology); standard order; Σ shorthand, TTF = 110 = 6, Σ(1, 3, 6, 7) (S25) | photo booth: three equivalent formulas in, one standard PDNF out; then binary row numbers beside the table |
| 37 | C26 | So what | Tests Made Easy | equivalence, tautology, contradiction, 2ⁿ relation; P → Q and ¬Q → ¬P share a PDNF (S26) | barcode scanner: two PDNF barcodes match, green "equivalent" (answers C1) |
| 38 | C27 | Application | What Went Wrong? | the 5 mistakes of S27 | debugging console: red error line, then green fix line per press |
| 39 | C28 | Application | One Formula, Every Idea | (P → Q) ∧ (Q → P): CNF, DNF, true rows, PDNF, PCNF, it is P ↔ Q (S28) | escape-room door with six dials; each answer turns a dial, door opens on "P ↔ Q" |

### Close

| # | Type | Content |
|---|---|---|
| 40 | `QuizTimeSlide` | "Quiz Time!" only |
| 41 | `KeyTakeawaysSlide` | the seven agenda items (labels only) |
| 42 | `FeedbackSlide` `formless` | rule 41 |
| 43 | `ThankYouSlide` | fixture |
| 44 | `ThankYouSlide` | `title="All the Best"` |

## 4. Term ledger

Carried in from Logical Connectives: **¬ ∧ ∨ → ↔, ≡, truth table, logically equivalent, tautology, contradiction**.

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| normal form | C2 | a standard shape using only ¬, ∧, ∨ |
| literal | C4 | one variable, with or without ¬ |
| elementary product / sum, clause | C5 | literals joined only by ∧ / only by ∨ |
| DNF, CNF | C7, C8 | OR of ANDs, AND of ORs |
| minterm | C16 | every variable once, true in one row |
| PDNF | C17 | OR of minterms |
| maxterm, PCNF | C18 | every variable once, false in one row; AND of maxterms |
| Σ shorthand | C25 | the list of true-row numbers |

## 5. Changes to the source

- **Speaker notes kept as notes**, including every "Exam hook".
- **Slide 1 callback** (S26 notes) becomes the visual echo on C26.
- **SAT solver** on C2 keeps the TR's gloss "computer programs that need a
  fixed input format".

## 6. No new figure

Every visual composes figures on `main`. No `StatusList`, `VennMini` or
`CodeOutput` (labels under the 16px floor).

## 7. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Seven concepts, the source's sections, frameworks as §2 | **Keep** |
| B | Agenda and Key Takeaways: the source's seven items verbatim | **Keep** |
| C | No "Where We Left Off" or Next Session: the TR has none | **Left out** |
| D | Publish as a private claude.ai link with the Editor controls | **Yes** |
| E | Two Quiz Time frames (after concepts 4 and 7) | **Keep** |
