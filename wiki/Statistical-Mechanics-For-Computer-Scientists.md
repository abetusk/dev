Statistical Mechanics for Computer Scientists
===

These are notes on statistical mechanics concepts with a focus
on interpreting them from the perspective of a computer scientist.
These should be considered personal opinions and, therefore, might
be completely misleading or outright wrong.

---

### Entropy

Entropy can be considered "the number of bits that it takes to describe a system".

That is if a system has $N$ possible states, each occurring with probability $p_i$, then
the number of bits to describe the system is:

$$
S = - \sum_{i=0}^{N-1} p_i \cdot \lg( p_i )
$$

With $\lg(\cdot) = \frac{ \ln(\cdot) }{ \ln(2) }$.

---

### Boltzmann Distribution

The state $i$ is often called a "microstate".
If we have a set of microstates and start out with assigning each
of them energies, rather than probabilities, under suitable conditions,
we can derive a probability for each microstate.

If we assume each microstate has an energy, $E_i$, attached to it, we can
write down some equations:

$$
\begin{array}{ll}
1 = & \sum_{i} p_i \\
E = & \sum_{i} p_i E_i \\
S_{*} = & - \sum_{i} p_i \ln(p_i)
\end{array}
$$

Where we use $S_{*}$ to differentiate between the entropy defined with $\lg(\cdot)$ instead of $\ln(\cdot)$

In the above, we make a few assumptions:

* Each of the microstate energies, $E_i$, is fixed and unchanging
* We impose the constraint that the average energy, $E$, is fixed
* The $p_i$ form a probability distribution

In other words find the maximum entropy, $S_{*}$, subject to the constraints
of $E_i$ chosen/fixed and an average fixed energy, $E$.

So, we want to maximize $S_{*}$ by varying each of the individual $p_i$'s.
We can use the method of Lagrange multipliers by using the two equations above as the constraints:

$$
\begin{align}
\vec{p} & = ( p_0, p_i, \cdots, p_{N-1} ) \\
L( \vec{p}, \alpha, \beta ) & = S_{*} - \alpha [ (\sum_{i} p_i) - 1 ] - \beta [ (\sum_{i} p_i E_i) - E ] \\
 & = - \sum_{i} p_i \ln(p_i) - \alpha [ (\sum_{i} p_i) - 1 ] - \beta [ (\sum_{i} p_i E_i) - E ] \\
\frac{\partial}{\partial p_i} L = & -ln(p_i) - 1 - \alpha - \beta E_i = 0 \\
\to \ \ & p_i = e^{-(1+\alpha)} e^{-\beta E_i}
\end{align}
$$

We can now define temperature:

$$
T = \frac{1}{\beta}
$$

And using one of the constraints, we can rewrite equations to get rid of the $\alpha$ term:

$$
\begin{align}
\sum_{i} p_i & = 1  \\
\to \ \ & \sum_{i} e^{ -\beta E_i } = e^{1 + \alpha} \\
\to \ \ & \sum_{i} e^{ \frac{E_i}{T} } = Z(T) \\
\to \ \ & Z(T) = e^{1 + \alpha}
\end{align}
$$

Which gives us:

$$
p_i = \frac{1}{Z(T)} e^{ -\frac{E_i}{T} }
$$

Adding a term,  $\kappa$, to $T$ and rewriting the probability as:

$$
p_i \propto e^{ -\frac{E_i}{\kappa T} }
$$

Is called a Boltzmann distribution.
Another name is Gibbs distribution.

---

### Kullback-Leibler Divergence

We want to talk about "free energy" but we will need the idea of
the Kullback-Leibler divergence first before providing intuition about the "free energy"
definition.

Consider an optimal encoding of sending $n$ symbols over a channel with the $i$'th symbol
occurring with probability $p_i$.
We can write the entropy of the distribution $p(\cdot)$ as:

$$
S_p = - \sum_{i}^{n-1} p_i \ln(p_i)
$$

Let's say we introduce another distribution $q(\cdot)$ that we will use to find an encoding/decoding
method on the symbols.
If the symbols are transmitted at the rate of $p_i$ still but we're using $q_i$ to encode/decode them,
we end up with (proportionally) $\lg(q_i)$ bits per symbols instead of (proportionally) $\ln(p_i)$
bits per symbol.

We can write down the entropy of receiving these symbols with probability distribution $p_i$ but
using $q_i$ to encode them as:

$$
S_q = - \sum_{i}^{n-1} p_i \ln(q_i)
$$

The difference, $S_q - S_p$ is
how "bad" the $q_i$ encoding is in terms of how many extra bits we waste using the $q_i$ encoding.
If we introduce more notation:

$$
D_{KL}(p || q) = \sum_{i} p_i \ln( \frac{p_i}{q_i} )
$$

Which is called the Kullback-Leibler Divergence.

Another way to write this is:

$$
D_{KL}(p || q) = H(p,q) - H(p)
$$

Where $H(p,q)$ is called the "cross entropy":

$$
\begin{align}
H(p) & = - \sum_{i} p_i \ln(p_i) \\
H(p,q) & = - \sum_{i} p_i \ln(q_i)
\end{align}
$$

---

### Helmholtz Free Energy

Helmholtz free energy is defined as the average energy minus the entropy:

$$
\begin{align}
F & = U - TS \\
 & = \sum_{i} p_i E_i - T \sum_{i} p_i \ln(p_i)
\end{align}
$$

Under equilibrium (?) recall $E_i = -T \ln(p_i)$.
If, instead (under non-equilibrium?) $E_i = -T \ln(q_i)$, then:

$$
F = T \sum_{i} p_i \ln( \frac{q_i}{p_i} )
$$

or

$$
D_{KL}(p || q) = \frac{F}{T}
$$

---

Appendix
---

### Lagrange Multipliers

Statement without proof.


$$
\begin{align}
& f,g \in C^1 & \\
& f:  \mathbb{R}^n   \mapsto \mathbb{R} & \\
& g: \mathbb{R}^n  \mapsto \mathbb{R}^m & \ \ \ (m < n) \\ 
&D h(x) = [ \frac{\partial h_j}{\partial x_k} ] &
\end{align}
$$

$$
\begin{align}
\text{maximize: } & f(x) \\
\text{ subject to: } & g(x)=0 \\
\to \ \  &  x^* \text{ optimal} \\
& \exists \lambda^* \in \mathbb{R}^m \\
\text{s.t. } \  & D f(x^{\*}) = {\lambda^{\*}}^{\intercal} D g(x^{\*})
\end{align}
$$

References
---


* [susskind](https://www.youtube.com/watch?v=rhFkYjaM5kE&list=PL_IkS0viawhr3HcKH607rXbVqy28W_gB7&index=4)
* [Gibbs free energy](https://en.wikipedia.org/wiki/Gibbs_free_energy)
* [Kullback-Leibler Divergence](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence)
* [Lagrange Multipliers](https://en.wikipedia.org/wiki/Lagrange_multiplier)

###### 2022-11-05
