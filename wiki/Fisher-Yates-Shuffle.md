Fisher-Yates Shuffle
---

The [Fisher-Yates shuffle algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) is used to create a random permutation.
The derivation is relatively straight forward:

```
function fisher_yates_shuffle(a) {
  var t, n = a.length;
  for (var i=0; i<(n-1); i++) {
    var idx = i + Math.floor(Math.random()*(n-i));
    t = a[i];
    a[i] = a[idx];
    a[idx] = t;
  }
}
```

We choose the first element at random, then
proceed to choose subsequent entries from the remaining elements.

As a spot check, we can confirm that there are $n!$ configurations
yielding approximately $ n (lg(n) - 1) $ bits of entropy.
Each poll of the random number generator is for $ lg(n-i) $ bits
over $n-1$ entries:

$$ lg(2) + lg(3) + \cdots + lg(n) = \sum_{k=1}^{n} lg(k) = lg(n!) $$

The Wrong Way
---

One can consider the following incorrect way to do the shuffle:

```
function nofish_shuffle(a) {
  var t, n = a.length;
  for (var i=0; i<n; i++) {
    var idx = Math.floor(Math.random()*n);
    t = a[i];
    a[i] = a[idx];
    a[idx] = t;
  }
}
```

or a slight variant:

```
function noyaks_shuffle(a) {
  var t, n = a.length;
  for (var i=0; i<n; i++) {
    var idx = Math.floor(Math.random()*(n-1));
    if (idx==i) { idx = n-1; }
    t = a[i];
    a[i] = a[idx];
    a[idx] = t;
  }
}
```

Where the difference in `nofish_shuffle` and `noyaks_shuffle`
is to skip the current index when considering which element to permute.

A friend of mine suggested an nice proof to show the above two
shuffle algorithms provide incorrect results.

As above, there are $n!$ possible shuffles we want to choose from, with
equal probability.
Since `nofish_shuffle` is choosing each element to permute from the whole
array, there are $n^n$ possible choices for the permutation with the
understanding that there might be some overlap.

Producing multiple configurations is permissible so long as `nofish_shuffle`
would produce an equal distribution for each of the $n!$ configurations.
Since $ n! \nmid n^n $ for $n>2$, there must be some configurations that
appear more often by the pigeonhole principle.

`noyaks_shuffle` doesn't fare much better since there are $n^{n-1}$ possible
configurations and $n! \nmid n^{n-1}$ for $n>2$.

Though hidden in such a large configuration space, both `nofish_shuffle`
and `noyaks_shuffle` produce configurations that are not uniformly
distributed.

###### 2018-06-13
