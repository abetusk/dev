Simple Inequalities
===

For (real), bounded, continuous functions of one variable,
explicit formulas for the error term of the remainder on the Taylor
series can be used to get bounds on functions.

Let $f: \mathbb{R} \to \mathbb{R}$ be $n+1$ differentiable over
a closed interval between $x_0$ to $x$, then:

$$
\begin{array}{l}
\exists x _ * , & x _ 0 \le x _ * \le x , \\
f(x) & = [ \sum _ { k=0 } ^ { n } \frac { f ^ { (k) }( x_0 ) } { k! } (x-x_0) ^ { k } ] + \frac { f ^ { (n+1) } ( x _ * ) } { (n+1)! } (x-x_0) ^ { n+1 } \\
\end{array}
$$

Where the last term is the Lagrange form of the mean value form of the remainder ([src](https://en.wikipedia.org/wiki/Taylor%27s_theorem)).

By restricting to an interval where you know the remainder term is of one sign, you can get explicit inequalities ([mo](https://math.stackexchange.com/questions/78261/using-taylor-series-expansion-as-a-bound)).

---

**Claim**: $1 \ge x \ge 0 , 1 - x \ge e ^ { -x }$


$$
\begin{array}{llr}
e ^ { -x } & = 1 - x e ^ { x _ * } \\
\forall x _ * , & 0 \ge x _ * \ge 1, \\
 &  0 \ge e ^ { -x _ * } \le 1 \\
 \to & -e ^ { -x _ * } \le -1 \\
 \to & -x e ^ { -x _ * } \le -x  & (x \ge 0) \\
 \to & 1 - x e ^ { -x _ * } \le 1 - x  \\
 \to & e ^ { -x } \le 1 - x \\
 \to & 1 - x \ge e ^ { -x } 
\end{array}
$$

---

**Claim**: $\frac { \pi } { 2 } \ge x \ge 0, x \ge sin(x)$

$$
\begin{array}{llr}
\sin(x) & = x - \frac { x ^ 3 } { 3! } \cos( x _ * ) \\
\forall x _ * , & 0 \le x _ * \le \frac { \pi } { 2 }, \\
 & 0 \le \cos( x _ * ) \le 1 \\
\to & \frac { x ^ 3 } { 3! } \cos( x _ * ) \ge 0 & (\frac { \pi } { 2 } \ge x \ge 0) \\
\to & -\frac { x ^ 3 } { 3! } \cos( x _ * ) \le 0 \\
\to & x -\frac { x ^ 3 } { 3! } \cos( x _ * ) \le x \\
\to & \sin( x )  \le x \\
\to & x \ge \sin( x )  \\
\end{array}
$$


---

$$
\begin{array}{llr}
n \ge k & \to & -n \le -k \\
 & \to & nk - n \le nk - k \\
 & \to & n(k - 1) \le k(n - 1) \\
 & \to & \frac{n}{k} \le \frac{n - 1}{k-1} \\
 & \to & \frac{n}{k} \le \frac{ n - 1}{k-1} \\
 & \to & ( \frac { n } { k } ) ^ k \le \prod_ { j=0 } ^ { k-1 } \frac { n-j } { k-j } \\
 & \to &  (\frac{n}{k})^k \le { n \choose k } \\
\end{array}
$$



###### 2021-03-15
