3SAT Computer
===

This is a work in progress.

This is a short text on how to make a "3SAT Computer".

For some reason most people have lost the understanding of the connection between NP-Complete
problems and Turing machine decidability.
In some very broad sense, NP-Complete problems can be seen to be a finite restatement of
the Halting Problem.

I believe this was well understood by Stephen Cook and others, which can be seen in the first line
of the summary in Cook's original paper:

> It is shown that any recognition problem solved by a polynomial time-bounded nondeterministic Turing
machine can be “reduced” to the problem of determining whether a given propositional formula is a
tautology.

The Halting Problem concerns itself with a Turing machine running on an infinite tape and only whether
a program will halt in finite time whereas NP-Complete problems concern themselves with whether a
Turing machine will halt in polynomial time.
By necessity, a Turing machine that runs in polynomial time will have a tape that is finite, though the
length might depend on the runtime bound.

To construct a "3SAT Computer", it suffices to show some basic operations and how they can be encoded
into 3SAT.

Preliminaries and Notation
---

Single bit variables will be denoted by $x_{k}$.

Multi bit variables will be denoted by $x(s)_{k} = ($x_{s-1,k}, x_{s-2,k}, /cdots, x_{0,k}$, where $s$
is the number of bits.

---

A useful heuristic will be to understand that the clause $(x_0 + x_1 + x_2)$ is false only when
$x_0=0$, $x_1=0$ and $x_2=0$.
One way to look at the clause is to say that the clause $(x_0+x_1+x_2)$ is only true if the 'forbidden'
configuration of
$x_0=0$, $x_1=0$ and $x_2=0$ doesn't happen.

For an arbitrary boolean function on three variables, we can take the Karnaugh map on false entries
and then negate the subsequent expression to get the formula in conjunctive normal form (CNF).

For example:

$$
\begin{array} {|cc|c|}
\hline f(x_0,x_1,x_2) & & x_1 \\
 & & \begin{array}{cc} 0 & 1\end{array} \\
 \hline x_0,x_1 & \begin{array}{ccc} 0 0 &  \\ 0 1 &  \\ 1 1 & \\ 1 0 & \\ \end{array}
 & \begin{array}{cc}
    1 & 0 \\
    0 & 0 \\
    0 & 0 \\
    0 & 0 \\
  \end{array} \\
 \hline
\end{array}
$$

One realization is:

$$
[ x_0 + x_1 + x_0^{'} \cdot x_1 ]^{'} = (x_0^{'})\cdot(x_1^{'})(x_0 + x_1^{'})
$$

Which can easily be verified to match the original example function.

---

To reduce CNF to 3CNF, we can add auxiliary variables, $y$, to chain the clauses together.

$$
\begin{array}{ll}
& (x_0 + x_1 + x_2 + x_3 + \cdots + x_{n-1}) \\
= & (x_0 + x_1 + y_0) \cdot (y_0^{'} + x_2 + y_1) \cdot (y_1^{'} + x_3 + y_2) \cdots \\
& (y_{n-4}^{'} + x_{n-2} + x_{n-1})
\end{array}
$$


** check this and prove **


Variable Assignment
---

First we start with a simple single bit variable assignment:

$$
x_1 = x_0
$$

This corresponds to the truth table:

$$
\begin{array} {|cc|c|}
\hline x_1 = x_0 & & x_1 \\
 & & \begin{array}{cc} 0 & 1\end{array} \\
 \hline x_0 & \begin{array}{ccc} 0 &  \\ 1 &  \\ \end{array}
 & \begin{array}{cc}
    1 & 0 \\
    0 & 1 \\
  \end{array} \\
 \hline
\end{array}
$$

That is, the expression is only true when both $x_0$ and $x_1$ have the same value.

This corresponds to the CNF expression:

$$
(x_0^{'} + x_1) \cdot (x_0 + x_1^{'})
$$

For $s$ bit variables, $x(s)_1 = x(s)_0$, the assignment then becomes:

$$
\begin{array}{l}
( x(s-1)_0^{'} + x(s-1)_1) \cdot (x(s-1)_0 + x(s-1)_1{'}) \cdot \\
(x(s-2)_0^{'} + x(s-2)_1) \cdot (x(s-2)_0 + x(s-2)_1{'}) \cdots \\
(x(1)_0^{'} + x(1)_1) \cdot (x(1)_0 + x(1)_1{'}) \cdot \\
(x(0)_0^{'} + x(0)_1) \cdot (x(0)_0 + x(0)_1{'})
\end{array}
$$


Addition
---

Consider the two 1-bit variables $x_0$ and $x_1$.
To find their sum, without carry, the following truth table
represents the operation:

$$
\begin{array} {|cc|c|}
\hline x_a = x_0 + x_1 & & x_a \\
 & & \begin{array}{cc} 0 & 1\end{array} \\
 \hline x_1 x_0 & \begin{array}{ccc} 0 0 &  \\ 0 1 &  \\  1 1 & \\ 1 0 & \\ \end{array}
 & \begin{array}{cc}
    1 & 0 \\
    0 & 1 \\
    1 & 0 \\
    0 & 1 \\
  \end{array} \\
 \hline
\end{array}
$$

It's CNF:

$$
\begin{array}{l}
(x_0 + x_1 + x_a^{'}) \cdot \\
(x_0 + x_1^{'} + x_a) \cdot \\
(x_0^{'} + x_1^{'} + x_a^{'}) \cdot \\
(x_0^{'} + x_1 + x_a) \cdot \\
\end{array}
$$

Similarly for the carry:

$$
\begin{array} {|cc|c|}
\hline x_c = \text{carry}( x_0 + x_1 ) & & x_c \\
 & & \begin{array}{cc} 0 & 1\end{array} \\
 \hline x_1 x_0 & \begin{array}{ccc} 0 0 &  \\ 0 1 &  \\  1 1 & \\ 1 0 & \\ \end{array}
 & \begin{array}{cc}
    1 & 0 \\
    1 & 0 \\
    0 & 1 \\
    1 & 0 \\
  \end{array} \\
 \hline
\end{array}
$$

It's CNF:

$$
\begin{array}{l}
(x_1 + x_c) \cdot \\
(x_0^{'} + x_1^{'} + x_c^{'}) \cdot \\
(x_0^{'} + x_1 + x_c)
\end{array}
$$

$s$ bit addition with carry can be performed in a similar fashion:

To get something more functional, we can do addition with carry:

$$
\begin{array} {|cc|c|}
\hline y_c = \text{carry}( x_0 + x_1 + x_c ) \\
 y_a = x_0 \oplus x_1 \oplus x_c & & y_c, y_a \\
 & & \begin{array}{cc} 0 & 1 & \end{array} \\
 \hline x_c x_1 x_0 & \begin{array}{ccc}
   0 0 0 &  \\ 0 0 1 &  \\  0 1 1 & \\ 0 1 0 & \\
   1 1 0 &  \\ 1 1 1 &  \\  1 0 1 & \\ 1 0 0 & \\ \end{array}
 & \begin{array}{cc}
    1 1 & 0 0 \\
    1 0 & 0 1 \\
    0 1 & 1 0 \\
    1 0 & 0 1 \\

    0 1 & 1 0 \\
    0 0 & 1 1 \\
    0 1 & 1 0 \\
    1 0 & 0 1 \\
  \end{array} \\
 \hline
\end{array}
$$

$$
\begin{array}{l}
(x_c + x_1 + x_0 + y_c^{'}) \cdot (x_c + x_1 + x_0 + y_a^{'}) \cdot  \\
(x_c + x_1 + x_0^{'} + y_c^{'}) \cdot (x_c + x_1 + x_0^{'} + y_a) \cdot  \\

(x_c + x_1^{'} + x_0^{'} + y_c) \cdot (x_c + x_1^{'} + x_0^{'} + y_a^{'}) \cdot  \\
(x_c + x_1^{'} + x_0 + y_c^{'}) \cdot (x_c + x_1^{'} + x_0 + y_a) \cdot  \\

(x_c^{'} + x_1^{'} + x_0 + y_c) \cdot (x_c^{'} + x_1^{'} + x_0 + y_a^{'}) \cdot  \\
(x_c^{'} + x_1^{'} + x_0^{'} + y_c) \cdot (x_c^{'} + x_1^{'} + x_0^{'} + y_a) \cdot  \\

(x_c^{'} + x_1 + x_0^{'} + y_c) \cdot (x_c^{'} + x_1 + x_0^{'} + y_a^{'}) \cdot  \\
(x_c^{'} + x_1 + x_0 + y_c^{'}) \cdot (x_c^{'} + x_1 + x_0 + y_a) \cdot  \\
\end{array}
$$

We can now construct our $s$ bit addition with $y(s)_a$ as our addition result, without carry,
and $y(s+1)_c$ as our auxiliary carry storage:

$$
\begin{array}{c}

\end{array}
$$

...

Subtraction can be done in a similar manner but with two's complement.

Multiplication
---

Multiplication turns out to be harder as the efficient algorithm is involved.

"Schoolchild" multiplication is $O(n^2)$ and can be used if need be.

Control Flow
---

First we talk about `if` statements:

$$
\begin{array} {|cc|c|}
\hline \text{if } (x_d) \to \text{expr}(x) & & x_d \\
 & & \begin{array}{cc} 0 & 1\end{array} \\
 \hline \text{expr}(x) & \begin{array}{ccc} 0 &  \\ 1 & \end{array}
 & \begin{array}{cc}
    1 & 0 \\
    1 & 1 \\
  \end{array} \\
 \hline
\end{array}
$$

If $\text{expr}(x)$ is in CNF, this amounts to adding the negated variable $x_d$ to every clause.

$$
(x_d^{'} + \text{expr}(x))
$$

When $x_d^{'} is 0, the resulting expression is rendered moot as each clause is not set to true from
the assignment of $x_d=0$.
When $x_d=1$ the only satisfying instance will necessarily have $\text{expr}(x)$ be true.


Bringing it Together
---

Once we have the basics of arithmetic, variable assignment and control flow, we can now
construct a language of sorts.

`for` and `while` loops can be simulated by bounding repetition.
A `break` like construction can be simulated by having an auxiliary variable
set to `true` if some condition is met on the inside loop.

Once we have `if` statements, the `goto` can effectively be simulated by adding
an "instruction pointer" variable.
We can wrap every unit of code with an `if` statement
that only gets called if the instruction pointer variable is set appropriately.
`goto`s are then effectively an assignment to the instruction pointer.
This construction is inefficient in the sense that it adds "code blocks" that are
duplicated but whose only difference is the instruction pointer but still stays
within the polynomial bound on instance size that's needed to keep it within NP.

Since we know the basic constructions of variable assignment, basic arithmetic and
conditionals are Turing machine equivalent, we have effectively shown
that SAT and 3SAT, by the normalization method above, can be used to simulate
a polynomial time bounded Turing machine.

The reason may have been lost in the details but one of the motivations was to
give some justified belief, even if empirical, of why we believe $\text{NP} \ne \text{P}$.
Since we know the Halting Problem is undecidable, we might think that the finite
restatement the halting problem, in terms of polynomial Turing machine decidability,
is also hard.





References
---

* ["The Complexity of Theorem-Proving Procedures" by  Stephen A. Cook](http://4mhz.de/download.php?file=Cook1971_A4.pdf)

###### 2020-05-11
