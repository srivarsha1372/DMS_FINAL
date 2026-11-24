<!-- extracted from Google Doc 'DSM : Relations and Ordering' (1AzKY5-pmFIhvgiRQ2NVOAjiPMGQjMSe8PeVVYwx54oU), read 2026-11-23; all 656 lines, 1 tab, no images -->

# DOC TITLE: DSM : Relations and Ordering

======== TAB: Tab 1 ========
## Relations and Ordering
### Agenda for Today's Session
- Relations and Their Parts: Cartesian products; a relation as a subset; binary relations; domain and range; listing ordered pairs
- Representing Relations: Relation matrices and directed graphs
- Properties of Relations: Reflexive, irreflexive, symmetric, antisymmetric and transitive relations
- Equivalence Relations: Equivalence classes and the partitions they create
- Compatibility Relations: Reflexive and symmetric relations; maximal compatibility blocks
- Composition of Relations: Chaining two relations; composition with matrices
- Partial Orders and Hasse Diagrams: Posets; comparable and incomparable elements; drawing Hasse diagrams
- Special Elements of a Poset: Minimal, maximal, least and greatest elements; upper and lower bounds; supremum and infimum
### SECTION 1: Relations and Their Parts: Definition of a relation; Cartesian products; binary relations; domain and range; ordered pairs
#### Slide 1: Things That Are Connected
Heading: Relations
Subheading: Describing Connections
Content:
Many facts in daily life connect one object to another:
- Asha is enrolled in Discrete Mathematics
- 3 is less than 7
- Hyderabad has a direct train to Chennai
A relation is a precise mathematical way to record which objects are connected and which are not.
Analogy: On Instagram, "follows" is a relation: for any two accounts, either the first follows the second or it does not.
Visual Guidance: Three small icon pairs joined by labelled arrows: a student and a book ("is enrolled in"), the numbers 3 and 7 ("is less than"), two city pins ("has a direct train to").
Speaker Notes: "Ask learners for two relations from their own life before showing the definition. Point out that order matters: 'Asha follows Ravi' is not the same fact as 'Ravi follows Asha'."
#### Slide 2: Cartesian Product Recap
Heading: All Possible Pairs
Subheading: The Cartesian Product A × B
Content:
The Cartesian product of A and B is the set of all ordered pairs with the first item from A and the second from B:
A × B = {(a, b) | a ∈ A and b ∈ B}
Example: Students S = {Asha, Ravi}, Courses C = {DM, DS}
[TABLE]
| S × C | DM | DS |
| Asha | (Asha, DM) | (Asha, DS) |
| Ravi | (Ravi, DM) | (Ravi, DS) |
[/TABLE]
|S × C| = |S| × |C| = 2 × 2 = 4
Visual Guidance: The 2 × 2 grid above with student photos on the left and course icons on top.
Speaker Notes: "This was covered with set theory; spend only a minute here. The point to carry forward: A × B lists every possible connection, whether or not it actually happens."
#### Slide 3: A Relation Is a Subset
Heading: Definition Of A Relation
Subheading: Choosing Pairs From A × B
Content:
A relation R from A to B is any subset of A × B. If (a, b) ∈ R, we write a R b and say "a is related to b". If (a, b) ∉ R, we write a R̸ b.
Example: Actual enrolments: R = {(Asha, DM), (Ravi, DM), (Ravi, DS)}
- Asha R DM, because (Asha, DM) ∈ R
- Asha R̸ DS, because (Asha, DS) ∉ R
- R ⊆ S × C: it uses 3 of the 4 possible pairs
Visual Guidance: The 2 × 2 grid from the previous slide, with three cells ticked (the pairs in R) and one cell crossed out.
Speaker Notes: "Stress the idea: A × B is the menu of all possible pairs; a relation is the order you actually place. Any choice of pairs, even an empty one, is a valid relation."
#### Slide 4: How Many Relations?
Heading: Counting Relations
Subheading: Every Subset Counts
Content:
If |A| = m and |B| = n, then A × B has mn pairs, and each pair is either in R or not. So:
Number of relations from A to B = 2^(mn)
- From S = {Asha, Ravi} to C = {DM, DS}: 2^4 = 16 relations
- The empty relation ∅ (no one related to anyone) is one of them
- The universal relation A × B (everyone related to everyone) is another
Visual Guidance: Four switches, one for each pair of S × C, each showing ON or OFF, with the caption "2 × 2 × 2 × 2 = 16 settings".
Speaker Notes: "This is the power set idea from set theory: the relations from A to B are exactly the elements of P(A × B). Exam hook: if |A| = 3 and |B| = 2, how many relations are there? Answer: 2^6 = 64."
#### Slide 5: Relations Within One Set
Heading: Binary Relations
Subheading: Relations On A Set A
Content:
A binary relation on A is a relation from A to itself, that is, a subset of A × A. Most relations in this session are of this kind.
Examples on A = {1, 2, 3}:
- "Less than": R = {(1, 2), (1, 3), (2, 3)}
- "Equal to" (the identity relation): I_A = {(1, 1), (2, 2), (3, 3)}
- Number of binary relations on an n-element set = 2^(n²); for n = 3 this is 2^9 = 512
Visual Guidance: A 3 × 3 grid of A × A with the three cells of "less than" shaded in one colour and the three diagonal cells of "equal to" in another.
Speaker Notes: "The word 'binary' means each fact involves two elements. Note that the identity relation is exactly the diagonal of the grid; this picture will help with reflexive relations later."
#### Slide 6: Domain and Range
Heading: Domain And Range
Subheading: Who Takes Part
Content:
For a relation R from A to B:
- Domain D(R) = {a ∈ A | (a, b) ∈ R for some b}: all first elements used
- Range R(R) = {b ∈ B | (a, b) ∈ R for some a}: all second elements used
Example: A = B = {1, 2, 3, 4, 5, 6}, R = {(1, 2), (1, 4), (2, 4), (3, 6)}
- D(R) = {1, 2, 3}
- Range = {2, 4, 6}
- 5 is in A but in neither, because no pair uses it
Visual Guidance: Two vertical columns of the numbers 1 to 6 with arrows for the four pairs; the numbers that send an arrow are circled in blue (domain) and those that receive one in green (range).
Speaker Notes: "Common slip: the domain is not the whole set A, only the part of A that actually appears as a first element. Ask learners for the domain and range of the enrolment relation: {Asha, Ravi} and {DM, DS}."
#### Slide 7: Listing a Relation as Ordered Pairs
Heading: Ordered-Pair Representation
Subheading: From Rule To List
Content:
A relation is often given by a rule. Writing out its ordered pairs makes it concrete.
Example: On A = {1, 2, 3, 4}, R = {(x, y) | x divides y}
R = {(1, 1), (1, 2), (1, 3), (1, 4), (2, 2), (2, 4), (3, 3), (4, 4)}: 8 pairs
Try it: On A = {1, 2, 3, 4}, list S = {(x, y) | x + y = 5}.
- Answer: S = {(1, 4), (2, 3), (3, 2), (4, 1)}
Visual Guidance: The rule "x divides y" written at the top; below it, each pair appears one by one as a card.
Speaker Notes: "Work through x = 1, 2, 3, 4 in turn and ask which y values work. This divides relation on {1, 2, 3, 4} is used again for matrices and digraphs, so keep it on the board."
### SECTION 2: Representing Relations: Relation matrices; directed graph representation
#### Slide 8: The Relation Matrix
Heading: Relation Matrix
Subheading: A Grid Of 0s And 1s
Content:
For a relation R from A = {a₁, …, aₘ} to B = {b₁, …, bₙ}, the relation matrix M_R is an m × n matrix with entry
mᵢⱼ = 1 if aᵢ R bⱼ, and mᵢⱼ = 0 otherwise
Example: "x divides y" on A = {1, 2, 3, 4}
[TABLE]
| M_R | 1 | 2 | 3 | 4 |
| 1 | 1 | 1 | 1 | 1 |
| 2 | 0 | 1 | 0 | 1 |
| 3 | 0 | 0 | 1 | 0 |
| 4 | 0 | 0 | 0 | 1 |
[/TABLE]
Visual Guidance: The matrix with row labels on the left ("x") and column labels on top ("y"); each 1 is highlighted.
Speaker Notes: "Rows are the first element and columns the second. Count the 1s: 8, matching the 8 pairs on Slide 7. Fix the order of elements once and use it for rows and columns."
#### Slide 9: Reading a Relation Matrix
Heading: From Matrix To Pairs
Subheading: Every 1 Is A Pair
Content:
Each 1 in row aᵢ and column bⱼ gives the pair (aᵢ, bⱼ).
Try it: A = {a, b, c}. Which relation does this matrix give?
[TABLE]
| M_R | a | b | c |
| a | 0 | 1 | 0 |
| b | 0 | 0 | 1 |
| c | 1 | 0 | 0 |
[/TABLE]
- Answer: R = {(a, b), (b, c), (c, a)}
- A relation from A to B with |A| ≠ |B| gives a rectangular matrix; the enrolment relation gives a 2 × 2 matrix with rows Asha, Ravi and columns DM, DS
Visual Guidance: The matrix with each 1 circled and an arrow from it to the matching ordered pair.
Speaker Notes: "Ask learners to write the enrolment matrix: row Asha is 1 0, row Ravi is 1 1."
#### Slide 10: The Directed Graph of a Relation
Heading: Digraph Representation
Subheading: Dots And Arrows
Content:
For a relation R on a set A:
- Draw one dot (vertex) for each element of A
- Draw an arrow from a to b for each pair (a, b) ∈ R
- A pair (a, a) is drawn as a loop: an arrow from a back to itself
Example: "x divides y" on {1, 2, 3, 4}
- Loops at 1, 2, 3 and 4
- Arrows 1 → 2, 1 → 3, 1 → 4 and 2 → 4
Visual Guidance: Four dots labelled 1 to 4 placed at the corners of a square, a small loop on each dot, and arrows 1 → 2, 1 → 3, 1 → 4 and 2 → 4.
Speaker Notes: "Draw it live on the board. Count arrows including loops: 4 loops + 4 arrows = 8, the same 8 pairs again."
#### Slide 11: Three Ways to Show One Relation
Heading: Comparing Representations
Subheading: Same Relation, Three Views
Content:
[TABLE]
| Representation | What It Looks Like | Best For |
| Ordered pairs | A list such as {(a, b), (b, c), (c, a)} | Writing answers; small relations |
| Relation matrix | A grid of 0s and 1s | Computers; checking properties quickly |
| Directed graph | Dots joined by arrows | Seeing paths, loops and cycles at a glance |
[/TABLE]
Try it: Draw the digraph of R = {(a, b), (b, c), (c, a)} from Slide 9.
- Answer: a triangle of arrows a → b → c → a, with no loops
Visual Guidance: The same relation shown three ways side by side: the list, the 3 × 3 matrix and the triangle digraph.
Speaker Notes: "Computers store relations as matrices (adjacency matrices in graph programs). Learners should be able to switch between all three forms in an exam."
### SECTION 3: Properties of Relations: Reflexive, irreflexive, symmetric, antisymmetric and transitive relations
#### Slide 12: Reflexive Relations
Heading: Reflexive
Subheading: Everyone Is Related To Themselves
Content:
R on A is reflexive if (a, a) ∈ R for every a ∈ A.
- Matrix test: every diagonal entry is 1
- Digraph test: every vertex has a loop
- Examples: "divides" on {1, 2, 3, 4}; "≤" on integers; "has the same birth month as"
- Non-example: R = {(1, 1), (2, 2)} on A = {1, 2, 3} is not reflexive, because (3, 3) is missing
Visual Guidance: The divides matrix from Slide 8 with its diagonal highlighted (all 1s), next to its digraph with all four loops highlighted.
Speaker Notes: "The word 'every' is the whole point. One missing loop breaks reflexivity, as in the non-example."
#### Slide 13: Irreflexive Relations
Heading: Irreflexive
Subheading: No One Is Related To Themselves
Content:
R on A is irreflexive if (a, a) ∉ R for every a ∈ A.
- Matrix test: every diagonal entry is 0
- Digraph test: no loops at all
- Examples: "<" on integers; "is a parent of"
[TABLE]
| Relation on A = {1, 2} | Reflexive? | Irreflexive? |
| {(1, 1), (2, 2), (1, 2)} | Yes | No |
| {(1, 2)} | No | Yes |
| {(1, 1)} | No | No |
[/TABLE]
Visual Guidance: Three small digraphs matching the three rows: loops on both dots; no loops; a loop on only one dot.
Speaker Notes: "The last row is the exam trap: 'not reflexive' does not mean 'irreflexive'. A relation with some loops but not all is neither."
#### Slide 14: Symmetric Relations
Heading: Symmetric
Subheading: Every Connection Goes Both Ways
Content:
R on A is symmetric if whenever (a, b) ∈ R, also (b, a) ∈ R.
- Matrix test: M_R equals its transpose (mᵢⱼ = mⱼᵢ for all i, j)
- Digraph test: every arrow between two different vertices has a return arrow
- Examples: "is a sibling of"; "lives in the same hostel as"; x + y is even
- Non-example: "divides" on {1, 2, 3, 4}: 1 divides 2, but 2 does not divide 1
Analogy: Facebook "friend" is symmetric: if you are my friend, I am your friend. Instagram "follows" is not.
Visual Guidance: A 3 × 3 matrix folded along its diagonal, with matching 1s landing on each other; beside it, a digraph with pairs of opposite arrows.
Speaker Notes: "Ask learners to classify 'is a sister of' among people. It is not symmetric: Asha is a sister of Ravi, but Ravi is not a sister of Asha."
#### Slide 15: Antisymmetric Relations
Heading: Antisymmetric
Subheading: No Two-Way Connections Between Different Elements
Content:
R on A is antisymmetric if whenever (a, b) ∈ R and (b, a) ∈ R, then a = b. In other words, for a ≠ b, the pairs (a, b) and (b, a) are never both in R.
- Matrix test: for i ≠ j, mᵢⱼ and mⱼᵢ are never both 1
- Digraph test: no two different vertices have arrows in both directions (loops are allowed)
- Examples: "≤" on integers; "divides" on positive integers; "⊆" on sets
Visual Guidance: A digraph with one-way arrows and a few loops; a crossed-out picture of a two-way pair of arrows beside it.
Speaker Notes: "Check 'divides' on {1, 2, 3, 4}: the only two-way pairs are loops like (2, 2), where a = b. So it is antisymmetric."
#### Slide 16: Symmetric vs Antisymmetric
Heading: Not Opposites
Subheading: Both, Either Or Neither
Content:
[TABLE]
| Relation on A = {1, 2, 3} | Symmetric? | Antisymmetric? |
| {(1, 1), (2, 2)} | Yes | Yes |
| {(1, 2), (2, 1)} | Yes | No |
| {(1, 2)} | No | Yes |
| {(1, 2), (2, 1), (1, 3)} | No | No |
[/TABLE]
Visual Guidance: Four small digraphs, one per row, each labelled with its two answers.
Speaker Notes: "Go row by row. Row 1: there are no pairs between different elements, so both conditions hold. Row 4: (1, 3) has no return arrow, so it is not symmetric; (1, 2) and (2, 1) are both present with 1 ≠ 2, so it is not antisymmetric. Exam hook: learners often assume 'not symmetric' means 'antisymmetric'."
#### Slide 17: Transitive Relations
Heading: Transitive
Subheading: Two Steps Imply A Shortcut
Content:
R on A is transitive if whenever (a, b) ∈ R and (b, c) ∈ R, also (a, c) ∈ R.
- Digraph test: every path of two arrows a → b → c has a direct arrow a → c
- Examples: "<" and "≤" on integers; "divides"; "is an ancestor of"
- Non-examples: "is a parent of" (a parent's parent is a grandparent, not a parent); "is a friend of"
Analogy: If a train goes from Hyderabad to Vijayawada and another from Vijayawada to Chennai, a transitive network would also have a direct train from Hyderabad to Chennai.
Visual Guidance: Three dots a, b, c with arrows a → b and b → c in black and the required shortcut a → c drawn in a highlight colour.
Speaker Notes: "Transitivity is the property learners check least carefully. The next slide shows a systematic method."
#### Slide 18: Checking Transitivity Step by Step
Heading: A Systematic Check
Subheading: Chain Every Matching Pair
Content:
Method: for each pair (a, b), look for pairs starting with b; for each (b, c), check that (a, c) is present.
Example 1: R = {(1, 2), (2, 3), (1, 3), (3, 3)} on {1, 2, 3}
[TABLE]
| Chain | Needs | Present? |
| (1, 2), (2, 3) | (1, 3) | Yes |
| (1, 3), (3, 3) | (1, 3) | Yes |
| (2, 3), (3, 3) | (2, 3) | Yes |
| (3, 3), (3, 3) | (3, 3) | Yes |
[/TABLE]
Every chain closes, so R is transitive.
Example 2: R = {(1, 2), (2, 1)}: the chain (1, 2), (2, 1) needs (1, 1), which is missing, so R is not transitive.
Visual Guidance: The chain table filled in one row at a time, with a green tick or a red cross in the last column.
Speaker Notes: "Example 2 is the classic trap: a chain can return to its start, and then the loop (a, a) is required. Learners often forget chains that go out and back."
#### Slide 19: Properties at a Glance
Heading: Summary Of Properties
Subheading: Definition, Matrix And Digraph
Content:
[TABLE]
| Property | Condition | Matrix Test | Digraph Test |
| Reflexive | (a, a) ∈ R for all a | All diagonal entries 1 | Loop at every vertex |
| Irreflexive | (a, a) ∉ R for all a | All diagonal entries 0 | No loops |
| Symmetric | (a, b) ∈ R ⇒ (b, a) ∈ R | M_R equals its transpose | Every arrow has a return arrow |
| Antisymmetric | (a, b), (b, a) ∈ R ⇒ a = b | mᵢⱼ = mⱼᵢ = 1 only when i = j | No two-way arrows between different vertices |
| Transitive | (a, b), (b, c) ∈ R ⇒ (a, c) ∈ R | Check every chain | Every two-arrow path has a shortcut |
[/TABLE]
Visual Guidance: The table with one small digraph icon in each row illustrating the property.
Speaker Notes: "This is the revision slide for the section. Ask learners to copy it; it is the checklist for equivalence relations and partial orders that follow."
#### Slide 20: Practice: Check All Five
Heading: Your Turn
Subheading: Test Two Relations
Content:
On A = {1, 2, 3}:
[TABLE]
| Relation | Refl. | Irrefl. | Symm. | Antisymm. | Trans. |
| R₁ = {(1, 1), (2, 2), (3, 3), (1, 2), (2, 1)} | Yes | No | Yes | No | Yes |
| R₂ = "<" = {(1, 2), (1, 3), (2, 3)} | No | Yes | No | Yes | Yes |
[/TABLE]
Visual Guidance: The table with the answer cells hidden; reveal one column at a time.
Speaker Notes: "For R₁, transitivity: the chains (1, 2), (2, 1) and (2, 1), (1, 2) need (1, 1) and (2, 2), which are present. R₂ is antisymmetric because no two-way pair exists at all. Point out that R₁ is reflexive, symmetric and transitive, which leads straight into the next section."
### SECTION 4: Equivalence Relations: Equivalence relations; equivalence classes; partitions induced by equivalence relations
#### Slide 21: Equivalence Relations
Heading: Equivalence Relations
Subheading: "Alike" In Some Way
Content:
A relation R on A is an equivalence relation if it is reflexive, symmetric and transitive.
- "Is equal to" on any set
- "Has the same birth month as" on a class of students
- "Has the same remainder when divided by 3" on integers
- R₁ from Slide 20
Analogy: Sorting students into sections: everyone is in their own section, if Asha shares Ravi's section then Ravi shares Asha's, and two sections never partly overlap.
Visual Guidance: A class of student icons, each coloured by birth month, with a caption "same colour = related".
Speaker Notes: "An equivalence relation says two things are 'the same' with respect to one feature. Ask learners for one example from their college life, such as 'is in the same branch as'."
#### Slide 22: Congruence Modulo 3
Heading: A Standard Example
Subheading: a ≡ b (mod 3)
Content:
On the integers, a ≡ b (mod 3) means 3 divides a − b. It is an equivalence relation:
- Reflexive: a − a = 0 = 3 × 0, so a ≡ a
- Symmetric: if a − b = 3k, then b − a = 3(−k), so b ≡ a
- Transitive: if a − b = 3k and b − c = 3m, then a − c = 3(k + m), so a ≡ c
Examples: 7 ≡ 1 (mod 3) since 7 − 1 = 6; 8 ≢ 3 (mod 3) since 8 − 3 = 5
Visual Guidance: A clock face with only three positions 0, 1, 2; the numbers 0 to 8 written around it, each landing on its remainder.
Speaker Notes: "This proof pattern (write the condition as 'difference = 3 × integer') works for any modulus n. Exam hook: 'Prove that congruence modulo n is an equivalence relation' is a frequent question."
#### Slide 23: Equivalence Classes
Heading: Equivalence Classes
Subheading: Collecting Related Elements
Content:
For an equivalence relation R on A, the equivalence class of a is
[a] = {x ∈ A | x R a}
Example: congruence modulo 3 on A = {1, 2, 3, 4, 5, 6, 7, 8, 9}
[TABLE]
| Class | Elements | Remainder on Division by 3 |
| [1] | {1, 4, 7} | 1 |
| [2] | {2, 5, 8} | 2 |
| [3] | {3, 6, 9} | 0 |
[/TABLE]
- Any member can name its class: [4] = [7] = [1]
Visual Guidance: Nine numbered balls sorted into three labelled baskets: remainder 1, remainder 2 and remainder 0.
Speaker Notes: "Ask learners for [5] and [9]: {2, 5, 8} and {3, 6, 9}. On all of Z the classes are infinite, for example [0] = {…, −6, −3, 0, 3, 6, …}."
#### Slide 24: Facts About Equivalence Classes
Heading: How Classes Behave
Subheading: Equal Or Disjoint, Never In Between
Content:
For an equivalence relation R on A and any a, b ∈ A:
- a ∈ [a], since R is reflexive; so no class is empty
- a R b exactly when [a] = [b]
- Any two classes are either equal or disjoint: they never partly overlap
- Every element of A lies in exactly one class
Visual Guidance: Two correct pictures (two identical circles, two separate circles) and one crossed-out picture (two partly overlapping circles).
Speaker Notes: "Explain the third fact informally: if some x were in both [a] and [b], then a R x and x R b, so a R b by symmetry and transitivity, and the classes would be the same."
#### Slide 25: Partitions
Heading: Partition Of A Set
Subheading: Cutting A Set Into Blocks
Content:
A partition of A is a collection of subsets (blocks) of A such that:
- every block is non-empty
- no two blocks share an element (pairwise disjoint)
- the union of all blocks is A
The equivalence classes of an equivalence relation form a partition of A. This partition is written A/R.
Example: congruence mod 3 on {1, …, 9} gives A/R = {{1, 4, 7}, {2, 5, 8}, {3, 6, 9}}
Visual Guidance: A rectangle (the set A) divided by lines into three regions, each region containing one class.
Speaker Notes: "Check the three conditions with the class on the mod 3 example. Non-example: {{1, 2}, {2, 3}} is not a partition of {1, 2, 3}, because 2 is in two blocks."
#### Slide 26: From Partition Back to Relation
Heading: Partition To Equivalence Relation
Subheading: Same Block Means Related
Content:
Every partition also gives an equivalence relation: a R b exactly when a and b are in the same block.
Example: partition {{a, b}, {c}} of {a, b, c}
- R = {(a, a), (a, b), (b, a), (b, b), (c, c)}
- Number of pairs = 2² + 1² = 5 (the square of each block size, added)
[TABLE]
| M_R | a | b | c |
| a | 1 | 1 | 0 |
| b | 1 | 1 | 0 |
| c | 0 | 0 | 1 |
[/TABLE]
Visual Guidance: The partition picture on the left, the digraph in the middle (a and b joined both ways with loops; c with only a loop), and the matrix on the right with its two blocks of 1s shaded.
Speaker Notes: "Equivalence relations and partitions are two descriptions of the same thing. When elements are listed block by block, the matrix shows square blocks of 1s on the diagonal."
#### Slide 27: Practice: Equivalence Relations
Heading: Your Turn
Subheading: Test And Find The Classes
Content:
On A = {1, 2, 3, 4}: R = {(1, 1), (2, 2), (3, 3), (4, 4), (1, 3), (3, 1), (2, 4), (4, 2)}
- Reflexive: all four loops present
- Symmetric: (1, 3) and (3, 1), (2, 4) and (4, 2) come in pairs
- Transitive: every chain closes, for example (1, 3), (3, 1) needs (1, 1), which is present
- So R is an equivalence relation with classes {1, 3} and {2, 4}
Visual Guidance: The digraph with two separate clusters, {1, 3} and {2, 4}, each joined both ways and with loops.
Speaker Notes: "Ask learners why 'is a friend of' is not an equivalence relation: it fails transitivity, and some would say reflexivity too."
### SECTION 5: Compatibility Relations: Reflexive and symmetric relations; compatibility blocks
#### Slide 28: Compatibility Relations
Heading: Compatibility Relations
Subheading: Reflexive And Symmetric Only
Content:
A relation on A is a compatibility relation if it is reflexive and symmetric. It need not be transitive.
Example: X = {sun, nut, tea, ear}; x R y if x and y share at least one letter.
- Reflexive: every word shares letters with itself
- Symmetric: sharing a letter works both ways
- Not transitive: sun R nut (u, n) and nut R tea (t), but sun and tea share no letter
Visual Guidance: The four words as dots in a row, sun — nut — tea — ear, joined by plain lines (no arrowheads) to the words they share a letter with; loops are omitted.
Speaker Notes: "Because the relation is reflexive and symmetric, it is drawn without loops or arrowheads, which keeps the picture clean. Every equivalence relation is a compatibility relation, but not the other way round."
#### Slide 29: Compatibility Blocks
Heading: Maximal Compatibility Blocks
Subheading: Groups That All Get Along
Content:
- A compatibility block is a subset of A in which every two elements are related
- A maximal compatibility block is a block that is not contained in any larger block
Example (the words relation from Slide 28):
- Pairs related: sun–nut, nut–tea, tea–ear
- Maximal compatibility blocks: {sun, nut}, {nut, tea}, {tea, ear}
- The blocks overlap ("nut" and "tea" are in two blocks each), so they form a covering of X, not a partition
Visual Guidance: The line diagram from Slide 28 with three coloured ovals, each around one maximal block; the ovals overlap at "nut" and "tea".
Speaker Notes: "Real use: if 'compatible' means two people can share a lab bench, a maximal block is a largest group where everyone can sit together. Overlapping blocks are allowed, unlike equivalence classes."
#### Slide 30: Equivalence vs Compatibility
Heading: Side-By-Side Comparison
Subheading: What Transitivity Changes
Content:
[TABLE]
| Feature | Equivalence Relation | Compatibility Relation |
| Properties needed | Reflexive, symmetric, transitive | Reflexive, symmetric |
| Groups formed | Equivalence classes | Maximal compatibility blocks |
| Can groups overlap? | No: classes are disjoint | Yes: blocks may overlap |
| Groups together form | A partition | A covering |
[/TABLE]
Visual Guidance: Left: a set split into separate regions. Right: the same set covered by overlapping ovals.
Speaker Notes: "The single missing property, transitivity, is what allows the overlap."
### SECTION 6: Composition of Binary Relations: Chaining relations; composition using matrices
#### Slide 31: Chaining Two Relations
Heading: Composition Of Relations
Subheading: First R, Then S
Content:
Let R be a relation from A to B and S a relation from B to C. The composite relation R ∘ S from A to C is
R ∘ S = {(a, c) | there is some b ∈ B with (a, b) ∈ R and (b, c) ∈ S}
Analogy: R lists flights from home cities to hub cities; S lists flights from hub cities to destinations. R ∘ S tells you which destinations you can reach from each home city with one change.
Visual Guidance: Three columns of dots (A, B, C) with arrows for R between the first two and arrows for S between the last two; one two-step path is highlighted and replaced by a single dashed arrow from A to C.
Speaker Notes: "Notation warning: Tremblay and Manohar write R ∘ S for 'R first, then S'. Some books, such as Rosen, write the same relation as S ∘ R. Always check the convention a question uses."
#### Slide 32: Worked Example: Composition
Heading: Computing R ∘ S
Subheading: Follow Every Two-Step Path
Content:
A = {1, 2, 3}, B = {x, y}, C = {p, q}
R = {(1, x), (2, x), (3, y)} and S = {(x, p), (y, p), (y, q)}
[TABLE]
| From a | R takes a to | S takes that to | Pairs in R ∘ S |
| 1 | x | p | (1, p) |
| 2 | x | p | (2, p) |
| 3 | y | p, q | (3, p), (3, q) |
[/TABLE]
R ∘ S = {(1, p), (2, p), (3, p), (3, q)}
Visual Guidance: The three-column arrow diagram for this example, with each two-step path traced in a different colour.
Speaker Notes: "Work row by row. For each a, find where R sends it, then where S sends each of those."
#### Slide 33: Composition with Matrices
Heading: Boolean Matrix Product
Subheading: M of R ∘ S = M_R ⊙ M_S
Content:
Multiply M_R and M_S as usual, but use OR in place of + and AND in place of ×. Any non-zero result is 1.
Step 1: the relation matrix of R (from A to B)
[TABLE]
| M_R | x | y |
| 1 | 1 | 0 |
| 2 | 1 | 0 |
| 3 | 0 | 1 |
[/TABLE]
Step 2: the relation matrix of S (from B to C)
[TABLE]
| M_S | p | q |
| x | 1 | 0 |
| y | 1 | 1 |
[/TABLE]
Step 3: the Boolean product, which is the matrix of R ∘ S (from A to C)
[TABLE]
| M of R ∘ S | p | q |
| 1 | 1 | 0 |
| 2 | 1 | 0 |
| 3 | 1 | 1 |
[/TABLE]
Visual Guidance: The three matrices in a row with ⊙ and = between them; row 3 of M_R and the columns of M_S highlighted to show how the last row is computed.
Speaker Notes: "Row 3 of the result: (0 AND 1) OR (1 AND 1) = 1 for column p, and (0 AND 0) OR (1 AND 1) = 1 for column q. The result matches Slide 32."
#### Slide 34: Order Matters
Heading: Properties Of Composition
Subheading: Not Commutative, But Associative
Content:
On A = {1, 2, 3}: R = {(1, 2), (2, 3)} and S = {(2, 1), (3, 3)}
- R ∘ S = {(1, 1), (2, 3)}
- S ∘ R = {(2, 2)}
- So R ∘ S ≠ S ∘ R in general, but composition is associative: (R ∘ S) ∘ T = R ∘ (S ∘ T)
- Powers: R² = R ∘ R = {(1, 3)}
- A relation R is transitive exactly when R² ⊆ R. Here (1, 3) ∉ R, so R is not transitive
Visual Guidance: Two arrow diagrams side by side, R ∘ S and S ∘ R, with their different results circled.
Speaker Notes: "For S ∘ R: (2, 1) in S then (1, 2) in R gives (2, 2); (3, 3) in S cannot continue because R has no pair starting with 3. The test R² ⊆ R links composition back to the transitive property."
### SECTION 7: Partial Orders and Hasse Diagrams: Partial orders; posets; comparable and incomparable elements; Hasse diagrams
#### Slide 35: Partial Orders
Heading: Partial Order
Subheading: Reflexive, Antisymmetric, Transitive
Content:
A relation ≼ on A is a partial order if it is reflexive, antisymmetric and transitive. The pair (A, ≼) is called a partially ordered set, or poset.
[TABLE]
| Poset | Order Relation |
| (Z, ≤) | Less than or equal to |
| (Z⁺, |) | Divides, on positive integers |
| (P(S), ⊆) | Subset of, on the power set of S |
[/TABLE]
- "<" is not a partial order: it is not reflexive
- "Divides" on all of Z is not a partial order: 2 | −2 and −2 | 2, but 2 ≠ −2
Analogy: Course prerequisites: some courses must come before others, but some pairs of courses have no required order.
Visual Guidance: A small prerequisite chart of courses with arrows from basic courses to advanced ones.
Speaker Notes: "Equivalence relations group things that are alike; partial orders arrange things in order. The only change in the definition is antisymmetric in place of symmetric."
#### Slide 36: Proof: Divides Is a Partial Order
Heading: A Worked Proof
Subheading: (Z⁺, |) Is A Poset
Content:
- Reflexive: a = 1 × a, so a | a
- Antisymmetric: if a | b and b | a, then b = ka and a = mb for positive integers k, m. So a = mka, giving mk = 1, hence k = m = 1 and a = b
- Transitive: if a | b and b | c, then b = ka and c = mb, so c = (mk)a and a | c
Visual Guidance: The three properties as three ticked boxes, each with its one-line reason.
Speaker Notes: "Point out where 'positive' is used: in the antisymmetric step, mk = 1 forces k = m = 1 only for positive integers. This is exactly why divides fails on all of Z."
#### Slide 37: Comparable and Incomparable Elements
Heading: Comparable Or Not
Subheading: Why The Order Is "Partial"
Content:
In a poset (A, ≼), elements a and b are comparable if a ≼ b or b ≼ a. Otherwise they are incomparable.
- In (Z⁺, |): 3 and 6 are comparable (3 | 6); 4 and 6 are incomparable (neither divides the other)
- In (P({a, b}), ⊆): {a} and {b} are incomparable
- If every pair of elements is comparable, the order is a total (linear) order and the poset is a chain, for example (Z, ≤)
Visual Guidance: The numbers 3 and 6 joined by an arrow labelled "3 | 6"; the numbers 4 and 6 with a crossed-out link labelled "neither divides the other".
Speaker Notes: "The word 'partial' is explained by incomparable pairs: the order does not have to say anything about every pair."
#### Slide 38: Hasse Diagrams
Heading: Hasse Diagrams
Subheading: A Cleaner Picture Of A Partial Order
Content:
The digraph of a partial order has many arrows. A Hasse diagram keeps only what is needed:
- Remove all loops (reflexivity is understood)
- Remove every arrow implied by transitivity: keep a → b only if b covers a, that is, a ≺ b and no c lies strictly between them
- Place each element above the elements it covers, and drop the arrowheads (all edges point upward)
Visual Guidance: Three stages of the same small poset: the full digraph, the digraph without loops, and the final Hasse diagram with no arrowheads.
Speaker Notes: "Use the poset ({1, 2, 4}, |) for the three stages: the full digraph has 6 pairs (3 loops, 1→2, 2→4, 1→4); the Hasse diagram keeps only 1–2 and 2–4."
#### Slide 39: Worked Hasse Diagram: Divisors of 12
Heading: Drawing A Hasse Diagram
Subheading: ({1, 2, 3, 4, 6, 12}, |)
Content:
The divides relation here has 18 pairs. The cover pairs are:
[TABLE]
| Element | Covered By |
| 1 | 2, 3 |
| 2 | 4, 6 |
| 3 | 6 |
| 4 | 12 |
| 6 | 12 |
[/TABLE]
- Levels from bottom to top: 1; then 2 and 3; then 4 and 6; then 12
- The Hasse diagram has only 7 edges in place of 18 pairs
Visual Guidance: Hasse diagram: 1 at the bottom; 2 and 3 on the next level; 4 above 2, 6 above both 2 and 3; 12 at the top above 4 and 6. Edges: 1–2, 1–3, 2–4, 2–6, 3–6, 4–12, 6–12.
Speaker Notes: "Ask why there is no edge 1–6: the path 1–2–6 already shows 1 | 6. Ask why 4 and 6 sit on the same level with no edge: they are incomparable."
#### Slide 40: Hasse Diagram of a Power Set
Heading: Another Hasse Diagram
Subheading: (P({a, b, c}), ⊆)
Content:
- Bottom: ∅
- Level 1: {a}, {b}, {c}
- Level 2: {a, b}, {a, c}, {b, c}
- Top: {a, b, c}
- Each set is joined to the sets on the next level that contain it, giving 12 edges
Visual Guidance: The Hasse diagram drawn as a cube: ∅ at the bottom, three singletons above it, three two-element sets above those, and {a, b, c} at the top, with each singleton joined to the two pairs that contain it.
Speaker Notes: "This cube shape appears often in exams. Ask learners which elements are incomparable: for example {a} and {b, c}."
#### Slide 41: Reading a Hasse Diagram
Heading: Reading The Order
Subheading: Follow Upward Paths
Content:
In a Hasse diagram, a ≼ b exactly when there is a path from a going upward to b.
Try it (divisors of 12, Slide 39):
- Is 1 ≼ 12? Yes: 1–2–4–12 goes upward
- Is 3 ≼ 4? No upward path, and no path from 4 up to 3, so 3 and 4 are incomparable
- Is 2 ≼ 12? Yes: 2–6–12 (or 2–4–12)
Visual Guidance: The divisors-of-12 diagram with the path 1–2–4–12 highlighted in green and the positions of 3 and 4 circled in red.
Speaker Notes: "A downward path does not count. Being lower on the page is not enough either: 3 is drawn below 4, but there is no upward path from 3 to 4."
### SECTION 8: Special Elements of a Poset: Minimal, maximal, least and greatest elements; upper and lower bounds; infimum and supremum
#### Slide 42: Minimal and Maximal Elements
Heading: Minimal And Maximal
Subheading: Nothing Below, Nothing Above
Content:
In a poset (A, ≼):
- a is minimal if no element b satisfies b ≺ a (nothing is strictly below a)
- a is maximal if no element b satisfies a ≺ b (nothing is strictly above a)
Example: A = {2, 3, 4, 6, 12, 18} under divides
- Hasse edges: 2–4, 2–6, 3–6, 4–12, 6–12, 6–18
- Minimal elements: 2 and 3
- Maximal elements: 12 and 18
Visual Guidance: Hasse diagram: 2 and 3 at the bottom; 4 above 2, 6 above 2 and 3; 12 above 4 and 6; 18 above 6. Minimal elements circled in blue, maximal in red.
Speaker Notes: "In a Hasse diagram, minimal elements have no edge going down and maximal elements have no edge going up. A poset can have several of each."
#### Slide 43: Least and Greatest Elements
Heading: Least And Greatest
Subheading: Below Everything, Above Everything
Content:
- a is the least element if a ≼ x for every x ∈ A
- a is the greatest element if x ≼ a for every x ∈ A
- If a least or greatest element exists, it is unique (by antisymmetry)
Examples:
- Divisors of 12: least element 1, greatest element 12
- {2, 3, 4, 6, 12, 18} under divides: no least element (2 and 3 are incomparable) and no greatest element (12 and 18 are incomparable)
Visual Guidance: The two Hasse diagrams side by side: the first with a single bottom and a single top, the second with two bottoms and two tops.
Speaker Notes: "A least element is always minimal, but a minimal element need not be least. The second poset shows this."
#### Slide 44: Comparing the Four Special Elements
Heading: Summary Table
Subheading: Which Exist In Which Poset?
Content:
[TABLE]
| Poset | Minimal | Least | Maximal | Greatest |
| Divisors of 12 under | | 1 | 1 | 12 | 12 |
| {2, 3, 4, 6, 12, 18} under | | 2, 3 | None | 12, 18 | None |
| (P({a, b}), ⊆) | ∅ | ∅ | {a, b} | {a, b} |
| ({2, 3, 5}, |) | 2, 3, 5 | None | 2, 3, 5 | None |
[/TABLE]
Visual Guidance: The table with a small Hasse diagram drawn beside each row.
Speaker Notes: "The last row is a poset with no edges at all: every element is both minimal and maximal. Ask learners to draw its Hasse diagram: three dots side by side."
#### Slide 45: Upper and Lower Bounds
Heading: Bounds Of A Subset
Subheading: Above All, Below All
Content:
Let B be a subset of a poset (A, ≼).
- u ∈ A is an upper bound of B if b ≼ u for every b ∈ B
- l ∈ A is a lower bound of B if l ≼ b for every b ∈ B
Example: A = divisors of 12, ordered by divides
[TABLE]
| Subset B | Upper Bounds | Lower Bounds |
| {2, 3} | 6, 12 | 1 |
| {4, 6} | 12 | 1, 2 |
[/TABLE]
- A bound may or may not belong to B itself
Visual Guidance: The divisors-of-12 Hasse diagram with B = {2, 3} shaded; its upper bounds outlined above and its lower bound outlined below.
Speaker Notes: "To find upper bounds, look for elements reachable by an upward path from every element of B. For lower bounds, look downward from every element of B."
#### Slide 46: Supremum and Infimum
Heading: Least Upper Bound And Greatest Lower Bound
Subheading: Supremum And Infimum
Content:
- Supremum (least upper bound, lub): the least element among all upper bounds of B
- Infimum (greatest lower bound, glb): the greatest element among all lower bounds of B
[TABLE]
| Subset B of Divisors of 12 | Supremum | Infimum |
| {2, 3} | 6 | 1 |
| {4, 6} | 12 | 2 |
[/TABLE]
- In (Z⁺, |): sup{a, b} = lcm(a, b) and inf{a, b} = gcd(a, b)
- In (P(S), ⊆): sup{X, Y} = X ∪ Y and inf{X, Y} = X ∩ Y
Visual Guidance: The Hasse diagram with B = {4, 6}: arrows from 4 and 6 meet upward at 12 (supremum) and downward at 2 (infimum).
Speaker Notes: "Check {4, 6}: lower bounds are 1 and 2, and the greatest of these is 2 = gcd(4, 6). The upper bound 12 = lcm(4, 6)."
#### Slide 47: When Bounds Do Not Exist
Heading: Supremum And Infimum May Not Exist
Subheading: Checking Before Naming
Content:
Poset A = {2, 3, 4, 6, 12, 18} under divides (Slide 42):
[TABLE]
| Subset B | Upper Bounds | Supremum | Lower Bounds | Infimum |
| {12, 18} | None | Does not exist | 2, 3, 6 | 6 |
| {2, 3} | 6, 12, 18 | 6 | None | Does not exist |
[/TABLE]
- 12 and 18 have no common multiple in A, so there is no upper bound
- 2 and 3 have no common divisor in A (1 is not in A), so there is no lower bound
Visual Guidance: The Hasse diagram of A twice: once with {12, 18} shaded and nothing above them, once with {2, 3} shaded and nothing below them.
Speaker Notes: "Stress that the supremum and infimum must be elements of the poset A. Exam hook: questions often ask for lub and glb of a subset from a given Hasse diagram, and 'does not exist' is a valid answer."
#### Slide 48: Practice: Power Set Poset
Heading: Your Turn
Subheading: Bounds In (P({a, b, c}), ⊆)
Content:
Use the cube diagram from Slide 40 with B = {{a}, {b}}.
- Upper bounds: {a, b} and {a, b, c}
- Supremum: {a, b} = {a} ∪ {b}
- Lower bounds: ∅
- Infimum: ∅ = {a} ∩ {b}
- Minimal element of the whole poset: ∅; maximal element: {a, b, c}
Visual Guidance: The cube Hasse diagram with {a} and {b} shaded, {a, b} outlined as the supremum and ∅ outlined as the infimum.
Speaker Notes: "Give two minutes before revealing. Then ask for the supremum and infimum of {{a, b}, {b, c}}: {a, b, c} and {b}."
### Key Takeaways
- Relations and Their Part
- Representing Relations
- Properties of Relations
- Equivalence Relations
- Compatibility Relations
- Composition of Relations
- Partial Orders and Hasse Diagrams
- Special Elements of a Poset
Thank You | All the Best