Probability Distribution Generation Notes
===

Sampling from a random variable, $X$, with a source uniform random variable $U$ (on $[0,1]$).

$$
p_U(t) = \begin{cases}
 1, & & 0 < x < 1 \\
 0, & & \text{otherwise}
\end{cases}
$$

$p_X(t)$ is the distribution in question.

$$
\begin{split}
\text{cdf}_X(s) & = \int_0^s \text{pdf}_X(t) dt \\
 & = y
$$

If $\text{cdf}_X(s)$ can be inverted, you get:

$$
s = \text{cdf}^{-1}_X{y}
$$

###### 2018-12-19
