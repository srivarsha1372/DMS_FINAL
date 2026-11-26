# Recomputes every count in "DSM : Enumerating Permutation with Constrained Repetitions",
# by brute-force listing of distinct arrangements wherever feasible.
from itertools import permutations as P
from math import factorial as f, perm, comb
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)

words = lambda s: {"".join(p) for p in P(s)}
def adjacent(seq, items):
    idx = sorted(i for i, x in enumerate(seq) if x in items)
    return idx[-1] - idx[0] == len(idx) - 1
def no_two(seq, items):
    idx = [i for i, x in enumerate(seq) if x in items]
    return all(b - a > 1 for a, b in zip(idx, idx[1:]))
def circles(people):
    """Distinct seatings up to rotation."""
    seen = set()
    for p in P(people):
        k = p.index(people[0]); seen.add(p[k:] + p[:k])
    return seen
def necklaces(beads):
    seen = set()
    for c in circles(beads):
        r = (c[0],) + tuple(reversed(c[1:]))
        seen.add(min(c, r))
    return seen

ok(len(words("BOOK")) == 12 == f(4) // f(2), "S1/S3 BOOK 12 (not 24)")
ok(words("AAB") == {"AAB", "ABA", "BAA"} and f(3) // f(2) == 3, "S2 A, A, B gives 3 words")
ok(len(words("BANANA")) == 60 and len(words("LETTER")) == 180, "S5 BANANA 60, LETTER 180")
ok(f(11) // (f(4) * f(4) * f(2)) == 34650 and f(11) == 39916800 and f(4) * f(4) * f(2) == 1152, "S6 MISSISSIPPI 34,650")
ok(f(11) * 1 // 1 == 39916800 and (11 * 10 * 9 * 8 * 7 * 6 * 5) // 48 == 34650, "S6 notes cancelling")
ok(len(words("RRRGGB")) == 60 and len(words("1110000")) == 35 == comb(7, 3), "S7 flags 60, bit strings 35")
ok(len(words("RRRRUUU")) == 35 and len(words("RRU")) == 3, "S8 grid paths 35; 2x1 grid 3")
ok(len(words("APPLE")) == 60 and len(words("11222")) == 10 and len(words("RRRUUU")) == 20, "S9 APPLE 60, 11222 10, paths 20")
ok(f(10) // (f(3) * f(3) * f(2)) == 50400, "S9 STATISTICS 50,400 (S3 T3 I2 A1 C1)")
ok(sorted("STATISTICS").count("S") == 3 and "STATISTICS".count("T") == 3 and "STATISTICS".count("I") == 2, "S9 letter counts")
ok(len(circles("ABC")) == 2 and len(circles("ABCDEF")) == 120 == f(5), "S10 3 at a table 2; S12 6 guests 120")
ok(f(7) == 5040 and len(circles("ABCDEFG")) == 720, "S12 try it 8 children 7! = 5,040; check 7 gives 720")
ok(len(necklaces("ABCDEFG")) == 360, "S13 7 beads 360")
ok(len(circles("ABCDE")) == 24 and f(9) == 362880 and len(necklaces("ABCDEF")) == 60 and len(necklaces("ABCD")) == 3, "S14 practice incl. key ring 3")
ok(sum(w[0] == "M" for w in words("MONDAY")) == 120, "S15 MONDAY starting with M 120")
ok(sum(w[0] in "OA" and w[-1] in "OA" for w in words("MONDAY")) == 48, "S16 vowels at both ends 48")
nums = ["".join(p) for p in P("12345")]
ok(sum(int(n) % 2 == 0 for n in nums) == 48 and sum(int(n) > 40000 for n in nums) == 48, "S17 even 48; above 40,000 48")
ban = words("BANANA")
ok(sum(w[0] == "B" for w in ban) == 10 and sum(w[0] == "A" and w[-1] == "A" for w in ban) == 12, "S18 BANANA begins B 10; A at both ends 12")
pen = words("PENCIL")
ok(sum(w[0] == "P" for w in pen) == 120 and sum({w[0], w[-1]} == {"E", "I"} for w in pen) == 48, "S19 PENCIL rows")
ok(sum(int(n) % 2 == 0 for n in ("".join(p) for p in P("1356"))) == 6 and sum(w[0] == "T" for w in words("LETTER")) == 60, "S19 even from 1356 6; LETTER with T first 60")
five = list(P("ABCDE"))
ok(sum(adjacent(p, "AB") for p in five) == 48 and sum(not adjacent(p, "AB") for p in five) == 72, "S20/S21 together 48, not together 72")
kids = list(P("BBBBGGG".replace("B", "b").replace("G", "g")))
boysgirls = list(P(["B1", "B2", "B3", "B4", "G1", "G2", "G3"]))
ok(sum(no_two(p, {"G1", "G2", "G3"}) for p in boysgirls) == 1440 == f(4) * perm(5, 3), "S22 no two girls together 1,440")
comp = list(P("COMPUTER"))
ok(sum(adjacent(p, "OUE") for p in comp) == 4320, "S23 all vowels together 4,320")
ok(sum(not adjacent(p, "OUE") for p in comp) == 36000, "S23 not all together 36,000")
ok(sum(no_two(p, "OUE") for p in comp) == 14400, "S23 no two vowels together 14,400")
ok(sum(adjacent(w, "A") for w in ban) == 12 and sum(not adjacent(w, "A") for w in ban) == 48 and sum(no_two(w, "A") for w in ban) == 12, "S24 BANANA 12, 48, 12")
def circ_adjacent(c, a, b):
    i, j = c.index(a), c.index(b); return abs(i - j) in (1, len(c) - 1)
six = circles("PQABCD")
ok(sum(circ_adjacent(c, "P", "Q") for c in six) == 48 and sum(not circ_adjacent(c, "P", "Q") for c in six) == 72, "S25 round table together 48, not 72")
ok(sum(not adjacent(p, "AB") for p in P("ABCDEF")) == 480, "S26 row 1: 480")
ok(sum(no_two(p, {"G1", "G2", "G3"}) for p in P(["B1", "B2", "B3", "B4", "B5", "G1", "G2", "G3"])) == 14400, "S26 row 2: 14,400")
app = words("APPLE")
ok(sum(adjacent(w, "P") for w in app) == 24 and sum(not adjacent(w, "P") for w in app) == 36, "S26 APPLE PP together 24, apart 36")
ok(sum(circ_adjacent(c, "A", "B") for c in circles("ABCDEFG")) == 240, "S26 7 at round table, 2 together 240")
bal = words("BALLOON")
ok(sum(w[0] == "B" and adjacent(w, "L") for w in bal) == 60, "S28 BALLOON begins B, L's together 60")
ok(f(6) == 720 and f(5) == 120, "S29 mistakes values")
ok(f(11) // (f(3) * f(3) * f(2) * f(2)) == 277200 and f(7) == 5040 and sum(w[-1] == "Y" for w in words("MONDAY")) == 120, "S30 rows 1-3")
ok(sum(not adjacent(p, "AB") for p in five) == 72 and sum(no_two(p, {"G1", "G2", "G3"}) for p in P(["B1", "B2", "B3", "G1", "G2", "G3"])) == 144, "S30 rows 4-5")
ok(len(words("aabbc")) == 30 and len(circles("ABCDE")) == 24 and f(5) == 120 and sum(not adjacent(p, "AB") for p in P("ABCDEF")) == 480, "S31 computing")
