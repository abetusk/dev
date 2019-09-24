Singularity Estimation
===

The term "singularity" was coined as an homage to a black hole singularity, where our
theories of relativity break down.
Though hard to pinpoint what the criteria are for the technological singularity,
I believe I've heard Kurzweil say it's when there's the
computation power of a small village, 10,000 to 100,000 human level AIs.

As a "back of the envelope" calculation, we can estimate what the rough time frame for
this could be.

For this estimate, I will use the human brain's storage capacity.
It's assumed that computation on what's stored goes hand in hand.
The other factors that will be assumed to follow easily are power consumption,
computation speed and whatever else goes with general purpose computation.

The storage capacity is a nice metric as there's a sentiment that, in general,
simple algorithms on large amounts of data win out over complex algorithms on small
amounts of data.
Often times the difference between code and data is semantic but the underlying sentiment
is the main motivation for focusing on storage capacity over anything else.

---

The time estimate is as follows:

* Estimate the human brain storage capacity
* Estimate the cost of current storage
* Assume Moore's Law holds for storage capacity and holds for the next couple of decades
* Assume the "singularity" will happen when storage capacity is the same as the human
  brain and costs around $1000

Extrapolate to find when that price point is hit.

The cost of $1000 is chosen under the assumption that true general purpose AI will
only happen when the economics of storage reach a point where amateurs and lay-people
have access to the computing power.
In the past, the personal computer became accessible at around the $1000 price point.

---

The human brain is estimated to be `2.5 petabytes`.
The entropy of the human brain can be very roughly estimated by taking the average number
of human brain neurons, `100 billion`, and multiplying by the average number
of neuron connections, `7000`.

```
l(100*10^9 * 7000)/l(10)
14.84509804001425683076
```

Where a petabyte is `10^15`.

As of today (`2019-09-24`) storage costs are about `$20 / terabyte`.

Assuming a generalized Moore's Law holds by halving the cost every `18 months`:

$$
\frac{$1000}{2.5 P} = \frac{$20}{1 T} \cdot \frac{1}{2}^{y \cdot \frac{18}{12}}
$$

or in about `7.5` years.

This puts the a rough timeline on the singularity slated at the year `2027`.

---

Often times these estimates can be off by a factor of a decade or so but if
there are underlying exponential processes involved in terms of computing
power per dollar, this means waiting some linear amount of time will result
in an exponential increase in computer power.
In other words, even if one or some of the parameters are off by an order of magnitude,
this will only skew the time frame linearly.

I find it interesting that the year `2027` is very close to what many of the
cyberpunk authors of the 1980s and 1990s estimated as the time their stories.


Reference
---

* [The Singularity of AI and Biotech is Near, Futurist Ray Kurzweil](https://www.youtube.com/watch?v=SD_NKKcxrXM)
* [Technological singularity](https://en.wikipedia.org/wiki/Technological_singularity)
* [Wikipedia: List of animals by number of neurons](https://en.wikipedia.org/wiki/List_of_animals_by_number_of_neurons)
* [Wikipedia: Neuron Connectivity](https://en.wikipedia.org/wiki/Neuron#Connectivity)

###### 2019-09-24

