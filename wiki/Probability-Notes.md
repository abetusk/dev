Probability Notes
===

By convention:

$$
E^n[X] \stackrel{def}{=} (E[X])^n
$$


Independence of Expectation (finite)
---

**Claim**:

$$
E[ \sum_{k=0}^{n-1} X_k ] = \sum_{k=0}^{n-1} E[X_k]
$$

*Proof*:

$$
\begin{align}
E[ X + Y ] & = \int \int (s + t) \Pr\\{ X = s \  \& \ Y = t \\} \ ds \ dt \\\\
 & = \int \int s \Pr \\{ X = s \ \& \  Y = t \\} \ ds \ dt + \int \int t \Pr \\{ X = s \ \& \ Y = t \\} \ ds \ dt \\\\
 & = \int \int s \Pr \\{ X = s \ \& \ Y = t \\} \ dt \ ds + \int \int t \Pr \\{ X = s \ \& \ Y = t \\} \ ds \ dt \\\\
 & = \int s \Pr \\{ X = s \\} \ ds + \int t \Pr \\{ Y = t \\} \ dt \\\\
 & = E[X] + E[Y]
\end{align}
$$

Induction can be used to extend to the general case:

$$
E[ \sum_{k=0}^{n-1} X_k ] = \sum_{k=0}^{n-1} E[X_k]
$$

Bayes' Theorem
---


$$
\Pr\\{ A | B \\} = \frac{ \Pr\\{ A \& B \\} }{ \Pr\\{ B \\} }
$$

$$
\Pr\\{ B | A \\} = \frac{ \Pr\\{ A \& B \\} }{ \Pr\\{ A \\} }
$$

$$
\Pr\\{ A | B \\} = \frac{ \Pr\\{ B | A \\} \Pr\\{ A \\} }{ \Pr\\{ B \\} }
$$


Variance
---

$$ \mathrm{Var}[X] \stackrel{def}{=} E[(X - E[X])^2] = E[X^2] - (E[X])^2 $$

Moment Generating Functions
---

$$
M_X(t) \stackrel{def}{=} E[ e^{t X} ] = \sum_{k=0}^{\infty} \frac{t^k E[X^k]}{k!}
$$

---

If $X$ and $Y$ and independent random variables, then:

$$
M_{X + Y}(t) = E[ e^{t(X + Y)} ] = E[ e^{tX} e^{tY} ] = M_X(t) \cdot M_Y(t)
$$

---

$$
\begin{align}
\frac{d^n}{dt} M_X(t) & = \frac{d^{(n)}}{dt} (  \sum_{k=0}^{\infty} \frac{t^n E[X^n]}{k!} ) \\\\
 & = \sum_{k=n} \frac{t^{k-n} E[X^k]}{(k-n)!} \\\\
\to \frac{d^n}{dt} M_X(0) & = E[X^n]
\end{align}
$$


Jensen's Inequality
---

**Claim**:

If $f(x)$ is a convex function, then:

$$
E[f(X)] \ge f(E[X])
$$

*Proof*:

Taylor's theorem gives us:

$$
\exists\ c : f(x) = f(\mu) + f'(\mu)(x - \mu) + \frac{f''(c)(x-\mu)^2}{2}
$$

Since $f(x)$ is concave, we know:

$$
f(\mu) + f'(\mu)(x - \mu) + \frac{f''(c)(x-\mu)^2}{2} \ge f(\mu) + f'(\mu)(x-\mu)
$$

This gives us:

$$
E[f(X)] \ge E[ f(\mu) + f'(\mu)(X - \mu) ]
$$

Choose $ \mu = E[X] $:

$$
\begin{align}
E[ f(\mu) + f'(\mu)(X-\mu) ] & = E[ f(E[X]) + f'(E[X])(X - E[X]) ] \\\\
 & = E[ f( E[X] ) ]  + f'(E[X])(E[X] - E[E[X]]) \\\\
 & = f(E[X]) + 0 \\\\
\end{align}
$$

$$
\to E[f(X)] \ge f(E[X])
$$

Markov's Inequality
---

**Claim**:

$$
X \ge 0, a > 0
$$

$$
\Pr \\{ X \ge a \\} \le \frac{E[X]}{a}
$$

*Proof*:

Since $X \ge 0$ and $a > 0$:

$$
\begin{align}
E[X] & = \int_0^{\infty} t\ p_X(t) dt \\\\
 & = \int_0^{a} t\ p_X(t) dt + \int_a^{\infty} t\ p_X(t) dt \\\\
 & \ge \int_{a}^{\infty} t\ p_X(t) dt \\\\
 & \ge \int_{a}^{\infty} a\ p_X(t) dt \\\\
 & = a \int_{a}^{\infty} p_X(t) dt \\\\
 & = a \Pr\\{ X \ge a \\} \\\\
\end{align}
$$

$a > 0$, so we can divide:

$$
\to \Pr\\{X \ge a \\} \le \frac{E[X]}{a}
$$

Chebyshev's Inequality
---

**Claim**:

$$
a > 0
$$

$$
\Pr\\{|X - E[X]| \ge a \\} \le \frac{ \mathrm{Var}[X] }{a^2}
$$

*Proof*:

$$
\begin{align}
\Pr\\{ |X - E[X]| \ge a \\} & = \Pr\\{ (X - E[X])^2 \ge a^2 \\} \\\\
 & \le \frac{E[ (X-E[X])^2 ]}{a^2} \\\\
 & = \frac{\mathrm{Var}[X]\}{a^2}
\end{align}
$$

By Markov's and the definition of variance.


Chernoff Bound
---

$$
X \ge 0, a > 0
$$

$$
\Pr\\{ X \ge a \\} = \Pr\\{ e^{tX} \ge e^{ta} \\} \le \frac{E[e^{tX}]}{e^{ta}}
$$

$$
\Pr\\{ X \ge a \\} \le \min_{t>0} \frac{E[e^{tX}]}{e^{ta}}
$$

This can be seen by a straight forward application of Markov's inequality.
The parameter $t$ can be chosen to taste.



###### 2018-08-04
