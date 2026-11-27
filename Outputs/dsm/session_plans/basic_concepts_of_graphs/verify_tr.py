# Rebuilds every graph in "DSM : Basic Concepts of Graphs" from its edge list and
# checks the matrices, degrees, neighbourhoods and handshaking claims the TR states.
from itertools import combinations
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)

def degrees(V, E):
    d = {v: 0 for v in V}
    for u, w in E:
        d[u] += 1
        d[w] += 1          # a loop (u == w) adds 2
    return d

V = list("LCHGAP")
E = [("L", "C"), ("L", "H"), ("C", "H"), ("C", "G"), ("H", "A")]
ok(len(V) == 6 and len(E) == 5, "S5 campus |V| = 6, |E| = 5")
E6 = [(1, 2), (1, 3), (2, 4), (2, 6), (3, 4), (3, 5)]
ok(len(E6) == 6, "S6 drawing exercise has 6 edges")
nb = lambda v: {w for a, b in E for x, w in ((a, b), (b, a)) if x == v}
ok(nb("C") == {"L", "H", "G"} and nb("P") == set() and "G" not in nb("L"), "S16 N(C) = {L,H,G}; N(P) empty; L, G not adjacent")
A = [[sum(1 for a, b in E if {a, b} == {u, w}) for w in V] for u in V]
expected = [[0, 1, 1, 0, 0, 0], [1, 0, 1, 1, 0, 0], [1, 1, 0, 0, 1, 0], [0, 1, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
ok(A == expected and all(A[i][j] == A[j][i] for i in range(6) for j in range(6)) and all(A[i][i] == 0 for i in range(6)), "S18 adjacency matrix, symmetric, zero diagonal")
I = [[1 if v in e else 0 for e in E] for v in V]
ok(I == [[1, 1, 0, 0, 0], [1, 0, 1, 1, 0], [0, 1, 1, 0, 1], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1], [0] * 5] and all(sum(col) == 2 for col in zip(*I)), "S19 incidence matrix, two 1s per column")
d = degrees(V, E)
ok([d[v] for v in V] == [2, 3, 3, 1, 1, 0] and [sum(r) for r in A] == [2, 3, 3, 1, 1, 0], "S20 degrees 2,3,3,1,1,0 = row sums")
ok(sum(d.values()) == 10 == 2 * len(E) and sorted(v for v in V if d[v] % 2) == sorted("CHGA"), "S22/S24 sum 10 = 2 x 5; odd vertices C, H, G, A")
ok(sum(sum(r) for r in I) == 10, "S23 incidence matrix: rows and columns both total 10")
E21 = [("a", "b"), ("a", "b"), ("b", "c"), ("c", "c")]
d21 = degrees("abc", E21)
ok([d21[v] for v in "abc"] == [2, 3, 3] and sum(d21.values()) == 8 == 2 * len(E21), "S21/S22 loop example degrees 2, 3, 3; sum 8")
ok(4 + 3 == 7 and 7 > 6, "S13 walking times: L-C-H 7 > direct L-H 6")
ok(sum([3, 3, 2, 1]) % 2 == 1 and (7 * 3) % 2 == 1 and sum([4, 3, 3, 2, 2]) // 2 == 7 and 20 // 4 == 5, "S25 rows 1-4")
K5 = list(combinations(range(5), 2))
ok(len(K5) == 10 and all(sum(v in e for e in K5) == 4 for v in range(5)), "S25 row 5: 5 friends, 10 handshakes, each degree 4")
D = [(1, 2), (2, 3), (3, 1), (1, 3), (4, 1), (3, 3)]
din = {v: sum(1 for a, b in D if b == v) for v in (1, 2, 3, 4)}
dout = {v: sum(1 for a, b in D if a == v) for v in (1, 2, 3, 4)}
ok([din[v] for v in (1, 2, 3, 4)] == [2, 1, 3, 0] and [dout[v] for v in (1, 2, 3, 4)] == [2, 1, 2, 1], "S26 in-degrees 2,1,3,0; out-degrees 2,1,2,1")
ok(sum(din.values()) == sum(dout.values()) == len(D) == 6, "S27 sum in = sum out = |E| = 6")
D12 = [("a", "b"), ("b", "c"), ("b", "c")]
ok(D12.count(("a", "b")) == 1 and D12.count(("b", "c")) == 2, "S12 multiplicities 1 and 2")
V28 = list("pqrst")
E28 = [("p", "q"), ("p", "r"), ("q", "r"), ("r", "s"), ("r", "s"), ("t", "t")]
d28 = degrees(V28, E28)
n_r = {w for a, b in E28 for x, w in ((a, b), (b, a)) if x == "r"}
ok(n_r == {"p", "q", "s"} and [d28[v] for v in "rst"] == [4, 2, 2] and sum(d28.values()) == 12 == 2 * len(E28), "S28 N(r), deg r,s,t = 4,2,2; sum 12")
ok(all(d28[v] > 1 for v in V28), "S28 no pendant or isolated vertex")
ok(sum([3, 3, 3]) % 2 == 1, "S29 degrees 3, 3, 3 impossible")
