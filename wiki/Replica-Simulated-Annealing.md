Replicated Simulated Annealing
===

$$
\begin{array}{cl}
 y \propto \frac{1}{T} \ \ \   & \beta, \gamma \in \mathbb{R}  \\
\sigma \in \{ \sigma_0, \sigma_1, \cdots, \sigma_{N-1} \} & S = \{ q_0, q_1, \cdots, q_{M-1}  \}^N \\
P( \sigma ; \beta , y, \gamma ) & =  (\frac{1}{Z(\beta,y,\gamma) } ) \cdot e^{y \Phi(\sigma,\beta,\gamma)}   \\
\Phi(\sigma,\beta,\gamma) & =  \ln( \sum_{\sigma'} e^{-\beta E(\sigma') - \gamma d(\sigma,\sigma')}) \\
Z(y,\beta,\gamma) & = \sum _ {\sigma \in S} \exp( y \Phi _ {\beta, \gamma} ( \sigma ) )
\end{array}
$$


In the above,
$y$ is formally inverse temperature ($\frac{1}{T}$), $\Phi(\cdots)$ is the local free entropy and
$\sigma$ is a configuration of $N$ cells, each of which can take on one of $M$ values, with
$E(\cdot)$ being the energy function of a particular configuration.

The distance function, $d(\cdot,\cdot)$, should be monotonically increasing.


If we take $y \ge 2, y \in \mathbb{Z} _ { + }$, then

$$
\begin{array}{cl}
Z(y,\beta,\gamma) & = \sum _ { \sigma \in S } \exp( y \Phi _ { \beta, \gamma } ( \sigma ) ) \\
 & = \sum _ { \sigma \in S } \exp( \sum _ { a=1 } ^ {y} \Phi _ { \beta, \gamma } ( \sigma ) ) \\
 & = \sum _ { \sigma \in S } \prod _ {a=1} ^ y \sum _ { \sigma^a } \exp( - \beta E( \sigma^a ) - \gamma d( \sigma, \sigma^a ) )
\end{array}
$$

Define:

TO BE CONTINUED...

References
---

* [Remarks on RSA](https://github.com/abetusk/papers/blob/release/ComputationalPhysics/remarks-replicated-simulated-annealing_gripon-lowe-vermet.pdf)
* [Limits of SA on hard inference](https://github.com/abetusk/papers/blob/release/ComputationalPhysics/limits-simulated-annealing-sparse-hard-inference_angelini-ricci_tersenghi.pdf)

###### 2023-03-18
