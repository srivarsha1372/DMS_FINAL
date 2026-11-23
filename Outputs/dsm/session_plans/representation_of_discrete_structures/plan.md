<!-- cSpell:ignore NxtWave devPort DSM Eratosthenes Tremblay Manohar NumPy rwx AVAIL SCQA -->
# Representation of Discrete Structures: slide-wise plan

**STATUS: SIGNED OFF 2026-11-21** (rev 2, signed off by the user in conversation; decisions in section 7) · PUBLISHED 2026-11-21

| | |
|---|---|
| Source | Google Doc "DSM : Representation of Discrete Structures" (`1ABl2LNsYE8daDyaQa64WidnMT8qZaVEI8gr1xUksUxQ`), extracted in full to `tr.md` beside this file (490 lines, 5 sections, 37 drafted slides, no images) |
| Course | `Outputs/dsm/` (new course) |
| Deck project | `Outputs/dsm/representation_of_discrete_structures/` (to be copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/representation_of_discrete_structures/plan.md` |
| Deck file | `src/decks/representationOfDiscreteStructuresDeck.tsx` |
| `name` / `htmlName` | `representation-of-discrete-structures` |
| `devPort` | **5271** (5270 is the highest taken) |
| Content slides | **56**, of which **1 is a code slide** (the Python bit-operations run) |
| Compulsory frames | **13** (brand, welcome, agenda, 4 dividers, 2 quiz, takeaways, feedback, thank you, all the best). No Next Session slide (decision D) |
| `slideCount` | **69** |
| Branch | `deck/representation-of-discrete-structures` |
| Artifact | https://claude.ai/artifact/1ZPcEZ3GYjd1pGEcxbm5Rd (private until shared) |

Every number, bit string, trace and address in the source was recomputed by
`verify_tr.py` (beside this file) before planning: **all correct**. The Python
output on C56 is the real output of Python 3.14.6, not typed in.

---

## 1. How the cut keeps the source

The TR is already written slide by slide, with headings, content, analogies,
visual guidance and speaker notes. The plan keeps **every idea, every worked
example and every analogy, in the source's order**, and changes four things:

- **Five sections become four concepts** (hard rule 20, at most four agenda
  items). Sections 3 and 4 merge into "Sequential and Linked Allocation"
  (decision A). They are the two answers to one question, which layout a list
  should use, so the merged concept is taught as that choice (SCQA).
- **Each concept opens on a felt need** (pedagogy §2). The source opens three
  of its five sections on the definition. The added opening slides are written
  from the source's own speaker notes, except C44 and C45, which are new
  (section 5).
- **One new term per slide** (pedagogy §2b). Row-major and column-major become
  two slides; the node and the chain become two; the source's slide 10 table
  becomes three slides, one row each.
- **Copy follows the content rules.** Titles are two or three words (rule 29),
  no full stops (rule 36), no slide numbers in rendered copy (rule 22: the
  source's "Using the table on Slide 22" and "Using A and B From Slide 29"),
  every acronym expanded (ASCII).

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways, verbatim) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Data Structures | **4MAT** | a definition: nothing runs yet | C1 to C8 (8) | section 1, slides 1 to 6 |
| 2 | Storage Structures | **4MAT** | a definition: how data sits in memory, before any method | C9 to C14 (6) | section 2, slides 7 to 10 |
| 3 | Sequential and Linked Allocation | **SCQA** | a choice between two layouts, closed by a verdict with its reason | C15 to C43 (29) | slide 11, sections 3 and 4, slides 12 to 27 |
| 4 | Bit Represented Sets | **STAR** | a mechanism: set operations run as bit operations | C44 to C56 (13) | section 5, slides 28 to 37 |

**Concept 3 is long (29 slides)**, past the 6 to 16 measured per concept
(pedagogy §1). That is the cost of decision A: it carries two of the source's
sections, and the floor is not a ceiling. Its Answer is two build sequences
(sequential, then linked), each in the source's own order, then the verdict.

**The chain** (pedagogy §2, "the deck is one chain"):
C8 closes concept 1 by choosing a structure for real data, and its note says
every structure must finally sit in memory: concept 2's opening. C14 closes
concept 2 on "the layout decides how fast we find, insert and delete": concept
3's Situation. Concept 3 closes on choosing a layout with a reason. Concept 4
opens on storing a set in the list form the room now knows, and the cost of
that. The course-level link (a teaser naming the next session) is left out by
decision D.

## 3. Slide by slide

C = content slide number. **Visual** names the kit form and why it fits
(skill `tr-to-webslides-artifact` §B1). Assets: **kit** = exists,
**BUILD** = a new figure (section 6), **icon** = house icon set. Sn = the
source's slide n.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Representation of Discrete Structures |
| 3 | `AgendaSlide` | the four items of §2, static (rule 44) |

### Concept 1: Data Structures (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 4 | | | divider 01 | Data Structures | divider fixture | kit |
| 5 | C1 | Why 1 | Data on Paper | We write sets, sequences and relations on paper. A phone keeps a playlist in a fixed order. How does it store that order? (S1 + its note) | `Phone` with a numbered playlist: the room's own example of ordered data | kit |
| 6 | C2 | Why 2 | A Pile of Books | Books in a heap: to find one book, you check every book. The same books on numbered shelves: you go straight to it (S1 analogy) | `SplitCompare`: heap beside numbered shelves, tick on the shelves. A comparison is the argument | kit |
| 7 | C3 | What | Data Structures | Gloss first: "Data items, kept together with how they relate, so our work on them is fast". Then: "This is called a data structure" (S1) | `Definition` block, the term set large: one term, one slide | kit |
| 8 | C4 | How | Three Parts | Data elements (roll numbers, names, marks) · relationships ("comes after", "is a parent of") · operations (access, insert, delete, search, traverse) (S2) | `AnalogyMap`: books = data, call-number order = relationship, issue and return = operations | kit |
| 9 | C5 | How | Examples | Five rows, one per press: roll list = sequence (each student has a next) · coding club = set (membership only) · folders = tree (one parent each) · train routes = graph (pairs joined or not) · prerequisites = relation (ordered pairs) (S3) | `DataTable` + one icon per row (list, group, folder, map, link): a table is one row per step (pedagogy §3) | kit, icon |
| 10 | C6 | How | Kinds of Data Structures | Primitive (one value the machine handles directly: integer, real, character, logical) · non-primitive: linear (arrays, strings, stacks, queues) and non-linear (trees, graphs) (S4) | classification tree, built one node per press: a hierarchy is drawn as a tree | **BUILD** `ClassTree` |
| 11 | C7 | How | Operations | Create and destroy · select and update · insert and delete · search, traverse and sort. A contact list: add, remove, look up, scroll (S5) | `Phone` contact list, four labels pointing at +, bin, search bar, scroll bar | kit |
| 12 | C8 | What if | Pick the Structure | Four rows, right column hidden, revealed one per press after a vote: 60 students' marks = linear, array · reporting hierarchy = non-linear, tree · one CGPA = primitive, real · friend links = non-linear, graph. Notes: every structure must finally sit in memory (S6) | `DataTable`, answer column as steps: the vote is the close | kit |

### Concept 2: Storage Structures (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 13 | | | divider 02 | Storage Structures | divider fixture | kit |
| 14 | C9 | Why 1 | Storage Locations | Memory is a long row of locations. Each has a fixed number, its address, and holds a value, its content. Hostel rooms: the room number stays, the student changes (S7) | memory strip, address left of each cell: the source's own drawing (address and content are introduced together: neither means anything alone, a stated exception, pedagogy §3) | **BUILD** `MemoryStrip` |
| 15 | C10 | Why 1 | Units of Storage | Bit: 0 or 1 · byte: 8 bits, one character · word: 16, 32 or 64 bits, one number or one address. One row per press (S8) | `Boxes`: 1 box, 8 boxes, 32 boxes, bracketed and labelled | kit |
| 16 | C11 | Why 2 | Same Bits, Different Meanings | 1000: 00001101 = 13 · 1001: 01000001 = 'A' (character code 65 in ASCII, American Standard Code for Information Interchange) · 1002: 00000001 = true · 1003: 00111110 = 62 or '>'. Memory holds patterns only: no meaning, and no "comes after" (S9) | `DataTable`, last row highlighted, two bubbles "62" and "'>'" | kit |
| 17 | C12 | What | Storage Structures | Data structure: the logical picture, what the data means. Storage structure: where the bits actually sit in memory (S10, row 1) | the list 12, 25, 37, 48 as four boxes, arrow down to `MemoryStrip` | **BUILD** (same) |
| 18 | C13 | How | One List, Many Layouts | The same list can sit in memory more than one way: four words in a row from address 2000, or four locations spread apart (S10, row 2 + note) | the list at top, two arrows down: adjacent cells, scattered cells | **BUILD** (same) |
| 19 | C14 | What if | What the Layout Decides | The layout decides the memory used, the speed of access, and how easily the list changes (S10, row 3 + S5 note) | three `StatTile`s: memory, speed, change | kit |
| 20 | | | `QuizTimeSlide` | "Quiz Time!" only (rule 28). Mid-deck: concepts 3 and 4 both build on address, content and bits | quiz fixture | kit |

### Concept 3: Sequential and Linked Allocation (SCQA)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 21 | | | divider 03 | Sequential and Linked Allocation | divider fixture | kit |
| 22 | C15 | Situation | Storing a List | We must store 12, 25, 37, 48, then find, insert and delete elements in it (S10, S11 notes) | four list boxes with three operation chips: find, insert, delete | kit |
| 23 | C16 | Complication | Two Layouts | Sequential allocation: side by side, "next" is the next location. Linked allocation: anywhere, each element stores where the next one is. Each makes one operation easy (S11) | the list at top, two arrows down: adjacent cells; scattered cells joined by curves | **BUILD** (`MemoryStrip` + links) |
| 24 | C17 | Question | Which Layout? | `QuestionSlide`: "Which layout should a list use?" Nothing else on the frame (rule 16) | question fixture | kit |
| 25 | C18 | Answer: sequential | Side by Side | List elements sit in consecutive locations, in list order. An array is a list stored this way. Cinema seats numbered in order (S12) | cinema row above `MemoryStrip`, colour-matched seat to cell | **BUILD** |
| 26 | C19 | | Finding Seat 9 | In the dark, checking seats 1 to 8 one by one is slow, and slower as the row grows. Each seat is 50 cm wide, so seat 9 is 4 m from seat 1 (S12 analogy + note) | the same row: a walker stepping seat by seat, then one straight 4 m arrow | **BUILD** |
| 27 | C20 | | Calculate, Not Search | We need the address of any element from its position alone, without visiting the ones before it | `FlowChart`: position → ? → address | kit |
| 28 | C21 | | The Address Formula | Loc(A[i]) = L₀ + c × (i − 1), one part per press: L₀ the first element's address · c the size of one element · (i − 1) how many elements come before (S13) | `SyntaxBreakdown`: a formula's parts labelled one at a time | kit |
| 29 | C22 | | Worked Example | Marks 72, 85, 64, 90, 58, 77 in A[1..6], L₀ = 2000, c = 4. Loc(A[5]) = 2000 + 4 × 4 = 2016, the same as the table. Reaching A[5] takes as long as A[1]: direct access (S13) | `Boxes` with addresses underneath, the formula over A[5] with an arrow | kit |
| 30 | C23 | | Other Index Ranges | A[l..u]: Loc(A[i]) = L₀ + c × (i − l) · count = u − l + 1 · from 0, as in Python: L₀ + c × i (S14) | strip A[5] to A[20], A[12] lit, the 7 cells before it bracketed | kit (`Boxes`) |
| 31 | C24 | | Try It | A[5..20], L₀ = 1200, c = 2. Loc(A[12])? → 1214. How many elements? → 16. Answers one per press (S14) | `QuestionPointsSlide`: a question answered by two points | kit |
| 32 | C25 | | A Table in One Line | Memory is one line. A 3 × 4 matrix has rows and columns, so it must be laid out flat (S15) | 3 × 4 grid beside one long strip of empty cells | **BUILD** `MatrixOrder` |
| 33 | C26 | | Row-Major Order | Row 1 fully, then row 2, then row 3. First 8: A[1,1] to A[1,4], A[2,1] to A[2,4]. Used by C, C++ and Python's NumPy (S15) | grid with an arrow along each row, cells dropping into the strip in order | **BUILD** (same) |
| 34 | C27 | | Column-Major Order | Column 1 fully, then column 2. First 8: A[1,1], A[2,1], A[3,1], A[1,2] … A[2,3]. Used by Fortran and MATLAB (S15) | same figure, arrows down each column, so the difference is the only change | **BUILD** (same) |
| 35 | C28 | | Finding A[i, j] | Row-major: L₀ + c × [(i − 1) × n + (j − 1)] → A[2,3] = 512. Column-major: L₀ + c × [(j − 1) × m + (i − 1)] → 514. m = 3, n = 4, L₀ = 500, c = 2. One order per press (S16) | the two strips, A[2,3] lit: 7th in one, 8th in the other | **BUILD** (same) |
| 36 | C29 | | Insertion Means Shifting | Insert 30 into 10, 20, 40, 50, 60. Shift 60, then 50, then 40 one place right, then 30 drops into A[3] (S17) | `Boxes`, animated one move per press: the cost is the movement | kit |
| 37 | C30 | | Pros and Cons | Works: direct access by formula · no extra memory for order. Fails: up to n moves to insert or delete · size fixed in advance (S18) | `StatusList` (2 pass, 2 fail): rows that carry verdicts | kit |
| 38 | C31 | Answer: linked | Elements Anywhere | If elements could sit anywhere, nothing would shift. But then there is no next location to calculate. How do we find the next one? (S11 note) | scattered `MemoryStrip` cells with a "?" between them | **BUILD** |
| 39 | C32 | | Store the Next Location | Each element must carry the address of the element after it | one cell with a second slot labelled "where next" | **BUILD** |
| 40 | C33 | | Pointers | Gloss first: "A value that is the address of another location". That value is called a pointer. P at 3000 holds 4096; 4096 holds "Ravi" (S19) | two far cells, bold arrow from P to 4096; callout: P's own address (3000) is not the address it holds (4096) | **BUILD** (`MemoryStrip` arrows) |
| 41 | C34 | | Pointing Nowhere | Change P's content and P points elsewhere; the data does not move. NULL means "points nowhere" and marks the end of a chain (S20) | `AnalogyMap`: saved contact = pointer, friend = data, new number = changed pointer, deleted contact = NULL | kit |
| 42 | C35 | | A Node | A node holds two fields: INFO, the value, and LINK, the address of the next node. Treasure hunt: the prize and the next clue (S21) | one node drawn large, both fields labelled (INFO and LINK are introduced together because neither means anything alone: a stated exception, pedagogy §3) | **BUILD** `NodeChain` |
| 43 | C36 | | A Linked List | FIRST holds the first node's address. The last LINK is NULL. Order comes only from the links. [12 \| •] → [25 \| •] → [37 \| •] → [48 \| NULL], one node per press (S21) | `NodeChain` built node by node | **BUILD** |
| 44 | C37 | | Following the Links | FIRST = 1020. Memory rows 1000 to 1080. Trace: 1020 (12) → 1080 (25) → 1000 (37) → 1060 (48) → NULL. The list is 12, 25, 37, 48 though the nodes are out of address order (S22) | `DataTable` with numbered arrows from each LINK to its row, one per press | **BUILD** (arrow overlay) |
| 45 | C38 | | Traversal | Set P to FIRST. While P is not NULL: use INFO(P), then set P to LINK(P) (S23) | `NodeChain` with a moving P marker, each INFO dropping into an output box | **BUILD** |
| 46 | C39 | | Try It | Same memory, but FIRST = 1080. Which list? → 25, 37, 48 (S23) | `QuestionPointsSlide` with the memory table | kit |
| 47 | C40 | | Inserting a Node | Free nodes wait in AVAIL. Insert 30 after 25: INFO(1040) ← 30 · LINK(1040) ← LINK(1080) · LINK(1080) ← 1040. Result 12, 25, 30, 37, 48, nothing shifted (S24) | `NodeChain`: new node below, arrows redrawn one per press; `Callout` (warning): do step 2 before step 3, or the rest of the list is lost | **BUILD** |
| 48 | C41 | | Deleting a Node | Delete 37: LINK(1040) ← LINK(1000), node 1000 back to AVAIL. Trace 12 → 25 → 30 → 48. One link changed (S25) | `NodeChain`: 37 fades, 30's arrow redrawn to 48 | **BUILD** |
| 49 | C42 | Answer: verdict | Sequential or Linked | Placement · access to the i-th element · insert and delete · size · extra memory, one row per press. Verdict: the choice depends on the operation used most (S26) | `DataTable`, header icons (a straight row, a chain), verdict line | kit, icon |
| 50 | C43 | Close | Your Turn | Monthly temperatures → sequential (fixed size, by month) · a music queue → linked (constant adding and removing) · a 10 × 10 times table → sequential, 2D. Vote, then answer and reason per card (S27) | three `Card`s with icons, answer under each as a step: a choice made with a reason | kit, icon |

### Concept 4: Bit Represented Sets (STAR)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 51 | | | divider 04 | Bit Represented Sets | divider fixture | kit |
| 52 | C44 | S1 | A Set as a List | **New.** Store A = {1, 3, 5, 7, 9} and B = {2, 3, 5, 7} as lists, side by side. To find A ∩ B, compare each element of A with each of B | two `Boxes` rows, comparison lines between them | kit |
| 53 | C45 | S2 | Every Pair Compared | **New.** 5 × 4 = 20 comparisons for two small sets. "Is 6 in A?" means checking all of A | 5 × 4 grid of comparisons lighting up | kit (`Boxes`) |
| 54 | C46 | T | One Place per Element | We need a form where "is x in the set?" is answered by looking at one fixed place (from S30 and S33 notes) | `FlowChart`: element → its place → yes / no | kit |
| 55 | C47 | A | Bit Represented Sets | Fix an order for U = {u₁ … uₙ}. Bit i is 1 if uᵢ is in A, else 0. Attendance register: 1 present, 0 absent (S28) | numbered bulbs, the ones in A lit, bit string below | **BUILD** `BitStrip` |
| 56 | C48 | A | From Set to Bits | U = {1 … 10}. Odd numbers A = 1010101010. Primes B = 0110101000. Row A built with the room, then row B (S29) | two `BitStrip` rows of ten | **BUILD** (same) |
| 57 | C49 | A | From Bits to Set | 1100000011 → {1, 2, 9, 10} · empty set: all 0s, U: all 1s · \|A\| = number of 1s · a 16-bit word holds any subset of 16 elements. Decode 0001001000 → {4, 7} (S30) | `BitStrip`, positions numbered above, 1s circled | **BUILD** (same) |
| 58 | C50 | A | Set and Bit Operations | Union = OR · intersection = AND · complement = NOT · difference = AND NOT · symmetric difference = XOR, one row per press. Note: A − B is A AND NOT B, not A AND B (S31) | `DataTable` + a small two-circle diagram per row, the region shaded | **BUILD** `VennMini` |
| 59 | C51 | A | OR, AND, NOT | A ∪ B = 1110101010 = {1, 2, 3, 5, 7, 9} · A ∩ B = 0010101000 = {3, 5, 7} · A′ = 0101010101 = {2, 4, 6, 8, 10} (S32) | `BitStrip` A over B, result row filling one operation per press | **BUILD** (same) |
| 60 | C52 | A | AND NOT and XOR | B′ = 1001010111 · A − B = 1000000010 = {1, 9} · A ⊕ B = 1100000010 = {1, 2, 9}. Check: {1, 9} ∪ {2}. A ⊆ B only when A AND B = A: here it is not (S33) | same layout, B′ first, then ANDed with A | **BUILD** (same) |
| 61 | C53 | R | Sieve of Eratosthenes | Primes up to 20. PRIME over {2 … 20}, all 1s. Take the smallest p left; remove its multiples with PRIME AND NOT M; stop when p × p > 20 (S34) | `StepList` beside a lit `BitStrip` of 19 cells | kit + **BUILD** |
| 62 | C54 | R | Running the Sieve | Pass p = 2: 4, 6 … 20 go dark. Pass p = 3: 9 and 15 go dark. p = 5: 25 > 20, stop. Left: 2, 3, 5, 7, 11, 13, 17, 19 (S35) | `BitStrip` of 19 cells, one pass per press. Replaces the source's 19-row table, which cannot fit the frame and says the same thing | **BUILD** (same) |
| 63 | C55 | R | Practice | U = {a … h}, A = {a, c, d, f}, B = {b, c, f, h}. A, B, A ∪ B, A ∩ B, A′, A − B, A ⊕ B, answers one per press (S36) | `PracticeSlide`: questions left, answers right | kit |
| 64 | C56 | R | **CODE** In Real Programs | Python, A = 0b10110100, B = 0b01100101: `bin(A \| B)` 0b11110101 · `bin(A & B)` 0b100100 · `bin(A & ~B)` 0b10010000 · `bin(A ^ B)` 0b11010001 · `bin(~A & 0b11111111)` 0b1001011. Where it is used: Linux file permissions, r-x is 101 (S37) | `Terminal` (VS Code, `python` REPL, rule 31 names where it runs), real output | kit |

### Close

| # | Type | Content |
|---|---|---|
| 65 | `QuizTimeSlide` | "Quiz Time!" only (rules 18, 28) |
| 66 | `KeyTakeawaysSlide` | the four agenda items, verbatim (rule 20) |
| 67 | `FeedbackSlide` | `lesson={SESSION}`, id `feedback` (rule 41). No Next Session slide before it (decision D) |
| 68 | `ThankYouSlide` | fixture |
| 69 | `ThankYouSlide` | `title="All the Best"` |

## 4. Term ledger

Carried in from earlier in this course (sets and logic), never re-explained
(decision B, confirmed): **set, sequence, relation, universal set (U), subset,
union, intersection, complement, difference, symmetric difference, AND, OR,
NOT, XOR, prime number, matrix.**

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| data structure | C3 | data items kept together with how they relate, so our work on them is fast |
| data element · relationship · operation | C4 | the values · how they connect · what we do with them |
| tree · graph | C5 | items where each has one parent · items joined in pairs, or not |
| primitive · linear · non-linear | C6 | one value the machine handles directly · items in a line, each with one next · items related to several others |
| insert · delete · search · traverse | C7 | add · remove · look up · visit every item once |
| address · content | C9 | a location's fixed number · the value it holds now |
| bit · byte · word | C10 | 0 or 1 · 8 bits · what the machine reads in one step |
| ASCII | C11 | American Standard Code for Information Interchange, the number code for characters |
| storage structure | C12 | where the bits actually sit in memory |
| sequential allocation · linked allocation | C16 | side by side · anywhere, each storing where the next is |
| array | C18 | a list stored side by side |
| base address L₀ | C21 | the first element's address |
| direct access | C22 | reaching any element in the same time |
| row-major order | C26 | stored row by row |
| column-major order | C27 | stored column by column |
| pointer | C33 | a value that is the address of another location |
| NULL | C34 | points nowhere |
| node · INFO · LINK | C35 | one element's box · its value · the address of the next node |
| FIRST · linked list | C36 | the address of the first node · nodes joined by links |
| traversal | C38 | visiting every node once |
| AVAIL | C40 | the pool of free nodes |
| bit represented set | C47 | a set stored as one bit per element of U |
| sieve of Eratosthenes | C53 | finding primes by removing multiples |
| `\|` `&` `~` `^` | C56 | Python's OR, AND, NOT, XOR on bits |

## 5. Changes to the source

- **Added: C44 and C45** (concept 4's Situation). The source opens section 5
  on the definition. The cost of storing a set as a list (20 comparisons for
  sets of 5 and 4) is new content, derived, not quoted. **Please check it.**
- **Added, from the source's own notes:** C15 (Situation), C17 (the Question
  frame), C20, C31 and C32 (the bridge into each layout), C46 (Task).
- **The source's slide 10 table is split into C12, C13 and C14**, one row
  each, so concept 2 has a What, a How and a close. C13 says "four locations
  spread apart" where the source says "four scattered nodes": node is not
  introduced until C35.
- **Prerequisite fixes (pedagogy §2b):** C6's primitive examples drop
  "pointer", and the linear examples drop "linked lists": both are taught in
  concept 3, and a table cell is not an introduction.
- **C34 drops the C and Java line** (`int *p`, "every object variable is a
  reference"): two languages and a new term on one line. It goes into the
  speaker notes.
- **C56 keeps Linux permissions and drops "feature flags" and "bitmap indexes
  in databases"**: two terms nothing in the deck explains. Both go into notes.
- **C54 replaces the 19-row sieve table with the lit strip** from the source's
  own visual guidance: 19 rows do not fit the frame.
- **Rendered slide pointers removed (rule 22):** "Using the table on Slide 22"
  becomes "Same memory"; the subheading "Using A and B From Slide 29" becomes
  "Same A and B".
- **Speaker notes:** kept as `notes`, except the reference to the course's
  "W3_S7" slides (rule 2b), which is removed. Notes that say "Section 3" or
  "Section 4" are rewritten to name the idea, since those sections are now one
  concept.
- **Titles shortened** to two or three words (rule 29). Every title is
  checked on the rendered slide for wrapping (rule 35).

## 6. New figures (kit PR, generate-slides §6): decision E, build

No kit component draws memory with addresses, a chain of nodes, a matrix
flattened in two orders, a lit bit strip or a shaded two-circle diagram. These
are reusable by any later DSM or data-structures deck, so they go into
`slide-kit/slide-template` on a `kit/` branch with a PR, never only into this
session:

| Figure | Draws | Used on |
|---|---|---|
| `MemoryStrip` | cells with addresses beside them; optional scattered layout and pointer arrows | C9, C12, C13, C16, C18, C19, C31 to C33 |
| `NodeChain` | INFO \| LINK nodes, FIRST, NULL, a moving P marker, insert and delete with redrawn arrows | C35 to C41 |
| `MatrixOrder` | an m × n grid flattened row-major or column-major, one cell per step | C25 to C28 |
| `BitStrip` | numbered cells lit for 1, dark for 0; rows that combine; passes that switch cells off | C47 to C54 |
| `VennMini` | two circles with one region shaded | C50 |
| `ClassTree` | a top-down classification tree, one node per step | C6 |

## 7. Decisions

| | Decision | Answer (2026-11-21) |
|---|---|---|
| A | Which two sections merge into one concept | **Sections 3 and 4**: "Sequential and Linked Allocation", taught as SCQA |
| B | Sets, set operations and logical connectives are carried in | **Yes**, already taught in this course |
| C | "Where We Left Off" and "Initial Setup" slides | **Left out** |
| D | Next Session slide | **Not needed.** Dropped; a deliberate exception to content rule 41, which places it before the feedback slide |
| E | Six new figures | **Build them**, into the kit by PR |
| F | Bit, byte and word on one slide (C10), one row per press | default kept: they are understood only in relation to each other. Say if you want three slides |
| G | Course folder `Outputs/dsm/` | default kept, from the source's title |

## 8. Built 2026-11-21, and where the deck differs from this plan

Generated into `Outputs/dsm/representation_of_discrete_structures/`, 69 slides.
Deliverable: `dist-single/representation-of-discrete-structures.html`.

- **The feedback slide has no form and no QR code** (user, 2026-11-21, during
  generation): "No need to add feedback form or QR code in the feedback slides",
  then "Keep feedback slide content to left centre of the slide". The kit's
  `FeedbackSlide` gained an opt-in `formless` prop (header only, on the left,
  centred top to bottom); this deck passes it. `feedback-check.mjs` therefore
  reports a difference from the gallery's standard slide, by design.
- **`MemoryStrip` and `NodeChain` are one figure, `MemoryMap`**, with `row()`,
  `column()` and `chain()` helpers. A strip, a pointer and a linked list are the
  same cells and arrows, so one engine keeps them looking the same as they move.
  All six figures live in the kit at `src/ui/structures/` (import by path,
  `@/ui/structures`), and `DataTable` gained `stepped` and `revealColumn`.
- **"Try It" (C24, C39) and "Practice" (C55)** use a `DataTable` whose answer
  column arrives one row per press, not `QuestionPointsSlide` / `PracticeSlide`:
  the answers had to stay hidden until the room answered.
- **C7 Operations** is a `ContentSlide` with points beside a contact list, not
  labels pointing at phone controls (rule 47: no label on a box).
- **C10 Units** draws the bit, byte and word as rows of small squares in a
  fourth table column.
- **C30 Pros and Cons** lost its detail lines; each fact moved into its row's
  text, because four two-line rows ran under the controls.
- **C53 Sieve** lays its four steps out as a 2 × 2 grid under the strip, not a
  vertical `StepList`, for the same reason.
