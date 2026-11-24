# Recomputes every example in "DSM : Algebraic Systems".
from fractions import Fraction as F
from itertools import product
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)
Z = range(-12, 13)
assoc = lambda f, D: all(f(f(a, b), c) == f(a, f(b, c)) for a, b, c in product(D, repeat=3))
comm = lambda f, D: all(f(a, b) == f(b, a) for a, b in product(D, repeat=2))
s1 = lambda a, b: a + b + a * b      # a + b + ab
s2 = lambda a, b: a + 2 * b          # a + 2b
s3 = lambda a, b: a + b - 3          # a + b - 3
s4 = lambda a, b: a + b + 1          # a + b + 1
ok(s1(2, 3) == 11, "S3 2*3 = 11")
ok(2 - 5 == -3 and all((2*m)*(2*n) == 2*(2*m*n) for m in Z for n in Z) and 2 + 3 == 5, "S4 closure rows")
t4 = [[a * b % 4 for b in range(4)] for a in range(4)]
ok(t4 == [[0,0,0,0],[0,1,2,3],[0,2,0,2],[0,3,2,1]] and t4[2][3] == 2, "S5 x4 table, 2x3 = 2")
ok((8-4)-2 == 2 and 8-(4-2) == 6 and F(8,4)/2 == 1 and F(8)/(F(4)/2) == 4, "S6 - and / not associative")
ok(assoc(s1, Z), "S7 a+b+ab associative")
ok(not assoc(s2, Z) and s2(s2(0, 0), 1) == 2 and s2(0, s2(0, 1)) == 4, "S7 a+2b not associative, 2 vs 4")
ok("ab"+"cd" == "abcd" and "cd"+"ab" == "cdab" and s2(1, 0) == 1 and s2(0, 1) == 2, "S8 non-commutative examples")
ok(all(t4[a][b] == t4[b][a] for a in range(4) for b in range(4)), "S8 x4 table symmetric")
ab = lambda a, b: abs(a - b)
ok(ab(ab(1, 2), 3) == 2 and ab(1, ab(2, 3)) == 0 and comm(ab, Z), "S9 |a-b| commutative, not associative")
ok(all(0 | a == a for a in (0, 1)), "S10 identity of OR is 0")
ok(all(s3(3, a) == a and s3(a, 3) == a for a in Z), "S12 identity of a+b-3 is 3")
ok(all(s1(0, a) == a and s1(a, 0) == a for a in Z), "S12 identity of a+b+ab is 0")
ok(all(s3(a, 6 - a) == 3 for a in Z) and s3(5, 1) == 3, "S14 inverse 6 - a, 5^-1 = 1")
inv1 = [a for a in range(-50, 51) if a != -1 and (-a) % (1 + a) == 0]
ok(inv1 == [-2, 0] and s1(-2, -2) == 0, "S14 a+b+ab: only 0 and -2 have inverses")
t5 = [[a * b % 5 for b in range(1, 5)] for a in range(1, 5)]
ok(t5 == [[1,2,3,4],[2,4,1,3],[3,1,4,2],[4,3,2,1]], "S15 x5 table")
ok({a: [b for b in range(1, 5) if a * b % 5 == 1][0] for a in range(1, 5)} == {1: 1, 2: 3, 3: 2, 4: 4}, "S15 inverses")
ok([a for a in range(4) if 1 not in t4[a]] == [0, 2], "S15 note: 0 and 2 have no inverse under x4")
ok([a * a % 4 for a in range(4)] == [0,1,0,1] and [a * a % 6 for a in range(6)] == [0,1,4,3,4,1], "S17 diagonals")
ok([a for a in range(6) if a * a % 6 == a] == [0, 1, 3, 4], "S17 x6 idempotents")
ok([a for a in Z if s3(a, a) == a] == [3], "S17/S21 a+b-3 idempotent only 3")
ok([a for a in Z if a + a == a] == [0] and [a for a in Z if a * a == a] == [0, 1], "S16 + and x idempotents")
ok(assoc(s3, Z) and comm(s3, Z) and all(s3(s3(a, b), c) == a + b + c - 6 for a, b, c in product(Z, repeat=3)), "S21 a+b-3 associative, commutative")
op = {('x','x'):'y', ('x','y'):'y', ('y','x'):'y', ('y','y'):'x'}
f = lambda a, b: op[(a, b)]
ok(comm(f, 'xy') and f(f('x','x'),'y') == 'x' and f('x', f('x','y')) == 'y' and not assoc(f, 'xy'), "S22 table: commutative, not associative")
ok(not any(all(f(e, a) == a and f(a, e) == a for a in 'xy') for e in 'xy') and f('x','x') != 'x' and f('y','y') != 'y', "S22 no identity, not idempotent")
avg = lambda a, b: F(a + b, 2)
ok(avg(avg(0, 0), 4) == 2 and avg(0, avg(0, 4)) == 1 and all(avg(a, a) == a for a in Z), "S23 average")
ok(assoc(s4, Z) and all(s4(s4(a, b), c) == a + b + c + 2 for a, b, c in product(Z, repeat=3)), "S24 associative, a+b+c+2")
ok(all(s4(-1, a) == a == s4(a, -1) for a in Z) and all(s4(a, -a - 2) == -1 for a in Z) and s4(3, -5) == -1, "S24 identity -1, inverse -a-2")
ok([a for a in Z if s4(a, a) == a] == [-1], "S24 idempotent only -1")
mx = lambda a, b: max(a, b); N = range(0, 15)
ok(assoc(mx, N) and comm(mx, N) and all(mx(0, a) == a for a in N) and [a for a in N if any(mx(a, b) == 0 for b in N)] == [0], "S19 (N, max)")
ok([a for a in (0, 1) if any(a & b == 1 for b in (0, 1))] == [1], "S19 ({0,1}, AND): only 1 has an inverse")
