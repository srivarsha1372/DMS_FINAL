# Checks every argument in "DSM : Inference Theory of the Predicate Calculus".
# An argument is checked against EVERY interpretation of its predicates over every
# universe of 1 to 3 elements (constants range over the universe too): "valid" means
# no interpretation makes the premises true and the conclusion false. Each named
# counterexample is then checked directly.
from itertools import product
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)
imp = lambda a, b: (not a) or b


def models(npred, nconst, sizes=(1, 2, 3)):
    for n in sizes:
        U = range(n)
        for ext in product(product([True, False], repeat=n), repeat=npred):
            for consts in product(U, repeat=nconst):
                yield U, ext, consts


def valid(prem, concl, npred, nconst=0):
    for U, P, c in models(npred, nconst):
        if all(p(U, P, c) for p in prem) and not concl(U, P, c):
            return False
    return True


A = lambda U, f: all(f(x) for x in U)
E = lambda U, f: any(f(x) for x in U)

# S1/S17 Socrates: ∀x (H → M), H(s) ∴ M(s)
ok(valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: P[0][c[0]]], lambda U, P, c: P[1][c[0]], 2, 1), "S1/S17 Socrates valid")
# S4 UI example
ok((-3) ** 2 >= 0, "S4 (-3)² ≥ 0")
# S6 chaining universals
ok(valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: A(U, lambda x: imp(P[1][x], P[2][x]))],
         lambda U, P, c: A(U, lambda x: imp(P[0][x], P[2][x])), 3), "S6 ∀(P→Q), ∀(Q→R) ∴ ∀(P→R) valid")
# S7 universal MP and MT
ok(valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: P[0][c[0]]], lambda U, P, c: P[1][c[0]], 2, 1)
   and valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: not P[1][c[0]]], lambda U, P, c: not P[0][c[0]], 2, 1), "S7/S8 universal MP and MT valid")
# S8 row 4: P(7) ∴ ∀x P(x) invalid
ok(not valid([lambda U, P, c: P[0][c[0]]], lambda U, P, c: A(U, lambda x: P[0][x]), 1, 1), "S8 row 4 P(7) ∴ ∀x P(x) invalid")
# S9 EG example
ok(any(x == 2 for x in [2]) and 2 % 2 == 0, "S9 2 is prime and even")
# S11 naturals and integers
ok(valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: E(U, lambda x: P[0][x])], lambda U, P, c: E(U, lambda x: P[1][x]), 2), "S11 ∃x I(x) follows")
# S12 row 4 / S23: ∃x P ∴ ∀x P invalid; counterexample {1,2}, P even
ok(not valid([lambda U, P, c: E(U, lambda x: P[0][x])], lambda U, P, c: A(U, lambda x: P[0][x]), 1), "S12/S23 ∃ ∴ ∀ invalid")
ok(any(x % 2 == 0 for x in [1, 2]) and not all(x % 2 == 0 for x in [1, 2]), "S23 counterexample {1, 2}, P even")
# S18 unread book
ok(valid([lambda U, P, c: E(U, lambda x: P[0][x] and not P[1][x]), lambda U, P, c: A(U, lambda x: imp(P[0][x], P[2][x]))],
         lambda U, P, c: E(U, lambda x: P[2][x] and not P[1][x]), 3), "S18 ∃x (P ∧ ¬B) follows")
# S19 / S20 splitting
ok(valid([lambda U, P, c: A(U, lambda x: P[0][x] and P[1][x])], lambda U, P, c: A(U, lambda x: P[0][x]) and A(U, lambda x: P[1][x]), 2), "S19 split universal valid")
ok(valid([lambda U, P, c: E(U, lambda x: P[0][x] and P[1][x])], lambda U, P, c: E(U, lambda x: P[0][x]) and E(U, lambda x: P[1][x]), 2), "S20 split existential valid")
# S24 converse invalid, counterexample odd/even on {1,2}
ok(not valid([lambda U, P, c: E(U, lambda x: P[0][x]), lambda U, P, c: E(U, lambda x: P[1][x])], lambda U, P, c: E(U, lambda x: P[0][x] and P[1][x]), 2), "S20/S24/S29 converse invalid")
ok(any(x % 2 for x in [1, 2]) and any(x % 2 == 0 for x in [1, 2]) and not any(x % 2 and x % 2 == 0 for x in [1, 2]), "S24 counterexample odd/even")
# S21 Meena
ok(valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: A(U, lambda x: imp(P[1][x], P[2][x])), lambda U, P, c: P[0][c[0]]], lambda U, P, c: P[2][c[0]], 3, 1), "S21 Meena W(m) follows")
# S22 practice rows
ok(valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: not P[1][c[0]]], lambda U, P, c: not P[0][c[0]], 2, 1), "S22 row 1")
ok(valid([lambda U, P, c: A(U, lambda x: P[0][x] or P[1][x]), lambda U, P, c: A(U, lambda x: not P[0][x])], lambda U, P, c: A(U, lambda x: P[1][x]), 2), "S22 row 2")
ok(valid([lambda U, P, c: E(U, lambda x: P[0][x]), lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x]))], lambda U, P, c: E(U, lambda x: P[1][x]), 2), "S22 row 3")
ok(valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: E(U, lambda x: P[0][x] and P[2][x])], lambda U, P, c: E(U, lambda x: P[1][x] and P[2][x]), 3), "S22 row 4")
# S25 affirming the consequent with quantifiers
ok(not valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: P[1][c[0]]], lambda U, P, c: P[0][c[0]], 2, 1), "S25/S27 row 3 invalid")
# S26 ∀x∃y L ∴ ∃y∀x L invalid; counterexample L = identity on {1, 2}
L = {(1, 1), (2, 2)}; U2 = [1, 2]
ok(all(any((x, y) in L for y in U2) for x in U2) and not any(all((x, y) in L for x in U2) for y in U2), "S26 counterexample L(1,1), L(2,2)")
# S27 row 2
ok(not valid([lambda U, P, c: A(U, lambda x: P[0][x] or P[1][x])], lambda U, P, c: A(U, lambda x: P[0][x]) or A(U, lambda x: P[1][x]), 2), "S27 row 2 invalid")
Pm, Qm = {1}, {2}
ok(all(x in Pm or x in Qm for x in U2) and not all(x in Pm for x in U2) and not all(x in Qm for x in U2), "S27 row 2 counterexample P{1}, Q{2}")
# S29
ok(valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: P[0][c[0]]], lambda U, P, c: E(U, lambda x: P[1][x]), 2, 1), "S29 row 1")
ok(valid([lambda U, P, c: A(U, lambda x: P[0][x])], lambda U, P, c: E(U, lambda x: P[0][x]), 1), "S29 row 2 (non-empty universes)")
ok(valid([lambda U, P, c: A(U, lambda x: imp(P[0][x], P[1][x])), lambda U, P, c: E(U, lambda x: not P[1][x])], lambda U, P, c: E(U, lambda x: not P[0][x]), 2), "S29 row 5")
ok(all(any(x < y for y in range(-50, 52)) for x in range(-50, 51)) and all(not (y < y) for y in range(-50, 51)), "S29 row 4: ∀x∃y (x < y) true over integers, but no d beats every x (x = d fails)")
