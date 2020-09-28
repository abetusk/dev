Calculus Notes
===

Chain Rule
---

$$
(f(g(x))' = g'(x)f'(g(x))
$$

*Proof*:

$$
\begin{align}
f'(x) & = \frac{f(x+h) - f(x)}{h} \\\\
(f(g(x))' & = \frac{f(g(x+h)) - f(g(x))}{h} \\\\
 & = \frac{f(g(x) + h g'(x)) - f(g(x))}{h} \\\\
 & = \frac{f(g(x)) + h g'(x)f'(g(x)) - f(g(x))}{h} \\\\
 & = g'(x) f'(g(x))
\end{align}
$$


Taylor Expansion
---

$$
f(x) = \sum_{k=0}^{\infty} \frac{ f^{(n)}(a)(x-a)^n }{n!}
$$

*Proof*:

w.l.o.g. $a=0$

$$
\begin{align}
f(x) & = \int_{0}^{x} f'(y) dy + f(0) \\\\
 \to f(x) & = f(0) + \int_{0}^{x} f'(y_0)dy_0 \\\\
 & = f(0) + \int_{0}^{x} \left( \left( \int_{0}^{y0}  f''(y_1)dy_1 dy_0 \right) + f'(0)dy_0 \right) \\\\
 & = f(0) + \int_{0}^{x}f'(0)dy_0 + \int_{0}^{x} \int_{0}^{y0} f''(y_1) dy_1 dy_0  \\\\
 & = f(0) + x f'(0) + \int \left( \int \left( \int f'''(y_2) dy_2 dy_1 dy_0 \right) + f''(0) dy_1 dy_0 \right) \\\\
 & = f(0) + x f'(0) + \int_0^x \int_0^{y_0} f''(0) dy_1 dy_0 + \int \int \int f'''(y_2) dy_2 dy_1 dy_0 \\\\
 & = f(0) + x f'(0) + \frac{1}{2} x^2 f''(0) + \cdots
\end{align}
$$

$$
\int_0^{x} \int_0^{y_0} \int_0^{y_1} \dots \int_0^{y_{n-1}} f^{(n+1)}(0) dy_n dy_{n-1} \dots dy_0  = \frac{ f^{(n+1)}(0) x^{n+1} }{(n+1)!}
$$

Use a instead of 0.

---

$$
| e^{i \theta} - 1| \le | \theta | , \ \ \theta \in \mathbb{R}
$$

*Proof*:

$$
\begin{align}
 i \int_0^{\theta} e^{i t} dt & = i [ \frac{1}{i} e^{i t} |_0^{\theta} \\\\
   & = e^{ i \theta } - 1
\end{align}
$$

$$
\begin{align}
| i \int_0^{\theta} e^{i t} |  & = | \int_0^{\theta} e^{i t} dt | \\\\
 & \le \int_0^{\theta} |e^{i t} dt  \\\\
 & = 0
\end{align}
$$

$$
\to | e^{i \theta} - 1 | \le | \theta |
$$

---

$$
| e^{i \theta} - 1 - i \theta | \le 2 | \theta |
$$

*Proof*:

$$
| e^{i \theta} - 1 - i \theta |  \lte | e^{i \theta} - 1 | + | \theta| \le 2 \theta
$$

$$
\to | e^i \theta} - 1 - i  \theta| \le \frac{\theta^2}{2}
$$

---

$$
| e^{i \theta} - 1 - i \theta| \le \frac{\theta^2}{2}
$$

*Proof*:

$$
\begin{align}
i \int_0^{\theta} ( e^{i t} - 1 ) dt & = i [ \frac{1}{i} e^{i t} - \frac{1}{i} - t |_0^{\theta} \\\\
 & = e^{i \theta} - 1 - i \theta
\end{align}
$$

$$
\begin{align}
| i \int_0^{\theta} ( e^{i t} - 1) dt| & = | \int_0^{\theta} ( e^{i t} -1) dt | \\\\
  \le \int_0^{\theta} | e^{i t} - 1)dt & \le \int_0^{\theta} |t| dt \\\\
 & = \frac{\theta^2}{2}
\end{align}
$$


