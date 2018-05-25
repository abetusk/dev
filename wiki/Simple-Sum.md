Simple Sums
===

$$ 0 < p < 1, p  \in \mathbb{R}$$

---

$$
\begin{align}
\sum_{k=0}^{\infty} p^k = \frac{1}{1-p}
\end{align}
$$

Proof:

$$
\begin{align}
S & = \sum_{k=0}^{\infty} p^k
\end{align}
$$

$$
\begin{align}
\sum_{k=0}^{\infty} p^k & = 1 + \sum_{k=1}^{\infty} p^k
\end{align}
$$

$$
\begin{align}
p S &= \sum_{k=0}^{\infty} p^{k+1} \\\\
 &= \sum_{k=1}^{\infty} p^k \\\\
\end{align}
$$

$$
\begin{align}
S - p S   &= 1 \\\\
S &= \frac{1}{1-p} \\\\
\end{align}
$$

---

$$
\begin{align}
\sum_{k=0}^{s-1} p^k = \frac{1-p^s}{1-p} \\\\
\sum_{k=s}^{\infty} p^k = \frac{p^s}{1-p}
\end{align}
$$

Proof:

$$
\begin{align}
\sum_{k=0}^{s-1} p^k &= \sum_{k=0}^{\infty} p^k - \sum_{k=s}^{\infty} p^k \\\\
  &= \sum_{k=0}^{\infty} p^k - p^s \sum_{k=0}^{\infty} p^k \\\\
  &= \frac{1}{1-p} - \frac{p^s}{1-p} \\\\
  &= \frac{1 - p^s}{1-p} \\\\
\end{align}
$$

$$
\begin{align}
\sum_{k=s}^{\infty} p^k &= p^s \sum_{k=0}^{\infty} p^k \\\\
   &= \frac{p^s}{1-p} \\\\
\end{align}
$$

---

$$
\begin{align}
\sum_{k=0}^{\infty} k p^k = \frac{p}{(1-p)^2}
\end{align}
$$

Proof:


$$
\begin{align}
S' &= \sum_{k=0}^{\infty} k p^k \\\\
p S' &= \sum_{k=0}^{\infty} k p^{k+1} \\\\
 &= \sum_{k=1}^{\infty} (k - 1) p^{k} \\\\
 &=  \sum_{k=1} k p^k - \sum_{k=1} p^k \\\\
 &=  S' - \frac{p}{1-p} \\\\
p S' - S' &= - \frac{p}{1-p} \\\\
S' (p - 1) &= - \frac{p}{1-p} \\\\
S' (1 - p) &= \frac{p}{1-p} \\\\
S' &= \frac{p}{(1-p)^2} \\\\
\end{align}
$$

$$
\begin{align}
\end{align}
$$



###### 2018-05-25
