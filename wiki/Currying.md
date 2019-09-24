Lambda Calculus
---

> Functional programming: Making you feel clever by allowing you to solve problems that nobody else even knew existed, in order to let you do what everyone else could do from the start.
> -- taneq ([HN comment](https://news.ycombinator.com/item?id=17956425))

| Syntax | Name | Description | Example |
|---|---|---|
| $(\lambda x . M)$ | function definition / lambda abstraction | Function $M$ taking $x$ as input | $(\lambda x . x^2)$ |
| $(M x)$ | function evaluation / application | Function $M$ executed on input $x$ | $(x^2 3)$ |

* $ \lambda x . y z = \lambda x . (y z) $
* $ x y z = (x y) z $


Currying
---

*The technique of translating the evaluation of a function that takes multiple arguments into evaluating a sequence of functions, each with a single argument.*

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



References
---

1. [Re: Boston.pm perl6/pugs](https://www.mail-archive.com/boston-pm@mail.pm.org/msg02716.html)
2. [SO: What is a Y-combinator?](https://stackoverflow.com/questions/93526/what-is-a-y-combinator/94056#94056)
3. [SO: Clear intuitive derivation of the fixed-point combinator (Y combinator)](https://stackoverflow.com/questions/93526/what-is-a-y-combinator/94056#94056)
4. [Wikipedia: Currying](https://en.wikipedia.org/wiki/Currying)
5. [Wikipedia: Lambda Calculus](https://en.wikipedia.org/wiki/Lambda_calculus)

###### 2018-09-10
