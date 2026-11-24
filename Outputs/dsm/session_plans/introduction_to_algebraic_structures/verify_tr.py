# Recomputes every closure claim, table and example in "DSM : Introduction to Algebraic Structures".
from fractions import Fraction as F
from itertools import product
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)
R = range(-30, 31); N = range(0, 40)
closed = lambda S, op, dom: all(op(a, b) in S for a in dom for b in dom)
ok(3 + 5 == 8 and (1 and 0) == 0, "S2 examples")
ok(max(2, 9, 4) == 9, "S3 ternary max")
ok(3 - 5 == -2 and -2 not in N, "S5/S6 N not closed under -")
ev = lambda x: x % 2 == 0
ok(all(ev(a + b) for a in R for b in R if ev(a) and ev(b)), "S7 even + closed")
ok(1 + 3 == 4 and ev(4), "S7 odd + counterexample")
ok(all(not ev(a * b) for a in R for b in R if not ev(a) and not ev(b)), "S7 odd x closed")
ok(all((2*m+1)*(2*n+1) == 2*(2*m*n+m+n)+1 for m in R for n in R), "S7 odd x identity")
ok(closed(set(range(0, 200)), lambda a, b: a + b, range(0, 100)), "S8 N + closed (sample)")
ok(all(a - b in set(range(-60, 61)) for a in R for b in R), "S8 Z - closed (sample)")
ok(F(1, 2) == F(1, 2) and F(1, 2).denominator != 1, "S8 Z / not closed")
Q = [F(p, q) for p in range(-6, 7) for q in range(1, 7) if p]
ok(all(a / b != 0 and isinstance(a / b, F) for a in Q for b in Q), "S8 Q without 0 closed under /")
T = {-1, 0, 1}
ok(not closed(T, lambda a, b: a + b, T) and 1 + 1 == 2, "S8 {-1,0,1} + not closed")
ok(closed(T, lambda a, b: a * b, T), "S8 {-1,0,1} x closed")
S4 = {0, 1, 2, 3}
table = [[(a + b) % 4 for b in range(4)] for a in range(4)]
ok(table == [[0,1,2,3],[1,2,3,0],[2,3,0,1],[3,0,1,2]], "S9 +4 table")
ok(closed(S4, lambda a, b: (a + b) % 4, S4) and 2 + 3 == 5, "S9 closed mod 4, 2+3=5")
ok((9 + 5) % 12 == 2, "S9 clock 9 + 5 = 2")
B = {0, 1}
rows = [(a, b, a | b, a & b, 1 - a) for a, b in product((0, 1), repeat=2)]
ok(rows == [(0,0,0,0,1),(0,1,1,0,1),(1,0,1,0,0),(1,1,1,1,0)], "S11 truth table")
ok(1 + 1 == 2 and (1 ^ 1) == 0 and closed(B, lambda a, b: a ^ b, B), "S11/S14 + vs XOR")
U = frozenset('ab'); A, Bs = frozenset('a'), frozenset('b')
ok(A | Bs == U and A & Bs == frozenset() and U - A == Bs, "S12 power set ops")
ok('01' + '110' == '01110', "S13 concatenation")
ok(all(a ** b >= 1 for a in range(1, 8) for b in range(1, 8)), "S14 a^b positive")
ok(F(1 + 2, 2) == F(3, 2), "S14 (1+2)/2 = 1.5")
i = 1j; G = {1, -1, i, -i}
ok(all(x * y in G for x in G for y in G) and i * i == -1 and i * -i == 1, "S14 {1,-1,i,-i} closed")
ok(7 / 2 == 3.5 and 7 // 2 == 3 and "ab" + "cd" == "abcd", "S17 Python results")
ok((2**31 - 1 + 1) % 2**32 == 2**31, "S17 32-bit wrap: 2^31 - 1 + 1 leaves int range")
