<!-- cSpell:ignore NxtWave devPort DSM Socrates Asha Meena Kiran Ravi tweety -->
# Inference Theory of the Predicate Calculus: slide-wise plan

**STATUS: SIGNED OFF 2026-11-26 · PUBLISHED 2026-11-26** (signed off by the user in conversation)

| | |
|---|---|
| Source | Google Doc "DSM : Inference Theory of the Predicate Calculus" (`1DPHAUsxCQPENx9cCVQTUubf4q7Mik2NIiZW2Q7AYZmI`), 7 sections, 29 drafted slides, no images |
| Deck project | `Outputs/dsm/inference_predicate_calculus/` (copied from `slide-kit/slide-template`) |
| Deck file | `src/decks/inferencePredicateCalculusDeck.tsx` |
| `name` / `htmlName` | `dsm-inference-predicate-calculus` |
| Built file | `Outputs/dsm/inference_predicate_calculus/dist-single/dsm-inference-predicate-calculus.html` |
| `devPort` | **5282** |
| Content slides | **29** (one per TR slide) |
| Compulsory frames | **16** (brand, welcome, agenda, 7 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **45** (under the 50 cap) |
| Branch | `deck/inference-predicate-calculus`, built on `main` |
| Artifact | https://claude.ai/artifact/QwcPrj7PhoRjq7a25q15jo (private; Editor controls) |

Every argument was checked against every interpretation of its predicates over
universes of 1 to 3 elements (`verify_tr.py`): valid ones never fail, invalid
ones fail, and each named counterexample works. **All 27 checks correct.**

## 1. How the cut keeps the source

- **Seven sections stay seven concepts**; agenda and Key Takeaways match (rule 20).
- **One TR slide, one deck slide** (29 → 29). Proofs build one line per press;
  practice answers one row per press; faulty proofs show the bad line in red.
- **Running threads:** the Socrates display case (C1) opens on C17; the
  strip / reason / rebuild factory (C2) labels the stages on every worked proof;
  the converse of C20 fails on C24.
- **Cross-references to other decks' slide numbers** ("Slide 35 of the
  Predicate Calculus TR", "Slide 24") become names ("Order Matters", "Error 2");
  reference-deck codes (W1_S7) go to notes.

## 2. Concepts

| # | Agenda item | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | Why We Need New Rules | 4MAT | C1 to C3 | S1 to S3 |
| 2 | Universal Rules | Merrill | C4 to C8 | S4 to S8 |
| 3 | Existential Rules | Merrill | C9 to C12 | S9 to S12 |
| 4 | Conditions and Restrictions | Merrill | C13 to C16 | S13 to S16 |
| 5 | Deriving Conclusions | Merrill | C17 to C22 | S17 to S22 |
| 6 | Spotting Invalid Arguments | Merrill | C23 to C27 | S23 to S27 |
| 7 | Putting It All Together | Merrill (Application) | C28 to C29 | S28 to S29 |

## 3. Slide by slide

| # | C | Title | Source | Visual |
|---|---|---|---|---|
| 1 to 3 | | Brand, Welcome, Agenda (7 items) | | fixtures |
| 4 | | divider 01 | | fixture |
| 5 | C1 | Finishing an Old Argument | S1 | locked case ∀x (H(x) → M(x)), UI key, cards H(s) → M(s) and H(s) meet in M(s) |
| 6 | C2 | Strip, Reason, Rebuild | S2 | three-station factory: caps off, mix, new cap |
| 7 | C3 | The Four Rules at a Glance | S3 | 2 × 2 rule grid (universal / existential × remove / add), warning triangles on UG and EI |
| 8 | | divider 02 | | |
| 9 | C4 | Universal Instantiation | S4 | biscuit batch, one picked at random |
| 10 | C5 | Universal Generalization | S5 | blindfolded lucky draw of token c, "applies to everyone" stamp |
| 11 | C6 | Chaining Universals | S6 | proof ledger beside nested squares ⊂ rectangles ⊂ parallelograms |
| 12 | C7 | Two Shortcuts | S7 | two flow strips: MP (green), MT (blue, reversed) |
| 13 | C8 | Which Step Is Allowed? | S8 | bouncer verdict per row |
| 14 | | divider 03 | | |
| 15 | C9 | One Example Is Enough | S9 | gem held up from a mine, "gems exist here" sign |
| 16 | C10 | Give It a Fresh Name | S10 | sealed envelope with sticky note "c" |
| 17 | C11 | There Exists an Integer | S11 | proof ledger with strip / reason / rebuild tags; number line point c |
| 18 | C12 | Which Step Is Allowed? | S12 | APPROVED / REJECTED stamps |
| 19 | | divider 04 | | |
| 20 | C13 | Where Did c Come From? | S13 | two jars: blank tokens vs one name-tagged token; UG funnel |
| 21 | C14 | Rules With Conditions | S14 | four road warning signs |
| 22 | C15 | EI First, Then UI | S15 | two kitchen timelines: right order vs wrong order (label d) |
| 23 | C16 | Allowed or Not, and Why? | S16 | referee review per clip |
| 24 | | `QuizTimeSlide` | | |
| 25 | | divider 05 | | |
| 26 | C17 | Socrates Is Mortal | S17 | the opened case: four-line plaque |
| 27 | C18 | Someone Passed Without Reading | S18 | nine-line proof with stage tags |
| 28 | C19 | Splitting a Universal | S19 | zip: one ∀ splits into two |
| 29 | C20 | Splitting an Existential | S20 | one student with bat and guitar splits into two bubbles; converse warning |
| 30 | C21 | Every Hard Worker Passes | S21 | three-panel journey for Meena beside the proof |
| 31 | C22 | Write a Full Proof | S22 | proof-builder: rule tiles fill per row |
| 32 | | divider 06 | | |
| 33 | C23 | Error 1: From Some to All | S23 | faulty proof with red line; "ALL STUDENTS WIN GOLD" headline crossed out |
| 34 | C24 | Error 2: Two Different Somebodies | S24 | two people merged into a glitching photo |
| 35 | C25 | Error 3: Affirming the Consequent | S25 | nested regions: Kiran in the outer ring |
| 36 | C26 | Error 4: Swapping ∀ and ∃ | S26 | game turns: d chosen after c |
| 37 | C27 | Build a Small Universe | S27 | dollhouse rooms with predicate flags; 3-row table |
| 38 | | divider 07 | | |
| 39 | C28 | Before You Submit a Proof | S28 | pre-flight panel: five switches turn green |
| 40 | C29 | Prove or Refute | S29 | case-file folders, PROVE / REFUTE / FIND THE ERROR |
| 41 to 45 | | Quiz Time, Key Takeaways (labels only), Feedback (formless), Thank You, All the Best | | fixtures |

## 4. Term ledger

Carried in: quantifiers, witness, counterexample, arbitrary element (Predicate
Calculus); MP, MT, HS, DS, Simp, Conj (Theory of Inference).
New: UI (C4), UG and arbitrary constant (C5), EG (C9), EI and fresh name (C10),
particular constant (C13).

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Seven concepts, the source's sections, one slide per TR slide (45 total) | **Keep** |
| B | Agenda and Key Takeaways: the source's seven items | **Keep** |
| C | Slide-number cross-references become slide names | **Yes** |
| D | Two Quiz Time frames; private claude.ai link with Editor controls | **Yes** |
