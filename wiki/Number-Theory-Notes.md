Number Theory Notes
===

Wilson's Theorem
---

$p$ prime

$$
\prod_{i=1}^{p-1} (i) \mod p \equiv -1 \mod p
$$

*proof*:

$$
\begin{equation} \label{eq1}
\begin{split}
\prod_{i=1}^{p-1} (i) & = 1 \cdot 2 \cdot 3 \cdots (p-1) \\\\
  & = (a_0 a_0') (a_1 a_1^{-1}) \cdots (a_{\frac{p-1}{2}} a_{\frac{p-1}{2}}^{-1}) \\\\
  & = [1]
\end{split}
\end{equation}
$$

Where $a_0=1$ and $a_0' = -1$.

*lemma*:

The only number whose inverse is itself is $(-1)$

*lemma proof*:

$$
\begin{split}
x^2 & = 1 \mod p \\\\
 & = \pm 1 \mod p
\end{split}
$$

Since $p$ is prime, there are only two solutions.

*proof (cont'd)*:

$$
\begin{split}
 \to [1] & = (1 \cdot -1) (a_1 a_1^{-1}) (a_2 a_2^{-1}) \cdots (a_{\frac{p-1}{2}} a_{\frac{p-1}{2}}^{-1}) \\\\
 & = (1 \cdot -1) (1) (1) \cdots (1) \\\\
 & =  -1
\end{split}
$$

---

Fermat's Theorem
---

$p$ prime

$$
\begin{split}
x^{p-1} = 1 \mod  p
\end{split}
$$

*proof*:

$a \ne 0$

$$
\begin{align}
 & & -1 & = 1 \cdot 2 \cdot 3 \cdot 4 \cdots (p-1) \mod p \\\\
\to & & -a^{p-1} & = (a \cdot 1) (a \cdot 2) (a \cdot 3) \cdots (a \cdot (p-1)) \mod p \\\\
\to & & -a^{p-1} & = 1 \cdot 2 \cdot 3 \cdot 4 \cdots (p-1) \mod p \\\\
\to & & -a^{p-1} & = -1 \mod p \\\\
\to & & a^{p-1} & = 1 \mod p
\end{align}
$$

Since $a \cdot x$ is 1-1 and onto for prime $p$ (with $a,x \ne 0$).


Legendre Symbol
---

$p$ prime

$$
\left( \dfrac{a}{p} \right)  = \begin{cases}
 1, & \text{ if } \sqrt{a} \text{ exists } \\\\
 0, & \text{ if } \gcd(a,p) \ne 1 \\\\
 -1, & \text{ if } \sqrt{a} \text{ does not exist }
\end{cases}
$$

*notes*:

$g$ a generator of $p$, consider $a = g^\beta$

$\beta$ even:

$$
\begin{align}
 & & g^\beta & = a \\\\
\to & & ( g^{\frac{p-1}{2}} ) )^\beta & = ( a^{\frac{p-1}{a}} ) \\\\
\to & & (-1)^\beta & = a^{\frac{p-1}{2}} \\\\
\to & & a^{\frac{p-1}{2}} & = 1 \\\\
\end{align}
$$

$\beta$ odd:

$$
\begin{align}
\to & & (-1)^\beta & = a^{\frac{p-1}{2}} \\\\
\to & & a^{\frac{p-1}{2}} & = -1 \\\\
\end{align}
$$

So:

$$
\left( \dfrac{a}{p} \right) = a^{\frac{p-1}{2}}
$$

---

Zeta Function
---

$$
\begin{split}
\sum_{n=1}^{\infty} \frac{1}{n^s} & = \prod_{p \text{ prime}}^{\infty} ( \frac{1}{1 - p^{-s}} )
\end{split}
$$

*proof*:

$$
\begin{align}
& & \sum_{i=1}^{\infty} a^i & = S \\\\
& & \sum_{i=0}^{\infty} a^{i+1} & = \sum_{i=1}^{\infty} a^i  \\\\
& &  & = S a \\\\
& & & \\\\
& &  S - S a & = 1 \\\\
\to & & S & = \frac{1}{1-a}
\end{align}
$$

Write out the product of infinit series of primes, $p_i$:

$$
\begin{align}
 & ( 1 + p_0^{-s} + p_0^{-2s} + p_0^{-3s} + \cdots ) \\\\
 & ( 1 + p_1^{-s} + p_1^{-2s} + p_1^{-3s} + \cdots ) \\\\
 & \cdots \\\\
 & = \prod_{p \text{ prime}}^{\infty} [ \sum_{i=0}^{\infty} \frac{1}{p^{i s}} ] \\\\
 & = \prod_{p \text{ prime}}^{\infty} ( \frac{1}{1-p^{-s}} )
\end{align}
$$

Any choice of terms in the product of infinite sums of primes will yield a value in the
original $\sum \frac{1}{n^s}$.

---

###### 2019-01-10
