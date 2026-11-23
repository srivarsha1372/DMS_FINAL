# Recomputes every worked example in the "DSM : Functions" TR doc.
from fractions import Fraction as F
ok=lambda c,m: print(("OK  " if c else "BAD ")+m)
isfn=lambda R,X: all(sum(1 for a,b in R if a==x)==1 for x in X)
X={1,2,3}
ok([isfn(R,X) for R in [{(1,'a'),(2,'b'),(3,'b')},{(1,'a'),(2,'b')},{(1,'a'),(1,'b'),(2,'c'),(3,'c')},{(1,'c'),(2,'c'),(3,'c')}]]==[True,False,False,True],"S3 function or not")
ok({x for x in range(-10,11) if x*x==9}=={3,-3},"S4 preimages of 9")
ok(sorted(2*x for x in [1,2,3,4])==[2,4,6,8],"S5 range of 2x")
h={'a':1,'b':1,'c':3}; ok(set(h.values())=={1,3},"S6 range of h")
inj=lambda f,D: len({f(x) for x in D})==len(list(D))
D=range(-20,21)
ok(inj(lambda x:2*x+3,D) and not inj(lambda x:x*x,D),"S7 2x+3 injective, x^2 not")
ok(all(3*((F(y)+5)/3)-5==y for y in range(-5,6)),"S11 3x-5 onto R")
ok((F(0)+5)/3==F(5,3),"S11 y=0 needs 5/3 over Z")
ok(all(y-1 in range(-30,31) for y in range(-20,21)) and 3 not in {2*x for x in range(-30,31)},"S10 x+1 onto, 2x misses 3")
# S14 four combinations
def cls(m,Y): v=list(m.values()); return (len(set(v))==len(v), set(v)==set(Y))
ok(cls({1:'a',2:'b',3:'c'},'abc')==(True,True),"S14 row1")
ok(cls({1:'a',2:'b',3:'c'},'abcd')==(True,False),"S14 row2")
ok(cls({1:'a',2:'a',3:'b'},'ab')==(False,True),"S14 row3")
ok(cls({1:'a',2:'a',3:'b'},'abc')==(False,False),"S14 row4")
# S17
N=range(0,50); ok(0 not in {n+1 for n in N},"S17 g misses 0")
ok(2 not in {x*x for x in range(-50,51)},"S17 h misses 2")
# S18/19 equality
ok(all(x*x==3*x-2 for x in [1,2]),"S18 x^2 = 3x-2 on {1,2}")
ok(all(x**3==x for x in [-1,0,1]) and all(abs(x)==x*x for x in [-1,0,1]) and abs(2)!=4,"S19 rows")
# S21
f={1:'a',2:'b',3:'a'}; g={'a':'q','b':'p'}; ok({x:g[f[x]] for x in f}=={1:'q',2:'p',3:'q'},"S21 g o f")
# S22
ok((3+2)**2==25 and 3**2+2==11,"S22 gof(3)=25, fog(3)=11")
# S23
ok(all(((2*x)+3)**2==(2*x+3)**2 for x in range(-5,6)),"S23 assoc check")
# S24
f=lambda x:3*x-1; g=lambda x:x*x+1
ok((f(g(2)),g(f(2)),g(g(1)))==(14,26,5) and all(f(f(x))==9*x-4 for x in range(-5,6)),"S24 table")
# S26
f={1:'b',2:'c',3:'a'}; inv={v:k for k,v in f.items()}; ok(inv=={'a':3,'b':1,'c':2},"S26 inverse")
# S28/30/31
ok(all(3*((x+5)/F(3))-5==x for x in range(-5,6)),"S28 check")
ok(all(((2*x+3)-3)/F(2)==x for x in range(-5,6)),"S30 (gof)^-1")
ok(2*4+3==11 and (11-3)/2==4,"S30 numeric check")
f=lambda x:2*x+1; ok(f(1)**3==27 and (3-1)/2==1 and round(27**(1/3))==3,"S31 rows 3-4")
