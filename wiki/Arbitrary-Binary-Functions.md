Arbitrary Binary Functions
===

$$
x \in \mathbb{B}^n \\\\
 \\\\
f(X): \\{0,1\\}^n \mapsto \\{0,1\\}
$$

There are $2^{2^n}$ different binary functions.
Can we approximate this with less than $\frac{2^n}{2n}$ boolean gates?

The strategy to show we can't is to overcount the number of boolean gates.

$$
\begin{align}
 m & & \text{ boolean gates } (\frac{2^n}{2n}) \\\\
 n & & \text{ inputs }
\end{align}
$$

One gate has $\binom{n+m}{2}$ choice of other gates that can connect to it (two inputs).

$$
\begin{align}
 \binom{n+m}{2} & = \frac{ (n+m) (n+m-1) }{2} \\\\
 & = \frac{ n^2 + 2mn + n^2 - n - m }{2} \\\\
 \frac{n^2 + 2mn + n^2 - n -m }{2} & < (n + m)^2 \\\\
 & < (c + n)m^2 \\\\
\end{align}
$$

$((n+c)m^2)^m$ different combinations of boolean gates

$$
\lg = \log_2
$$

$$
\begin{align}
 \lg[ ((n+c)m^2)^m] & = m \lg((n+c)m^2) \\\\
 = \frac{2^n}{2n} \lg(\frac{2^2n}{2n^2}(n+c) ) & = \frac{2^n}{2n} [ 2n + \lg(\frac{n+c}{2n^2}) ] \\\\
 = 2^n [1 - \frac{ \lg( \frac{2n^2}{n+c} ) }{2n} ] & < \lg(2^{2^n}) = 2^n
\end{align}
$$



Even when we overcount, we still can't the count large enough to represent all binary functions.
