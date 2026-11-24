A=0b10110100; B=0b01100101
for e in ["bin(A | B)","bin(A & B)","bin(A & ~B)","bin(A ^ B)","bin(~A & 0b11111111)"]: print(">>>", e, "\n" + eval(e))
ok=lambda c,m: print(("OK  " if c else "BAD ")+m)
loc1=lambda L,c,i,l=1: L+c*(i-l)
ok(loc1(2000,4,5)==2016 and loc1(2000,4,6)==2020,"1D 2016/2020"); ok(loc1(1200,2,12,5)==1214 and 20-5+1==16,"A[5..20]")
ok(500+2*((2-1)*4+(3-1))==512 and 500+2*((3-1)*3+(2-1))==514,"2D 512/514")
rm=[(i,j) for i in range(1,4) for j in range(1,5)][:8]; cm=[(i,j) for j in range(1,5) for i in range(1,4)][:8]
ok(rm.index((2,3))==6 and cm.index((2,3))==7, f"A[2,3] 7th rm, 8th cm")
mem={1000:(37,1060),1020:(12,1080),1060:(48,None),1080:(25,1000)}
def tr(p,m):
  o=[]
  while p: o.append(m[p][0]); p=m[p][1]
  return o
ok(tr(1020,mem)==[12,25,37,48] and tr(1080,mem)==[25,37,48],"linked traces")
mem[1040]=(30,mem[1080][1]); mem[1080]=(25,1040); ok(tr(1020,mem)==[12,25,30,37,48],"insert 30")
mem[1040]=(30,mem[1000][1]); del mem[1000]; ok(tr(1020,mem)==[12,25,30,48],"delete 37")
U=range(1,11); bs=lambda S:''.join('1' if u in S else '0' for u in U); st=lambda b:{u for u,x in zip(U,b) if x=='1'}
Aa={1,3,5,7,9}; Bb={2,3,5,7}
ok(bs(Aa)=="1010101010" and bs(Bb)=="0110101000","A,B strings")
ok(bs(Aa|Bb)=="1110101010" and bs(Aa&Bb)=="0010101000" and bs(set(U)-Aa)=="0101010101","OR AND NOT")
ok(bs(set(U)-Bb)=="1001010111" and bs(Aa-Bb)=="1000000010" and bs(Aa^Bb)=="1100000010","NOT B, diff, xor")
ok(st("1100000011")=={1,2,9,10} and st("0001001000")=={4,7},"decode")
ok(int("00001101",2)==13 and chr(int("01000001",2))=='A' and int("00111110",2)==62 and chr(62)=='>',"bit meanings")
P=set(range(2,21))
for p in (2,3): P-= set(range(2*p,21,p))
ok(sorted(P)==[2,3,5,7,11,13,17,19] and 5*5>20,"sieve")
