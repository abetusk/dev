Markov Chain Notes
===

Maximum Entropy Random Walk
---

Consider an adjacency matrix $A \in \\{ 0,1 \\}^{n,n}$, with $n$ states.
We'll only concern ourselves with symmetric adjacency matrices,
so a simple, undirected graph with $A^T = A$.

Each vertex has degree $k _ i = \sum _ j A _ {i,j}$.

For a Generalized Random Walk (GRW), we can consider
a probability matrix, stationary distribution $\pi ^ {\text{GRW}} _ i$,
and trajectory $\gamma ^ {(t)} _ {i _ 0, i _ t} = (i _ 0, i _ 1, \dots, i _ {t-1}, i _ t)$:

$$
\begin{array}{ll}
P _ {i,j} & = A _ {i,j} / k _ i \\
\pi ^ {\text{GRW}}  _ i & = \frac{k _ i}{\sum _ j k _ j } \\
P(\gamma ^ {(t)} _ {i _ 0, i _ 1}) & = P _ {i _ 0, i _ 1} P _ {i _ 1, i _ 2} \cdots P _ {i _ {t-1}, i _ t} \\
& = \frac{1}{k _ {i _ 0} k _ {i _ 1} \cdots k _ {t-1} k _ t} \\
\end{array}
$$

Consider finding an eigenvalue, $\lambda$, and eigenvector, $\psi$, of $A$:

$$
A \psi = \lambda \psi
$$

($k _ {\text{min}} \le \lambda \le k _ {\text{max}}$)

Construct a new matrix $Q$:

$$
Q _ {i,j} = \frac{ A _ {i,j} }{\lambda} \frac{ \psi _ j }{\psi _ i}
$$

Which will be the Maximum Entropy Random Walk (MERW) matrix.

From this, it's easy to verify:

$$
\begin{array}{ll}
Q( \gamma ^ {(t)} _ {i _ 0, i _ t} ) & = \frac{1}{\lambda^t} \frac{\psi _ {i _ t}}{\psi _ {i _ 0}} \\
\pi ^ {\text{MERW}} _ i & = \psi ^ 2 _ i \\
\sum _ i \pi ^ {\text{MERW}} _ i & = \sum _ i \psi ^ 2 _ i = 1 \\
\pi ^ {\text{MERW}} _ i Q _ {i,j} & = \pi ^ {\text{MERW}} _ j Q _ {j,i} \\
\end{array}
$$

With detailed balance as the last condition.

Note, to verify $\pi ^ {\text{MERW}} _ i = \psi^2 _ i$,
plug in the definition of $Q _ {i,j}$ to $\pi ^ {\text{MERW}} _ i = \sum _ j \pi ^ {\text{MERW}} _ j Q _ {j,i}$)


For a regular graph the GRW and MERW stationary distribution are identical.
For non-homogenous degree distribution, the stationary distributions can differ.

References
---

* [Maximal entropy random walk - Dr. Jean-Marc Luck](https://www.youtube.com/watch?v=Ollh8udMB3A)


###### 2026-08-06
