Belief Propagation
===

Introduction
---

For a set of random variables, $ { \bf x } = (x_0, x_1, x_2, \cdots, x_{n-1} $,
and a given probability distribution over those random variables, $p( { \bf x } $,
we might like to know what the most likely configuration is.
Another name for the most likely configuration is the maximum a posteriori (MAP)
assignment of the variables over their domain.

Sometimes there is additional structure on the random variables so that the probability function
can be decomposed into a product of distributions over the subsets of variables.
If the additional structure is encapsulated in a graphical model, connecting variables
with an edge and corresponding distribution function, this this can be represented as
a Markov Random Field (MRF),
with a set of cliques, represented in a graph structure, whose probability distribution
function can be written as:

$$
\begin{align}
p( { \bf x } ) & = \frac{1}{Z} \prod_{c \in \text{clique(} G \text{)} } \phi_c ( { \bf x }_c )
\end{align}
$$

A marginal distribution is the probability of fixing a subset of the random variables over
all possible values of the remaining variables.
That is:

$$
p( { \bf x }_s  = { \bf b }_s ) = \sum_{ { \bf x } / x_s } \ \   \prod_{c \in \text{clique(} G \text{)} } \phi_c ( { \bf x }_c )
$$

Where the term on the right fixes the values of ${ \bf x }_s$ where appropriate.

This problem is NP-Complete in general.
If the form of the graphical model is a tree, then the marginals can be computed efficiently with a dynamic programming
like algorithm.

A dynamic programming like algorithm can be adapted to be used on non-tree like graphs and can be expected to
work for graphs that have certain restrictions on their topology or structure.
Since the graph now has loops, the independence property that was needed to make the algorithm efficient is violated.

The dynamic programming like algorithm is called Belief Propagation (BP), sometimes called Loopy Belief Propagation (LBP)
for non-tree like graphs.
For non-tree graphs, the term "probability" is substituted with "messages", as calculations are no longer probability distributions
any more, with the underlying algorithm for BP described as a "message passing" algorithm.

The type of structure on the graphs that lead to proper marginal discovery is not well understood in general
and certainly not understood by me.
Some clue as to what the structure is comes from the degree of independence of the variables and a somewhat hand-waivy
heuristic is that if graphs look locally "tree-like" then BP (or LBP) has some expectation of converging to a correct solution.

---

There are three main graph models that belief propagation looks to be run on:

* Bayesian Network
* Factor Graph
* Markov Random Fields (MRF)

### Markov Random Field

Finite Markov Random Fields (MRF) will be considered.

$$ G(V,E), \ \ \  |V| = n, \ \ \ x_i \in D = \{ d_0, d_1, \cdots, d_{m-1} \}  $$

$$
i \in V \to g_i(\cdot) \in \mathbb{R}
$$

$$
(i,j) \in E \to f_{i,j}( \cdot, \cdot ) \in \mathbb{R}
$$

* $x_i$ represents the value of vertex $i$.
* $g_i(x_i)$ is the mapping of vertex $i$ with value $x_i$
* $f_{i,j}(x_i,x_j)$ is the mapping of the connected vertex $i$ and $j$
  with values $x_i$ and $x_j$, respectively

For example, $f_{i,j}(x_i,x_j)$ could be an indicator function that
vertex $i$ and $j$ could have values $x_i$ and $x_j$.

### Belief Propagation on a (discrete) Markov Random Field

```
::mermaid
graph LR
  u((u)) & v((v)) --> i((i)) -.-> j((j)))
```

| |
|---|
| ![Belief Propagation on Markov Random Field example](img/mrfbp_example.png) |

Each vertex, $i$, can be associated with a random variable, $X_i$, taking
on (discrete) values chosen from some domain $D = \{ d_0, d_1, \cdots, d_{m-1} \}$ with
a probability distribution function $g_i(\cdot)$.

$$
\mu_{i,j}^{t+1}(b) = \sum_{a \in D} f_{i,j}(a,b) \cdot g_i(a) \cdot \prod_{k \in N(i) \text{ \\\\ } j} \mu_{k,i}^{t}(a)
$$

$$
P(X_i = a) \approx b^t_i(a) \propto g_i(a) \cdot \prod_{k \in N(i)} \mu^t_{k,i}(a)
$$

$$
\sum_{b \in D} \mu_{i,j}^{t}(b) = 1,  \ \ \ \ \sum_{a \in D} b^t_i(a) = 1
$$

The product can be more compactly represented by a function $h^t_{i,j}(\cdot)$:

$$
h^t_{i,j}(a) = g_i(a) \cdot \prod_{k \in N(i) \text{\\\\} j } \mu^t_{k,i}(a)
$$

$$
\mu_{i,j}^{t+1}(b) = \sum_{a \in D} f_{i,j}(a,b) \cdot h^t_{i,j}(a)
$$

One can recast this as a matrix multiplication:

$$ \begin{bmatrix} f_{i,j}(d_0,d_0) & f_{i,j}(d_1,d_0) &  \cdots & f_{i,j}(d_{m-1},d_0) \\\\ f_{i,j}(d_0,d_1) & f_{i,j}(d_1,d_1) &  \cdots & f_{i,j}(d_{m-1},d_1) \\\\ \vdots  & \vdots & \ddots & \vdots & \\\\ f_{i,j}(d_0,d_{m-1}) & f_{i,j}(d_1,d_{m-1}) &  \cdots & f_{i,j}(d_{m-1},d_{m-1}) \end{bmatrix} \begin{bmatrix} h_{i,j}^{t}(d_0) \\\\ h_{i,j}^{t}(d_1) \\\\ \vdots \\\\ h_{i,j}^{t}(d_{m-1}) \end{bmatrix} = \begin{bmatrix} \mu_{i,j}^{t+1}(d_0) \\\\ \mu_{i,j}^{t+1}(d_1) \\\\ \vdots \\\\ \mu_{i,j}^{t+1}(d_{m-1}) \end{bmatrix}
$$

$$
\to F_{i,j} \cdot \vec{h}^t_{i,j} = \vec{\mu}^{t+1}_{i,j}
$$


Since $h^t_{i,j}(\cdot)$ has no dependence on $b$, this speeds up a naive calculation by re-using the product results instead of re-calculating them.

If the $F_{i,j}$ matrix has low rank, $r < m$, it can be factored into a singular value decomposition (SVD) for performance:

$$U \cdot S \cdot V = \begin{bmatrix} \vec u_0 & \vec u_1 & \cdots & \vec u_{r-1} \end{bmatrix} \begin{bmatrix} s_0 & 0 &  \cdots & 0 \\\\ 0 & s_1 & \cdots & 0 \\\\ \vdots & \vdots  & \ddots & \vdots \\\\ 0 & 0 &  \cdots & s_{r-1} \end{bmatrix} \begin{bmatrix} \vec{v}^\dagger_0 \\\\ \vec{v}^\dagger_1 \\\\ \vdots \\\\ \vec{v}_{r-1}^\dagger  \end{bmatrix}
$$

Where $F_{i,j} = U \cdot S \cdot V$.

The matrix multiplication that was $O(m^2)$ now becomes two matrix multiplications of order $O(r \cdot m)$ for a potential speedup of $\sim \frac{m}{r}$.

---

#### Sum-Product Belief Propagation

$$
G(V,E)
$$

$$
s, t \in V, x_{*} \in S = \{ s_0, s_1, \cdots, s_{n-1} \}
$$

$$
\mu_{s \to t}(x_t) = \sum_{x_s} [ \phi_{s t}(x_s,x_t) \prod_{u \in N(s) / t} \mu_{u \to s} (x_s) ] 
$$
$$
b_t(x_t)  \propto \prod_{s \in N(t)} \mu_{t \to s}(x_s)
$$

* $s,t$ - verticies in the graph ($s,t \in V$)
* $x_s, x_t \in S$ - values at the vertices (one of a discrete set of values from $S = \{ s_0, s_1, \cdots, s_{n-1} \}$)
* $N(s)$ - neighbors of vertex $s$
* $N(s) / t$ - neighbors of vertex $s$ excluding vertex $t$
* $\phi_{s t}(x_s,x_t)$ - probability/weight of finding value $x_s$ at position $s$ next to value $x_t$ at position $t$
* $\mu_{s \to t}(x_t)$ - probability/message from position vertex $s$ that value $x_t$ at vertex $t$ is allowed
* $b_t(x_t)$ - "belief" of value $x_t$ at position $t$ ("belief" that vertex $t$ holds value $x_t$)

```
A - B - C
    |   |
    D - E
```

Literature Notes
---

This is a bit outside the scope of this document but I should take some notes on the various "state of the art" techniques
from about a decade or more ago.

#### Fast Belief Propagation for Early Vision

* [paper](https://www.cs.cornell.edu/~dph/papers/bp-cvpr.pdf)
* [talk](https://www.youtube.com/watch?v=nZ2uo-7TDDc)

The basic idea is that for problems with structure, many speedups can be had exploiting the
symmetry or simplicity of the label-to-label cost function, locality of labels or other factors.

The paper and talk focus on using loopy belief propagation (LBP) for stereo problems.

* Using linear or quadratic (truncated) label cost functions, you can go from $O(B^2)$ to $O(B)$ by
  various tricks
* Using a virtual hierarchy of nodes, you can compute initial messages and beliefs and then propagate
  those out to the nodes underneath (wholesale) to get faster convergence

A point that doesn't really seem to be addressed is that this assumes the labels have locality or "cohesion" in
that if you find one label somewhere, the chance of finding a similar label nearby is higher.
This assumption is obvious if you're doing stereo matching or motion estimation but for general problems
this is not the case and it's not clear that this method will do better (and might even perform worse?).

Some other random notes:

* Can do 'checkerboard' updates to get half the memory and twice the speed with similar or the same
  convergence (guaranteed? empirical?)
* Other methods that try to make 'superblocks' change the graph and potentially reduce the node and edge
  count but at the cost of exploding the label state space, which becomes a Cartesian product. Huttenlocher
  talks about how the superblocks (generalized belief propagation (GBP)?) idea wasn't meant to make it
  more efficient but was done for other, theoretical, reasons

#### Scalable detection of statistically significantcommunities and hierarchies, using messagepassing for modularity

* [talk](https://www.youtube.com/watch?v=jzN37cqkB0c&list=LL)
* [paper](https://www.pnas.org/doi/epdf/10.1073/pnas.1409770111))

#### Focused Belief Propagation for Query-Specific Inference

* [paper](http://proceedings.mlr.press/v9/chechetka10a/chechetka10a.pdf)

This builds on an idea of residual belief propagation (RBP) by Elidan et all that updates only one message per
time step based on the difference of the messages, called the "residual".
The idea is that one can weight message updates by a better heuristic than the residual, namely
a "path sensitivity".

The path sensitivity attempts to measure the effect of changing/updating one message on another and then
picking a message to update that has maximal path sensitivity.
Doing this wholesale and in general is as bad or worse then just running LBP but various heuristics
can be used to estimate the path sensitivity which are more efficient than a wholesale recalculation.

Other tricks need to be employed in order to make the algorithm "anytime", where an "anytime" algorithm
can be stopped at anytime and still get a good estimate of the answer (maximum a posteriori (MAP) or distribution
on end state).



---

Appendix
---

Mutual information:

$$
\begin{align}
I(X;Y) & = D_{KL}(p_{X,Y} || p_X \cdot p_Y ) \\
 & = \sum_{x \in X} \sum_{y \in Y} P_{X,Y}(x,y) \ln( \frac{P_{X,Y}(x,y)}{P_X(x) P_Y(y)} )
\end{align}
$$

For $p_X$ and $p_y$ independent, this reduces to:

$$
\sum_{x \in X} \sum_{y \in Y} P_{X,Y}(x,y) \ln( \frac{P_X(x) P_Y(y)}{P_X(x) P_Y(y)} ) = 0
$$

For $X = Y$, this reduces to:

$$
\begin{align}
&  \sum_{x \in X} \sum_{y \in X} P_{X,X}(x,y) \ln( \frac{P_{X,X}(x,y) }{P_X(x) P_X(y)} ) \\
= & \sum_{x \in X} P_X(x) \ln( \frac{P_X(x) }{P_X(x) P_X(x)} ) \\
= & - \sum_{x \in X} P_X(x) \ln( P_X(x) ) \\
\end{align}
$$

which is just the entropy of $X$.



References
---

* [Island algorithm](https://en.wikipedia.org/wiki/Island_algorithm)
* [Tree decomposition / junction tree / clique tree / join tree](https://en.wikipedia.org/wiki/Tree_decomposition)
* [Belief Propagation](youtube.com/watch?v=meBWAboEWQk)
* [Splash Belief Propagation](https://www.youtube.com/watch?v=m8QXn5DWu3M)
* [Relax, Compensate, Recover BP](youtube.com/watch?v=dMUFfLKIylQ)


###### 2022-08-16

