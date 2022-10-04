#!/usr/bin/python3

# To the extent possible under law, the person who associated CC0 with
# this project has waived all copyright and related or neighboring rights
# to this project.
#
# You should have received a copy of the CC0 legalcode along with this
# work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
#

# plotting functions from
# https://www.johndcook.com/blog/2008/11/10/bounds-on-binomial-coefficients/

import mpmath as mp
import sys

def binom(n_i,k_i):
  n = mp.mpf(n_i)
  k = mp.mpf(k_i)
  num = mp.mpf(1.0)
  denom = mp.mpf(1.0)
  P = mp.mpf(1.0)
  for x in range(k_i):
    p = (n-mp.mpf(x)) / (k-mp.mpf(x))
    num *= n-mp.mpf(x)
    denom *= k-mp.mpf(x)
    P *= p
  return P
  return num/denom


def lb(n_i, k_i):

  if k_i==0: return mp.mpf(1.0)

  n = mp.mpf(n_i)
  k = mp.mpf(k_i)

  P = 1
  p = n / k
  for x in range(k_i):
    P *= p

  return P


def ub(n_i, k_i):
  if k_i==0: return mp.mpf(1.0)

  n = mp.mpf(n_i)
  k = mp.mpf(k_i)

  P = mp.mpf(1.0)
  p = mp.e * n / k
  for x in range(k_i):
    P *= p

  return P

def bb(n_i,k_i,C):
  if k_i==0: return mp.mpf(1.0)

  n = mp.mpf(n_i)
  k = mp.mpf(k_i)

  P = mp.mpf(1.0)
  p = mp.mpf(C)  * n / k
  for x in range(k_i):
    P *= p

  return P

def eb(n_i,k_i,E):
  if k_i==0: return mp.mpf(1.0)
  n = mp.mpf(n_i)
  k = mp.mpf(k_i)
  p = n / k
  return mp.power(p, E)


def ratio_f(n_i,k_i):
  b = binom(n_i,k_i)
  l = lb(n_i,k_i)
  return b/l

n_int = 100

dig = 16*n_int
mp.prec = dig

lb_a = []
ub_a = []
f_a = []

bb_a = []
ra_a = []

eb_a = []

n = mp.mpf(n_int)
for k_int in range(n_int):
  k = mp.mpf(k_int)

  n_str = mp.nstr(n, dig)
  k_str = mp.nstr(k, dig)
  b_str = mp.nstr(binom(n_int,k_int), dig)

  lb_a.append(lb(n_int,k_int))
  ub_a.append(ub(n_int,k_int))
  f_a.append(binom(n_int,k_int))

  bb_a.append(bb(n_int,k_int, 2))

  ra_a.append(ratio_f(n_int,k_int))
  eb_a.append(eb(n_int,k_int, 1.5*float(k_int)))

  #print(k_str, b_str)
  #print("n:", n_str, "k:", k_str, b_str)

#for k,v in enumerate(ra_a):
#  print(k,mp.nstr(v,dig))
#print("")
#sys.exit()



for k,v in enumerate(lb_a):
  print(k,mp.nstr(v,dig))
print("")

for k,v in enumerate(ub_a):
  print(k,mp.nstr(v,dig))
print("")

for k,v in enumerate(f_a):
  print(k,mp.nstr(v,dig))
print("")

for k,v in enumerate(bb_a):
  print(k,mp.nstr(v,dig))
print("")

for k,v in enumerate(eb_a):
  print(k,mp.nstr(v,dig))
print("")


