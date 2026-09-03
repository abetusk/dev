The Wait Equation
===

The original formulation asked how long should we wait to send a spaceship
as thrust technology achieves exponentially better results as time progresses.

The formulation here, will use the following parameters:


$$
\begin{array}{ll}
T(w) & \text{Total time as a function of wait time } w \\
w & \text{Wait time} \\
C & \text{Initial time constant} \\
\tau & \text{Growth exponent} \\
\\
T(w) & = w + C e^{-\tau w} \\
\end{array}
$$

Note that the original formulation had extra factors which have been subsumed to create $(C = D / v _ 0)$, $(e^{-\tau} = (1+r)^{1/k})$.

When $w << \infty$, the wait time drops exponentially.
As $w \to \infty$, the time to reach the goal vanishes due to the exponential so is
then dominated by the linear component.

The cross over, from exponentially decreasing wait time, to linearly increasing wait time
happens at the inflection point.
Assuming there's one inflection point, we can find it by taking the derivative
and setting to 0:

$$
\begin{array}{lll}
 & \frac{dT(w _ { * })}{dw}& = 0 \\
\to & 1 - \tau C e^{-\tau w _ { * }} \ &= 0 \\
 \to  & w _ { * }  &= \frac{ \ln(\tau) + \ln(C) }{\tau} \\
\end{array}
$$



References
---

* [Wikipedia: The Wait Equation](https://en.wikipedia.org/wiki/The_Wait_Equation)
* [Wait Calculation ... by Andrew Kennedy](https://gwern.net/doc/statistics/decision/2013-kennedy.pdf)
