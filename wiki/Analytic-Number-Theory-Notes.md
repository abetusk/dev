Analytic Number Theory Notes
===

$$

\begin{equation} \label{eq1}
\begin{split}
P &= \{ p_0, p_1, \dots, p_{m-1} \} &, \ p_k \in \text{Prime} \\\\
N_p(x) &= |\{ n : n = \prod_{k=0}^{m-1} p_k^{\alpha_k} \le x, \alpha_k \in \mathbb{N}_0 \}| \\\\
& \prod_{k=0}^{m-1} p^{\alpha_k} \le x \\\\
\to & \ \ \sum_{k=0}^{m-1} \alpha_k \ln(p_k) \le \ln(x) \\\\
\to & \ \  \alpha_k \ln(p_k) \le \ln(x) \\\\
x \ge 2 \\\\
\to & \ \ \alpha_k \le \frac{\ln(x)}{\ln(p_k)} \le \frac{\ln(x)}{\ln(2)} \\\\
\to & \ \  \alpha_k \le \lfloor \frac{\ln(x) }{\ln(2)} \rfloor + 1 \le \frac{2 \ln(x)}{\ln(2)} \\\\

N_p(x) & \le | \{ [\alpha_0, \alpha_1, \dots, \alpha_{m-1}] : \alpha_k \le \frac{2\ln(x)}{\ln(2)}\}| \\\\
 & \le \left( \frac{2 \ln(x)}{\ln(2)} \right)^m 

\end{split}
\end{equation}

$$

---

$$

\begin{equation} \label{eq2}
\begin{split}

e(n) &=
\begin{cases}
1 & n=1 \\\\
0 & \text{otherwise}
\end{cases}

\\\\

id(n) &= n \\\\

s(n) &= \begin{cases}
1 & n =m^2 \\\\
0 & \text{otherwise}
\end{cases}

\\\\

\mu(n) &= \begin{cases}
1 & n=1 \\\\
(-1)^m & n = \prod_{k=0}^{m-1} p_k \\\\
0 & \text{otherwise}
\end{cases}

\\\\

\lambda(n) & = \begin{cases}
1 & n=1 \\\\
(-1)^s & s = \sum_{k=0}^{m-1} \alpha_k, n = \prod_{k=0}^{m-1} p_k^{\alpha_k} \\\\
0 & \text{otherwise}
\end{cases}

\\\\

\phi(n) &= |\{ m : 1 \le m \le n,  \gcd(m,n) \}|

\\\\

d(n) & = \sum_{d|n} d

\\\\

\omega(n) &= \begin{cases}
m & n = \prod_{k=0}^{m-1} p_k^{\alpha_k}
\end{cases}

\\\\

\Omega(n) &= \begin{cases}
\sum_{k=0}^{m-1} \alpha_k & n=\prod_{k=0}^{m-1} p_k^{\alpha_k}
\end{cases}

\\\\

\Lambda(n) &= \begin{cases}
\ln(p) & n = p^m \\\\
0 & \text{otherwise}
\end{cases}

\end{split}
\end{equation}

$$

---

$$
\begin{equation} \label{eq3}
\begin{split}

\sum_{d|n} \mu(d) &= \sum_{ < p > } \mu(\prod_{k=0}^{m-1} p_k^{\alpha_k} ) \\\\
 &= \sum_{ < p > } \mu(\prod_{k=0}^{m-1} p_k) \\\\
 & =\sum_{k=0}^{m-1} (-1)^k \binom{m}{k} \\\\
 & = (1-1)^m \\\\
 & = \begin{cases}
1 & n = 1 \\\\
0 & \text{otherwise}
\end{cases}

\end{split}
\end{equation}
$$

---


