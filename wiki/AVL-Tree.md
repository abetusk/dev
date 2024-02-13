AVL Tree
===

Adelson-Velsky and Landis ([AVL](https://en.wikipedia.org/wiki/AVL_tree)).


Insertion
---

Initially, insertion is done as normal into a binary tree.

The tree can be left in a state that violates to the AVL
delta height condition.
To fix up, a series of rotations are done.

![AVL Tree Rotations](img/avl_rot.svg)

Here, the `--`, `-`, `+`, `==` and $\rlap{0}/$ signify
whether the node is left heavy, right heavy or balanced,
respectively.

The last condition is a double rotation, sometimes
represented as $z$ rotated with $y$, then $z$ rotated
with $x$.

In the case of a double rotation, the node heaviness
can be determined from the initial configuration:

| $\Delta h _ z$ | $-1$ | $\rlap{0}/$ | $1$ |
|---|---|---|---|
| $\Delta h _ {x'}$ | $\rlap{0}/$ | $\rlap{0}/$ | $-1$ |
| $\Delta h _ {y'}$ | $1$ | $\rlap{0}/$ | $\rlap{0}/$ |
| $\Delta h _ {z'}$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ |


