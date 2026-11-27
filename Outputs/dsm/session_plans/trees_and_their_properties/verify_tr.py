# Checks every graph claim in "DSM : Trees and Their Properties" by brute force:
# components, cycles, all simple paths, tree tests, edge counts, and the number of
# non-isomorphic trees on up to 6 vertices.
from itertools import combinations, permutations
ok = lambda c, m: print(("OK  " if c else "BAD ") + m)

def adj(V, E):
    A = {v: set() for v in V}
    for a, b in E:
        A[a].add(b); A[b].add(a)
    return A

def components(V, E):
    A, seen, comps = adj(V, E), set(), []
    for v in V:
        if v in seen: continue
        stack, comp = [v], set()
        while stack:
            x = stack.pop()
            if x in comp: continue
            comp.add(x); stack.extend(A[x] - comp)
        seen |= comp; comps.append(comp)
    return comps

def acyclic(V, E):   # simple graph: acyclic iff |E| = |V| - #components
    return len(E) == len(V) - len(components(V, E))

def is_tree(V, E):
    return len(components(V, E)) == 1 and acyclic(V, E)

def paths(V, E, s, t):
    A, out = adj(V, E), []
    def go(p):
        if p[-1] == t: out.append(p); return
        for w in A[p[-1]]:
            if w not in p: go(p + [w])
    go([s]); return out

def cycles(V, E):   # distinct cycles as frozensets of edges
    A, found = adj(V, E), set()
    def go(p):
        for w in A[p[-1]]:
            if w == p[0] and len(p) >= 3:
                found.add(frozenset(frozenset(e) for e in zip(p, p[1:] + [p[0]])))
            elif w not in p:
                go(p + [w])
    for v in V: go([v])
    return found

CV, CE = list("LCHGAP"), [("L", "C"), ("L", "H"), ("C", "H"), ("C", "G"), ("H", "A")]
ok(["G", "C", "H", "A"] in paths(CV, CE, "G", "A") and not any(len(c) for c in cycles(CV, CE) if any("G" in e for e in c)) and all("P" not in c or len(c) == 1 for c in components(CV, CE)), "S1 G to A route; no cycle through G; P unreachable")
ok({frozenset({"L", "C"}), frozenset({"C", "H"}), frozenset({"H", "L"})} in [set(c) for c in cycles(CV, CE)], "S3 L, C, H, L is a cycle of length 3")
ok(sorted(map(sorted, components(CV, CE))) == sorted([sorted("LCHGA"), ["P"]]), "S4 components {L,C,H,G,A} and {P}")
V5, E5 = [1, 2, 3, 4, 5, 6], [(1, 2), (2, 3), (3, 1), (3, 4), (5, 6)]
ok([2, 3, 4] in paths(V5, E5, 2, 4) and sorted(map(sorted, components(V5, E5))) == [[1, 2, 3, 4], [5, 6]], "S5 path 2,3,4; components {1,2,3,4}, {5,6}")
VF, EF = [1, 2, 3, 4, 5, 6], [(1, 2), (1, 3), (4, 5)]
ok(acyclic(VF, EF) and len(components(VF, EF)) == 3 and len(EF) == 6 - 3, "S8/S17 forest: 3 trees, 6 - 3 = 3 edges")
ok(is_tree([1, 2, 3, 4, 5], [(1, 2), (2, 3), (3, 4), (4, 5)]) and is_tree(list(range(6)), [(0, i) for i in range(1, 6)])
   and not is_tree([1, 2, 3], [(1, 2), (2, 3), (3, 1)]) and not is_tree([1, 2, 3, 4], [(1, 2), (3, 4)]) and acyclic([1, 2, 3, 4], [(1, 2), (3, 4)])
   and not is_tree([1, 2, 3, 4, 5], [(1, 2), (2, 3), (3, 4), (4, 1), (4, 5)]), "S9 examples and non-examples")
ok(is_tree([1], []) and is_tree([1, 2, 3, 4, 5], [(1, 2), (2, 3), (2, 4), (2, 5)]) and acyclic(range(1, 7), [(1, 2), (2, 3), (4, 5), (5, 6)]) and len(components(list(range(1, 7)), [(1, 2), (2, 3), (4, 5), (5, 6)])) == 2
   and cycles([1, 2, 3, 4], [(1, 2), (2, 3), (3, 4), (4, 1)]) and cycles([1, 2, 3, 4, 5], [(1, 2), (2, 3), (3, 1), (4, 5)]) and len(components([1, 2, 3, 4, 5], [(1, 2), (2, 3), (3, 1), (4, 5)])) == 2, "S10 classify")
T11 = ([1, 2, 3, 4, 5, 6], [(1, 2), (2, 3), (2, 4), (4, 5), (4, 6)])
ok(paths(*T11, 1, 6) == [[1, 2, 4, 6]] and sorted(paths([1, 2, 3], [(1, 2), (2, 3), (3, 1)], 1, 3)) == [[1, 2, 3], [1, 3]], "S11 one path 1,2,4,6; triangle has two")
ok(all(len(paths(*T11, u, v)) == 1 for u, v in combinations(T11[0], 2)), "S12 every pair in a tree has exactly one path")
T13 = (list(range(1, 9)), [(1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (3, 7), (7, 8)])
ok(paths(*T13, 4, 5) == [[4, 2, 5]] and paths(*T13, 4, 8) == [[4, 2, 1, 3, 7, 8]] and paths(*T13, 6, 8) == [[6, 3, 7, 8]], "S13 unique paths, lengths 2, 5, 3")
ok(is_tree(*T13) and len(T13[1]) == 7, "S14 the 8-vertex tree has 7 edges")
deg = lambda V, E: {v: sum(v in e for e in E) for v in V}
ok(sum(1 for d in deg(*T13).values() if d == 1) >= 2, "S15 at least two leaves")
K4 = list(combinations([1, 2, 3, 4], 2))
ok(len(K4) == 6 and not is_tree(list(range(1, 8)), K4) and cycles(list(range(1, 8)), K4) and len(components(list(range(1, 8)), K4)) == 4, "S18 7 vertices, 6 edges, not a tree")
ok(10 - 1 == 9 and 15 + 1 == 16 and 12 - 3 == 9 and 8 - 1 == 7, "S20 rows 1-4")
# S21 on the S26 tree: removing any edge gives two trees; adding any edge gives exactly one cycle
T26 = (list(range(1, 8)), [(1, 2), (1, 3), (3, 4), (3, 5), (5, 6), (5, 7)])
ok(is_tree(*T26) and all(len(components(T26[0], [x for x in T26[1] if x != e])) == 2 for e in T26[1]), "S21 removing any edge splits into two trees")
non_edges = [e for e in combinations(T26[0], 2) if e not in T26[1] and e[::-1] not in T26[1]]
ok(all(len(cycles(T26[0], T26[1] + [e])) == 1 for e in non_edges), "S21 adding any edge makes exactly one cycle")
# S22 non-isomorphic trees on n vertices
def count_trees(n):
    V = list(range(n)); seen = set()
    for E in combinations(list(combinations(V, 2)), n - 1):
        if not is_tree(V, list(E)): continue
        canon = min(tuple(sorted(tuple(sorted((p[a], p[b]))) for a, b in E)) for p in permutations(V))
        seen.add(canon)
    return len(seen)
ok([count_trees(n) for n in range(1, 7)] == [1, 1, 1, 2, 3, 6], "S22 trees up to isomorphism: 1, 1, 1, 2, 3, 6")
# S23 leaves: 2 of degree 3, 3 of degree 2, L leaves
Ls = [L for L in range(0, 30) if 2 * 3 + 3 * 2 + L == 2 * (5 + L - 1)]
ok(Ls == [4], "S23 L = 4 (9 vertices, 8 edges)")
ex = (list(range(9)), [(0, 1), (1, 2), (2, 3), (3, 4), (0, 5), (0, 6), (4, 7), (4, 8)])
d = deg(*ex)
ok(is_tree(*ex) and sorted(d.values()) == [1, 1, 1, 1, 2, 2, 2, 3, 3], "S23 such a tree exists")
ok(all(3 * n + 2 - 1 == 3 * n + 1 and (4 * n + 2 * n + 2) // 2 == 3 * n + 1 for n in range(1, 20)), "S24 alkane CnH2n+2: 3n + 2 vertices, 3n + 1 edges")
butane = ([0, 1, 2, 3], [(0, 1), (1, 2), (2, 3)])
isobutane = ([0, 1, 2, 3], [(0, 1), (0, 2), (0, 3)])
ok(sorted(deg(*butane).values()) != sorted(deg(*isobutane).values()), "S24 butane and isobutane skeletons non-isomorphic")
ok(paths(*T26, 2, 7) == [[2, 1, 3, 5, 7]] and sorted(v for v, x in deg(*T26).items() if x == 1) == [2, 4, 6, 7], "S26 path 2..7; leaves 2, 4, 6, 7")
cyc = cycles(T26[0], T26[1] + [(4, 7)])
ok(len(cyc) == 1 and set(next(iter(cyc))) == {frozenset(e) for e in [(4, 3), (3, 5), (5, 7), (7, 4)]}, "S26 add 47: one cycle 4, 3, 5, 7, 4")
ok(sorted(map(sorted, components(T26[0], [e for e in T26[1] if e != (3, 5)]))) == [[1, 2, 3, 4], [5, 6, 7]], "S26 remove 35: {1,2,3,4} and {5,6,7}")
ok(deg([0], [])[0] == 0, "S25 a single vertex has degree 0, no leaves")
