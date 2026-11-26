"""Recompute every number in the TR 'The Binomial and Multinomial Theorems'.
Polynomials are dicts {exponent tuple: Fraction coeff}; exponents may be negative (for 1/x)."""
from fractions import Fraction as F
from math import comb, factorial
from itertools import product

def mul(p, q):
    r = {}
    for a, ca in p.items():
        for b, cb in q.items():
            e = tuple(i + j for i, j in zip(a, b)); r[e] = r.get(e, 0) + ca * cb
    return {e: c for e, c in r.items() if c != 0}

def pw(p, n, nv):
    r = {(0,) * nv: F(1)}
    for _ in range(n): r = mul(r, p)
    return r

def lin(*terms, nv):  # terms: (coeff, exponent tuple)
    return {e: F(c) for c, e in terms}

ok = bad = 0
def check(name, got, want):
    global ok, bad
    if got == want: ok += 1
    else: bad += 1; print("FAIL", name, "got", got, "want", want)

# vars x, y (nv=2)
X, Y = (1, 0), (0, 1)
xy = lin((1, X), (1, Y), nv=2)
for n, row in [(0, [1]), (1, [1, 1]), (2, [1, 2, 1]), (3, [1, 3, 3, 1]), (4, [1, 4, 6, 4, 1]), (5, [1, 5, 10, 10, 5, 1])]:
    p = pw(xy, n, 2)
    check(f"(x+y)^{n}", [p.get((n - k, k), 0) for k in range(n + 1)], row)
    check(f"C row {n}", [comb(n, k) for k in range(n + 1)], row)
# S3 tree: leaves of 3 brackets
leaves = list(product("xy", repeat=3))
check("tree x2y", sum(1 for l in leaves if l.count("y") == 1), 3)

one = (0,)
def uni(d): return {(e,): F(c) for e, c in d.items()}
def coeffs(p, n):  # descending powers list for univariate
    return {e[0]: c for e, c in p.items()}
check("(2x+3)^3", coeffs(pw(uni({1: 2, 0: 3}), 3, 1), 3), {3: 8, 2: 36, 1: 54, 0: 27})
ab = lin((1, X), (-1, Y), nv=2)
check("(a-b)^5", [pw(ab, 5, 2).get((5 - k, k), 0) for k in range(6)], [1, -5, 10, -10, 5, -1])
check("(x+1/x)^4", coeffs(pw(uni({1: 1, -1: 1}), 4, 1), 4), {4: 1, 2: 4, 0: 6, -2: 4, -4: 1})
# S10
check("(x+2)^4", coeffs(pw(uni({1: 1, 0: 2}), 4, 1), 4), {4: 1, 3: 8, 2: 24, 1: 32, 0: 16})
check("(1-x)^4", coeffs(pw(uni({0: 1, 1: -1}), 4, 1), 4), {0: 1, 1: -4, 2: 6, 3: -4, 4: 1})
p = pw(lin((2, X), (1, Y), nv=2), 3, 2)
check("(2a+b)^3", p, {(3, 0): 8, (2, 1): 12, (1, 2): 6, (0, 3): 1})
check("(x-3)^3", coeffs(pw(uni({1: 1, 0: -3}), 3, 1), 3), {3: 1, 2: -9, 1: 27, 0: -27})
# S12
check("T4 (x+2)^7", comb(7, 3) * 2**3, 280)
check("T4 power", coeffs(pw(uni({1: 1, 0: 2}), 7, 1), 7)[4], 280)
check("T3 (2a+b)^6", pw(lin((2, X), (1, Y), nv=2), 6, 2)[(4, 2)], 240)
# S13
check("x^5 in (2x-1)^8", coeffs(pw(uni({1: 2, 0: -1}), 8, 1), 8)[5], -1792)
# S14
check("const (x^2+1/x)^6", coeffs(pw(uni({2: 1, -1: 1}), 6, 1), 6)[0], 15)
check("const (x+1/x)^6", coeffs(pw(uni({1: 1, -1: 1}), 6, 1), 6)[0], 20)
# S15
check("mid (x+y)^8", pw(xy, 8, 2)[(4, 4)], 70)
p7 = pw(xy, 7, 2); check("mid (x+y)^7", (p7[(4, 3)], p7[(3, 4)]), (35, 35))
# S16
check("x3 (1+x)^10", coeffs(pw(uni({0: 1, 1: 1}), 10, 1), 10)[3], 120)
check("x2 (3-x)^5", coeffs(pw(uni({0: 3, 1: -1}), 5, 1), 5)[2], 270)
check("T5 (x-2)^6", coeffs(pw(uni({1: 1, 0: -2}), 6, 1), 6)[2], 240)
check("const (2x-1/x)^4", coeffs(pw(uni({1: 2, -1: -1}), 4, 1), 4)[0], 24)
check("mid (a+b)^10", pw(xy, 10, 2)[(5, 5)], 252)
# S17-18
check("sum (x+y)^6", sum(pw(xy, 6, 2).values()), 64)
check("row6 sum list", [comb(6, k) for k in range(7)], [1, 6, 15, 20, 15, 6, 1])
check("alt n=4", sum((-1)**k * comb(4, k) for k in range(5)), 0)
check("even/odd n=5", (comb(5,0)+comb(5,2)+comb(5,4), comb(5,1)+comb(5,3)+comb(5,5)), (16, 16))
# S19
check("11^4", 10**4 + 4*10**3 + 6*10**2 + 4*10 + 1, 11**4); check("11^4 val", 11**4, 14641)
check("1.01^5 exact", F(101, 100)**5, F(10510100501, 10**10))
check("1.01^5 approx", float(1 + 5*F(1,100) + 10*F(1,100)**2), 1.051)
check("99^3", 1000000 - 30000 + 300 - 1, 99**3); check("99^3 val", 99**3, 970299)
# S20
check("sum (x+y)^9", 2**9, 512); check("sum (2x+1)^4", sum(pw(uni({1: 2, 0: 1}), 4, 1).values()), 81)
check("alt n=7", sum((-1)**k * comb(7, k) for k in range(8)), 0)
check("11^5", 11**5, 161051)
check("1.02^4 3dp", round(float(F(102, 100)**4), 3), 1.082)
check("1.02^4 approx 3dp", round(float(1 + 4*F(2,100) + 6*F(2,100)**2 + 4*F(2,100)**3), 3), 1.082)
# multinomial, vars x,y,z,(w)
def v(i, nv): return tuple(1 if j == i else 0 for j in range(nv))
xyz = lin((1, v(0, 3)), (1, v(1, 3)), (1, v(2, 3)), nv=3)
p = pw(xyz, 2, 3)
check("(x+y+z)^2", p, {(2,0,0): 2-1, (0,2,0): 1, (0,0,2): 1, (1,1,0): 2, (0,1,1): 2, (1,0,1): 2})
check("x2yz in (x+y+z)^4", pw(xyz, 4, 3)[(2, 1, 1)], 12)
from itertools import permutations
check("arrangements xxyz", len(set(permutations("xxyz"))), 12)
check("a3b2c in (a+b+c)^6", pw(xyz, 6, 3)[(3, 2, 1)], 60)
check("x2y3z in (2x-y+3z)^6", pw(lin((2, v(0, 3)), (-1, v(1, 3)), (3, v(2, 3)), nv=3), 6, 3)[(2, 3, 1)], -720)
p3 = pw(xyz, 3, 3)
check("(x+y+z)^3 terms", len(p3), 10); check("(x+y+z)^3 sum", sum(p3.values()), 27)
check("(x+y+z)^3 coeffs", (p3[(3,0,0)], p3[(2,1,0)], p3[(1,1,1)]), (1, 3, 6))
check("(x+y+z)^4 terms", len(pw(xyz, 4, 3)), comb(6, 4)); check("C(6,4)", comb(6, 4), 15)
check("C(5,3)", comb(5, 3), 10)
abcd = lin(*[(1, v(i, 4)) for i in range(4)], nv=4)
check("(a+b+c+d)^2 terms", len(pw(abcd, 2, 4)), comb(5, 2)); check("C(5,2)", comb(5, 2), 10)
# S27
p5 = pw(xyz, 5, 3)
check("x2y2z (x+y+z)^5", p5[(2, 2, 1)], 30)
check("xyzw", pw(abcd, 4, 4)[(1, 1, 1, 1)], 24)
check("x3y (x+y+z)^4", pw(xyz, 4, 3)[(3, 1, 0)], 4)
check("x2yz (x+2y+z)^4", pw(lin((1, v(0, 3)), (2, v(1, 3)), (1, v(2, 3)), nv=3), 4, 3)[(2, 1, 1)], 24)
check("x2y2 (x+y+z)^5", p5.get((2, 2, 0), 0), 0)
# S29 wrong values
check("C(4,2) wrong", comb(4, 2), 6)
# S30
check("(x-1)^4", coeffs(pw(uni({1: 1, 0: -1}), 4, 1), 4), {4: 1, 3: -4, 2: 6, 1: -4, 0: 1})
check("x4 (1+2x)^6", coeffs(pw(uni({0: 1, 1: 2}), 6, 1), 6)[4], 240)
check("const (x+2/x)^4", coeffs(pw(uni({1: 1, -1: 2}), 4, 1), 4)[0], 24)
check("mid (x+1)^6", coeffs(pw(uni({1: 1, 0: 1}), 6, 1), 6)[3], 20)
check("a2bc2 (a+b+c)^5", p5[(2, 1, 2)], 30)
check("(a+b+c+d)^3 terms", len(pw(abcd, 3, 4)), 20); check("C(6,3)", comb(6, 3), 20)
# S31
check("8-bit three 1s", sum(1 for s in product("01", repeat=8) if s.count("1") == 3), 56)
check("all 8-bit", 2**8, 256)
check("len4 over abc aabc", sum(1 for s in product("abc", repeat=4) if sorted(s) == list("aabc")), 12)
check("(x+y)^20 terms", len(pw(xy, 20, 2)), 21); check("C(20,10)", comb(20, 10), 184756)
# multinomial k=2 reduces
check("multinomial k=2", factorial(7) // (factorial(3) * factorial(4)), comb(7, 3))
print(f"{ok} correct, {bad} wrong")
