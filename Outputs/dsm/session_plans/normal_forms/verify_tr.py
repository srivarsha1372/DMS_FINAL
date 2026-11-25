# Truth-table check of every equivalence, PDNF and PCNF in "DSM : Normal Forms".
from itertools import product
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)
imp = lambda a, b: (not a) or b
TF = [True, False]
def eq(f, g, n): return all(f(*v) == g(*v) for v in product(TF, repeat=n))
def pdnf(f, n): return {v for v in product(TF, repeat=n) if f(*v)}
def pcnf(f, n): return {v for v in product(TF, repeat=n) if not f(*v)}
T, F = True, False

ok(eq(lambda p, q: imp(p, q), lambda p, q: (not p) or q, 2) and eq(lambda p, q: imp(p, q), lambda p, q: imp(not q, not p), 2), "S1 P->Q = ~PvQ = ~Q->~P")
ok([imp(p, q) for p, q in product(TF, repeat=2)] == [T, F, T, T], "S1 fingerprint T,F,T,T (rows TT,TF,FT,FF)")
ok(eq(lambda p, q: p == q, lambda p, q: (p and q) or (not p and not q), 2) and eq(lambda p, q: p == q, lambda p, q: imp(p, q) and imp(q, p), 2), "S3 biconditional law")
ok(eq(lambda p, q, r: p and (q or r), lambda p, q, r: (p and q) or (p and r), 3) and eq(lambda p, q, r: p or (q and r), lambda p, q, r: (p or q) and (p or r), 3), "S3 distributive laws")
ok(eq(lambda p, q: p or (p and q), lambda p, q: p, 2) and eq(lambda p, q: (p and q) or (p and not q), lambda p, q: p, 2), "S10 absorption DNFs")
ok(eq(lambda p, q, r: (not imp(p, q)) or (p and r), lambda p, q, r: (p and not q) or (p and r), 3) and eq(lambda p, q, r: (p and not q) or (p and r), lambda p, q, r: p and ((not q) or r), 3), "S12 DNF and its CNF")
ok(eq(lambda p, q, r: (p and q) or not r, lambda p, q, r: (p or not r) and (q or not r), 3), "S13 CNF")
ok(eq(lambda p, q: p == q, lambda p, q: ((not p) or q) and (p or not q), 2), "S14 CNF of P<->Q")
ok(eq(lambda p, q: not (p or q), lambda p, q: (not p) and (not q), 2) and eq(lambda p, q, r: imp(not (p and q), r), lambda p, q, r: (p or r) and (q or r), 3) and eq(lambda p, q, r: p and imp(q, r), lambda p, q, r: (p and not q) or (p and r), 3), "S15 practice")
ok(pdnf(lambda p, q: p or q, 2) == {(T, T), (T, F), (F, T)}, "S17 PDNF of PvQ")
ok(pdnf(lambda p, q: p or ((not p) and q), 2) == {(T, T), (T, F), (F, T)}, "S19 PDNF by algebra")
ok(pdnf(lambda p, q: p, 2) == {(T, T), (T, F)} and pdnf(lambda p, q: (not p) or q, 2) == {(T, T), (F, T), (F, F)}
   and pdnf(lambda p, q, r: p and (q or r), 3) == {(T, T, T), (T, T, F), (T, F, T)}, "S20 practice PDNFs")
f22 = lambda p, q: (not (p or q)) == (p and q)
ok(pdnf(f22, 2) == {(T, F), (F, T)} and pcnf(f22, 2) == {(T, T), (F, F)}, "S22 classic PDNF/PCNF")
f23 = lambda p, q, r: (p and q) or ((not p) and r)
ok(pdnf(f23, 3) == {(T, T, T), (T, T, F), (F, T, T), (F, F, T)}, "S23 PDNF")
ok(pcnf(f23, 3) == {(T, F, T), (T, F, F), (F, T, F), (F, F, F)}, "S23 PCNF")
idx = lambda v: int(''.join('1' if x else '0' for x in v), 2)
ok(idx((T, T, F)) == 6 and sorted(idx(v) for v in pdnf(f23, 3)) == [1, 3, 6, 7], "S25 TTF = 6, sigma(1,3,6,7)")
ok(pdnf(lambda p, q: imp(p, q), 2) == {(T, T), (F, T), (F, F)} and pcnf(lambda p, q: imp(p, q), 2) == {(T, F)}, "S24 P->Q")
ok(pdnf(lambda p, q: p == q, 2) == {(T, T), (F, F)} and pcnf(lambda p, q: p == q, 2) == {(T, F), (F, T)}, "S24 P<->Q")
ok(pdnf(lambda p, q: p and not q, 2) == {(T, F)} and pcnf(lambda p, q: p and not q, 2) == {(T, T), (F, T), (F, F)}, "S24 P^~Q")
ok(pdnf(lambda p, q: imp(not q, not p), 2) == pdnf(lambda p, q: imp(p, q), 2) == pdnf(lambda p, q: (not p) or q, 2), "S26 three formulas share one PDNF")
ok(all(len(pdnf(f, 2)) + len(pcnf(f, 2)) == 4 for f in [f22, lambda p, q: imp(p, q), lambda p, q: p and not q]), "S26 minterms + maxterms = 2^n")
ok(pcnf(lambda p, q: (not p) or q, 2) == {(T, F)} and eq(lambda p, q: not (p and q), lambda p, q: (not p) or (not q), 2), "S27 maxterm ~PvQ false only at TF; De Morgan")
mix = lambda p, q: imp(p, q) and imp(q, p)
ok(pdnf(mix, 2) == pdnf(lambda p, q: p == q, 2) and len(pdnf(mix, 2)) == 2, "S28 mixed practice = P<->Q, 2 true rows")
