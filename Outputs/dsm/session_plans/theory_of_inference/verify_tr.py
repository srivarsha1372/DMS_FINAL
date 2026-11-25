# Checks every validity claim, counterexample and proof line in
# "DSM : Theory of Inference for the Statement Calculus" by brute force.
from itertools import product
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)
imp = lambda a, b: (not a) or b
TF = [True, False]
T, F = True, False

def valid(prem, concl, n):
    return all(concl(*v) for v in product(TF, repeat=n) if all(p(*v) for p in prem))

def counter(prem, concl, n):
    return [v for v in product(TF, repeat=n) if all(p(*v) for p in prem) and not concl(*v)]

def follows(prem, concl, n):  # a single proof line follows from the lines it cites
    return valid(prem, concl, n)

# S3/S4 rain argument as a tautology
ok(all(imp(p and imp(p, q), q) for p, q in product(TF, repeat=2)), "S3 (p ∧ (p → q)) → q is a tautology")
# S5
ok(valid([lambda p, q: imp(p, q), lambda p, q: p], lambda p, q: q, 2), "S5 row 1 has the MP form (valid)")
ok(not valid([lambda p, q: imp(p, q), lambda p, q: q], lambda p, q: p, 2), "S5 row 2 cat argument invalid")
# S6 fallacies, counterexample p F, q T
ok(counter([lambda p, q: imp(p, q), lambda p, q: q], lambda p, q: p, 2) == [(F, T)], "S6/S9 affirming the consequent: only counterexample p=F, q=T")
ok(counter([lambda p, q: imp(p, q), lambda p, q: not p], lambda p, q: not q, 2) == [(F, T)], "S6 denying the antecedent: only counterexample p=F, q=T")
# S8 MT table: one critical row FF
crit = [v for v in product(TF, repeat=2) if imp(*v) and not v[1]]
ok(crit == [(F, F)] and valid([lambda p, q: imp(p, q), lambda p, q: not q], lambda p, q: not p, 2), "S8 MT: single critical row FF, valid")
crit9 = [v for v in product(TF, repeat=2) if imp(*v) and v[1]]
ok(crit9 == [(T, T), (F, T)], "S9 critical rows TT and FT")
# S10
ok(valid([lambda p, q: p or q, lambda p, q: not p], lambda p, q: q, 2), "S10 row 1 valid")
ok(counter([lambda p, q: imp(p, q), lambda p, q: not p], lambda p, q: not q, 2) == [(F, T)], "S10 row 2 invalid p=F q=T")
ok(valid([lambda p, q, r: imp(p, q), lambda p, q, r: imp(q, r)], lambda p, q, r: imp(p, r), 3), "S10 row 3 valid")
ok(counter([lambda p, q: p or q], lambda p, q: p, 2) == [(F, T)], "S10 row 4 invalid p=F q=T")
# S11 rules table: each rule valid
rules = {
    'MP': ([lambda p, q, r: p, lambda p, q, r: imp(p, q)], lambda p, q, r: q),
    'MT': ([lambda p, q, r: not q, lambda p, q, r: imp(p, q)], lambda p, q, r: not p),
    'HS': ([lambda p, q, r: imp(p, q), lambda p, q, r: imp(q, r)], lambda p, q, r: imp(p, r)),
    'DS': ([lambda p, q, r: p or q, lambda p, q, r: not p], lambda p, q, r: q),
    'Add': ([lambda p, q, r: p], lambda p, q, r: p or q),
    'Simp': ([lambda p, q, r: p and q], lambda p, q, r: p),
    'Conj': ([lambda p, q, r: p, lambda p, q, r: q], lambda p, q, r: p and q),
    'Res': ([lambda p, q, r: p or q, lambda p, q, r: (not p) or r], lambda p, q, r: q or r),
}
ok(all(valid(pr, c, 3) for pr, c in rules.values()), "S11 all eight rules are valid")
ok(valid([lambda p, q: p or q, lambda p, q: (not p) or q], lambda p, q: q, 2), "S16 note: q = r gives p ∨ q, ¬p ∨ q ∴ q")
ok(all(imp(not q, not p) == imp(p, q) for p, q in product(TF, repeat=2)), "S13 contrapositive equivalence")
# S19 canoe: p q r s t
canoe = [lambda p, q, r, s, t: (not p) and q, lambda p, q, r, s, t: imp(r, p), lambda p, q, r, s, t: imp(not r, s), lambda p, q, r, s, t: imp(s, t)]
ok(valid(canoe, lambda p, q, r, s, t: t, 5), "S19 canoe argument valid")
ok(follows([lambda p, r: imp(r, p), lambda p, r: not p], lambda p, r: not r, 2), "S19 step 4 MT (3),(2)")
# S20 saturday: p q r s t
sat = [lambda p, q, r, s, t: imp(p, q or r), lambda p, q, r, s, t: imp(s, not q), lambda p, q, r, s, t: p and s]
ok(valid(sat, lambda p, q, r, s, t: r or t, 5) and valid(sat, lambda p, q, r, s, t: r, 5), "S20 Saturday argument valid, r already follows (step 8)")
# S21 Holmes: b t o w l k
hol = [lambda b, t, o, w, l, k: imp(b, t), lambda b, t, o, w, l, k: not t, lambda b, t, o, w, l, k: imp(not b, o or w),
       lambda b, t, o, w, l, k: imp(o, l), lambda b, t, o, w, l, k: imp(k, not l), lambda b, t, o, w, l, k: k]
ok(valid(hol, lambda b, t, o, w, l, k: w, 6), "S21 Holmes argument valid")
ok(all(valid(hol, c, 6) for c in [lambda b, t, o, w, l, k: not b, lambda b, t, o, w, l, k: o or w, lambda b, t, o, w, l, k: not l, lambda b, t, o, w, l, k: not o]), "S21 every intermediate line follows")
# S22 resolution proof
pr22 = [lambda P, Q, R, S: imp(P, Q), lambda P, Q, R, S: imp(not P, R), lambda P, Q, R, S: imp(Q, S)]
ok(valid(pr22, lambda P, Q, R, S: imp(not R, S), 4), "S22 ¬R → S follows")
ok(valid([lambda P, Q, R: (not P) or Q, lambda P, Q, R: P or R], lambda P, Q, R: Q or R, 3) and all((q or r) == imp(not r, q) for q, r in product(TF, repeat=2)), "S22 steps 3 and 4")
# S23
ok(valid([lambda p, q, r: imp(p, q), lambda p, q, r: imp(q, r), lambda p, q, r: not r], lambda p, q, r: not p, 3), "S23 ¬p follows")
ok(valid([lambda p, q, r: imp(q, r), lambda p, q, r: not r], lambda p, q, r: not q, 3), "S23 alternative: ¬q by MT")
# S24 derive: f w h m t
d24 = [lambda f, w, h, m, t: imp(f, w), lambda f, w, h, m, t: imp(h, f), lambda f, w, h, m, t: h, lambda f, w, h, m, t: (not m) or t, lambda f, w, h, m, t: m]
ok(valid(d24, lambda f, w, h, m, t: w, 5) and valid(d24, lambda f, w, h, m, t: t, 5) and valid(d24, lambda f, w, h, m, t: f, 5), "S24 f, w and t follow")
# S25 CP example
ok(valid([lambda p, q, r: imp(p, imp(q, r)), lambda p, q, r: q], lambda p, q, r: imp(p, r), 3), "S25 CP example p → r follows")
# S26
ok(imp(3 < 0, 9 > 3) and all(imp(a > b, a ** 0 >= b ** 0) for a in range(1, 6) for b in range(1, 6)), "S26 vacuous and trivial examples true")
# S28
ok(counter([lambda p, q, r: imp(p, q), lambda p, q, r: imp(r, q)], lambda p, q, r: imp(p, r), 3) == [(T, T, F)], "S28 row 1 invalid, only counterexample p=T q=T r=F")
ok(valid([lambda p, q, r, s: p and q, lambda p, q, r, s: imp(p, r)], lambda p, q, r, s: r or s, 4), "S28 row 2")
ok(valid([lambda p, q, r: p or q, lambda p, q, r: (not q) or r, lambda p, q, r: not r], lambda p, q, r: p, 3)
   and valid([lambda p, q, r: p or q, lambda p, q, r: (not q) or r], lambda p, q, r: p or r, 3), "S28 row 3 (resolution gives p ∨ r)")
ok(valid([lambda a, b, c: imp(a, b), lambda a, b, c: not b, lambda a, b, c: a or c], lambda a, b, c: (not a) and c, 3), "S28 row 4 ¬a and c")
