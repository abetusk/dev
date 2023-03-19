Neural Network Notes
===

$$
\begin{align}
x \in \mathbb{R} ^ n & - \text{ input } \\
y \in \mathbb{R} ^ m & - \text{ output (training) data } \\
C & - \text{ loss function } \\
L & - \text{ number of layers } \\
W ^ l = ( w ^ l _ { j, k } ) & - \text{ weight } \\
f _ l & - \text{ activation function }  \\
z _ l & - \text{ weighted input at level } l \\
a _ l & - \text{ activation output at level } l \\
\end{align}
$$

Some common activation functions:

$$
\begin{align}
\text{ReLU}(x)  & = \max(0, x) \\
\sigma(x) &= \frac{1}{1 + e ^ { - \beta \cdot x } } \\
s(x) &= \frac{1}{\beta} \ln(1 + e ^ { \beta \cdot x } ) \\
\text{softmax}( \vec{ x } ) &= [ \frac{e ^ {x _ j}}{ \sum ^ {n-1} _ {j=0} e ^ { x _ j } } ]
\end{align}
$$

Where $\beta$ controls the width or 'ramp up' region for ReLU and the sigmoid function.

Call $g(x) = f _ { L-1 } ( W _ { L-1 } f _ { L-2 } ( W _ { L-2} \cdots f _ 0 ( W _ 0 x ) \cdots ) )$,
then we want to minimize:

$$
C(y, g(x))
$$

Backpropagation proceeds by updating weights based on gradient descent:

$$
\frac{ d C }{ d a _ { L-1 }} \circ \frac{ d a _ { L-1 } }{ d z _ { L-1 } }
 \circ \frac{ d z _ { L-1 } }{ d a _ { L-2 } } \circ \frac{ d a _ { L-2 } }{ d z _ { L-2 } } \circ
 \cdots \circ \frac{ d a _ 0 }{ d z _ 0 } \cdot \frac{ d  z _ 0 } { d x }
$$

Where $\circ$ is the Hadamard product.

TO BE CONTINUED...


Autoencoders
---

$$
\begin{align}
\phi & : X \to F \\
\psi & : F \to X \\
\phi, \psi & = \text{argmin} _ { \phi, \psi } | X - ( \psi \circ \phi ) X |^2
\end{align}
$$

$$
\begin{align}
z &= \sigma( W x + b ) \\
x &= \sigma'( W' z + b' ) \\
L(x,x') & = \text{ loss function } \\
 & = |x - \sigma'(W'(\sigma(Wx + b)) + b') |^2 \\
\end{align}
$$

Some common loss functions:

$$
\begin{align}
L _ {MSE} (x,\bar{x}) & = \frac{1}{M} \sum ^ {M-1} _ {i=0} | x_i - \bar{x} _ i |^2 \\
L _ {CE} (x,\bar{x}) & = - \frac{1}{M} \sum ^ {M-1} _ {i=0} \sum ^ { N-1 } _ {j=0} [ x _ {j,i} \ln( \bar{x} _ {j,i} ) + (1-x _ {j,i}) \ln( 1 - \bar{x} _ {j,i} ) ] \\
\end{align}
$$


Where $F$ is called the "latent space".

Regularization is a method to make sure answers meet some sparsity condition.
Here are two:

$$
\begin{align}
\ell _ 2 \text{ reg } & : L(x,\bar{x})  + \lambda \sum _ i \theta ^ 2 _ i   \\
\ell _ 1 \text{ reg } & : L(x,\bar{x})  + \lambda \sum _ i |a ^ h _ i |   \\
\end{align}
$$

Where $\theta$ are the presumably the weights and $a ^ h _ i$ are the activations of position $i$ at level $h$.



References
---

* [0](https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/)
* [1](https://en.wikipedia.org/wiki/Autoencoder)
* [2](https://arxiv.org/pdf/2201.03898.pdf)
* [3](https://en.wikipedia.org/wiki/Backpropagation)

###### 2023-03-18
