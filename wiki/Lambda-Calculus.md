Lambda Calculus
---

> Functional programming: Making you feel clever by allowing you to solve problems that nobody else even knew existed, in order to let you do what everyone else could do from the start.
> -- taneq ([HN comment](https://news.ycombinator.com/item?id=17956425))

| Syntax | Name | Description | Example |
|---|---|---|---|
| $(\lambda x . M)$ | function definition / lambda abstraction | Function $M$ taking $x$ as input | $(\lambda x . x^2)$ |
| $(M x)$ | function evaluation / application | Function $M$ executed on input $x$ | $(x^2 3)$ |

* $ \lambda x . y z = \lambda x . (y z) $
* $ x y z = (x y) z $

Recursion
---

From [6]:

> Lambda calculus, which is the core of functional languages, only supports function
> literals and function application. So the definition above is not a valid lambda term ...
> it involves a recursive binding: the definition ... refers to itself!

```
function fact_base(recur, x) {
  return function() {
    if (x==0) { return 1; }
    return x * (recur(recur, x-1)());
  };
}

fact = function(x) { return fact_base(fact_base, x)(); }
```

Now

```
> fact(5)
120
```

Currying
---

*The technique of translating the evaluation of a function that takes multiple arguments into evaluating a sequence of functions, each with a single argument.*

From [6]:

> Functions with several parameters can be encoded in the lambda calculus via currying,
> whereby a function taking two parameters is turned into a function that takes the first
> parameter and returns a function that takes the second parameter.

```
var X = function(recurse, n) {
  if (0==n) { return 1; }
  return n * recurse(recurse, n-1);
}

var Y = function(builder, n) { 
  return builder(builder, n);
}

var res = Y(X,6);
console.log(res);

//----

var X1 = function (recurse) { return function(n) {
  if (0==n) { return 1; }
  return n * (recurse(recurse))(n-1);
}};

var Y1 = function(builder) { return function(n) {
  return (builder(builder))(n);
}};

res = Y1(X1)(6);
console.log(res);

//---

var res =
  (function(builder) { return function(n) {
      return (builder(builder))(n);
  }})(function (recurse) { return function(n) {
    if (0==n) { return 1; }
    return n * (recurse(recurse))(n-1);
  }})(6);

console.log(res);
```

Produces:

```
720
720
720
```

Y Combinator
---

$$
Y = \lambda f . (\lambda x . f(x x)) (\lambda x . f(x x))
$$


References
---

1. [Re: Boston.pm perl6/pugs](https://www.mail-archive.com/boston-pm@mail.pm.org/msg02716.html)
2. [SO: What is a Y-combinator?](https://stackoverflow.com/questions/93526/what-is-a-y-combinator/94056#94056)
3. [SO: Clear intuitive derivation of the fixed-point combinator (Y combinator)](https://stackoverflow.com/questions/93526/what-is-a-y-combinator/94056#94056)
4. [Wikipedia: Currying](https://en.wikipedia.org/wiki/Currying)
5. [Wikipedia: Lambda Calculus](https://en.wikipedia.org/wiki/Lambda_calculus)
6. [The Simple Essence of the Y Combinator (Explained in Python)](https://lptk.github.io/programming/2019/10/15/simple-essence-y-combinator.html)

###### 2018-09-10
