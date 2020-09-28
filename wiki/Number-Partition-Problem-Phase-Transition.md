Notes on Phase Transitions for the Number Partition Problem
===

The Number Partition Problem (NPP) is, given $n$ integers, find a partition
such that the sum of each is equal.

Another way to formulate:

$$
\begin{align}
 & n, m, a_k \in \mathbb{Z}, \ M = 2^m \\\\
 & \exists \ \ \sigma_k \in \{ 0,1 \}  \ s.t.\\\\
 & \sum_{k=0}^{n-1} \sigma_k a_k = 0
\end{align}
$$

If we take an ensemble to be all instances for a given $n$ and $a_k$ chosen
in the uniform interval from $[1, 2, \dots, M]$, then this is the "uniform
random NPP" (UR-NPP) problem.

Gent and Walsh observed that the probability of a number of $m$ bits long
being all $0$ is $2^{-m}$ whereas the number of configurations is $2^n$.
If we ignore carry, then we can get intuition about the expected number
of solutions by observing $ \frac{2^m}{2^n} > 0 $ when $ m > n $.

In other words, for a random instance of the uniform NPP, we would expect
to see a transition when the number of bits exceeds the list length.

If we want to get intuition about the probability of a solution existing,
we can pretend each configuration has no carry and is independent to notice that
$(1-2^{-m})^{2^n}$ is the probability that no instance will have a solution.

If we take $ m = \kappa_n n $, then, with the above caveats and some questionable
manipulation, the probability becomes:

$$
\begin{align}
 & 1 - (1 - \frac{1}{2^{m}})^{2^{n}} \\\\
 = & 1 - (1 - \frac{1}{2^{m}})^{2^{m + n - m}} \\\\
\approx & 1 - \exp( - 2^{n-m}) \\\\
 = & 1 - \exp( -2^{-\kappa_n (n-1)})
\end{align}
$$

Borgs, Chayes, and Pittel (BCP) provide rigour to the uniform random NPP.
They introduce a parameter, $\lamba_n$:

$$
\begin{align}
 & \lambda_n = m - n + \frac{lg(n)}{2n} \\\\
 = & \kappa_n n - n + \frac{lg(n)}{2n}
\end{align}
$$

Where $m = \kappa_n n$ as above.

In some vague sense, the extra $\frac{lg(n)}{2n}$ is a term accounting for
the carry from the addition.

BCP use an integral representation for the number of solutions, where $X_k$ are independent, identically distributed
random variables chosen over the integral range of $1$ to $M = 2^m$:

$$
Z_{n} = \frac{1}{2 \pi} \int_{-\pi}^{\pi} \sum_{k=0}^{n-1} (e^{-X_k \theta} + e^{X_k \theta}) d\theta 
$$

For a perfect partition, the integral over the expanded summation will be non zero iff there is a perfect partition.

Taking expectations, fiddling and noticing independence:

$$
\begin{align}
E[Z_{n}] = &
E[ \frac{1}{2 \pi} \int_{-\pi}^{\pi} \sum_{k=0}^{n-1} (e^{- X_k i \theta} + e^{ X_k i \theta})d\theta ] \\\\
= & \frac{1}{2\pi} \int_{-\pi}^{\pi} (E[e^{- X i \theta} + e^{ X i \theta}])^nd\theta  \\\\
= & \frac{1}{2\pi} \int_{-\pi}^{\pi} ( \frac{2}{M}\sum_{k=0}^{M-1}  \cos( k \theta))^n d\theta \\
= & \frac{2^{n(1-m)}}{2\pi} \int_{-\pi}^{\pi} ( \frac{\sin((M+\frac{1}{2})\theta)}{2\sin(\theta/2)} - \frac{1}{2} )^n d\theta \\
\end{align}
$$



References
---

* C. Borgs, J. Chayes, B. Pittel, Phase Transition and Finite-Size Scaling for the Integer Partitioning Problem, [p](https://github.com/abetusk/papers/blob/release/ComputerScience/Phase-Transition-and-Finite-size-Scaling-for-the-Integer-Partitioning-Problem.pdf)
* I.P. Gent, T. Walsh, Phase Transitions and Annealed Theories: Number Partitioning as a Case Study, [p](https://github.com/abetusk/papers/blob/release/ComputerScience/Phase_transitions_and_annealed_theories.pdf)
