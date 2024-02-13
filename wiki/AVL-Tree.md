AVL Tree
===

Adelson-Velsky and Landis ([AVL](https://en.wikipedia.org/wiki/AVL_tree)).

The AVL condition is to make sure the balance factor (BF) of every node
stays within $\{-1,0,1\}$.
That is, the height of every nodes children differs by at most 1.

For every insertion and deletion, the BF is restored through a series
of tree rotations.

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

The last condition can be represented as a double rotation,
with $z$ rotated with $y$, then $z$ rotated
with $x$.

In the case of a double rotation, the node's AVL condition
can be determined from the initial configuration:

| $\Delta h _ z$ | $-1$ | $\rlap{0}/$ | $1$ |
|---|---|---|---|
| $\Delta h _ {x'}$ | $\rlap{0}/$ | $\rlap{0}/$ | $-1$ |
| $\Delta h _ {y'}$ | $1$ | $\rlap{0}/$ | $\rlap{0}/$ |
| $\Delta h _ {z'}$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ |

If the height of the altered subtree changes, nodes above will
need to be recursively updated in the same way.

Deletion
---

Deletion of the node $z$ has three main cases (as per [CLR](https://en.wikipedia.org/wiki/Introduction_to_Algorithms)):

* $z$ is a leaf, in which case the parents point to $z$ can be set to `null`
* $z$ has exactly one child, in which case $z$ can be removed and the parent
  can now point to the child of $z$
* $z$ has two children, in which case, $y$, the successor of $z$ is found,
  removed and replaced with $z$. $y$ must have a `null` child so the initial
  removal can be done as per above


###### 2024-02-13
