Belief Propagation
===

There are three main graph models that belief propagation looks to be run on:

* Markov Random Fields (MRF)
* Bayesian Network
* Factor Graph

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
* $ g_i(x_i) $ is the mapping of vertex $i$ with value $x_i$
* $ f_{i,j}(x_i,x_j)$ is the mapping of the connected vertex $i$ and $j$
  with values $x_i$ and $x_j$, respectively

For example, $f_{i,j}(x_i,x_j)$ could be an indicator function that
vertex $i$ and $j$ could have values $x_i$ and $x_j$.

### Belief Propagation on a (discrete) Markov Random Field

<!--
#mermaid
graph LR
  u((u)) & v((v)) --> i((i)) -.-> j((j)))
-->

![Belief Propagation on Markov Random Field example](img/mrfbp_example.png)

$$
\mu_{i,j}^{t+1}(x_j) = \sum_{x_i} f_{i,j}(x_i,x_j) \cdot g_i(x_i) \cdot \prod_{k \in N(i) \\ j} \mu_{k,j}^{t}(x_i)
$$



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


###### 2022-08-16
