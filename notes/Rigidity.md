Rigidity Notes
===

Give a graph $G$ with certain edge length constraints $e _ {i,j} \in E(G)$ ( $|E(G)| \le |G|^2$ ),
is there a realization in $\mathbb{R}^n$ that respects the edge constraints.

Definitions:

* Globally rigid - edge lengths uniquely determine realization in all dimensions
* Globally non-rigid - different configurations realize edge constraints
  - continuously non-rigid - can move via infinitesimal motion
  - discretely non-rigid - has another realization but there isn't a continuous motion from one
    configuration to another
* Stress vector
  - assign projection vector, $p(u) \in \mathbb{R}^d$, of vertex $u$ into dimension $d$
  - assign $w _ {u,v} \in \mathbb{R}$ to each edge, $e _ {u,v}$ such that $\forall u, \sum _ {v} w _ {u,v} (p(v) - p(u)) = 0$
  - energy interpretation $Z(p) = \sum _ u \sum _ v w _ {u,v} (p(v) - p(u))^2$ (equilibrium, gradient 0)
  - stress vector invariant under affine transformations $T(p)$
  - some configurations can be in equilibria but not be an affine transform of each other
* Connelly's condition (CC)
  - CC satisfied if only stress vector 0 configurations are from the set of affine transformations
  - sufficient for generic global rigidity


References
---

* ["Characterizing Generic Global Rigidity" by Steven J. Gortler (Shlomo)](https://www.microsoft.com/en-us/research/video/characterizing-generic-global-rigidity/)
