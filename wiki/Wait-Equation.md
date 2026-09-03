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

Note that the original formulation had extra factors which have been subsumed
to create $(C = D / v _ 0)$, $(e^{\tau} = (1+r)^{1/k})$.
Relativistic effects are ignored here.

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


The problem can be changed to one of investment time.

Consider an initial pool of wealth, $W _ 0$, that can be
put into an investment fund with an annual percentage rate
increase of $\rho$.

Consider an investment that will yield higher
returns with an initial buy-in cost of $W _ 1$
but whose buy-in cost is being reduced by an exponential
annual percentage rate factor, $\sigma$.

The wait cost is then:

$$
\begin{array}{ll}
I(y) & = W _ 0 \int _ 0 ^ y e ^ {\rho t} dt - W _ 1 e^{-\sigma y} \\
 & = \frac{W _ 0}{\rho} ( e^{\rho y} - 1 ) - W _ 1 e ^ {-\sigma y} \\
 & = W _ 0 [ \frac{1}{\rho} ( e^{\rho y} - 1 ) - \frac{W _ 1 }{W _ 0} e ^ {-\sigma y} ] \\
\end{array}
$$




References
---

* [Wikipedia: The Wait Equation](https://en.wikipedia.org/wiki/The_Wait_Equation)
* [Wait Calculation ... by Andrew Kennedy](https://gwern.net/doc/statistics/decision/2013-kennedy.pdf)
