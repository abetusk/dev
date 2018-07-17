Halting Problem
===

The Halting Problem asks whether there exists a program that takes other programs
as input and determines whether they loop forever or halt.

Assume such a program exists and call it `HP`.

The program `HP(P,X)` assumes:


* `HP` is a finite program
* `HP` stops in finite time
* `HP` takes as input a program, `P`, with input, `X`, both of finite length
* `HP` can access infinite memory such as a tape in a Turing Machine model

Consider the program SPITE:

```
SPITE(P) {

  if (HP(P,P) reports P halts with P as input) {
    while (true) {} // loop forever
  }

  else if (HP(P,P) reports P loops forever with P as input) {
    halt // return
  }

}
```

When we run `SPITE(SPITE)` (`SPITE` with itself as input), there are two cases:

* `SPITE(SPITE)` halts, in which case the first condition would have been hit, contradicting the subsequent action of looping forever.
* `SPITE(SPITE)` loops forever, in which case the second condition would have been hit, contradicting the subsequent action of halting.

No matter the path we take, we get a contradiction, proving the impossibility of `HP` existing with our given assumptions.

###### 2018-06-13
