Matrix Cheat Sheet
===

Hermitian Matrix
---

$$
\begin{array}{c}
A \in \text{Hermitian} \\
n \in \mathbb{Z^+},  \ A = \mathbb{C}^{n,n} \\
A = \overline{ (A^T) } = A^H = A^* = A^{\dagger}
\end{array}
$$

$ A, B \in \text{Hermitian} $:

* $ A^* A = A A^* $
* $ A_{j,j} \in \mathbb{R} $
* $ A = U^* D U $, with $U$ unitary, $D$ diagonal
* $A B = B A \to A B \in \mathbb{H}$
* $A B A \in \mathbb{H} $
* $ \det(A) \in \mathbb{R} $

Hadamard Matrix
---

$$
\begin{array}{c}
A \in \text{Hadamard} \\
n \in \mathbb{Z^+}, \ A = \{-1,1\}^{n,n} \\
x = A_{i,\cdot}, y = A_{j,\cdot} (i \ne j) \\
x \cdot y^T = 0
\end{array}
$$

$ A \in \text{Hadamard} $:

* $ A A^T = n I_n $
* $ \det(A) = \pm n^{\frac{n}{2}} $
* $ M \in \mathbb{C}^{n,n}, |M_{i,j}| \le 1 \to | \det(M) | \le n^{\frac{n}{2}} $

Toeplitz Matrix
---

$$
\begin{array}{c}
A \in \mathbb{C}^{n,n} \\
A_{ (i+1)%n, (j+1)%n } = A_{i,j} = a_{i-j}
\end{array}
$$

Unitary Matrix
---

$$
\begin{array}{c}
U \in \text{Unitary} \\
n \in \mathbb{Z^+}, \ U \in \mathbb{C}^{n,n} \\
U U^* = U^* U = I
\end{array}
$$

$ U \in \text{Unitary}$:

* $ \det(U) = 1 $
* $ U = V D V^* $, where $V \in \text{Unitary}$ and $D$ is diagonal and unitary
* $ H \in text{Hermitian} \to U = e^{i H} $
* $ x,y \in \mathbb{C}^{n}, x y^T = (U x) \cdot (U y)^T  $

That is, unitary matricies are complex multidimensional analogues of rotations.


