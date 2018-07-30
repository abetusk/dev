Assorted Small Probability Problems
===

Independence of expectation (finite)
---

$$
E[ X + Y ] = \int \int (s + t) Pr \{ X = s \  \& \ Y = t \} \ ds \ dt
= \int \int s Pr\{ X = s \ \& \  Y = t \} \ ds \ dt + \int \int t Pr\{ X = s \ \& \ Y = t \} \ ds \ dt
= \int \int s Pr\{ X = s \ \& \ Y = t \} \ dt \ ds + \int \int t Pr\{ X = s \ \& \ Y = t \} \ ds \ dt
= \int s Pr\{ X = s \} \ ds + \int t Pr\{ Y = t \} \ dt
= E[X] + E[Y]
$$

Induction can be used to extend to the general case:

$$
E[ \sum_{k=0}^{n-1} X_k ] = \sum_{k=0}^{n-1} E[X_k]
$$

Coupon Collector
---

Find the expected time, $T$, to wait to collect $n$ different coupons, each appearing with probability $\frac{1}{n}$.

Assign the random variable $X_t$ to be the time taken to see a new coupon once $t$ have already been collected.

$X_0 = 1$

$$
E[X_t] = \sum_{k=1}^{\infty} k (\frac{t}{n})^{k-1} (1 - \frac{t}{n})
  = (1 - \frac{t}{n}) ( \sum_{k=0}^{\infty} k (\frac{t}{n})^k + \sum_{k=0}^{\infty} (\frac{t}{n})^k )
  = (1 - \frac{t}{n}) ( \frac{ \frac{t}{n}  }{ (1 - \frac{t}{n} )^2 } + \frac{1}{1 - \frac{t}{n}} )
  = \frac{n}{n-t}
$$

$$
E[T] = E[\sum_{t=0}^{n-1}]
$$

Since the expectation is independent

$$
E[ \sum_{t=0}^{n-1} X_t ] = \sum_{t=0}^{n-1} E_t
= \frac{n}{n} + \frac{n}{n-1} + \frac{n}{n-2} + \cdots + \frac{n}{1}
= \sum_{t=0}^{n-1} \frac{n}{n-t}
= n ( \sum_{t=0}^{n-1} \frac{1}{n-t} )
= n \cdot H_n
$$

Where $H_n$ is the $n$-th harmonic number.

$$
E[T] = n \cdot H_n = n \log n + \gamma n + \frac{1}{2} + O(\frac{1}{n})
\approx n \log n
$$

Birthday Problem
---

$n$ people are assigned a random integer uniformly at random from $[1,m]$.
For a given probability $p$, what is the relationship to $n$ and $m$ that
at least two people have the same number.

* $Q_{n,m}$ the probability that no two of $n$ people with $m$ numbers have a number in common

$$
Q_{n,m} = \prod_{t=1}^{n} (1 - \frac{t}{m})
 \le \prod_{t=1}^{n} e^{-\frac{t}{m}}
 = \exp( -\sum_{t=1}^{n} \frac{t}{m} )
 = \exp( -\frac{ {n+1 \choose 2 } }{m} )
 = \exp( -\frac{n (n+1)}{2 m} )
$$

$$
p \approx 1 - \exp( -\frac{n (n+1)}{2 m} )
\to \log \frac{1}{1-p} \approx \frac{ n (n+1)}{2 m}
$$

For $n >> 1$ we can approximate further:

$$
\to \log \frac{1}{1-p} \approx \frac{ n^2 }{2 m}
\to n \approx \sqrt{ 2 m \log \frac{1}{1-p} }
$$

For $m=365$ we get $n \approx 22.494...$.

Best Choice Problem
---

$n$ candidates, with each that can be ranked relative to the others.
The candidates file in one at a time and are ranked relative to the candidates
already seen.
When each candidate is first seen, a decision is made to accept or reject them.

Find the optimal stopping point to maximize the likelyhood of getting the ideal candidate.

One strategy is a "wait then choose" strategy, where $r$ of $n$ candidates are considered
and then the next candidate chosen that is better than all of the $r$ previsously seen.

With this in mind, the probability becomes:

$$
P(r) = \sum_{k=r+1}^{n} \Pr \{ 
$$


Hat Derangement
---

$n$ people each take a random hat out of a bag after throwing them all in.
Find the probability of no person getting their own hat back.

A crude way to do this is just consider the probability of a person randomely choosing a hat
without considering the previously drawn hats.
Using this approximation, there are $(1-\frac{1}{n})$ choices for some other hat,
leaving the probability of no person chooses their own hat as:

$$
(1 - \frac{1}{n})^{n} \to \frac{1}{e}
$$


The more complete solution is to make an inclusion-exclusion argument
by counting the number of possibilities.
Call $S$ the set of all permutations, and $F_k$ be the set of all permutations
that fixes position $k$, then the number of permutations is:

$$
|S| - |F_0 \cup F_1 \cup F_2 \cup \dots \cup F_{n-1}|

= |S| - \sum_{k=0}^{n-1} |F_k| + \sum_{k=0}^{n-1} \sum_{k'=k+1}^{n-1} |F_k \cap F_{k'}| \dots |F_0 \cap F_1 \cap \dots \cap F_{n-1}|
$$

Symmetry of the sets allows us to consolidate the counts:

$$
 = n! - (n \choose 1) (n-1)! + (n \choose 2) (n-2)! - (n \choose 3) (n-3)! \dots (n \choose n) 1!
 = n! ( \sum_{k=0}^{n} frac{ (-1)^k }{ k! } )
\approx n! e^{-1}
$$

Since there are $n!$ total configurations, the probability of a permutation not leaving any position fixed is:

$$
 = \frac{n! e^{-1} }{n!} = \frac{1}{e}
$$



The inclusion-exclusion princple works by progressively subtracting
off further refinements of 
There are $n!$ possible permutations but
First is all $n!$ possible permutations, then subtracting the 


Labelled Box Problem
---

There are $n$ boxes each assigned randomly a unique number from $1$ to $n$ (inclusive) and
$n$ participants each assigned a unique number from $1$ to $n$ (inclusive).
Each participant can examine half of the boxes, with the ability to choose later
boxes depending on what was seen previously.
No participant is allowed to communicate once the process starts.

Find a reasonable lower bound on the probabiliy of each participant seeing their own
number.

By considering the numbers in the boxes as permutations, each participant can
start with the box position of the number they've been assigned and continue on,
jumping to the subsequent box positions from the revealed number after each box opening.

The probability each participant sees their own number in this process is the the chance
that the "box permutation" has a maximum cycle less than or equal to $\lfloor \frac{n}{2} \rfloor$.

The trivial cycle permutation $(1,2,3,\dots,n)$ has $(n \choose l)$ ways to choose a
particular cycle of length $l$.
In disjoint cycle notation, it should be clear that for a cycle of length $l$, there are
$l!$ different presentations.
The remaining elements can be permuted arbitrarily yielding the number of cycles of length $l$:

$$
(n \choose l) \cdot l! \cdot (n-l)! = \frac{n!}{l}
$$

Summing over all cycles of length $l > \lfloor \frac{n}{2} \rfloor$:

$$
\sum_{l=\lfloor \frac{n}{2} \rfloor +1} \frac{n!}{l} =
n! \sum_{l=\lfloor \frac{n}{2} \rfloor + 1} \frac{1}{l} =
n! ( H_n - H_{\lfloor \frac{n}{2} \rfloor + 1} )
$$

The total number of permutations is $n!$, so the resulting probability of having no cycle
greater than $\lfloor \frac{n}{2} \rfloor$ is:

$$
1 - 100! (H_{n} - H_{\lfloor \frac{n}{2} \rfloor + 1})
$$

Since $ \lim_{n \to \infty} (H_n - \ln n) = \gamma $, we get:

$$
\lim_{n \to \infty} ( 1 - (H_{n} - H_{\lfoor \frac{n}{2} \rfloor + 1} ) ) = 1 - (\gamma - \gamma) - \ln 2 = 1 - \ln 2
$$


Unfair Coin
---

Given an unfair coin with unknown probability $p$ of landing heads, find a reasonably efficient
process that yields $0.5$ proabibility and estimate the time it takes to 'draw'
from the resulting fair distribution.

$$
Pr( H T ) = Pr( T H ) = p (1-p) = (1-p) p
$$


