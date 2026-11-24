# Recomputes every count in "DSM : Basics of Counting", by brute force where it is small.
from itertools import product
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)
D = '0123456789'
ok(len(list(product('WB', 'KG'))) == 4, "S2 2 shirts x 2 trousers listed: 4")
ok(len(list(product(D, repeat=4))) == 10000, "S2/S13 4-digit PINs: 10,000")
ok(3 + 4 == 7 and 4 + 3 + 2 == 9 and 5 + 3 + 4 == 12, "S4/S6 sums")
coding, music = set(range(10)), set(range(7, 15))
ok(len(coding) == 10 and len(music) == 8 and len(coding & music) == 3 and len(coding | music) == 15, "S7 clubs: 10 + 8 - 3 = 15")
ok([6 + 4, 5 + 3 + 2, 7 + 5, 25 + 20] == [10, 10, 12, 45] and 12 - 2 == 10, "S8 practice")
ok(len(list(product('WBR', 'KG'))) == 6, "S9 outfits 6")
ok(sorted(a + b for a, b in product('pqr', 'xy')) == ['px', 'py', 'qx', 'qy', 'rx', 'ry'], "S11 routes")
ok(len(list(product(range(3), range(4), range(2)))) == 24, "S12 combos 24")
ok(26 * 26 * 10 ** 4 == 6760000, "S13 plates 6,760,000")
ok(sum(1 for p in product(D, repeat=4) if len(set(p)) == 4) == 5040, "S14 PIN no repeats 5,040")
ok(sum(1 for n in range(100, 1000)) == 900 and sum(1 for n in range(100, 1000) if n % 2 == 0) == 450, "S14 3-digit numbers 900, even 450")
ok(sorted(''.join(b) for b in product('01', repeat=3)) == ['000','001','010','011','100','101','110','111'] and 2 ** 8 == 256, "S15 bit strings")
ok(4 * 3 == 12 and 26 ** 3 == 17576 and sum(1 for n in range(10, 100) if len(set(str(n))) == 2) == 81 and 2 ** 10 == 1024, "S16 practice")
ok((3 + 2, 3 * 2) == (5, 6), "S18 wardrobe")
ok(2 + 3 * 2 == 8, "S19 routes A to C")
ok(10 ** 3 + 10 ** 4 == 11000 and 26 + 26 * 26 == 702, "S20 codes and usernames")
f1, f2 = 26 ** 2 * 10 ** 3, 26 ** 3 * 10 ** 2
ok((f1, f2, f1 + f2) == (676000, 1757600, 2433600), "S21 plates")
ok(7 == 3 + 4 and 7 * 2 == 14 and 10 ** 4 + 10 ** 6 == 1010000 and (2 + 1) * 3 == 9 and 4 ** 5 == 1024, "S23 practice")
ok(62 ** 8 == 218340105584896 and round(62 ** 8 / 1e12) == 218, "S24 passwords about 218 trillion")
ok(2 ** 32 == 4294967296 and round(2 ** 32 / 1e9, 1) == 4.3, "S24 IPv4 about 4.3 billion")
n = 0
for i in range(10):
    for j in range(5):
        n += 1
m = 0
for i in range(10):
    m += 1
for j in range(5):
    m += 1
ok((n, m) == (50, 15), "S24 nested loops 50, sequential 15")
