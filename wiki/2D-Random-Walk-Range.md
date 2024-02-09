2D Random Walk Range
===

This is mostly notes for myself interpreting Jian Jiao's masters thesis
"The Range of Two Diemnsional Simple Random Walk" ([paper](https://github.com/abetusk/papers/blob/release/Misc/range-of-2d-simple-random-walk_jiao.pdf)).

---

We are interested in proving that the number of unique sites visited for a random walk of length $n$ on the two dimensional lattice
scales as $\frac{\pi n}{\log n}$.

The number of unique sites visited is called the Range, or $R _ n$ for a random walk of $n$ steps. The goal is to prove:

$$
R _ n \sim \frac{\pi n}{\log n}
$$

---

Glossary:

| |
|---|
| $\bar 0 = (0,0) \in \mathbb{Z}^2$ |
| $e _ 1 = (1,0), e _ 2 = (0,1)$ |
| $\mathbb{P}\\{ X _ k = \sigma e _ i \\} = \frac{1}{4}, \sigma \in \\{-1,1\\}, i \in \\{1,2\\}$ | 
| $S _ n = {\sum} _ {k=1} ^ {n} X _ k$ |
| $p _ n ( s, t ) = \mathbb{P} \\{ S _ n = t \| S _ 0 = s \\} , s,t \in \mathbb{Z}^2$ |
| $u _ n ( s )$, probability visiting $s \in \mathbb{Z}^2$ for the first time |
| $R _ n = \| S _ 0 \cup S _ 1 \cup S _ 2 \cup \cdots \cup S _ n \|$ |
| $\gamma _ n$, indicator if $n$-th step is a unique visited spot ($1$ if so, $0$ otherwise) |
| $b _ n = \mathbb{E} [ \gamma _ n ]$ |
| $G(x) = {\sum} _ {n=0} ^ {\infty} x^n p _ n ( {\bar 0})$ |
| $F(x) = {\sum} _ {n=0} ^ {\infty} x^n u _ n ( {\bar 0})$ |

---

The overall idea is to create bridging relations by connecting:

* the probability of hitting the origin, $p _ n({\bar 0})$, to
  the probability of first hitting the origin, $u _ n({\bar 0})$
* $p _ n({\bar 0})$ and $u _ n({\bar 0})$ to their generating functions $G(x)$ and $F(x)$,
  allowing for closed form solutions/estimates as $x \to 1-$
* the probability of first hitting the origin, $u _ n({\bar 0})$ and its related
  generating functions $F(x)$ and $G(x)$ to
  the expectation of hitting a new spot, $b _ n = \mathbb{E}[\gamma _ n]$

### Range Expectation Relation

claim:

$$
\mathbb{E}[ \gamma _ n ] = \mathbb{P} \{ S _ i \ne (0, 0) , i \in [1 \dots n] \}
$$

proof:

$$
\begin{array}{ll}
\mathbb{E}[ \gamma _ n ] & = \mathbb{P} \{ \text{new site visited on n-th step} \} \\
 \to & = \mathbb{P} \{ S _ n \ne S _ {n-1}, S _ n \ne S _ {n-2}, \cdots S _ {n} \ne S _ 1, S _ n \ne S _ 0  \} \\
 \to & = \mathbb{P} \{ X _ n \ne (0,0), X _ n + X _ {n-1} \ne (0,0), \cdots {\sum} _ {k=1} ^ {n} X _ k \ne (0,0) \} \\
 \to & = \mathbb{P} \{ X _ 1 \ne (0,0), X _ 1 + X _ {2} \ne (0,0), \cdots {\sum} _ {k=1} ^ {n} X _ k \ne (0,0) \} \\
 \to & = \mathbb{P} \{ S _ i \ne (0, 0) , i \in [1 \dots n] \}
\end{array}
$$

$X _ i$ are i.i.d. so can be exchanged as above.

---

This relates origin hitting times of the origin to the range.

### First Return Convolution Relation

claim:

$$
p _ {2n}({\bar 0}) = {\sum} _ {k=1} ^ {n} u _ {2k} ({\bar 0}) p _ {2n - 2k} ({\bar 0})
$$

proof:

---

Relates the origin hitting times to the first hit times of the origin.

### First Return Generating Function Relation

claim:

$$
G(x) = \frac{1}{1 - F(x)}
$$

proof:

$$
\begin{array}{ll}
G(x) & = {\sum} _ {n=0} ^ {\infty} x^n p _ n({\bar 0}) \\\\
 & = p _ 0 ({\bar 0})  +   {\sum} _ {n=1} ^ {\infty} x^n \left( {\sum} _ {k=1} ^ {n} p _ k ({\bar 0}) u _ {n-k} ({\bar 0})  \right) \\\\
 & = p _ 0 ({\bar 0}) +  {\sum} _ {n=1} ^ {\infty} \left( {\sum} _ {k=1} ^ {n} x ^ k p _ k ({\bar 0}) x ^ {n-k} u _ {n-k} ({\bar 0})  \right) \\\\
 & =  p _ 0 ({\bar 0}) + \left( {\sum} _ {n=0} ^ {\infty} x ^ n p _ n ({\bar 0}) \right) \left( {\sum} _ {n=1} ^ {\infty}  x ^ {n} u _ {n} ({\bar 0}) \right)  \\\\
 & = p _ 0 ({\bar 0}) + G(x) F(x) \\\\
 \to & G(x) = \frac{1}{ 1 - F(x) } 
\end{array}
$$

**PROOF IS WRONG, NEED TO FIX UP**

---

Relating the generating function of the origin hitting times to the generating function of the origin first hit times.


### Killing Relation

claim:

$$
(1-x) {\sum} _ {n=0} ^ {\infty} x^n b _ n = 1 - {\sum} _ {n=1} ^{\infty} x ^n u _ n({\bar 0})
$$

proof:

Consider $(1-x)$ as the killing rate, where $x = 1 - (1-x)$ is the survival rate.

The chance that a walk returns to the origin for the first time after $n$ steps without
being killed is:

$$
a _ n (x)  = x^n u _ n({\bar 0})
$$

With the chance of returning to the origin at least once before being killed:

$$
A(x) = {\sum} _ {n=1} ^ {\infty} a _ n (x)
$$

So the chance of never returning to the origin before being killed is:

$$
1 - A(x)
$$

$b _ n = \mathbb{P}\{ S _ i \ne (0,0), i \in [1 \dots n] \}$, or, the chance of never visiting the origin
in $n$ steps.

Summing over paths where the origin hasn't been visited in $n$ steps but the walk has been killed on the $n+1$ step
is the same as summing over all paths that have never visited the origin and haven't been killed.

***STILL NOT CONVINCED, THIS NEEDS WORK***

---

Now bridging the range expectation to first origin return.

$$
\begin{array}{ll}
(1-x) {\sum} _ {n=0} ^ {\infty} x^n b _ n & = 1 - {\sum} _ {n=1} ^{\infty} x ^n u _ n({\bar 0}) \\
\to & = 1 - F(x)
\end{array}
$$

### Asymptotic Range Generating Function Value

claim:

As $x \to 1-$:

$$
{\sum} _ {n=0} ^ {\infty} x ^ n b _ n \sim \frac{\pi}{1-x} \left[ \log \left( \frac{1}{1-x} \right) \right] ^ {-1}
$$

proof:

* Stirling approximation of $p _ n ({\bar 0})$
* Definition of $G(x)$ $\to$ sum converges for $|x|<1$
* Differentiate $G(x)$ term by term, the integrate to get back $G(x)$

$$
\begin{array}{ll}
{\sum} _ {n=0} ^ {\infty} x ^ n b _ n & = \frac{1}{1-x}(1 - F(x)) \\
 & = \frac{1}{(1-x) \cdot G(x) }
\end{array}
$$

Allowing us to use the closed form of $G(x)$ to get the closed form of ${\sum} x^n b^n$.

### Tauberian Bridge Relation

claim:

As $n \to \infty$:

$$
{\sum} _ {i=0} ^ {n} b _ i \sim \frac{ \pi n }{ \log n}
$$

proof:

**TAUBERIAN NOTES IN LAWLER ET ALL**

See prop 12.5.3 ([book](https://github.com/abetusk/papers/blob/release/books/random-walk-modern-intro_lawler-limic.pdf))

###### 2024-01-23
