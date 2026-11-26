# Recomputes every count in "DSM : The Principle of Exclusion", by brute force
# (direct counting over the integers, strings, arrangements and distributions)
# and by the inclusion-exclusion formula, and checks the two agree.
from itertools import permutations as P, product
from math import factorial as f, e
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)

div = lambda n, *ks: sum(1 for x in range(1, n + 1) if any(x % k == 0 for k in ks))
ok(10 + 8 - 3 == 15, "S1 clubs 15")
ok(25 + 18 - 10 == 33 and 40 - 33 == 7 and 25 - 10 == 15 and 18 - 10 == 8 and 15 + 10 + 8 + 7 == 40, "S6 sports 33, 7, 15, 8")
ok([100 // 2, 100 // 3, 100 // 6] == [50, 33, 16], "S7 floors")
ok(div(100, 2, 3) == 67 == 50 + 33 - 16 and 100 - 67 == 33, "S8 divisible by 2 or 3: 67; neither 33")
ok(50 - 16 == 34 and 33 - 16 == 17 and 34 + 16 + 17 + 33 == 100, "S8 Venn regions 34, 16, 17, 33")
ok(div(200, 4, 6) == 67 and 50 - div(50, 3, 5) == 27, "S9 rows 1-2")
bits = ["".join(b) for b in product("01", repeat=8)]
ok(sum(b[0] == "1" or b.endswith("00") for b in bits) == 160, "S9 bit strings 160")
ok(60 - (35 + 30 - 12) == 7, "S9 tea/coffee neither 7")
# S10: each region counted once
ok(all(sum((-1) ** (k + 1) * __import__("math").comb(m, k) for k in range(1, m + 1)) == 1 for m in (1, 2, 3, 4, 5)), "S10/S17 an element in m sets is counted exactly once")
ok(45 + 40 + 35 - 15 - 12 - 10 + 5 == 88 and 100 - 88 == 12, "S12 survey 88, none 12")
reg = dict(all3=5, MP=15 - 5, PC=12 - 5, MC=10 - 5)
reg["M"] = 45 - reg["MP"] - reg["MC"] - 5; reg["P"] = 40 - reg["MP"] - reg["PC"] - 5; reg["C"] = 35 - reg["PC"] - reg["MC"] - 5
ok([reg[k] for k in ("all3", "MP", "PC", "MC", "M", "P", "C")] == [5, 10, 7, 5, 25, 18, 18] and sum(reg.values()) == 88, "S13 regions 5,10,7,5,25,18,18 total 88")
ok([1000 // k for k in (3, 5, 7, 15, 21, 35, 105)] == [333, 200, 142, 66, 47, 28, 9] and div(1000, 3, 5, 7) == 543 and 1000 - 543 == 457, "S14 3, 5 or 7: 543; none 457")
ok(50 - (30 + 25 + 20 - 12 - 10 - 8) == 5, "S15 all three 5")
ok(div(100, 2, 3, 5) == 74 and 100 - 74 == 26, "S16 rows 1-2")
ok(20 + 15 + 10 - 12 + 2 == 35 and 10 + 7 + 5 == 22, "S16 rows 3-4")
perms5 = list(P(range(1, 6)))
ok(sum(p[0] != 1 and p[1] != 2 for p in perms5) == 78 and 24 + 24 - 6 == 42, "S18 forbidden positions 78")
def onto(gifts, kids):
    return sum(len(set(a)) == kids for a in product(range(kids), repeat=gifts))
ok(onto(5, 3) == 150 and 3 ** 5 - 3 * 32 + 3 * 1 == 150, "S19 5 gifts to 3 children 150")
pins = list(product(range(10), repeat=4))
ok(sum(0 in p and 1 in p for p in pins) == 974 and 9 ** 4 == 6561 and 8 ** 4 == 4096, "S20 PINs with a 0 and a 1: 974")
abcd = list(P("ABCD"))
ok(sum(p[0] != "A" and p[-1] != "B" for p in abcd) == 14, "S21 row 1: 14")
ok(onto(4, 2) == 14 and onto(4, 3) == 36, "S21 rows 2-3: 14, 36")
ok(sum(7 in s and 8 in s for s in product(range(10), repeat=3)) == 54, "S21 row 4: 54")
def D(n):
    return sum(all(p[i] != i for i in range(n)) for p in P(range(n)))
ok([D(n) for n in range(1, 7)] == [0, 1, 2, 9, 44, 265], "S23/S25 D1..D6 by brute force: 0, 1, 2, 9, 44, 265")
ok(sorted("".join(str(x + 1) for x in p) for p in P(range(3)) if all(p[i] != i for i in range(3))) == ["231", "312"], "S23 derangements of 3: 231, 312")
from math import comb
ok(all(D(n) == sum((-1) ** k * comb(n, k) * f(n - k) for k in range(n + 1)) for n in range(1, 8)) and all(comb(n, k) * f(n - k) == f(n) // f(k) for n in range(8) for k in range(n + 1)), "S24 formula and C(n,k)(n-k)! = n!/k!")
from fractions import Fraction as Fr
ok(f(4) * (1 - 1 + Fr(1, 2) - Fr(1, 6) + Fr(1, 24)) == 9 and 120 * (Fr(1, 2) - Fr(1, 6) + Fr(1, 24) - Fr(1, 120)) == 44, "S25 D4 and D5 from the formula (exact fractions)")
ratios = [round(D(n) / f(n), 4) for n in range(3, 8)]
ok(ratios == [0.3333, 0.375, 0.3667, 0.3681, 0.3679] and abs(1 / e - 0.3679) < 0.0001, "S26 ratios approach 1/e")
ok(D(5) == 44 and D(6) == 265 and D(4) == 9 and sum(sum(p[i] == i for i in range(5)) == 1 for p in P(range(5))) == 45, "S27 practice incl. exactly one right 45")
ok(div(60, 3, 4) == 30 and 60 - div(60, 2, 3, 5) == 16 and (18 - 8) + (15 - 8) == 17 and onto(3, 3) == 6 == f(3) and D(5) == 44, "S30 mixed practice")
ok(500 + 300 - 120 == 680 and 100 - div(100, 2, 3, 5) == 26, "S31 computing")
