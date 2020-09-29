Assorted Small Probability Problems
===

Coupon Collector
---

Find the expected time, $T$, to wait to collect $n$ different coupons, each appearing with probability $\frac{1}{n}$.

Assign the random variable $X_t$ to be the time taken to see a new coupon once $t$ have already been collected.

$$ X_0 = 1 $$

$$
\begin{align}
E[X_t] & = \sum_{k=1}^{\infty} k (\frac{t}{n})^{k-1} (1 - \frac{t}{n}) \\\\
  & = (1 - \frac{t}{n}) ( \sum_{k=0}^{\infty} k (\frac{t}{n})^k + \sum_{k=0}^{\infty} (\frac{t}{n})^k ) \\\\
  & = (1 - \frac{t}{n}) ( \frac{ \frac{t}{n}  }{ (1 - \frac{t}{n} )^2 } + \frac{1}{1 - \frac{t}{n}} ) \\\\
  & = \frac{n}{n-t}
\end{align}
$$

$$
E[T] = E[ \sum_{t=0}^{n-1} X_t ]
$$

Since the expectation is independent

$$
\begin{align}
E[ \sum_{t=0}^{n-1} X_t ] & = \sum_{t=0}^{n-1} E[X_t] \\\\
 & = \frac{n}{n} + \frac{n}{n-1} + \frac{n}{n-2} + \cdots + \frac{n}{1} \\\\
 & = \sum_{t=0}^{n-1} \frac{n}{n-t} \\\\
 & = n ( \sum_{t=0}^{n-1} \frac{1}{n-t} ) \\\\
 & = n \cdot H_n
\end{align}
$$

Where $H_n$ is the $n$-th harmonic number.

$$
\begin{align}
E[T] & = n \cdot H_n \\\\
 & = n \log n + \gamma n + \frac{1}{2} + O(\frac{1}{n}) \\\\
 & \approx n \log n & 
\end{align}
$$

Birthday Problem
---

$n$ people are assigned a random integer uniformly at random from $[1,m]$.
For a given probability $p$, what is the relationship to $n$ and $m$ that
at least two people have the same number.

* $Q_{n,m}$ the probability that no two of $n$ people with $m$ numbers have a number in common

$$
\begin{align}
Q_{n,m} & = \prod_{t=1}^{n} (1 - \frac{t}{m}) \\\\
 & \le \prod_{t=1}^{n} e^{-\frac{t}{m}} \\\\
 & = \exp( -\sum_{t=1}^{n} \frac{t}{m} ) \\\\
 & = \exp( -\frac{ {n+1 \choose 2 } }{m} ) \\\\
 & = \exp( -\frac{n (n+1)}{2 m} )
\end{align}
$$

$$
p \approx 1 - \exp( -\frac{n (n+1)}{2 m} )
$$

$$
\to \log \frac{1}{1-p} \approx \frac{ n (n+1)}{2 m}
$$

For $n >> 1$ we can approximate further:

$$
\begin{align}
 & \to \log \frac{1}{1-p} \approx \frac{ n^2 }{2 m} \\\\
 & \to n \approx \sqrt{ 2 m \log \frac{1}{1-p} } \\\\
\end{align}
$$

For $m=365$ we get $n \approx 22.494...$.


Weighted Birthday Problem
---

Consider $n$ bins with $t$ balls being thrown in them.
Bin $j$ has probability $p_j$ of receiving a ball.

$$
\begin{align}
\vec{p} = ( p_0, p_1, \cdots, p_{n-1}) \\\\
\sum_{j=0}^{n-1} p_j = 1
\end{align}
$$

Call the random variable $X_{t,k}$ the number of bins that have $k$ balls after $t$ throws.

**Claim**:

$$
E[X_{t,k}] \le \frac{t^k}{k!} \sum_{j=0}^{n-1} p_j^k
$$

*Proof*:

Call the random variable $Y_{t,j}$ the number of balls in bin $j$ after $t$ throws.

$$
\begin{align}
 X_{t,k} & = \sum_{j=0}^{n-1} Y_{t,j} \\\\
\to E[X_{t,k}] & = E[ \sum_{j=0}^{n-1} Y_{t,j} ] \\\\
 & = \sum_{j=0}^{n-1} E[Y_{t,j}] 
\end{align}
$$

By linearity of expectation.

$ Y_{t,j} \sim \text{Bin}(k,t,p_j) $:

$$
\begin{align}
E[Y_{t,j}] & = {{t}\choose{k}} p_j^k (1-p_j)^{n-k} \\\\
 & \le \frac{ (t)_k }{ k! } p_j^k \\\\
 & \le \frac{ t^k }{k!} p_j^k  \\\\
\end{align}
$$

$$
\begin{align}
 E[X_{t,k}] & = \sum_{j=0}^{n-1} E[Y_{t,j}] \\\\
 & \le \frac{t^k}{k!} \sum_{j=0}^{n-1} p_j^k \\\\
 & = \frac{t^k}{k!} || \vec{p} ||_k^k
\end{align}
$$

---

In particular, after $t$ throws, the expectation for a birthday like problem ($k=2$) is:

$$
E[X_{t,2}] \le \frac{t^2}{2} \sum_{j=0}^{n-1} p_j^2
$$

To find the time at which we expect to have at least one collision, we can set $E[X_{t,2}]=1$ and solve
for $t$:

$$
\begin{align}
t & \ge \sqrt{ 2 \sum_{j=0}^{n-1}p_j^2 } \\\\
\to t & \ge \sqrt{2} ||\vec{p}||_2 
\end{align}
$$

For the case $p_j = \frac{1}{n}$, setting $E[X_{t,2}]=1$ and solving for $t$, we get:

$$
\begin{align}
  1 & \le \frac{t^2}{2} \sum_{j=0}^{n-1} \frac{1}{n^2} \\\\
\to  t^2 & \ge \frac{2}{ \frac{1}{n} } \\\\
\to  t^2 & \ge 2 n \\\\
\to  t & \ge \sqrt{2 n} \\\\
\end{align}
$$

which is on the order of the standard birthday problem.

([ref](https://github.com/abetusk/papers/blob/release/Probability/MSR-TR-2014-153.pdf))

Best Choice Problem
---

$n$ candidates, with each that can be ranked relative to the others.
The candidates file in one at a time and are ranked relative to the candidates
already seen.
When each candidate is first seen, a decision is made to accept or reject them.

Find the optimal stopping point to maximize the likelihood of getting the ideal candidate.

One strategy is a "wait then choose" strategy, where $r$ of $n$ candidates are considered
and then the next candidate chosen that is better than all of the $r$ previously seen.

With this in mind, the probability becomes:

$$
\begin{align}
P(r) & = \sum_{k=1}^{n} \Pr \\{ \text{ candidate k chosen } \& \text{ candidate k is best } \\} \\\\
 & = \sum_{k=1}^{n} \Pr \\{ \text{ next best candidate in} \in [1 \dots r] | \text{ candidate k is best } \\} \\\\
 & = \sum_{k=r+1}^{n} \frac{r}{k-1} \cdot \frac{1}{n} \\\\
 & = \frac{r}{n} \sum_{k=r}^{n-1} \frac{1}{k} \\\\
 & = \frac{r}{n} ( H_{n-1} - H_{r} )
\end{align}
$$

Consider

$$
\begin{align}
f(r) & = \frac{r}{n} ( H_{n-1} - H_{r} ) \\\\
 & \approx \frac{r}{n} ( \ln(n) - \ln(r) )
\end{align}
$$

If $f(r)$ was continuous and had a single global maximum in the range of $[1 \dots n]$,
we could find the maximum by evaluating the derivative of $f(r)$ at 0.

That is:

$$
\begin{align}
 \frac{d}{dr} f(r) & \approx \frac{d}{dr} ( \frac{r}{n} ( \ln(n) - \ln(r) ) \\\\
 & = \ln(n) - \ln(r) - 1
\end{align}
$$

$$
\begin{align}
\to & \ln(n) - \ln(r) - 1 & = 0 \\\\
\to & \frac{r}{n} = \frac{1}{e}
\end{align}
$$

Meaning, the best strategy is to wait to see $\frac{n}{e}$ candidates and then take the
next best one.

Hat Derangement
---

$n$ people each take a random hat out of a bag after throwing them all in.
Find the probability of no person getting their own hat back.

A crude way to do this is just consider the probability of a person randomly choosing a hat
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
\begin{align}
 & |S| - |F_0 \cup F_1 \cup F_2 \cup \dots \cup F_{n-1}| \\\\
 & = |S| - \sum_{k=0}^{n-1} |F_k| + \sum_{k=0}^{n-1} \sum_{k'=k+1}^{n-1} |F_k \cap F_{k'}| - \dots + (-1)^{n-1} |F_0 \cap F_1 \cap \dots \cap F_{n-1}|
\end{align}
$$

Symmetry of the sets allows us to consolidate the counts:

$$
\begin{align}
 & = n! - \binom{n}{1} (n-1)! + \binom{n}{2} (n-2)! - \binom{n}{3} (n-3)! + \dots + (-1)^{n-1} \binom{n}{n} 1! \\\\
 & = \sum_{k=0}^{n-1} (-1)^k \binom{n}{k} (n-k)!  \\\\
 & = n! ( \sum_{k=0}^{n} \frac{ (-1)^k }{ k! } ) \\\\
 & \approx n! e^{-1}
\end{align}
$$

Since there are $n!$ total configurations, the probability of a permutation not leaving any position fixed is:

$$
\begin{align}
 & = \frac{n! e^{-1} }{n!}  \\\\
 & = \frac{1}{e}
\end{align}
$$

Labeled Box Problem
---

There are $n$ boxes each assigned randomly a unique number from $1$ to $n$ (inclusive) and
$n$ participants each assigned a unique number from $1$ to $n$ (inclusive).
Each participant can examine half of the boxes, with the ability to choose later
boxes depending on what was seen previously.
No participant is allowed to communicate once the process starts.

Find a reasonable lower bound on the probability of each participant seeing their own
number.

By considering the numbers in the boxes as permutations, each participant can
start with the box position of the number they've been assigned and continue on,
jumping to the subsequent box positions from the revealed number after each box opening.

The probability each participant sees their own number in this process is the the chance
that the "box permutation" has a maximum cycle less than or equal to $\lfloor \frac{n}{2} \rfloor$.

The trivial cycle permutation $(1,2,3,\dots,n)$ has $\binom{n}{l}$ ways to choose a
particular cycle of length $l$.
In disjoint cycle notation, it should be clear that for a cycle of length $l$, there are
$l!$ different presentations.
The remaining elements can be permuted arbitrarily yielding the number of cycles of length $l$:

$$
\begin{align}
& \binom{n}{l}  \cdot l! \cdot (n-l)! \\\\
& = \frac{n!}{l}
\end{align}
$$

Summing over all cycles of length $l > \lfloor \frac{n}{2} \rfloor$:

$$
\begin{align}
 & \sum_{l=\lfloor \frac{n}{2} \rfloor +1} \frac{n!}{l} \\\\
 & = n! \sum_{l=\lfloor \frac{n}{2} \rfloor + 1} \frac{1}{l} \\\\
 & = n! ( H_n - H_{\lfloor \frac{n}{2} \rfloor + 1} )
\end{align}
$$

The total number of permutations is $n!$, so the resulting probability of having no cycle
greater than $\lfloor \frac{n}{2} \rfloor$ is:

$$
1 - (H_{n} - H_{\lfloor \frac{n}{2} \rfloor + 1})
$$

Since

$$ \lim_{n \to \infty} (H_n - \ln n) = \gamma $$

we get:

$$
\begin{align}
 & \lim_{n \to \infty} ( 1 - (H_{n} - H_{\lfloor \frac{n}{2} \rfloor + 1} ) ) \\\\
 & = 1 - (\gamma - \gamma) - \ln 2 \\\\
 & = 1 - \ln 2
\end{align}
$$


Unfair Coin
---

Given an unfair coin with unknown probability $p$ of landing heads, find a reasonably efficient
process that yields $0.5$ probability and estimate the time it takes to 'draw'
from the resulting fair distribution.

$$
\Pr \\{ H T \\} = \Pr \\{ T H \\} = p (1-p) = (1-p) p
$$
