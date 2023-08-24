Probability Definitions
===

Shannon Entropy
---

$$
H(p) = - \sum_{x} p(x) \lg p(x)
$$

Conditional Entropy
---

$$

H(X | Y) = \sum _ {x,y} p(x,y) \lg \left( \frac{p(x,y)}{p(x)} \right)
$$

Mutual Information
---

$$
\begin{array}{ll}
I(X;Y) & = H(X) - H(X | Y) \\
 & = D _ {KL} \left[ \ p(x , y) \ || \ p(x) \cdot p(y) \ \right] \\
 & = D _ {KL} \left[ \ p(x | y) \ || \ p(x) \ \right] \\
 & = D _ {KL} \left[ \ p(y | x) \ || \ p(y) \ \right] \\
\end{array}
$$


Cross Entropy
---

$$
H(p,q) = - \sum_{x} p(x) \lg q(x)
$$

Kullback-Leilbler Divergence
---

$$
\begin{array}{ll}
D_{KL} (p || q) & = - \sum_{k} p(x) \lg \frac{q(x)}{p(x)} \\\\
 & = - \left( \sum_{x} p(x) \lg q(x) - p(x) \lg p(x) \right)
\end{array}
$$


Maximum Likelihood Estimation
---

todo

###### 2020-06-12
