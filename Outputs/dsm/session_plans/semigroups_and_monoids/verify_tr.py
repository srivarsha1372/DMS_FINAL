# Recomputes every example in "DSM : Semigroups and Monoids".
from fractions import Fraction as F
from itertools import product
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)
Z = range(-8, 9); ZP = range(1, 12); N = range(0, 12)
assoc = lambda f, D: all(f(f(a, b), c) == f(a, f(b, c)) for a, b, c in product(D, repeat=3))
ident = lambda f, D: [e for e in D if all(f(e, a) == a == f(a, e) for a in D)]
ok(2 * 3 == 3 + 3 and (2 + 3) == 5, "S3 (Z,+): a^2 * a^3 = 5a")
ok(assoc(max, Z) and assoc(lambda a, b: a, Z) and ident(lambda a, b: a, Z) == [], "S4 max and keep-the-first associative; keep-the-first no identity")
ok(ident(lambda a, b: a + b, ZP) == [], "S4 (Z+,+) no identity")
ok(2 - 5 == -3 and (8 - 4) - 2 == 2 and 8 - (4 - 2) == 6, "S5 rows 1-2")
s = lambda a, b: a * b + 1
ok(all(s(s(a, b), c) == a*b*c + c + 1 and s(a, s(b, c)) == a*b*c + a + 1 for a, b, c in product(Z, repeat=3)), "S5 ab+1 expansions")
ok(s(s(0, 5), 1) == 2 and s(0, s(5, 1)) == 1, "S5 note: a=0, c=1 gives 2 and 1")
av = lambda a, b: F(a + b, 2)
ok(av(av(0, 0), 4) == 2 and av(0, av(0, 4)) == 1, "S5 average")
t = lambda a, b: a + b + a * b
ok(assoc(t, Z) and all(t(t(a, b), c) == a+b+c+a*b+a*c+b*c+a*b*c for a, b, c in product(Z, repeat=3)), "S6 a+b+ab")
m4 = lambda a, b: a * b % 4
ok(assoc(m4, range(4)) and ident(m4, range(4)) == [1], "S6/S8 x4 semigroup, identity 1")
# min on any finite slice 1..n has identity n (its largest element); Z+ has no largest element, so none.
ok(ident(max, ZP) == [1] and all(ident(min, range(1, n + 1)) == [n] for n in range(2, 30)), "S9/S13 (Z+,max) id 1; (Z+,min) only the largest element would do, and Z+ has none")
ok(ident(lambda a, b: a + b, N) == [0] and ident(lambda a, b: a * b, Z) == [1], "S9 (N,+), (Z,x)")
fs = {'i': (1, 2), 'c1': (1, 1), 'c2': (2, 2), 's': (2, 1)}
inv = {v: k for k, v in fs.items()}
comp = lambda f, g: inv[tuple(fs[f][fs[g][x - 1] - 1] for x in (1, 2))]  # (f o g)(x) = f(g(x))
table = {f: [comp(f, g) for g in ['i', 'c1', 'c2', 's']] for f in fs}
ok(table == {'i': ['i','c1','c2','s'], 'c1': ['c1']*4, 'c2': ['c2']*4, 's': ['s','c2','c1','i']}, "S10 composition table")
ok(assoc(comp, list(fs)) and ident(comp, list(fs)) == ['i'], "S10 associative, identity i")
ok(comp('s', 'c1') == 'c2' and comp('c1', 's') == 'c1', "S10 note: not commutative")
ok(ident(lambda a, b: a * b, range(-8, 9, 2)) == [], "S11 evens under x: no identity")
f13 = lambda a, b: a + b - 3
ok(assoc(f13, Z) and ident(f13, Z) == [3], "S13 a+b-3 monoid, e=3")
r = lambda a, b: a + b - a * b
ok(assoc(r, Z) and ident(r, Z) == [0] and all(r(r(a,b),c) == a+b+c-a*b-a*c-b*c+a*b*c for a,b,c in product(Z, repeat=3)), "S13 a+b-ab monoid, e=0")
d = lambda a, b: 2*a + 2*b
ok(not assoc(d, Z) and all(d(d(a,b),c) == 4*a+4*b+2*c and d(a,d(b,c)) == 2*a+4*b+4*c for a,b,c in product(Z, repeat=3)), "S13 2a+2b not associative")
m6 = lambda a, b: a * b % 6; E = [0, 2, 4]
ok([[m6(a, b) for b in E] for a in E] == [[0,0,0],[0,4,2],[0,2,4]] and ident(m6, E) == [4], "S14 {0,2,4} x6, identity 4")
p = lambda a, b: a + b + 1
ok(assoc(p, Z) and ident(p, Z) == [-1], "S15 a+b+1 monoid, e=-1")
ok(assoc(lambda a, b: a, N) and ident(lambda a, b: a, N) == [] and ident(lambda a, b: a | b, [0, 1]) == [0], "S15 keep-first semigroup; OR identity 0")
closed = lambda T, f: all(f(a, b) in T for a in T for b in T)
mul = lambda a, b: a * b
ok(closed({0, 1}, mul) and closed({1, -1}, mul) and closed({-1, 0, 1}, mul) and closed({0}, mul) and not closed({2}, mul), "S16/S20 closure of subsets of (Z,x)")
ok(1 + 3 == 4, "S17 odd + odd is even")
ok(ident(mul, [0]) == [0] and ident(m6, E) == [4], "S19 own identities 0 and 4")
ok(len("data" + "base") == len("data") + len("base") == 8, "S21 lengths")
ok(all((a + b) % 2 == (a % 2 + b % 2) % 2 for a, b in product(Z, repeat=2)), "S22 parity homomorphism")
ok(all(2 ** (x + y) == 2 ** x * 2 ** y for x, y in product(range(-4, 5), repeat=2)) and 2 ** 0 == 1, "S23/S25 powers of 2")
ok(0 * 0 == 0 and 0 != 1, "S24 zero map")
g = lambda x: x + 1
ok(g(2 + 3) == 6 and g(2) + g(3) == 7, "S25 x+1 fails at 2, 3")
ok(all(3 * (a + b) == 3 * a + 3 * b for a, b in product(Z, repeat=2)), "S25 3x")
ok((1 + 1) ** 2 == 4 and 1 ** 2 + 1 ** 2 == 2 and all((a * b) ** 2 == a * a * b * b for a, b in product(Z, repeat=2)), "S26 squares")
U = frozenset('abc'); subs = [frozenset(x) for k in range(4) for x in __import__('itertools').combinations('abc', k)]
ok(all(U - (A | B) == (U - A) & (U - B) for A in subs for B in subs) and U - frozenset() == U, "S26 De Morgan")
ok(all(w.count('a') + v.count('a') == (w + v).count('a') for w in ['', 'ab', 'aa', 'b'] for v in ['a', 'ba', '']), "S26 count of a's")
