<!-- cSpell:ignore NxtWave devPort DSM subsemigroup subsemigroups submonoid submonoids homomorphism homomorphisms -->
# Semigroups and Monoids: slide-wise plan

**STATUS: SIGNED OFF 2026-11-25** (signed off by the user in conversation; decisions in section 7 accepted as proposed)

| | |
|---|---|
| Source | Google Doc "DSM : Semigroups and Monoids" (`1eSJrdKOIMSDvaJkJW1RmB57G5m1rIOF0df8tZn368pE`), 5 sections, 26 drafted slides, no images |
| Course | `Outputs/dsm/` |
| Deck project | `Outputs/dsm/semigroups_and_monoids/` (copied from `slide-kit/slide-template`) |
| Plan (this file) | `Outputs/dsm/session_plans/semigroups_and_monoids/plan.md` |
| Deck file | `src/decks/semigroupsMonoidsDeck.tsx` |
| `name` / `htmlName` | `dsm-semigroups-and-monoids` |
| `devPort` | **5276** (5275 is the highest taken) |
| Content slides | **47** |
| Compulsory frames | **14** (brand, welcome, agenda, 5 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **61** |
| Branch | `deck/semigroups-and-monoids`, built on `main` |
| Delivery | `dist-single/` HTML in the repo, and a private claude.ai link with the Editor controls (edit text, hide, delete, restore), like the other DSM decks |

Every closure, associativity, identity, operation table, function composition
and homomorphism in the source was recomputed by `verify_tr.py` beside this
file: **all 33 checks correct**.

---

## 1. How the cut keeps the source

The plan keeps **every idea, worked example, analogy and practice item, in
the source's order**, and changes four things:

- **Five sections stay five concepts.** The agenda's five names are kept, and
  Key Takeaways already repeats them (rule 20).
- **Each concept opens on a felt need** (pedagogy §2). Added slides: C11, C18,
  C19, C27, C28 (second opening slides) and C26, C35 (Merrill Integration),
  from the source's own notes.
- **One new term per slide** (pedagogy §2b). Split: S3 (brackets, then
  powers), S6 (formula, then finite), S9 (examples, then max and min), S11
  (table, then the nested picture), S17 (inheritance, then the odd integers),
  S21 (example, then analogy, then the idea), S22 (definition, then parity),
  S23 (definition, then 2ˣ), S24 (zero map, then the onto fact).
- **Copy follows the content rules.** Slide pointers removed (rule 22:
  "the staircase from Slide 1", "Slide 12", "Slide 14", "Slide 21"), titles two
  or three words, no full stops.

## 2. Concept map, agenda and frameworks

| # | Agenda item (= Key Takeaways, verbatim) | Framework | Why this one | Content slides | Source |
|---|---|---|---|---|---|
| 1 | Semigroups | **4MAT** | a definition and its consequences | C1 to C9 (9) | section 1, S1 to S6 |
| 2 | Monoids | **4MAT** | one added requirement, the identity | C10 to C17 (8) | section 2, S7 to S10 |
| 3 | Semigroup or Monoid? | **Merrill** | a skill: classify a system | C18 to C26 (9) | section 3, S11 to S15 |
| 4 | Subsemigroups and Submonoids | **Merrill** | a skill: test a subset | C27 to C35 (9) | section 4, S16 to S20 |
| 5 | Homomorphisms | **Merrill** | a skill: test a map | C36 to C47 (12) | section 5, S21 to S26 |

**The chain.** Concept 1 closes on a finite semigroup (×₄) that also has a
do-nothing element, which opens concept 2. Concept 2 closes on a monoid of
functions; concept 3 asks how to tell the two names apart. Concept 3 closes on
the test order; concept 4 asks what to test inside a bigger structure. Concept
4 closes on what a subset inherits; concept 5 compares two structures.

## 3. Slide by slide

C = content slide; Sn = the source's slide n. All visuals compose figures on
`main`: `RelationGraph` (machines, set ovals, the commuting square), `DataTable`
(stepped rows, revealed columns, lit cells), numbered cards, `Callout`.

### Front

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Semigroups and Monoids |
| 3 | `AgendaSlide` | the five items of §2, static (rule 44) |

### Concept 1: Semigroups (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 4 | | | divider 01 | Semigroups | fixture | kit |
| 5 | C1 | Why 1 | Checks So Far | Last session: closure, associativity, identity, inverses, one by one (S1) | four check chips | kit |
| 6 | C2 | Why 2 | Names for Patterns | Systems passing the same checks share a name, like licence levels: a learner's licence needs fewer tests (S1 analogy) | two steps, lower step named, upper step named later | kit |
| 7 | C3 | What | Semigroup | Non-empty set, binary operation, closure and associativity; nothing else needed (S2) | two ticked boxes, two grey "not needed" | kit |
| 8 | C4 | How | Brackets Can Be Dropped | Closure keeps results in S; associativity gives a₁ ∗ … ∗ aₙ one value however bracketed (S3) | three bracketings, one result | kit |
| 9 | C5 | How | Powers | aⁿ is well defined; aᵐ ∗ aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ; in (Z, +), a² ∗ a³ = 5a (S3) | `StepCards` | kit |
| 10 | C6 | How | Examples | (Z, +), (Z, ×), (Z⁺, +), (P(S), ∪), (Σ⁺, ·), (Z, max), "keep the first", one per press (S4) | stepped `DataTable` | kit |
| 11 | C7 | How | Non-Examples | (N, −), (Z, −), ab + 1, the average: which condition fails (S5) | `DataTable`, failing condition per row | kit |
| 12 | C8 | How | Verifying a Semigroup | a + b + ab on Z: closure, then both expansions (S6) | `StepCards` | kit |
| 13 | C9 | What if | Finite Semigroup | ({0, 1, 2, 3}, ×₄): every entry in the set; associativity inherited from × (S6) | ×₄ table | kit |

### Concept 2: Monoids (4MAT)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 14 | | | divider 02 | Monoids | fixture | kit |
| 15 | C10 | Why 1 | Adding Zero | A calculator's + with 0 changes nothing (S7 analogy) | machine (7, 0) → 7 | kit |
| 16 | C11 | Why 2 | No Zero Available | **Added** from S4: (Z⁺, +) is a semigroup, but 0 ∉ Z⁺, so nothing changes nothing | Z⁺ oval with 0 outside | kit |
| 17 | C12 | What | Monoid | A semigroup with an identity e: e ∗ a = a ∗ e = a; written (M, ∗, e) (S7) | the two steps, upper step now named | kit |
| 18 | C13 | How | Both Sides, Only One | Two-sided; exactly one (e = e ∗ e′ = e′); must belong to M (S8) | `StepCards` | kit |
| 19 | C14 | How | Identity in a Table | ×₄: row 1 and column 1 repeat the headings, so 1 is the identity (S8) | ×₄ table, row and column 1 lit | kit |
| 20 | C15 | How | Examples of Monoids | Eight monoids and their identities, one per press (S9) | stepped `DataTable` | kit |
| 21 | C16 | How | Max and Min | (Z⁺, max) has identity 1; (Z⁺, min) has none: no largest positive integer (S9 note) | two machine rows | kit |
| 22 | C17 | What if | Functions Under Composition | i, c₁, c₂, s on {1, 2}; the ∘ table; closed, associative, identity i; not commutative (S10) | the 4 × 4 table | kit |

### Concept 3: Semigroup or Monoid? (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 23 | | | divider 03 | Semigroup or Monoid? | fixture | kit |
| 24 | C18 | Activation 1 | Two Labels | **Added.** Every system so far is a semigroup; some are also monoids | two chips | kit |
| 25 | C19 | Activation 2 | Adding What Is Missing | **Added** from S11's note: (Z⁺, +) becomes (N, +) once 0 is added | Z⁺ oval, then N with 0 inside | kit |
| 26 | C20 | Demonstration | The Difference | Closure, associativity, identity, notation (S11) | `DataTable` | kit |
| 27 | C21 | Demonstration | Every Monoid Is a Semigroup | Nested picture; (Z⁺, +), (Σ⁺, ·), even integers under ×, keep-the-first are only semigroups (S11) | nested ovals | kit |
| 28 | C22 | Demonstration | Three-Step Test | Closure, then associativity, then identity (S12) | numbered cards with outcomes | kit |
| 29 | C23 | Demonstration | Classifying Formulas | Six systems, one row per press (S13) | revealed `DataTable` | kit |
| 30 | C24 | Demonstration | A Surprising Monoid | ({0, 2, 4}, ×₆): identity 4, not 1 (S14) | table, row and column 4 lit | kit |
| 31 | C25 | Application | Your Turn | Five systems: vote, then reveal (S15) | revealed `DataTable` | kit |
| 32 | C26 | Integration | Order of Checks | **Added** from S12's note: no point looking for an identity in a system that is not associative | callout | kit |
| 33 | | | `QuizTimeSlide` | "Quiz Time!" only. Mid-deck | fixture | kit |

### Concept 4: Subsemigroups and Submonoids (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 34 | | | divider 04 | Subsemigroups and Submonoids | fixture | kit |
| 35 | C27 | Activation 1 | A Set Inside a Set | **Added.** Even integers sit inside (Z, +): even + even stays even (S16) | small oval inside a big one | kit |
| 36 | C28 | Activation 2 | What Must Be Checked? | **Added.** Must every property be checked again for the smaller set? (S16 note) | question callout | kit |
| 37 | C29 | Demonstration | Subsemigroup | Non-empty T ⊆ S, closed under ∗. Evens in (Z, +), (Z⁺, +), {0, 1} in (Z, ×) (S16) | stepped `DataTable` | kit |
| 38 | C30 | Demonstration | Associativity Is Inherited | True for all of S, so true for T (S17) | `StepCards` | kit |
| 39 | C31 | Demonstration | Odd Integers Fail | 1 + 3 = 4 is even: not a subsemigroup of (Z, +) (S17) | oval with 4 outside | kit |
| 40 | C32 | Demonstration | Submonoid | Closed, and contains the identity e of M. (N, +), evens under +, {1, −1} in (Z, ×) (S18) | stepped `DataTable` | kit |
| 41 | C33 | Demonstration | Its Own Identity | Z⁺ in (N, +); {0} in (Z, ×); {0, 2, 4} in ×₆: closed, but M's identity is missing (S19) | revealed `DataTable` | kit |
| 42 | C34 | Application | Your Turn | Six subsets of (Z, ×, 1): subsemigroup? submonoid? (S20) | revealed `DataTable` | kit |
| 43 | C35 | Integration | Inherited or Not | **Added** from S17's note: associativity and commutativity pass down; the identity may not | three cards | kit |

### Concept 5: Homomorphisms (Merrill)

| # | C | Move | Title | Content (from source) | Visual + why | Assets |
|---|---|---|---|---|---|---|
| 44 | | | divider 05 | Homomorphisms | fixture | kit |
| 45 | C36 | Activation 1 | Lengths Add Up | "data" · "base" = "database", length 8; 4 + 4 = 8 (S21) | two routes to 8 | kit |
| 46 | C37 | Activation 2 | A Good Translation | Translating a combined sentence equals combining the translations (S21 analogy) | two routes, one meaning | kit |
| 47 | C38 | Demonstration | Homomorphism | Combine then map = map then combine; "same shape" (S21) | commuting square, both routes lit in turn | kit |
| 48 | C39 | Demonstration | Semigroup Homomorphism | f(a ∗ b) = f(a) ∘ f(b); length L: (Σ⁺, ·) → (Z⁺, +) (S22) | square with the string example | kit |
| 49 | C40 | Demonstration | The Parity Map | (Z, +) → ({0, 1}, +₂), remainder by 2 (S22) | two rows checked | kit |
| 50 | C41 | Demonstration | Monoid Homomorphism | Also f(e) = e′. L: (Σ∗, ·, ε) → (N, +, 0) (S23) | square plus e → e′ arrow | kit |
| 51 | C42 | Demonstration | Powers of 2 | f(x) = 2ˣ: (R, +, 0) → (R⁺, ×, 1); why logarithm tables worked (S23) | `StepCards` | kit |
| 52 | C43 | Demonstration | The Zero Map | f(a) = 0 on (Z, ×, 1): a semigroup homomorphism, but f(1) = 0 ≠ 1 (S24) | every arrow to 0, 1 never reached | kit |
| 53 | C44 | Demonstration | Onto Maps Keep e | An onto semigroup homomorphism between monoids sends e to e′ (S24 fact) | `StepCards` proof sketch | kit |
| 54 | C45 | Demonstration | Worked Checks | 3x, x + 1, 2ⁿ, one row per press, with a = 2, b = 3 (S25) | revealed `DataTable` | kit |
| 55 | C46 | Application | Your Turn | Count of a's, x² twice, complement: vote, then reveal (S26) | revealed `DataTable` | kit |
| 56 | C47 | Integration | De Morgan Again | **Added** from S26's note: (A ∪ B)′ = A′ ∩ B′ is a homomorphism statement | callout | kit |

### Close

| # | Type | Content |
|---|---|---|
| 57 | `QuizTimeSlide` | "Quiz Time!" only |
| 58 | `KeyTakeawaysSlide` | the five agenda items, verbatim |
| 59 | `FeedbackSlide` `formless` | rule 41 |
| 60 | `ThankYouSlide` | fixture |
| 61 | `ThankYouSlide` | `title="All the Best"` |

47 content slides and 14 frames: `slideCount` **61**.

## 4. Term ledger

Carried in: **algebraic system, binary operation, closure, associative,
commutative, identity element, inverse, operation table, ×ₙ, function,
composition, onto, power set, complement, De Morgan's law, string,
concatenation**.

| Term | Introduced | Plain-words gloss given there |
|---|---|---|
| semigroup | C3 | closed and associative, nothing more |
| power aⁿ | C5 | a combined with itself n times |
| Σ⁺, Σ∗ | C6, C15 | non-empty strings · all strings, the empty one included |
| monoid | C12 | a semigroup with an identity |
| subsemigroup | C29 | a closed non-empty subset |
| submonoid | C32 | a closed subset holding M's identity |
| homomorphism | C38 | a map that keeps the shape of the operation |
| semigroup homomorphism | C39 | f(a ∗ b) = f(a) ∘ f(b) |
| monoid homomorphism | C41 | also sends e to e′ |

## 5. Changes to the source

- **Added C11, C18, C19, C27, C28** (second opening slides) and **C26, C35,
  C47** (Merrill Integration), from the source's notes, new wording. **Please
  check them.**
- **The staircase** (S1, S7) is built in two steps: the monoid step is named
  only when monoids are taught (rule 4: name a later idea, never open it).
- **Groups** stay a one-line mention in the speaker notes, as in S1.
- **Pictures** (licence, calculator, translation, podium) are drawn as labelled
  pills or tables, not illustrations (rule 8).

## 6. No new figure

Every visual composes figures already on `main`, and avoids `StatusList`,
`VennMini` and `CodeOutput`, whose small labels fall under the 16px floor.

## 7. Decisions (answered 2026-11-25: all as proposed)

| | Decision | Proposed |
|---|---|---|
| A | Five concepts, the source's sections, frameworks as §2 | **Keep** |
| B | Agenda and Key Takeaways: the source's five items, unchanged | **Keep** |
| C | No "Where We Left Off", "Initial Setup" or Next Session: the TR has none | **Left out** |
| D | Publish as a private claude.ai link with the Editor controls, like the other DSM decks | **Yes** |
