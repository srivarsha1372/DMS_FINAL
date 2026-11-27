<!-- cSpell:ignore NxtWave devPort DSM acyclic alkane isobutane Kasparov Huffman tries -->
# Trees and Their Properties: slide-wise plan

**STATUS: SIGNED OFF 2026-11-27** (signed off by the user in conversation)

| | |
|---|---|
| Source | Google Doc "DSM : Trees and Their Properties" (`1NM_C523ATzPgAXBHaM1PgMKhz1CKPqFT7meJhDGmIps`), 6 sections, 27 drafted slides, no images |
| Deck project | `Outputs/dsm/trees_and_their_properties/` (copied from `slide-kit/slide-template`) |
| Deck file | `src/decks/treesDeck.tsx` |
| `name` / `htmlName` | `dsm-trees-and-their-properties` |
| Built file | `Outputs/dsm/trees_and_their_properties/dist-single/dsm-trees-and-their-properties.html` |
| `devPort` | **5291** (5280 to 5290 in use or reserved) |
| Content slides | **27** (one per TR slide) |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **42** |
| Branch | `deck/trees-and-their-properties`, built on `main` |
| Artifact | https://claude.ai/artifact/CtpCp4ddyNU3k73cv6viFK (private, Editor controls) |

Every claim was checked by brute force in `verify_tr.py`: components, cycles and
all simple paths of every graph, the tree tests, both edge-count theorems,
"remove any edge splits into two, add any edge makes exactly one cycle", the
number of trees on 1 to 6 vertices up to isomorphism (1, 1, 1, 2, 3, 6), the
leaf-count problem and the alkane edge count: **all 25 checks correct**.

## 1. How the cut keeps the source

- **Six sections stay six concepts**; agenda and Key Takeaways match (rule 20).
- **One TR slide, one deck slide** (27 → 27).
- **No cross-session phrases** (user rule): "Recall the campus graph" and
  "from the Basic Concepts session" become "the campus graph"; "In Basic
  Concepts we called degree-1 vertices pendant" becomes "degree-1 vertices are
  also called pendant"; "a later session" becomes "later in the course"; the
  subheading "Applications From The Reference Deck" becomes "Applications";
  "Slide 8 / 13 / 18" references become slide names.
- **Running threads:** the campus graph opens the deck; the forest {1, 2, 3},
  {4, 5}, {6} (C8) is counted again with n − k (C17); the 8-vertex tree (C13)
  feeds the edge table (C14); the 7-vertex tree of the mixed practice (C26) is
  used for remove/add (C21) checks in the notes.
- **Shared figure:** the Graph figure from Basic Concepts of Graphs (text-free
  SVG edges, teardrop loops, DOM vertex discs and badges), with highlighted
  paths and cycles per press.

## 2. Concepts

| # | Agenda item | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | Moving Around a Graph | 4MAT | C1 to C5 | S1 to S5 |
| 2 | What Is a Tree | Merrill | C6 to C10 | S6 to S10 |
| 3 | The Unique Path Property | Merrill | C11 to C13 | S11 to S13 |
| 4 | The n − 1 Edges Property | Merrill | C14 to C20 | S14 to S20 |
| 5 | Building Intuition | 4MAT (What if) | C21 to C24 | S21 to S24 |
| 6 | Putting It All Together | Merrill (Application) | C25 to C27 | S25 to S27 |

## 3. Slide by slide

| # | C | Title | Source | Visual |
|---|---|---|---|---|
| 1 to 3 | | Brand, Welcome, Agenda (6 items) | | fixtures |
| 4 | | divider 01 | | |
| 5 | C1 | Walking Around Campus | S1 | campus mini-map, route G → C → H → A highlighted; P fenced off |
| 6 | C2 | Routes Through a Graph | S2 | two traces: red walk C → H → L → C → G, green path G → C → H → A |
| 7 | C3 | Coming Back Home | S3 | the L–C–H triangle lit as a lap, "3 edges, back at start" |
| 8 | C4 | Can Everyone Reach Everyone? | S4 | two islands: {L, C, H, G, A} and the islet {P} |
| 9 | C5 | Walk, Path or Cycle? | S5 | practice graph beside the reveal table |
| 10 | | divider 02 | | |
| 11 | C6 | Branching Without Loops | S6 | three hierarchy cards (family, org chart, folders) as small trees |
| 12 | C7 | A Tree | S7 | two requirement badges, a tree earning both |
| 13 | C8 | Many Trees Together | S8 | forest of three trees, vertex 6 alone |
| 14 | C9 | Tree or Not? | S9 | gallery of five small graphs with ✓ / ✗ placards, two ribbons |
| 15 | C10 | Tree, Forest or Neither? | S10 | practice table (three baskets) |
| 16 | | divider 03 | | |
| 17 | C11 | A Single Route | S11 | the tree with its one 1→6 route lit; triangle with two routes |
| 18 | C12 | Unique Paths Characterise Trees | S12 | two routes splitting and rejoining: "a cycle hides here" |
| 19 | C13 | Find the Path | S13 | 8-vertex tree, each asked path lit per press |
| 20 | | divider 04 | | |
| 21 | C14 | A Pattern in Small Trees | S14 | growth strip: vertices and edges counters always one apart |
| 22 | C15 | Every Tree Has Leaves | S15 | longest path as a spine, ends as leaves, impossible edges crossed |
| 23 | C16 | Prune One Leaf at a Time | S16 | four frames: snip a leaf, tally 1, 2, 3 … |
| 24 | C17 | Edges in a Forest | S17 | balance sheet: three trees, totals 6 vertices, 3 edges |
| 25 | C18 | n − 1 Edges Does Not Make a Tree | S18 | K₄ plus three isolated vertices with a "7 vertices, 6 edges" tag |
| 26 | C19 | Six Ways to Say "Tree" | S19 | six statement cards around a "equivalent" hub |
| 27 | C20 | Use n − 1 and n − k | S20 | rapid-fire practice |
| 28 | | `QuizTimeSlide` | | |
| 29 | | divider 05 | | |
| 30 | C21 | Minimally Connected, Maximally Acyclic | S21 | split: an edge cut → two trees; an edge added → one cycle lit |
| 31 | C22 | Trees up to Isomorphism | S22 | all trees with 1 to 5 vertices; six empty frames for n = 6 |
| 32 | C23 | Handshaking Meets n − 1 | S23 | two equations meeting at L = 4, with one such tree |
| 33 | C24 | Molecules as Trees | S24 | butane (path) and isobutane (star) carbon skeletons; edge count working |
| 34 | | divider 06 | | |
| 35 | C25 | What Went Wrong? | S25 | myth vs fact strips |
| 36 | C26 | One Graph, Every Idea | S26 | the 7-vertex tree beside the reveal table |
| 37 | C27 | Applications | S27 | five application tiles |
| 38 to 42 | | Quiz Time, Key Takeaways (labels only), Feedback (formless), Thank You, All the Best | | fixtures |

## 4. Term ledger

Carried in: graph, vertex, edge, degree, adjacency, isomorphism, handshaking
lemma, campus graph. New: walk, path, length (C2); cycle, acyclic (C3);
connected, component (C4); tree (C7); forest (C8); leaf (C15); n − 1 and n − k
(C16, C17); equivalent definitions (C19).

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, one slide per TR slide (42 total) | **Keep** |
| B | Agenda and Key Takeaways: the source's six items | **Keep** |
| C | Reword the cross-session phrases (user rule) | **Yes** |
| D | Two Quiz Time frames; private claude.ai link with Editor controls | **Yes** |
