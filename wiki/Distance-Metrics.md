Distance Metrics
===

$$
\begin{array}{ll}
 X = (x _ 0, x _ 1, \cdots, x _ {n-1} ) & \in \mathbb{R}^n \\
 Y = (y _ 0, y _ 1, \cdots, y _ {n-1} ) & \in \mathbb{R}^n \\
\end{array}
$$

Chebyshev
---

$$
\begin{array}{ll}
|| X - Y || _ {\infty} & = \max _ i | x _ i - y _ i |
\end{array}
$$

[wiki](https://en.wikipedia.org/wiki/Chebyshev_distance)


Cosine
---

$$
\begin{array}{ll}
||X|| \cdot ||Y|| \cos(\theta) & = \frac{ {\sum} ^{n-1} _ {i=0}  x _ i \cdot y _ i}{ \left( {\sum} _ {i=0}^{n-1} x _ i ^ 2 \right)^{\frac{1}{2}} \cdot 
  \left( {\sum} _ {i=0}^{n-1} y _ i ^ 2 \right)^{\frac{1}{2}} }
\end{array}
$$

[wiki](https://en.wikipedia.org/wiki/Cosine_similarity)

Euclidean
---

$$
\begin{array}{ll}
|| X - Y || _ {2} & = \left( {\sum} _ {i=0} ^ {n-1} | x _ i - y _ i |^2 \right)^{\frac{1}{2}}
\end{array}
$$

Manhattan
---

$$
\begin{array}{ll}
|| X - Y || _ {1} & = {\sum} _ {i=0} ^ {n-1} | x _ i - y _ i |
\end{array}
$$


Minkowski
---

$$
\begin{array}{ll}
|| X - Y || _ {q} & = \left( {\sum} _ {i=0} ^ {n-1} | x _ i - y _ i |^q \right)^{\frac{1}{q}}
\end{array}
$$

[wiki](https://en.wikipedia.org/wiki/Minkowski_distance)

* $|| X - Y || _ 1$ : Manhattan distance ([wiki](https://en.wikipedia.org/wiki/Taxicab_geometry))
* $|| X - Y || _ 2$ : Euclidean distance ([wiki](https://en.wikipedia.org/wiki/Euclidean_distance))
* $|| X - Y || _ {\infty}$ : Chebyshev distance ([wiki](https://en.wikipedia.org/wiki/Chebyshev_distance))


###### 2024-01-08
