# Recomputes every value and identity in "DSM : Binomial Coefficient",
# by subset listing where small and by formula and Pascal's rule otherwise.
from itertools import combinations as C
from math import comb, factorial as f
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)

ok(len(list(C(["Onion", "Paneer", "Corn", "Mushroom"], 2))) == 6, "S1 toppings 6")
S = "abcd"
ok([len(list(C(S, r))) for r in range(5)] == [1, 4, 6, 4, 1] and sum(len(list(C(S, r))) for r in range(5)) == 16, "S3 subsets of {a,b,c,d} 1,4,6,4,1 total 16")
ok(all(comb(n, 0) == 1 == comb(n, n) and comb(n, 1) == n and comb(n, 2) == n * (n - 1) // 2 for n in range(2, 30)), "S4 special values")
ok([comb(6, 2), comb(7, 3), comb(8, 4), comb(9, 1), comb(10, 0)] == [15, 35, 70, 9, 1], "S5 practice")
rows = [[1]]
for n in range(1, 11):
    prev = rows[-1]; rows.append([1] + [prev[i - 1] + prev[i] for i in range(1, n)] + [1])
ok(rows[4] == [1, 4, 6, 4, 1] and all(rows[n] == [comb(n, r) for r in range(n + 1)] for n in range(11)), "S6/S8 the building rule gives C(n, r)")
ok(rows[7] == [1, 7, 21, 35, 35, 21, 7, 1] and all(len(rows[n]) == n + 1 for n in range(11)), "S7 rows 0-7; row n has n + 1 entries")
ok(rows[6][2] == 15 and rows[7][3] == 35 and rows[5][2] == 10, "S8 reading examples")
ok(comb(5, 2) == comb(4, 1) + comb(4, 2) == 10, "S9 C(5,2) = 4 + 6")
ok(rows[6][3] == 20 and rows[7][2] == rows[7][5] == 21 and rows[8] == [1, 8, 28, 56, 70, 56, 28, 8, 1] and rows[9][2] == rows[9][7] == 36 and rows[9][3:7] == [84, 126, 126, 84], "S10 blanks 20; 21; 56; 36")
ok(all(rows[n] == rows[n][::-1] for n in range(11)), "S11 every row a palindrome")
ok(all(comb(n, r) == comb(n, n - r) for n in range(30) for r in range(n + 1)) and comb(10, 8) == comb(10, 2) == 45, "S12/S13 symmetry")
ok(len(list(C(range(6), 2))) == len(list(C(range(6), 4))) == 15, "S14 2 go = 4 stay")
ok(comb(100, 98) == 4950 and comb(20, 17) == 1140 and [n for n in range(30) if n >= 7 and comb(n, 7) == comb(n, 5)] == [12] and [r for r in range(13) if comb(15, r) == comb(15, r + 3)] == [6], "S15 applications")
ok(all(comb(n, r) == comb(n - 1, r - 1) + comb(n - 1, r) for n in range(2, 40) for r in range(1, n)), "S16/S18/S19 Pascal's identity")
ok(comb(7, 3) == comb(6, 2) + comb(6, 3) == 35 and comb(8, 4) == comb(7, 3) + comb(7, 4) == 70, "S16 checks")
pairs = list(C(S, 2))
ok(sum("a" in p for p in pairs) == 3 == comb(3, 1) and sum("a" not in p for p in pairs) == 3 == comb(3, 2), "S17 with a 3, without a 3")
ok([comb(8, 3), comb(9, 4), comb(10, 5)] == [56, 126, 252] and comb(12, 4) + comb(12, 5) == comb(13, 5), "S20 building values")
ok(comb(50, 48) == 1225 and comb(10, 4) + comb(10, 5) == comb(11, 5) and [n for n in range(5, 30) if comb(n, 4) == comb(n, 6)] == [10] and comb(6, 3) == comb(5, 2) + comb(5, 3) == 20 and comb(7, 2) + comb(7, 3) + comb(8, 4) == comb(9, 4) == 126, "S21 practice")
ok(all(sum(rows[n]) == 2 ** n for n in range(11)), "S22 row sums 2^n")
ok(all(sum(len(list(C(range(n), r))) for r in range(n + 1)) == 2 ** n for n in range(8)), "S23 all subsets counted two ways")
ok([comb(n, 1) for n in range(1, 6)] == [1, 2, 3, 4, 5] and [comb(n, 2) for n in range(2, 7)] == [1, 3, 6, 10, 15] and [comb(n, 3) for n in range(3, 8)] == [1, 4, 10, 20, 35], "S24 diagonals")
ok(2 ** 8 == 256 and 2 ** 6 == 64 and 2 ** 5 - 1 == 31 and comb(8, 2) == 28 == [1, 3, 6, 10, 15, 21, 28][6], "S25 patterns")
r9 = [1] + [rows[8][i - 1] + rows[8][i] for i in range(1, 9)] + [1]
ok(r9 == [1, 9, 36, 84, 126, 126, 84, 36, 9, 1] and r9 == r9[::-1] and comb(9, 2) == 36, "S26 row 9")
ok(rows[5][2] == 10 and comb(6, 2) == 15 and comb(10, 3) == comb(10, 7) and comb(7, 3) == comb(6, 2) + comb(6, 3), "S27 mistakes")
ok(comb(6, 3) == 20 and comb(7, 2) == 21 and [n for n in range(9, 30) if comb(n, 3) == comb(n, 9)] == [12] and comb(15, 6) + comb(15, 7) == comb(16, 7) and comb(25, 23) == 300 and 2 ** 10 == 1024, "S28 mixed")
ok(f(21) > 2 ** 63 - 1 > f(20) and comb(30, 15) == 155117520 and len(str(f(30))) == 33, "S29 21! overflows 64-bit; C(30,15); 30! has 33 digits")
