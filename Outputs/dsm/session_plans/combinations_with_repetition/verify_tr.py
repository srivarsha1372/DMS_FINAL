# Recomputes every count in "DSM : Enumerating Combinations and Permutations with Repetitions",
# by brute-force listing wherever feasible and by formula otherwise.
from itertools import product, combinations_with_replacement as CR, permutations as P
from math import comb, perm
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)

ok(perm(10, 3) == 720 and len(list(product(range(10), repeat=3))) == 1000, "S1/S6 lock codes 720 vs 1,000")
codes = ["".join(p) for p in product("abc", repeat=2)]
ok(len(codes) == 9 and len(list(P("abc", 2))) == 6 and sum(c[0] == c[1] for c in codes) == 3, "S4 9 codes, 6 without repeats, 3 extra")
ok([perm(3, 2), perm(10, 3), perm(10, 4), perm(26, 4)] == [6, 720, 5040, 358800] and [3**2, 10**3, 10**4, 26**4] == [9, 1000, 10000, 456976], "S6 table")
ok(len(list(product(range(6), repeat=3))) == 216 and len(list(product("HT", repeat=5))) == 32, "S7 dice 216, coins 32")
ok(len(list(product(range(3), repeat=5))) == 243, "S8 5 jobs to 3 printers = 243 (functions 5 -> 3)")
ok(3**5 == 243 and 5**3 == 125 and 6**4 == 1296 and 4**6 == 4096 and 2**8 == 256 and 8**2 == 64, "S9 base/power table")
ok(26**3 == 17576 and 2**10 == 1024 and 4**6 == 4096 and sum(len(set(p)) < 4 for p in product(range(10), repeat=4)) == 4960, "S10 practice incl. PINs with a repeat 4,960")
cups = list(CR("VCS", 3))
ok(len(cups) == 10 and 3**3 == 27 and comb(3, 3) == 1, "S11/S12 10 cups (27 too many, 1 too few)")
ok(sum(len(set(c)) == 1 for c in cups) == 3 and sum(len(set(c)) == 2 for c in cups) == 6 and sum(len(set(c)) == 3 for c in cups) == 1, "S12 patterns 3 + 6 + 1")
def code(cup):
    return "|".join("*" * cup.count(f) for f in "VCS")
ok(code("VVC") == "**|*|" and code("VCS") == "*|*|*" and code("SSS") == "||***" and code("CCS") == "|**|*", "S17 star-bar codes")
ok(code("CSS") == "|*|**", "S17 notes decode | * | ** = CSS")
rows = {"".join(r) for r in P("***||")}
ok(len(rows) == 10 == comb(5, 3) and {code("".join(c)) for c in cups} == rows, "S18 bijection: 10 codes = 10 cups")
sb = lambda n, r: comb(n + r - 1, r)
ok(all(len(list(CR(range(n), r))) == sb(n, r) for n in range(1, 6) for r in range(0, 7)), "S19 formula matches brute force for n<=5, r<=6")
ok(len(list(CR(range(4), 6))) == 84 == comb(9, 6), "S20 doughnuts 84")
ok([sb(5, 3), sb(3, 5), sb(4, 10), sb(4, 3)] == [35, 21, 286, 20], "S21 table")
dist = [t for t in product(range(8), repeat=3) if sum(t) == 7]
ok(len(dist) == 36 == comb(9, 7), "S23 7 chocolates among 3 = 36")
ok(sum(min(t) >= 1 for t in dist) == 15 == comb(6, 4), "S25 each at least one = 15")
ok(len([t for t in product(range(6), repeat=3) if sum(t) == 5]) == 21 and 3**5 == 243, "S26 identical 21 vs different 243")
ok(sb(4, 10) == 286 and sb(3, 6) == 28 and comb(5, 3) == 10 == len([t for t in product(range(7), repeat=3) if sum(t) == 6 and min(t) >= 1]) and 3**4 == 81 and sb(2, 8) == 9, "S27 practice")
ok(len(list(P("abc", 2))) == 6 and len(list(product("abc", repeat=2))) == 9 and len(list(CR("abc", 2))) == 6 and comb(3, 2) == 3, "S28 grid 6, 9, 3, 6")
ok(perm(5, 3) == 60 and 5**3 == 125 and comb(5, 3) == 10 and sb(5, 3) == 35, "S29 fruit stall 60, 125, 10, 35")
ok(comb(9, 6) == 84 and comb(10, 6) == 210 and comb(7, 5) == 21 and comb(9, 7) == 36 and comb(6, 4) == 15, "S30 mistakes table values")
loops = [(i, j, k) for i in range(1, 5) for j in range(1, 5) for k in range(1, 5) if i <= j <= k]
ok(2**8 == 256 and 4**6 == 4096 and len(loops) == 20 == comb(6, 3) and sb(3, 10) == 66, "S31 computing 256, 4,096, 20, 66")
ok(len([(i, j) for i in (1, 2) for j in (1, 2) if i <= j]) == 3 == comb(3, 2), "S31 notes small case 3")
