from itertools import product
ok=lambda c,m: print(("OK  " if c else "BAD ")+m)
comp=lambda R,S:{(a,c) for a,b in R for b2,c in S if b==b2}
refl=lambda R,A: all((a,a) in R for a in A)
irr=lambda R,A: all((a,a) not in R for a in A)
sym=lambda R: all((b,a) in R for a,b in R)
anti=lambda R: all(not((b,a) in R and a!=b) for a,b in R)
tr=lambda R: comp(R,R)<=R
A4=range(1,5); D={(x,y) for x in A4 for y in A4 if y%x==0}
ok(len(D)==8,"divides on 1..4: 8 pairs"); ok({(x,y) for x in A4 for y in A4 if x+y==5}=={(1,4),(2,3),(3,2),(4,1)},"x+y=5")
ok(2**4==16 and 2**6==64 and 2**9==512,"counts")
A3={1,2,3}
R1={(1,1),(2,2),(3,3),(1,2),(2,1)}; R2={(1,2),(1,3),(2,3)}
ok((refl(R1,A3),irr(R1,A3),sym(R1),anti(R1),tr(R1))==(True,False,True,False,True),"R1 row")
ok((refl(R2,A3),irr(R2,A3),sym(R2),anti(R2),tr(R2))==(False,True,False,True,True),"R2 row")
for R,s,a in [({(1,1),(2,2)},1,1),({(1,2),(2,1)},1,0),({(1,2)},0,1),({(1,2),(2,1),(1,3)},0,0)]: ok((sym(R),anti(R))==(bool(s),bool(a)),f"sym/anti {sorted(R)}")
ok(tr({(1,2),(2,3),(1,3),(3,3)}) and not tr({(1,2),(2,1)}),"transitivity examples")
E={(1,1),(2,2),(3,3),(4,4),(1,3),(3,1),(2,4),(4,2)}; ok(refl(E,A4) and sym(E) and tr(E),"equivalence practice")
ok([sorted(x for x in range(1,10) if x%3==r) for r in (1,2,0)]==[[1,4,7],[2,5,8],[3,6,9]],"mod 3 classes")
W={'sun','nut','tea','ear'}; rel=lambda x,y: bool(set(x)&set(y))
ok(sorted(tuple(sorted(p)) for p in [(x,y) for x in W for y in W if x<y and rel(x,y)])==[('ear','tea'),('nut','sun'),('nut','tea')],"word pairs")
ok(comp({(1,'x'),(2,'x'),(3,'y')},{('x','p'),('y','p'),('y','q')})=={(1,'p'),(2,'p'),(3,'p'),(3,'q')},"R o S example")
R={(1,2),(2,3)}; S={(2,1),(3,3)}
ok(comp(R,S)=={(1,1),(2,3)} and comp(S,R)=={(2,2)} and comp(R,R)=={(1,3)},"order matters, R^2")
P=[1,2,3,4,6,12]; dv={(a,b) for a in P for b in P if b%a==0}; ok(len(dv)==18,"18 pairs")
cov=lambda X,dv:{(a,b) for (a,b) in dv if a!=b and not any(c not in (a,b) and (a,c) in dv and (c,b) in dv for c in X)}
ok(cov(P,dv)=={(1,2),(1,3),(2,4),(2,6),(3,6),(4,12),(6,12)},"7 Hasse edges")
Q=[2,3,4,6,12,18]; dq={(a,b) for a in Q for b in Q if b%a==0}
ok(cov(Q,dq)=={(2,4),(2,6),(3,6),(4,12),(6,12),(6,18)},"Q edges")
mn=[a for a in Q if not any((b,a) in dq and b!=a for b in Q)]; mx=[a for a in Q if not any((a,b) in dq and b!=a for b in Q)]
ok(mn==[2,3] and mx==[12,18],"min/max")
ub=lambda B,X,d:[u for u in X if all((b,u) in d for b in B)]; lb=lambda B,X,d:[l for l in X if all((l,b) in d for b in B)]
ok(ub([2,3],P,dv)==[6,12] and lb([2,3],P,dv)==[1] and ub([4,6],P,dv)==[12] and lb([4,6],P,dv)==[1,2],"bounds in div 12")
ok(ub([12,18],Q,dq)==[] and lb([12,18],Q,dq)==[2,3,6] and ub([2,3],Q,dq)==[6,12,18] and lb([2,3],Q,dq)==[],"bounds in Q")
from itertools import combinations
sets=[frozenset(c) for k in range(4) for c in combinations('abc',k)]
ok(sum(1 for x in sets for y in sets if x<y and len(y)==len(x)+1)==12,"cube 12 edges")
