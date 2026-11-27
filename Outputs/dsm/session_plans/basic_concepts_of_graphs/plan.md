<!-- cSpell:ignore NxtWave devPort DSM Königsberg digraph pseudograph multigraph -->
# Basic Concepts of Graphs: slide-wise plan

**STATUS: SIGNED OFF 2026-11-27 · PUBLISHED 2026-11-27** (signed off by the user in conversation)

| | |
|---|---|
| Source | Google Doc "DSM : Basic Concepts of Graphs" (`1PDXZhQGTR5pNfETelDnRE_KXadktRWKBHsKnn7x6MlA`), 6 sections, 30 drafted slides, no images |
| Deck project | `Outputs/dsm/basic_concepts_of_graphs/` (copied from `slide-kit/slide-template`) |
| Deck file | `src/decks/graphsDeck.tsx` |
| `name` / `htmlName` | `dsm-basic-concepts-of-graphs` |
| Built file | `Outputs/dsm/basic_concepts_of_graphs/dist-single/dsm-basic-concepts-of-graphs.html` |
| `devPort` | **5290** (5288 and 5289 left free for a parallel session) |
| Content slides | **30** (one per TR slide) |
| Compulsory frames | **15** (brand, welcome, agenda, 6 dividers, 2 quiz, takeaways, feedback, thank you, all the best) |
| `slideCount` | **45** |
| Branch | `deck/basic-concepts-of-graphs`, built on `main` |
| Artifact | https://claude.ai/artifact/5XonBpQrjw32UPKC7brZvk (private; Editor controls) |

Every graph was rebuilt from its edge list by `verify_tr.py` and its adjacency
matrix, incidence matrix, neighbourhoods, degrees, in- and out-degrees and both
handshaking sums compared with the TR: **all 18 checks correct**.

## 1. How the cut keeps the source

- **Six sections stay six concepts**; agenda and Key Takeaways match (rule 20).
- **One TR slide, one deck slide** (30 → 30).
- **No cross-session phrases** (user rule): "in a later session" and "appear in
  later sessions" become "later in the course"; "the same technique we used for
  binomial identities" becomes "a counting-in-two-ways proof"; "from the
  combinatorics module" becomes "this matches C(5, 2) = 10"; reference-deck code
  W8_S1 stays in notes only.
- **Running thread:** the campus graph (L, C, H, G, A, P) built on C2 carries
  adjacency (C16), both matrices (C18, C19), degrees (C20) and both theorems
  (C22, C24); the in-degree example (C26) is reused by the directed theorem (C27).
- **One shared figure:** a graph drawn as DOM vertex discs on top of a text-free
  SVG of edges (lines, arrows, curved parallel edges, loops), with weight pills,
  lit edges and ringed vertices per press. Set and vertex labels are page
  elements, never SVG text.

## 2. Concepts

| # | Agenda item | Framework | Content slides | Source |
|---|---|---|---|---|
| 1 | Why Graphs | 4MAT | C1 to C3 | S1 to S3 |
| 2 | What Is a Graph | Merrill | C4 to C7 | S4 to S7 |
| 3 | Types of Graphs | Merrill | C8 to C15 | S8 to S15 |
| 4 | Adjacency and Incidence | Merrill | C16 to C19 | S16 to S19 |
| 5 | Degree and the Handshaking Lemma | Merrill | C20 to C27 | S20 to S27 |
| 6 | Putting It All Together | Merrill (Application) | C28 to C30 | S28 to S30 |

## 3. Slide by slide

| # | C | Title | Source | Visual |
|---|---|---|---|---|
| 1 to 3 | | Brand, Welcome, Agenda (6 items) | | fixtures |
| 4 | | divider 01 | | |
| 5 | C1 | What Do These Have in Common? | S1 | a coloured metro sketch fades to plain dots and lines: "this skeleton is a graph" |
| 6 | C2 | Things and Connections | S2 | four network cards, each with a tiny graph sketch; course plan marked "has a direction" |
| 7 | C3 | Where Graph Theory Began | S3 | Königsberg: 4 land areas as dots, 7 bridges as curved edges |
| 8 | | divider 02 | | |
| 9 | C4 | Graph G = (V, E) | S4 | G = (V, E) splitting into a bag of dots V and a bag of tagged lines E |
| 10 | C5 | Building a Graph From a Story | S5 | three-frame storyboard: buildings → dots → the campus graph, P alone |
| 11 | C6 | From Sets to a Picture | S6 | dotted canvas with the sets on a sticky note; drawing revealed edge by edge |
| 12 | C7 | How Many Vertices? | S7 | campus graph in a frame vs an integer path running off both edges |
| 13 | | divider 03 | | |
| 14 | C8 | Two-Way or One-Way? | S8 | split screen: friends (two-way) vs follows (one arrow) |
| 15 | C9 | The Cleanest Kind of Graph | S9 | spot the difference: simple ✓, loop ✗, parallel edges ✗ |
| 16 | C10 | More Than One Edge | S10 | towns X and Y with a highway and an old road; multiplicity 2 |
| 17 | C11 | An Edge From a Vertex to Itself | S11 | web-page vertex with a loop |
| 18 | C12 | Direction Plus Repeats | S12 | airports a, b, c: one arrow a→b, two arrows b→c |
| 19 | C13 | Edges With Numbers | S13 | campus graph as a navigation app: minute pills on edges |
| 20 | C14 | What Is Allowed? | S14 | switchboard: rows = types, toggles = direction / loops / parallel |
| 21 | C15 | Sort the Scenarios | S15 | five scenario cards drop into type bins per press |
| 22 | | `QuizTimeSlide` | | |
| 23 | | divider 04 | | |
| 24 | C16 | Neighbours and Incidence | S16 | campus graph, C spotlit: incident edges glow, neighbours ringed |
| 25 | C17 | To and From | S17 | one large arrow u → v as a road sign with both labels |
| 26 | C18 | A Graph as a Table | S18 | campus graph beside its adjacency matrix; C–G cells lit |
| 27 | C19 | Vertices Against Edges | S19 | incidence matrix filling column by column |
| 28 | | divider 05 | | |
| 29 | C20 | How Many Edges Meet Here? | S20 | degree badges on the campus graph, heat-coloured |
| 30 | C21 | Counting Edge-Ends | S21 | a, b, c with parallel edges and a loop; edge-ends numbered |
| 31 | C22 | Sum of Degrees = 2 × Edges | S22 | handshake tally: hands 20, handshakes 10 |
| 32 | C23 | A Two-Line Proof | S23 | incidence matrix with column sums 2 and row sums = degrees, both 10 |
| 33 | C24 | Odd Vertices Come in Pairs | S24 | even and odd buckets; the four odd balls snap into two pairs |
| 34 | C25 | Quick Answers From One Equation | S25 | chat thread: question bubble, reply with one-line reasoning |
| 35 | C26 | Arrows In, Arrows Out | S26 | directed graph with in-box / out-box counts per vertex |
| 36 | C27 | In = Out = Number of Edges | S27 | one arrow tagged "+1 out" / "+1 in"; running totals reach 6 and 6 |
| 37 | | divider 06 | | |
| 38 | C28 | One Graph, Many Questions | S28 | exit ticket with the p, q, r, s, t pseudograph |
| 39 | C29 | What Went Wrong? | S29 | marking sheet: red-circled claims, red-pen corrections |
| 40 | C30 | Where Programmers Meet Graphs | S30 | four app tiles with graph sketches |
| 41 to 45 | | Quiz Time, Key Takeaways (labels only), Feedback (formless), Thank You, All the Best | | fixtures |

## 4. Term ledger

New: graph, vertex / node, edge, endpoint, G = (V, E) (C4); finite / infinite
(C7); undirected, directed graph / digraph, initial and terminal vertex (C8);
simple graph, loop, parallel edges (C9); multigraph, multiplicity (C10);
pseudograph (C11); weighted graph (C13); adjacent, incident, neighbourhood N(v)
(C16); adjacency matrix (C18); incidence matrix (C19); degree, isolated,
pendant (C20); handshaking lemma (C22); in-degree, out-degree (C26).

## 5. Decisions

| | Decision | Proposed |
|---|---|---|
| A | Six concepts, one slide per TR slide (45 total) | **Keep** |
| B | Agenda and Key Takeaways: the source's six items | **Keep** |
| C | Reword the cross-session phrases (user rule) | **Yes** |
| D | Two Quiz Time frames; private claude.ai link with Editor controls | **Yes** |
