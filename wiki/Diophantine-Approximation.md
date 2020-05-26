Diophantine Approximation
===

Dirichlet's Approximation Theorem
---

$$
\begin{array}{c}
\forall \alpha \in \mathbb{R}, \forall n \in \mathbb{Z}_+ \\
\exists p,q \in \mathbb{Z}_+, \ \ 1 \le q \le n \\
\to | q \alpha - p | < \frac{1}{n} \\
\end{array}
$$

Consider

$$
\begin{array}{c}
r_q = q \alpha - \lfloor q \alpha \rfloor \\
r_q \in [0,1) \\
\end{array}
$$

Allow for $r_0 = 0$ and there
are $(n+1)$ points for $(0 \le q \le n)$, $r_q$, in the unit interval.
By pigeonhole, there must be two that fall in some interval $[\frac{s}{n}, \frac{s+1}{n})$ for $0 \le s < n$.

Call the two points $r_m$ and $r_l$, $m > l$.

$$
\begin{array}{cl}
& |r_m - r_l| < \frac{1}{n} \\\\
\to & | \{m \alpha\} - \{l \alpha\} | < \frac{1}{n} \\\\
\to & | (m \alpha - \lfloor m \alpha \rfloor) - (l \alpha - \lfloor l \alpha \rfloor) | < \frac{1}{n} \\\\
\to & | (m - l) \alpha - (\lfloor m \alpha \rfloor - \lfloor l \alpha \rfloor ) | < \frac{1}{n} \\\\
\end{array}
$$


$$
\begin{array}{cl}
 & q' = m - l \\\\
 & p' = (\lfloor m \alpha \rfloor - \lfloor l \alpha \rfloor )  \\\\
\to & | q' \alpha - p' | < \frac{1}{n}
\end{array}
$$

---

Rearranging,

$$
\begin{array}{cl}
& | \alpha - \frac{p}{q} | < \frac{1}{q n} < \frac{1}{q^2} \\\\
\to & | \alpha - \frac{p}{q} | < \frac{1}{q^2}
\end{array}
$$




###### 2020-05-22
