# Checks every truth value, witness and counterexample in "DSM : The Predicate Calculus".
# Infinite universes are sampled on a finite window wide enough to hold every witness
# and counterexample the source names; "true for all" claims that need a proof are
# also argued in the comment beside them.
from itertools import product
from fractions import Fraction as Fr
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)
imp = lambda a, b: (not a) or b
TF = [True, False]
Z = range(-60, 61)
N = range(0, 61)

ok(not all(imp(p and q, r) for p, q, r in product(TF, repeat=3)) and (True, True, False) in [v for v in product(TF, repeat=3) if v[0] and v[1] and not v[2]], "S2 p, q ∴ r invalid as propositions")
ok(all(imp(x % 2 == 0, x % 2 == 0) for x in Z), "S3/S20 ∀x (E(x) → D(x)) on integers")
ok((5 > 3) and not (2 > 3), "S5 P(5) true, P(2) false")
ok(not (-1 + 1 > 0) and (1 + 1 > 0) and (1 < 5 < 9), "S6 P(-1,1) false, P(1,1) true, B(5,1,9) true")
ok(not any(x * x == 2 for x in Z) and abs(2 ** 0.5 * 2 ** 0.5 - 2) < 1e-12, "S7 x² = 2: no integer, √2 real")
ok(all(x >= 0 for x in N) and not all(x >= 0 for x in Z) and [x for x in Z if 3 * x + 2 == 8] == [2], "S8 rows 1-3")
ok(not any(2 * x == 1 for x in Z) and 2 * Fr(1, 2) == 1, "S8 rows 4-5 (2x = 1: no integer, 1/2 rational)")
ok(15 % 5 == 0 and (2 < 7) and not (7 < 2) and not any(x > 10 for x in [1, 2, 3]), "S9 practice")
ok(all(x * x >= 0 for x in Z) and (1j) ** 2 == -1, "S10 x² ≥ 0 on reals (sampled); i² = -1 over complex")
ok(not all(x * x > 0 for x in Z) and 0 in Z, "S10 note: x² > 0 fails at x = 0")
ok([x for x in Z if 3 * x + 2 == 8] == [2] and not any(x == x + 3 for x in Z), "S11 witness 2; x = x + 3 never")
U = [1, 2, 3]
ok([x < 3 for x in U] == [True, True, False] and not all(x < 3 for x in U) and any(x < 3 for x in U), "S12 ∀ false (3), ∃ true (1, 2)")
# S14 equivalences over all predicates on a 3-element universe
preds = list(product(TF, repeat=3))
ok(all(all(p[i] and q[i] for i in range(3)) == (all(p) and all(q)) for p in preds for q in preds), "S14 ∀ distributes over ∧")
ok(all(any(p[i] or q[i] for i in range(3)) == (any(p) or any(q)) for p in preds for q in preds), "S14 ∃ distributes over ∨")
ev = lambda x: x % 2 == 0
ok(all(ev(x) or not ev(x) for x in Z) and not all(ev(x) for x in Z) and not all(not ev(x) for x in Z), "S14 ∀ over ∨ fails: even/odd counterexample")
ok(any(ev(x) for x in Z) and any(not ev(x) for x in Z) and not any(ev(x) and not ev(x) for x in Z), "S14 ∃ over ∧ fails: even/odd counterexample")
ok(all(x + 0 == x for x in Z) and [x for x in Z if not x * x > x] == [0, 1] and sorted(x for x in Z if x * x == 49) == [-7, 7]
   and not any(x * x == -1 for x in Z) and all((2 * x) % 2 == 0 for x in Z) and not any(100 < x < 101 for x in range(0, 300)), "S15 all six rows")
# S17: ∃x (S → L) is true as soon as a non-student exists
people = [("student", False), ("non-student", False)]  # nobody studies logic
ok(any(imp(s == "student", l) for s, l in people) and not any(s == "student" and l for s, l in people), "S17 ∃ with → true for a silly reason")
# S18 / S19 / S30 equivalences over all predicate pairs on a 3-element universe
ok(all(all(imp(s[i], not f[i]) for i in range(3)) == (not any(s[i] and f[i] for i in range(3))) for s in preds for f in preds), "S18 no student fails: two forms agree")
ok(all((not all(imp(s[i], p[i]) for i in range(3))) == any(s[i] and not p[i] for i in range(3)) for s in preds for p in preds), "S18/S32 not all: two forms agree")
ok(all((not all(p)) == any(not v for v in p) and (not any(p)) == all(not v for v in p) for p in preds), "S30 quantifier De Morgan")
ok(2 % 2 == 0 and all(not (p % 4 == 0) for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]), "S20 2 is an even prime; no prime divisible by 4")
ok(all((not all(p)) == any(not v for v in p) for p in preds), "S25 ¬∀x H(x) = not everyone is happy")
ok(all(x * x >= 0 for x in Z) and not any(x * x < 0 for x in Z), "S33 row 1: statement true, negation false")
ok(any(p == 2 for p in [2, 3, 5]), "S33 row 2: some prime is even (2), so the negation is false")
ok(all(x + y == y + x for x in Z for y in Z) and sorted((x, y) for x in Z for y in Z if x + y == x * y) == [(0, 0), (2, 2)], "S34 commutativity; x + y = xy only at (0,0) and (2,2)")
ok(all(any(x + y == 0 for y in Z) for x in Z) and not any(all(x + y == 0 for y in Z) for x in Z), "S35 ∀x∃y true, ∃x∀y false")
ok(all(Fr(0) * y != 1 for y in [Fr(1), Fr(5), Fr(-3, 7), Fr(10**6)]) and all(x * (1 / x) == 1 for x in [Fr(2), Fr(-3, 7)]), "S37 x = 0 has no y with xy = 1 (0·y = 0), so ¬∀x∃y (xy = 1) holds")
ok(all((x + 1) > x for x in Z) and all(not (y > y) for y in Z), "S39 rows 5-6: y = x + 1 is a witness for every x; for any y, x = y is a counterexample, so no y beats every x")
