Littlewood Polynomial Notes
===

Littlewood polynomials are polynomials whose coeffients are drawn from
a finite set of $\{-1,1\}$.

Plotting the roots of Littlewood polynomials for a restricted degree $n$
yields pretty pictures.

---

**Claim**:

$$
\begin{align}
c_k \in \{-1, 0, 1\} & \\\\
p(z) = \sum c_k z^k & \\\\
p(z_*) = 0 & \\\\
& \to |z_{*}| \ge \frac{1}{2} \text{ or } z_{*} = 0 \\\\
\end{align}
$$

Proof (by contradiction):

$$
\begin{align}
c_0 \ne 0 & \\\\
 & \to p(z_*) = c_0 + \sum_{k=1}^{n} c_k z_{*}^k \\\\
 & \to 1 = | \sum_{k=1}^{n} c_k z_{*}^k | \\\\
 & \to 1 < \sum_{k=1}^{n} | \frac{1}{2} |^k < 1 \\\\
\end{align}
$$

[source](https://golem.ph.utexas.edu/category/2009/12/this_weeks_finds_in_mathematic_46.html#c030053)

This is sloppy and doesn't take into account degree, $n$, of the polynomial.

"In the limit", this is true, but this is violated for smaller degree polynomials.

---

In general, we can ask what are the symmetries of transformations on $z$ that will
still admit Littlewood polynomials.

Some candidates for $p(z)$ are:

* $p(z^{-1})$
* $p(z^*)$
* $p(-z)$

The complex conjugate gives the mirror symmetry about the x-axis.
The negation and complex conjugation gives the symmetry about the y-axis ($p(\alpha + i \beta) = 0 \to q(-\alpha + i \beta)=0$).
The inversion gives a kind of projection onto the Riemann sphere and/or Mobius transformation like
symmetry, giving a projection symmetry about the circle/sphere at radius 1.

---

**Claim**:

$$
\begin{align}
c_k \in \{-1, 0, 1\} & \\\\
p(z) = \sum c_k z^k & \\\\
p(z) = 0 & \to p(z^*) = 0 \\\
\end{align}
$$

---

**Claim**:

$$
\begin{align}
c_k, d_k  \in \{-1, 0, 1\} & \\\\
p(z) = \sum c_k z^k, & q(z) = \sum_d_k z^k \\\\
p(z) = 0 & \to q(z^{-1}) = 0 \\\
\end{align}
$$

That is, there exists a Littlewood polynomial whose roots are $z^{-1}$.

---

An explanation of how Dragon curves show up:

The idea is that the dragon curve can be created through in iterated
function system (IFS) by choosing randomly between $f_z(x)=1+zx$ and $g_z(x)=1-zx$
for some complex z and initial $x=0$.


The iteration of $\{f, g, -f, -g\}$ trace out all Littlewood polynomials for
initial values of $f(0)$ and $g(0)$.

For a set of "dragon-like curve" points $S_z$, from an initial $z$, if
$0 \in S_z$, this means there's a Littlewood polynomial where at least some
of the roots are at least pretty close to the points in $S_z$.


---

If we have $p(z)=0$ and $z = u^m$, then we also have $p(u^m)=0$, creating another
polynomial $q(\cdot)$ of $\deg(n) \cdot m$.
That is $q(u)=p(u^m)=p(z)=q(z^{\frac{1}{m}})$.

This provides another form of symmetry, even if it's only "probabilistic" in nature.

I suspect this is the reason for the holes around the $|z|=1$ line but I'm having
a hard time coming up with a good reason.

[see](https://golem.ph.utexas.edu/category/2009/12/this_weeks_finds_in_mathematic_46.html#c030073)

---



References
---

* [link](https://golem.ph.utexas.edu/category/2009/12/this_weeks_finds_in_mathematic_46.html)
