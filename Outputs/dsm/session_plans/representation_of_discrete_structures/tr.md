<!-- extracted from Google Doc 'DSM : Representation of Discrete Structures' (1ABl2LNsYE8daDyaQa64WidnMT8qZaVEI8gr1xUksUxQ), read 2026-11-21 via the Google Docs connector; all 490 lines, 1 tab, no images -->

# DOC TITLE: DSM : Representation of Discrete Structures

======== TAB: Tab 1 ========
## Representation of Discrete Structures
### Agenda for Today's Session
- Data Structures: What a data structure is; how discrete data is organised and represented in a computer
- Storage Structures: Memory as addressed locations; bits, bytes and words; data structure vs storage structure
- Sequential Allocation: Storing elements in consecutive locations; address formulas for one- and two-dimensional arrays
- Pointers and Linked Allocation: Pointers and NULL; nodes with INFO and LINK fields; tracing, inserting and deleting in a linked list
- An Application of Bit Represented Sets: Sets as bit strings; reading bit patterns; set operations as bitwise operations; the sieve of Eratosthenes
### SECTION 1: Data Structures: Meaning of data structures; how discrete data is organised and represented
#### Slide 1: Data Needs a Shape
Heading: Data Structures
Subheading: More Than A Pile Of Data
Content:
Sets, sequences and relations live on paper until we store them in a computer in a definite form.
A data structure is a way of organising data elements together with the relationships among them, so that the required operations can be carried out efficiently.
Analogy: A library is more than a pile of books. Without its shelf and numbering system, finding one book means searching through every book.
Visual Guidance: On the left, a messy heap of books; on the right, the same books on numbered shelves, with a tick mark beside the neat version.
Speaker Notes: "Open with a question: how does a phone know the order of songs in a playlist? Let learners answer before showing the definition. The idea to land: data plus an arrangement."
#### Slide 2: Three Parts of Every Data Structure
Heading: What A Data Structure Contains
Subheading: Data, Relationships, Operations
Content:
- Data elements: the individual values, such as roll numbers, names or marks
- Relationships: how the elements are connected, such as "comes after" or "is a parent of"
- Operations: what we do with the data, such as access, insert, delete, search and traverse
Analogy: In the library, the books are the data, the call-number order is the relationship, and issuing and returning books are the operations.
Visual Guidance: Three labelled boxes, "Data", "Relationships" and "Operations", joined into one larger box titled "Data Structure", each with a library icon beside it.
Speaker Notes: "Map each part to the library analogy as you reveal it. Stress that the same data (names of students) can be organised in different ways depending on what we want to do with it."
#### Slide 3: Discrete Structures Around Us
Heading: Examples
Subheading: Same Idea, Different Relationships
Content:
[TABLE]
| Real Situation | Discrete Structure | Relationship Among Elements |
| Roll list of a class in order | Sequence (list) | Each student has a next student |
| Students in the coding club | Set | Only membership matters; no order, no repetition |
| Folders inside folders on a laptop | Tree | Each folder has one parent folder |
| Cities connected by train routes | Graph | A pair of cities is joined or not joined |
| "Is a prerequisite of" among courses | Relation | Ordered pairs (course, course) |
[/TABLE]
Visual Guidance: Four small pictures in a row: a numbered roll list, a bag of name cards, a folder tree and a map with dots joined by lines.
Speaker Notes: "Ask learners to give one more example for each row. The relationship column is what decides which structure we choose."
#### Slide 4: Kinds of Data Structures
Heading: Classifying Data Structures
Subheading: Simple To Structured
Content:
[TABLE]
| Type | Meaning | Examples |
| Primitive | A single value the machine handles directly | Integer, real number, character, logical (true/false), pointer |
| Non-primitive: Linear | Elements form a sequence; each element (except the last) has a unique next element | Arrays (vectors), strings, stacks, queues, linked lists |
| Non-primitive: Non-linear | An element may be related to several others | Trees, graphs |
[/TABLE]
Visual Guidance: A classification chart: "Data Structures" at the top splitting into "Primitive" and "Non-primitive"; "Non-primitive" splitting into "Linear" and "Non-linear", with examples under each box.
Speaker Notes: "Keep this light. The point is that the structure is chosen to match the relationship in the data, not memorised as a list."
#### Slide 5: What Can We Do With Them?
Heading: Operations On Data Structures
Subheading: The Everyday Toolkit
Content:
- Create and destroy the structure
- Select (access) an element and update its value
- Insert and delete elements
- Search for an element, traverse (visit every element once) and sort
Analogy: In a phone's contact list you add a contact (insert), remove one (delete), look someone up (search) and scroll through all of them (traverse).
Visual Guidance: A phone screen showing a contact list, with small labels pointing to the "+" button (insert), the trash icon (delete), the search bar (search) and the scroll bar (traverse).
Speaker Notes: "Insert, delete and access will come back in Sections 3 and 4: how fast each one is depends on how the data is stored in memory."
#### Slide 6: Quick Check
Heading: Pick The Structure
Subheading: Match Data To Its Shape
Content:
[TABLE]
| Data to Store | Best Described As |
| Marks of 60 students, looked up by roll number | Linear: array |
| A company's reporting hierarchy | Non-linear: tree |
| A single student's CGPA | Primitive: real number |
| Friend connections on a social network | Non-linear: graph |
[/TABLE]
Visual Guidance: Show the table with the right-hand column hidden; reveal one row at a time after learners vote.
Speaker Notes: "Run this as a quick poll. Close the section by noting that every structure, however complex, must finally be laid out in memory, which is the topic of Section 2."
### SECTION 2: Storage Structures: How data is stored in memory; organisation of storage locations
#### Slide 7: Memory Is a Row of Numbered Boxes
Heading: Storage Locations
Subheading: Address And Content
Content:
Main memory is a long sequence of storage locations.
- Each location has a fixed, unique number: its address
- Each location holds a value: its content
- Addresses are consecutive (1000, 1001, 1002, …), so the "next" location is always known
Analogy: Hostel rooms are numbered 101, 102, 103, … The room number is the address; the student living there is the content. The number never changes, even when the occupant does.
Visual Guidance: A vertical strip of memory cells with the address written to the left of each cell and a value inside it.
Speaker Notes: "Ask: what is the difference between 'location 1000' and 'the value at location 1000'? Keep this distinction alive; pointers in Section 4 depend on it."
#### Slide 8: Bits, Bytes and Words
Heading: Units Of Storage
Subheading: From One Bit Upward
Content:
[TABLE]
| Unit | Size | Can Hold |
| Bit | 1 binary digit | 0 or 1 (for example, true or false) |
| Byte | 8 bits | One character, such as 'A' |
| Word | 16, 32 or 64 bits (depends on the machine) | One integer, real number or address |
[/TABLE]
Visual Guidance: One bit drawn as a single small box; a byte as a row of 8 boxes; a word as a longer row of 32 boxes, with brackets and labels.
Speaker Notes: "A word is the amount the machine reads or writes in one step. This matters again in Section 5, where one word can hold a whole set."
#### Slide 9: Bits Need Interpretation
Heading: Same Bits, Different Meanings
Subheading: Memory Stores Only Patterns
Content:
[TABLE]
| Address | Content (binary) | Read As |
| 1000 | 00001101 | The integer 13 |
| 1001 | 01000001 | The character 'A' (ASCII code 65) |
| 1002 | 00000001 | The logical value true |
| 1003 | 00111110 | The integer 62, or the character '>' |
[/TABLE]
Visual Guidance: The table with the last row highlighted, and two speech bubbles from it: one saying "62" and one saying "'>'".
Speaker Notes: "The last row is the key point: memory holds only bit patterns. Whether 00111110 is a number or a character is decided by the program that reads it."
#### Slide 10: Logical View vs Memory View
Heading: Storage Structures
Subheading: How Structures Sit In Memory
Content:
A data structure is the logical picture of the data. A storage structure is the actual arrangement of that data in memory locations.
[TABLE]
| Aspect | Data Structure | Storage Structure |
| Viewpoint | Logical: what the data means | Physical: where the bits are |
| Example | The list (12, 25, 37, 48) | Four words starting at address 2000, or four scattered nodes |
| Concern | Relationships and operations | Memory used, speed of access, ease of change |
[/TABLE]
Visual Guidance: The list (12, 25, 37, 48) drawn as four boxes at the top, with a downward arrow to a strip of memory cells labelled "storage structure".
Speaker Notes: "One data structure can have more than one storage structure. The next slide shows the two basic choices."
#### Slide 11: Two Ways to Lay Out a List
Heading: Sequential Or Linked
Subheading: Two Basic Storage Representations
Content:
- Sequential allocation: elements occupy consecutive locations; "next" is shown by physical position
- Linked allocation: elements may be anywhere in memory; "next" is shown by storing the address of the next element
Visual Guidance: The list (12, 25, 37, 48) at the top. Two arrows point down: on the left, four adjacent cells; on the right, four scattered cells joined by curved arrows.
Speaker Notes: "Ask: if the elements are side by side, how do we find the 3rd one? If they are scattered, how do we find the next one? Let learners guess; the answers are 'calculate its address' and 'follow a stored address'. Sections 3 and 4 cover each one."
### SECTION 3: Sequential Allocation: Sequential storage arrangement; locating and accessing elements
#### Slide 12: Side by Side in Memory
Heading: Sequential Allocation
Subheading: Elements In Consecutive Locations
Content:
- Elements of a linear list are stored in consecutive memory locations, in the same order as in the list
- A one-dimensional array (vector) is the standard example
- Because positions are regular, any element's address can be calculated
Analogy: Seats in a cinema row are numbered in order. If each seat is 50 cm wide, seat 9 is exactly 4 metres from seat 1; you can walk straight to it without checking seats 1 to 8.
Visual Guidance: A cinema row of numbered seats above a strip of numbered memory cells, with matching colours linking seat 1 to cell 1, seat 2 to cell 2, and so on.
Speaker Notes: "Ask learners how they would find seat 9 in the dark. The answer, 'count the distance', is exactly the address formula on the next slide."
#### Slide 13: The Address Formula
Heading: Finding A[i]
Subheading: One Calculation, No Searching
Content:
If A[1] starts at the base address L₀ and each element takes c locations:
Loc(A[i]) = L₀ + c × (i − 1)
Worked example: marks of 6 students in A[1..6], L₀ = 2000, c = 4 bytes.
[TABLE]
| Element | A[1] | A[2] | A[3] | A[4] | A[5] | A[6] |
| Value | 72 | 85 | 64 | 90 | 58 | 77 |
| Address | 2000 | 2004 | 2008 | 2012 | 2016 | 2020 |
[/TABLE]
Loc(A[5]) = 2000 + 4 × (5 − 1) = 2016
Visual Guidance: Six equal boxes holding the marks, addresses written below, and the formula shown above A[5] with an arrow.
Speaker Notes: "Reaching A[5] takes the same time as reaching A[1]. This is called direct or random access. Ask learners to compute Loc(A[6]) themselves: 2020."
#### Slide 14: Other Index Ranges
Heading: When Indexing Does Not Start At 1
Subheading: Adjusting The Formula
Content:
- For an array A[l..u] with lower bound l: Loc(A[i]) = L₀ + c × (i − l)
- Number of elements in A[l..u] = u − l + 1
- With 0-based indexing (C, Python): Loc(A[i]) = L₀ + c × i
Try it: A[5..20], L₀ = 1200, c = 2. Find Loc(A[12]) and the number of elements.
- Loc(A[12]) = 1200 + 2 × (12 − 5) = 1214
- Number of elements = 20 − 5 + 1 = 16
Visual Guidance: A strip of cells labelled A[5], A[6], …, A[20], with A[12] highlighted and the count of cells before it marked as 7.
Speaker Notes: "The term (i − l) is simply how many elements come before A[i]. Exam hook: questions of this exact type are common."
#### Slide 15: Storing a Table in a Line
Heading: Two-Dimensional Arrays
Subheading: Row-Major And Column-Major
Content:
Memory is one long line, but a matrix has rows and columns, so an m × n matrix must be flattened:
- Row-major order: store row 1 fully, then row 2, and so on
- Column-major order: store column 1 fully, then column 2, and so on
Example: order of storage for a 3 × 4 matrix A (first 8 positions)
[TABLE]
| Position | 1st | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th |
| Row-major | A[1,1] | A[1,2] | A[1,3] | A[1,4] | A[2,1] | A[2,2] | A[2,3] | A[2,4] |
| Column-major | A[1,1] | A[2,1] | A[3,1] | A[1,2] | A[2,2] | A[3,2] | A[1,3] | A[2,3] |
[/TABLE]
Visual Guidance: A 3 × 4 grid with arrows running across each row (row-major) beside a copy with arrows running down each column (column-major).
Speaker Notes: "Row-major is used by C, C++ and Python (NumPy default); column-major by Fortran and MATLAB."
#### Slide 16: Address Formulas for Matrices
Heading: Finding A[i, j]
Subheading: Count What Comes Before
Content:
For an m × n matrix A[1..m, 1..n]:
- Row-major: Loc(A[i, j]) = L₀ + c × [(i − 1) × n + (j − 1)]
- Column-major: Loc(A[i, j]) = L₀ + c × [(j − 1) × m + (i − 1)]
Worked example: m = 3, n = 4, L₀ = 500, c = 2. Find the address of A[2, 3].
- Row-major: 500 + 2 × [(1 × 4) + 2] = 500 + 12 = 512
- Column-major: 500 + 2 × [(2 × 3) + 1] = 500 + 14 = 514
Visual Guidance: The two strips from the previous slide with A[2,3] highlighted: 7th position in row-major, 8th in column-major.
Speaker Notes: "Check against the previous slide: in row-major A[2,3] is 7th, so 6 elements come before it (6 × 2 = 12). In column-major it is 8th, so 7 come before it (7 × 2 = 14). Exam hook: questions ask for both orders on the same matrix."
#### Slide 17: The Cost of Inserting
Heading: Insertion Means Shifting
Subheading: Making Room In The Middle
Content:
Example: insert 30 into the sorted list (10, 20, 40, 50, 60) stored in A[1..6].
[TABLE]
| Step | A[1] | A[2] | A[3] | A[4] | A[5] | A[6] |
| Before | 10 | 20 | 40 | 50 | 60 | (empty) |
| Shift 60, 50, 40 right (last one first) | 10 | 20 | (free) | 40 | 50 | 60 |
| Place 30 in A[3] | 10 | 20 | 30 | 40 | 50 | 60 |
[/TABLE]
Visual Guidance: An animated row of six boxes: the last three values slide one place right one by one, then 30 drops into the gap.
Speaker Notes: "Ask why shifting starts from the last element: starting at 40 would overwrite 50. Then ask what deleting 20 would need: shift 30, 40, 50, 60 one place left."
#### Slide 18: Strength and Weakness
Heading: Pros And Cons
Subheading: Fast Access, Costly Change
Content:
- Advantage: any element is reached directly using the address formula
- Advantage: no extra memory is needed to record the order
- Disadvantage: inserting or deleting in the middle needs shifting; with n elements, up to n moves
- Disadvantage: the maximum size must be fixed in advance; too large wastes space, too small causes overflow
Visual Guidance: A two-column card: a green column with the two advantages and a red column with the two disadvantages.
Speaker Notes: "These costs motivate linked allocation, which comes next."
### SECTION 4: Pointers and Linked Allocation: Pointers; links between locations; tracing linked elements
#### Slide 19: A Value That Tells You Where to Look
Heading: Pointers
Subheading: Storing An Address
Content:
A pointer (or link) is a data item whose value is the address of another storage location.
[TABLE]
| Address | Content | Remark |
| 3000 | 4096 | P: a pointer holding the address 4096 |
| 4096 | Ravi | The data that P points to |
[/TABLE]
Following P from location 3000 leads to location 4096, which holds "Ravi".
Visual Guidance: Two memory cells far apart. The cell P at address 3000 shows "4096" inside, with a bold arrow to the cell at address 4096 containing "Ravi".
Speaker Notes: "Return to the address vs content idea from Section 2. A pointer is simply content that happens to be an address. Common slip: confusing the pointer's own address (3000) with the address it holds (4096)."
#### Slide 20: NULL and Pointers in Code
Heading: Working With Pointers
Subheading: Pointing Somewhere, Or Nowhere
Content:
- Changing the content of P to another address makes P point elsewhere; the data itself is not moved
- NULL (written Λ or 0 in many books) means "points nowhere"; it marks the end of a chain
- In C, int *p stores an address; in Python and Java, every object variable is a reference to an object
Analogy: A contact saved in your phone is not your friend; it is how to reach your friend. If your friend changes numbers, you update the contact, and the friend stays where they are.
Visual Guidance: A phone contact card with an arrow to a person icon; below it, a contact card with an arrow ending in a crossed-out circle labelled NULL.
Speaker Notes: "Ask: what happens if a program follows a NULL pointer? It has nowhere to go; this is the 'null pointer' error learners will meet in coding."
#### Slide 21: Nodes Joined by Links
Heading: Linked Allocation
Subheading: Each Element Knows The Next
Content:
Each element is stored in a node with two fields:
- INFO: the data value
- LINK: a pointer to the node holding the next element
A pointer called FIRST holds the address of the first node, and the LINK of the last node is NULL. The order of the list comes only from the links, not from where the nodes sit in memory.
Analogy: A treasure hunt: each clue gives a prize (INFO) and tells you where the next clue is hidden (LINK).
Visual Guidance: The list drawn as two-part boxes [12 | •] → [25 | •] → [37 | •] → [48 | Λ], with a FIRST arrow pointing to the first box.
Speaker Notes: "Draw one node large on the board and label both fields before showing the chain."
#### Slide 22: Tracing a Linked List
Heading: Following The Links
Subheading: Reading A List From Memory
Content:
FIRST = 1020
[TABLE]
| Address | INFO | LINK |
| 1000 | 37 | 1060 |
| 1020 | 12 | 1080 |
| 1040 | (free) | (free) |
| 1060 | 48 | NULL |
| 1080 | 25 | 1000 |
[/TABLE]
Trace: 1020 (12) → 1080 (25) → 1000 (37) → 1060 (48) → NULL, so stop.
The list is (12, 25, 37, 48), even though the nodes are not in address order.
Visual Guidance: The memory table with arrows drawn from each LINK value to the row with that address, numbered 1 to 4 in the order they are followed.
Speaker Notes: "Trace slowly on the board with learners calling out the next address. Note that to reach the 4th element we must pass through the first three; there is no address formula here."
#### Slide 23: Walking Through a List
Heading: Traversal
Subheading: Visit Every Node Once
Content:
Procedure:
- Set P ← FIRST
- While P ≠ NULL: process INFO(P), then set P ← LINK(P)
Try it: Using the table on Slide 22, start with FIRST = 1080 instead. What list do you get?
- Answer: (25, 37, 48)
Visual Guidance: A pointer P drawn as a small arrow that moves from node to node along the chain, with each visited INFO value appearing in an output box.
Speaker Notes: "Point out that the same memory can hold different lists depending on where we start. The loop stops only because the last LINK is NULL."
#### Slide 24: Inserting a Node
Heading: Insertion
Subheading: Change Two Links
Content:
Free nodes are kept in a pool called the availability list (AVAIL). To insert 30 after 25 (in node 1080), take free node 1040 from AVAIL:
- Step 1: INFO(1040) ← 30
- Step 2: LINK(1040) ← LINK(1080), so the new node points to 1000 (the node holding 37)
- Step 3: LINK(1080) ← 1040, so 25 now points to the new node
New list: (12, 25, 30, 37, 48). Nothing was shifted.
Visual Guidance: The chain from Slide 21 with a new box "30" below it. The arrow from 25 is redrawn to 30, and an arrow from 30 goes to 37.
Speaker Notes: "Ask what goes wrong if Steps 2 and 3 are swapped: once LINK(1080) is overwritten, the address 1000 is lost and the rest of the list is cut off. This is the most common error in linked-list code."
#### Slide 25: Deleting a Node
Heading: Deletion
Subheading: Bypass The Node
Content:
To delete 37 (node 1000), make the node before it (1040) skip over it, then return node 1000 to AVAIL:
- LINK(1040) ← LINK(1000), so 30 now points to 1060 (the node holding 48)
[TABLE]
| Address | INFO | LINK (after insert and delete) |
| 1000 | (free) | (returned to AVAIL) |
| 1020 | 12 | 1080 |
| 1040 | 30 | 1060 |
| 1060 | 48 | NULL |
| 1080 | 25 | 1040 |
[/TABLE]
Trace from FIRST = 1020: 12 → 25 → 30 → 48.
Visual Guidance: The chain with box 37 fading out and the arrow from 30 redrawn to 48.
Speaker Notes: "Only one LINK changed for the deletion. Compare with Slide 17, where inserting into an array needed three shifts."
#### Slide 26: Sequential vs Linked
Heading: Side-By-Side Comparison
Subheading: Choosing A Storage Structure
Content:
[TABLE]
| Feature | Sequential Allocation | Linked Allocation |
| Placement in memory | Consecutive locations | Anywhere; joined by pointers |
| Access to the i-th element | Direct, by address formula | Follow links from FIRST |
| Insert / delete in the middle | Slow: elements are shifted | Fast once the position is found: change links |
| Size | Fixed in advance | Grows and shrinks using AVAIL |
| Extra memory | None | One LINK field per node |
[/TABLE]
Visual Guidance: The table with small icons in the header: a straight train of boxes for sequential and a chain of boxes with arrows for linked.
Speaker Notes: "Neither method wins every time; the choice depends on which operation happens most."
#### Slide 27: Which One Would You Use?
Heading: Your Turn
Subheading: Pick A Storage Structure
Content:
- Monthly temperatures of a city for one year: sequential (fixed size, accessed by month number)
- A music queue where songs are added and removed while playing: linked (frequent insertion and deletion)
- A 10 × 10 multiplication table: sequential, as a two-dimensional array
Visual Guidance: Three cards, each with a picture (thermometer, music queue, times table). The answer appears under each card after learners vote.
Speaker Notes: "Ask for a reason, not only an answer. Mention that Python's list is sequential (an array of references), which is why inserting at the front of a long list is slow."
### SECTION 5: An Application of Bit Represented Sets: Sets as bits; interpreting bit patterns; set operations
#### Slide 28: One Bit per Element
Heading: Bit Represented Sets
Subheading: A Set As A Bit String
Content:
Let U = {u₁, u₂, …, uₙ} be a finite universal set with a fixed order. Every subset A of U is stored as an n-bit string:
bit i = 1 if uᵢ ∈ A, and bit i = 0 if uᵢ ∉ A
Analogy: An attendance register with one column per student: 1 for present, 0 for absent. Each day's row is a bit string for the set of students present.
Visual Guidance: A row of numbered light bulbs for the elements of U, with the bulbs of the elements in A switched on and the bit string written below.
Speaker Notes: "The order of U must be fixed once and used for every set; otherwise bit strings cannot be compared. Our earlier course slides (W3_S7) wrote the elements from right to left, like binary place values; either direction is correct if used consistently."
#### Slide 29: Building Bit Strings
Heading: From Set To Bits
Subheading: One Position Per Element
Content:
U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, in this order from left to right.
[TABLE]
| Element of U | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| A = odd numbers {1, 3, 5, 7, 9} | 1 | 0 | 1 | 0 | 1 | 0 | 1 | 0 | 1 | 0 |
| B = primes {2, 3, 5, 7} | 0 | 1 | 1 | 0 | 1 | 0 | 1 | 0 | 0 | 0 |
[/TABLE]
So A = 1010101010 and B = 0110101000.
Visual Guidance: Two rows of ten bulbs, one for A and one for B, with the lit bulbs matching the 1s in the table.
Speaker Notes: "Build row A with the class element by element before revealing it. Let them build row B on their own."
#### Slide 30: Reading Bit Patterns
Heading: From Bits To Set
Subheading: Decoding A Bit String
Content:
- 1100000011 stands for {1, 2, 9, 10}: list the positions that hold 1
- ∅ is all 0s (0000000000) and U is all 1s (1111111111)
- |A| = the number of 1s, so |A| = 5 and |B| = 4
- An n-element universe needs only n bits per subset; one 16-bit word holds any subset of a 16-element universe
Try it: Decode 0001001000. Answer: {4, 7}
Visual Guidance: The bit string 1100000011 with element numbers written above each bit and the 1-positions circled.
Speaker Notes: "Decoding is the reverse of building. Ask: what bit string stands for {10}? Answer: 0000000001."
#### Slide 31: Set Operations Become Bit Operations
Heading: Operations On Bit Strings
Subheading: One Position At A Time
Content:
[TABLE]
| Set Operation | Bitwise Operation | Rule for Each Position |
| Union A ∪ B | A OR B | 1 if either bit is 1 |
| Intersection A ∩ B | A AND B | 1 only if both bits are 1 |
| Complement A′ | NOT A | Flip every bit |
| Difference A − B | A AND (NOT B) | 1 if the bit is 1 in A and 0 in B |
| Symmetric difference A ⊕ B | A XOR B | 1 if the two bits differ |
[/TABLE]
Visual Guidance: Each row of the table paired with a small Venn diagram showing the shaded region for that operation.
Speaker Notes: "Bit i answers 'is uᵢ in the set?', so each set operation is just a logical connective applied position by position. Exam hook: A − B is A AND NOT B; learners often write A AND B by mistake."
#### Slide 32: Worked Example: Union, Intersection, Complement
Heading: Applying OR, AND, NOT
Subheading: Using A and B From Slide 29
Content:
A = 1010101010 (odd numbers), B = 0110101000 (primes)
[TABLE]
| Operation | Bit String | Set |
| A ∪ B = A OR B | 1110101010 | {1, 2, 3, 5, 7, 9} |
| A ∩ B = A AND B | 0010101000 | {3, 5, 7} |
| A′ = NOT A | 0101010101 | {2, 4, 6, 8, 10} |
[/TABLE]
Visual Guidance: A and B written one above the other with element numbers on top; the result row appears below, column by column.
Speaker Notes: "Do the OR row column by column with the class, then let them do AND and NOT. Check each answer against the sets directly."
#### Slide 33: Worked Example: Difference and Symmetric Difference
Heading: Applying AND-NOT, XOR
Subheading: Same A And B
Content:
[TABLE]
| Operation | Bit String | Set |
| B′ = NOT B | 1001010111 | {1, 4, 6, 8, 9, 10} |
| A − B = A AND B′ | 1000000010 | {1, 9} |
| A ⊕ B = A XOR B | 1100000010 | {1, 2, 9} |
[/TABLE]
- Check: A ⊕ B = (A − B) ∪ (B − A) = {1, 9} ∪ {2} = {1, 2, 9}
- Subset test: A ⊆ B exactly when A AND B = A. Here A AND B ≠ A, so A ⊄ B
Visual Guidance: The same layout as the previous slide, with the B′ row shown first and then ANDed with A.
Speaker Notes: "Point out the speed: a computer applies AND or OR to a whole word, up to 64 elements, in one machine instruction. That is why this representation is used when the universe is small and fixed."
#### Slide 34: The Sieve of Eratosthenes
Heading: Application: Finding Primes
Subheading: Removing Multiples With Set Difference
Content:
Goal: find all primes up to 20, using a bit-represented set PRIME over U = {2, 3, …, 20}.
- Start with every bit of PRIME equal to 1
- Take the smallest p still in PRIME; let M = the multiples of p greater than p
- Set PRIME ← PRIME − M, that is, PRIME AND (NOT M)
- Move to the next p still in PRIME; stop when p × p > 20
Visual Guidance: A strip of 19 numbered cells from 2 to 20, all lit, with the label "PRIME" and a hand ready to switch off cells.
Speaker Notes: "This is the application of bit-represented sets worked out in Tremblay and Manohar: every step is a set difference done with AND and NOT on whole words."
#### Slide 35: Sieve Trace up to 20
Heading: Running The Sieve
Subheading: Two Passes Are Enough
Content:
[TABLE]
| Number | Start | After p = 2 | After p = 3 | Prime? |
| 2 | 1 | 1 | 1 | Yes |
| 3 | 1 | 1 | 1 | Yes |
| 4 | 1 | 0 | 0 | No |
| 5 | 1 | 1 | 1 | Yes |
| 6 | 1 | 0 | 0 | No |
| 7 | 1 | 1 | 1 | Yes |
| 8 | 1 | 0 | 0 | No |
| 9 | 1 | 1 | 0 | No |
| 10 | 1 | 0 | 0 | No |
| 11 | 1 | 1 | 1 | Yes |
| 12 | 1 | 0 | 0 | No |
| 13 | 1 | 1 | 1 | Yes |
| 14 | 1 | 0 | 0 | No |
| 15 | 1 | 1 | 0 | No |
| 16 | 1 | 0 | 0 | No |
| 17 | 1 | 1 | 1 | Yes |
| 18 | 1 | 0 | 0 | No |
| 19 | 1 | 1 | 1 | Yes |
| 20 | 1 | 0 | 0 | No |
[/TABLE]
- p = 2 removes {4, 6, 8, …, 20}; p = 3 removes {6, 9, 12, 15, 18}, but only 9 and 15 change
- Next is p = 5, and 5 × 5 = 25 > 20, so stop. Result: {2, 3, 5, 7, 11, 13, 17, 19}
Visual Guidance: The strip of 19 cells: in pass 1 the multiples of 2 (except 2) go dark; in pass 2 cells 9 and 15 go dark. The cells still lit are labelled "Primes".
Speaker Notes: "Ask why we can stop at p = 5: every composite number up to 20 has a factor no larger than √20, which is less than 5. Also ask why 4 never needs its own pass: its multiples were already removed as multiples of 2."
#### Slide 36: Your Turn
Heading: Practice
Subheading: Bit Strings By Hand
Content:
U = {a, b, c, d, e, f, g, h} in this order, A = {a, c, d, f}, B = {b, c, f, h}.
- A = 10110100 and B = 01100101
- A ∪ B = 11110101 = {a, b, c, d, f, h}
- A ∩ B = 00100100 = {c, f}
- A′ = 01001011 = {b, e, g, h}
- A − B = 10110100 AND 10011010 = 10010000 = {a, d}
- A ⊕ B = 11010001 = {a, b, d, h}
Visual Guidance: The questions on the left with answers revealed one at a time on the right.
Speaker Notes: "Give two minutes before revealing the answers. Ask learners to check A ⊕ B by computing B − A = {b, h} and taking the union with A − B."
#### Slide 37: Bit Sets in Code
Heading: In Real Programs
Subheading: Same Operations, Real Tools
Content:
[TABLE]
| Set Operation | Operator (C, Java, Python) | Python, with A = 0b10110100, B = 0b01100101 |
| Union | A | B | bin(A | B) gives 0b11110101 |
| Intersection | A & B | bin(A & B) gives 0b100100 |
| Difference | A & ~B | bin(A & ~B) gives 0b10010000 |
| Symmetric difference | A ^ B | bin(A ^ B) gives 0b11010001 |
| Complement | ~A, kept to n bits with a mask | bin(~A & 0b11111111) gives 0b1001011 |
[/TABLE]
Where bit sets are used: Linux file permissions (rwx is 3 bits, so r-x is 101), feature flags in apps, and bitmap indexes in databases.
Visual Guidance: A Python console running the five lines, next to the bit strings from the previous slide.
Speaker Notes: "If a laptop is available, run these live. Python does not print leading zeros, so 0b100100 is 00100100. The mask in the complement row keeps only the 8 bits of our universe, because Python's ~ works on unlimited-length integers."
### Key Takeaways
- Data Structures
- Storage Structures
- Sequential Allocation
- Pointers and Linked Allocation
- Bit Represented Sets
Thank You | All the Best