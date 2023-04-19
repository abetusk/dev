Permutation Group
===

Consider a group $G$ that acts on a set $X$.
(Without loss of generality?) assume $X$ consists of $N$ array elements,
each of which is $n$ long with each entry drawn from $m$ values.

The permutation group element, $g \in G$, acts on elements $x \in X$ by
permuting the elements $g \cdot x \in X$.

As a canonical example, consider a $3 \times 3$ grid with two colors and
the group symmetries of a square:

Call two elements of $X$ similar, $x \sim _ G y$ if $\exists \ g \in G \ s.t. y = g \cdot x$.

Call the orbit of an element $x$, $O _ x = \{ y : g \in G, y = g \cdot x \in X \}$.

Call the stabilizer of an $x$, $S _ x = \{ g : g \in G, g \cdot x = x \}$.

---

Claim: $\sim _ G$ is an equivalence relation

$$
\begin{array}{ll}
 \varepsilon \in G & \to \varepsilon \cdot x = x \\
 & x \sim _ G x \\
x \sim _ G y, & \to g \cdot x = y \\
 & \to x = g^{-1} y \\
 & \to y \sim _ G x \\
x \sim _ G y, & y \sim _ G z \\
 & \to g \cdot x = y, \ \  h \cdot y = z \\
 & \to g \cdot x = h^{-1} z \\
 & \to h \cdot g \cdot x = z \\
 & \to x \sim _ G z \\
\end{array}
$$

---

Claim: $S  _ x \le G$

$$
\begin{array}{ll}
\varepsilon \in S_x, & \varepsilon \cdot x = x \\
g \in S_x \to g^{-1} \in S_x, & g \cdot x = x \\
 & \to g^{-1} \cdot g \cdot x = g^{-1} x \\
 & \to x = g^{-1} x \\
\end{array}
$$

---

Claim: $|O _ x| \times |S _ x| = |G|$

We must show $|O _ x| = | [ G : S _ x ] |$

$$
\begin{array}{ll}
g S _ x = h S _ x & \iff h^{-1} g S _ x = S _ x \\
 & \iff h^{-1} g \in S _ x \\
 & \iff h^{-1} g x = x \\
 & \iff  g \cdot x = h \cdot x \\
\end{array}
$$

---

Claim: $\frac{1}{|G|} \sum _ {x \in X} |S _ x|$ is the number of distinct orbits

Suppose $k$ orbits, $\{ O _ {x _ 0}, O _ {x _ 1}, O _ { x _ 2}, \dots , O _ { x _ { k-1} } \}$

$$
\begin{array}{ll}
\sum _ {x \in O _ { x _ j } } |S _ {x}|  &  = \sum _ {x \in O _ {x _ j} } \frac{ |G| }{ |O _ x| } \\
 & = \sum _ {x \in O _ {x _ j} } \frac{ |G| }{ |O _ {x _ j}| } \\
 & = |G| \\
\frac{1}{|G|} \sum _ {x \in X} |S _ x| & = \frac{1}{|G|} \sum _ {j=0}^{k-1} \sum _ {x \in O _ {x _ j}} |S _ x| \\
 & = \frac{1}{|G|} \sum _ {j=0}^{k-1} |G| \\
 & = k
\end{array}
$$

Burnside's Theorem (Frobenius)
---

$$
\begin{array}{l}
\text{Fix}(g) = \{ x \in X | g \cdot x = x \} \\
\sum _ { g \in G } | \text{Fix}(g) | = \sum _ {x \in X} | S _ x |
\end{array}
$$


###### 2023-04-18
