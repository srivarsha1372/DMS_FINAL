# Recomputes every count in "DSM : Enumeration of Combinations and Permutations",
# by brute-force listing wherever the case is small enough, and by formula otherwise.
from itertools import permutations as P, combinations as C
from math import comb, perm, factorial as f
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)

def adjacent(seq, group):
    idx = sorted(seq.index(g) for g in group)
    return idx[-1] - idx[0] == len(group) - 1

boys = [f"B{i}" for i in range(6)]; girls = [f"G{i}" for i in range(4)]
committees = list(C(boys + girls, 5))
ng = lambda c: sum(x.startswith("G") for x in c)

ok(comb(10, 5) == 252 == len(committees), "S1 10C5 = 252")
ok(3 + 4 == 7 and 3 * 2 == 6 and perm(8, 3) == 336 and comb(8, 3) == 56 and f(5) == 120, "S2 toolkit examples")
ok(len([1 for m in C(range(5), 2) for w in C(range(4), 3)]) == 40 == comb(5, 2) * comb(4, 3), "S4 2 of 5 men, 3 of 4 women = 40")
ok(len(list(C(["M1", "M2"], 1))) * len(list(C(["W1", "W2", "W3"], 2))) == 6, "S5 small case lists 6")
team_capt = {(frozenset(t), c) for t in C(range(10), 5) for c in t}
ok(len(team_capt) == 1260 == comb(10, 5) * 5 == 10 * comb(9, 4), "S6 team + captain 1,260 both ways")
words = {w for cs in C("BCDFG", 2) for v in "AEI" for w in P(cs + (v,))}
ok(len(words) == 180, "S7 3-letter words with 2 consonants and 1 vowel = 180")
disp = {d for n in C("NOPQ", 2) for c in C("XYZ", 2) for d in P(n + c)}
ok(len(disp) == 432, "S8 shelf displays = 432")
ok(comb(6, 3) * comb(5, 2) == 200 and comb(9, 4) * 4 == 504 and comb(5, 2) * 3 * 6 == 180 and comb(4, 2) * comb(3, 2) * 24 == 432, "S9 practice")
abc = ["".join(p) for p in P("ABC")]
ok(sorted(p for p in abc if adjacent(p, "AB")) == sorted(["ABC", "BAC", "CAB", "CBA"]), "S10 4 of 6 keep A, B together")
ok(f(2) * f(2) == 4, "S11 block check 2! × 2! = 4")
ok(sum(adjacent(p, [0, 1]) for p in P(range(6))) == 240 and f(6) == 720 and 720 // 3 == 240, "S12 siblings together 240 (a third of 720)")
ok(sum(adjacent(p, "OUE") for p in P("COMPUTER")) == 4320, "S13 COMPUTER vowels together 4,320")
books = ["M1", "M2", "M3", "P1", "P2", "C1", "C2", "C3", "C4"]
def subj_together(p):
    return all(adjacent(p, [b for b in books if b[0] == s]) for s in "MPC")
ok(sum(subj_together(p) for p in P(books)) == 1728, "S14 subjects together 1,728 (brute force over 9!)")
ok(sum(adjacent(p, [0, 1]) for p in P(range(5))) == 48, "S15 row 1: 48")
ok(sum(adjacent(p, [4, 5, 6]) for p in P(range(7))) == 720, "S15 rows 2 and 3: 720")
beads = ["R1", "R2", "B1", "B2", "B3", "G1"]
ok(sum(all(adjacent(p, [b for b in beads if b[0] == s]) for s in "RBG") for p in P(beads)) == 72, "S15 row 4: 72")
ok(sum(ng(c) == 2 for c in committees) == 120, "S16 exactly 2 girls = 120")
ok([sum(ng(c) == k for c in committees) for k in range(5)] == [6, 60, 120, 60, 6], "S18 cases 6, 60, 120, 60, 6 sum to 252")
ok(comb(5, 3) * comb(4, 2) == 60 and comb(4, 2) * comb(48, 3) == 103776 and comb(48, 3) == 17296, "S19 exam 60; exactly 2 aces 103,776")
ok(comb(5, 1) * comb(6, 3) == 100 and comb(5, 3) * comb(7, 3) == 350 and comb(4, 2) * comb(8, 1) == 48 and comb(4, 2) * comb(6, 3) == 120, "S20 practice")
ok(sum(ng(c) >= 3 for c in committees) == 66, "S22 at least 3 girls = 66")
ok(sum(ng(c) >= 1 for c in committees) == 246 == 252 - 6, "S23 at least 1 girl = 246")
ok(sum(ng(c) <= 3 for c in committees) == 252 - 6 and sum(ng(c) <= 1 for c in committees) == 66, "S24 at most 3 and at most 1 (method table)")
bulbs = [f"F{i}" for i in range(3)] + [f"G{i}" for i in range(7)]
pick4 = list(C(bulbs, 4))
ok(len(pick4) == 210 and sum(all(b[0] == "G" for b in s) for s in pick4) == 35 and sum(any(b[0] == "F" for b in s) for s in pick4) == 175, "S25 at least one faulty = 175")
ok(3 * 35 + 3 * 21 + 1 * 7 == 175, "S25 check by cases")
routes = [(fb, frozenset(rest) | {fb}) for fb in bulbs[:3] for rest in C([b for b in bulbs if b != fb], 3)]
ok(len(routes) == 252 and len({s for _, s in routes}) == 175, "S26 pick-one-first gives 252 routes to 175 selections")
ok(comb(9, 4) - comb(5, 4) == 121 and comb(4, 3) * 5 + 1 == 21 and comb(8, 3) + 4 * comb(8, 2) == 168 and comb(52, 5) - comb(48, 5) == 886656, "S27 practice")
seat = 0
for b3 in C(range(5), 3):
    for g2 in C(range(5, 9), 2):
        seat += sum(adjacent(p, list(g2)) for p in P(b3 + g2))
ok(comb(5, 3) * comb(4, 2) * f(5) == 7200 and seat == 2880, "S28 (a) 7,200, (b) 2,880 by brute force")
panel = sum(f(3) for s in C(["S1", "S2", "S3", "S4", "J1", "J2", "J3"], 3) if sum(x[0] == "S" for x in s) >= 2)
ok(panel == 132, "S29 at least 2 seniors, seated = 132")
ok(comb(6, 4) * comb(5, 3) == 150 and comb(11, 7) == 330 and comb(6, 7) == 0 and comb(4, 2) * 3 * 6 == 108 and comb(9, 3) - comb(5, 3) == 74, "S31 mixed practice")
