AVL Tree
===

Adelson-Velsky and Landis ([AVL](https://en.wikipedia.org/wiki/AVL_tree)).

AVL trees are surprisingly subtle when it comes to their update rules.
This is a short note on some of those subtleties when implementing
AVL trees.

AVL Condition
---

The AVL condition is to make sure the balance factor (BF) of every node
stays within $\{-1,0,1\}$.
That is, the height of every nodes children differs by at most 1.

For every insertion and deletion, the BF is restored through a series
of tree rotations.
Tree rotations restore the BF locally, recursively applying any
height changes up the tree, issuing tree rotations as necessary.

Insertion
---

Initially, insertion is done as normal into a binary tree.

The tree can be left in a state that violates to the AVL
delta height condition.
To fix up, a series of rotations are done.

![AVL Tree Rotations](img/avl_rot.svg)

Here, the `--`, `-`, `+`, `==` and $\rlap{0}/$ signify
whether the node is left heavy requiring a rotation, left
heavy without the need for a rotation,, right heavy without
the need for a rotation, right
heavy with the need for a rotation or balanced,
respectively.

The last condition row in can be represented as a double rotation,
with $z$ rotated with $y$, then $z$ rotated
with $x$.

If the height of the altered subtree changes, nodes above will
need to be recursively updated in the same way.

#### Single Rotation

...



#### Double Rotation

In the case of a double rotation, the rotated nodes' balance factor, $x'$, $y'$ and $z'$,
can be determined from the $z$'s balance factor before rotation:


| $\Delta h _ z$ | $-1$ | $\rlap{0}/$ | $1$ | $-1$ | $\rlap{0}/$ | $1$ |
|---|---|---|---|---|---|---|
| $\Delta h _ {x}$  | $-2$ | $-2$ | $-2$ | $2$ | $2$ | $2$ |
| $\Delta h _ {y}$  | $1$ | $1$ | $1$ | $-1$ | $-1$ | $-1$ |
| $h _ \beta$  | $h _ z -1$ | $h _ z -1$ | $h _ z -2$ | $h _ z -1$ | $h _ z -1$ | $h _ z -2$ |
| $h _ \gamma$ | $h _ z -2$ | $h _ z -1$ | $h _ z -1$ | $h _ z -2$ | $h _ z -1$ | $h _ z -1$ |
| $\Delta h _ {x'}$ | $1$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ | $-1$ |
| $\Delta h _ {y'}$ | $\rlap{0}/$ | $\rlap{0}/$ | $-1$ | $1$ | $\rlap{0}/$ | $\rlap{0}/$ |
| $\Delta h _ {z'}$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ |
| $\Delta h _ {p'}$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ | $\rlap{0}/$ |

Note that in the case of a double rotation, before the addition of a node, the height $h _ x = h _ z + 1$.
Regardless of which double rotation is done, what value $\Delta h _ {x}$, $\Delta h _ {y}$, $h _ {\beta}$
or $h _ {\gamma}$, the resulting height of $h _ {z'}$ will always be $h _ z + 1$, requiring no height
change to to communicated back up to the parent tree corresponding to $\Delta h _ {p'} = \rlap{0}/$ in the
above table.

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
