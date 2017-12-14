PCB Autorouting
===

I think it might be possible to come up with a reasonable PCB auto-router
based on the ideas in [WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse)
by [mxgmn](https://github.com/mxgmn).

Overview
---

The basic idea is to use the wave function collapse (wfc) to guess at a path routing.
There might need to be some heuristics added and additional algorithmic additions
to make the end result reasonable but the core idea behind wfc might work.

Briefly, the problem can be stated as a wfc by:

* Set a resolution of 1/4 a mil, say, and then create an image which can then be ported back
  to a vector file.
* Labelling all unique traces as different 'colors'
* Providing a library with start and end traces, as well as trace joints.
  There might need to be rotations provided for each trace.
* For multi-layer boards, add 'joining' voxels to the the lower layers
  in the library and turn it into a 3d wfc problem with only a few dimensions in the 3rd axis.
* Provide an 'entropy weight' that lowers the entropy of the possible choices
  based on a linear distance to the center of mass from the anchor points of where the
  trace started, say.

The entropy heuristic above is added to try and mitigate "meandering" lines and have traces
gravitate towards each other, much like building a train track from the source and destination
and meeting in the middle.
We'll have to play with this parameter to see if it actually solves the meandering problem,
or if the meandering problem is actually a problem.

Care has to be taken to make sure there are reasonable alternatives to starting a trace
from a pad, having the pads labelled properly, making sure the board edges are respected,
making sure the clearances are respected, among others.
Maybe adding transparency can act as wildcards for portions of the patterns that require it
while having white space can force clearance.
Trace width is also a problem if there is a fixed pattern window size in the library base image.

Some thoughts:

* The library can be constructed with different sized patterns so long as we understand how to
  connect other patterns to it.
* Length constrained traces can be achieved by incrementing a counter associated with each pixel
  (minimum of neighbors + 1) and making sure the trace ends on the proper count.
* Length bounds can be acheived by allowing a connection within a certain range
* Multiples of length can be achieved by modular count.

We have to think about the length issues as there might be some subtleties involved.

For length constriained traces might also want another heuristic where they try to
stay within a certain threshold of remaining distance (to the COM, say), with the
entropy changing as it drifts out of the threshold, pushing it at a tangent to
try and compensate if there's too much slack.

Vanilla WFC
---

WFC tries to fit a library of patterns on the destination image while making sure
they're locally consistent.
The general problem is `NP-Hard` so we don't have much hope of finding an efficient
general solution but since most routing is done by humans anyway, the hope is that
most problems fall into the 'easy' range so as to be susceptible to this type of
solution.

From `mxgwn`'s repo, they claim that it's satisfying to watch because the algorithm
functions much the way humans do.
If that's true, then this might be a very reasonable solution, potentially giving
routing that seems even "natural" by some measure.

I'll briefly describe the algorithm for a 2D image:

* Create a library of patterns along with how they're able to join together.
  In a simple form, take in a "sample" image and subdivide it into `(N,M)` windows,
  recording each unique pattern you find, it's frequency of occurance and what
  it's neighbors are.
* Initialize the output array of dimension `(X,Y)` with an array of possible library
  pattern indices at each `x,y` position.

Now we go through and "collapse" the wave, breaking ties at random and propagating
the implications of choices:

```
While there isn't a contradiction and there are still tiles to be chosen in output:
  Pick a tile with minimum entropy
  Choose a pattern for the picked tile from the available choices to it, weighting appropriately
  "Propagate" choice by removing invalid patterns on adjacent tiles (within the window)
```

Output positions without a valid choice result in a contradiction.
Ouputt positions with only a single choice are 'fixed' and removed from consideration in future
tile picking.

The entropy calculation can be done via suming the log of the frequency of the tile patterns
available to it.

Comments
---

Extending to 3D can be seen.
Using arbitrary libraries instead of from a source image and with a fixed window can also be seen.

The parameters that can be added/played with are:

* backtracking count
* weight of center of mass (com) entropy heuristic
* library weight/minimum entropy function

There might be better heurstics than the com entropy heuristic.

This method is nice as well because if the wfc fails, the user can facilitate it by providing
"forced" portions.
For example, if there's a bottleneck where a trace absolutely must go through, this might be
difficult to discover with wfc+backtracking.
Instead, the user can add a trace "anchor" to help wfc find a valid solution.

Also of interest might be non straight line traces.
By adding a "wave" trace library, this might help create more "natural" or "wavy" traces
instead of being restricted to the stright line and 45 degree angled joints.

Test suite
---

In order to make sure things are working properly, there should be a suite of examples to choose from
to make sure the algorithm is working properly.
These should start out simply and then get progressively more complex.
The tests for validity should include making sure the clearances are respected and connections have
been made.

Some small examples off the top of my head:

* Square PCB with one pad connected to another.
* A "U" PCB with one pad on one leg and the other pad on the other leg with the trace forced to snake around the neck
* `K(3,3)` on a small square PCB to test multi layer boards.

Taking boards off of OSH Park (especially the ones that are free/libre) could work as a source of example boards to
choose from.

References
---

* [WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse) by mxgmn
* ["WaveFunctionCollapse is Constraint Solving in the Wild" by Isaac Karth and Adam M. Smith](https://github.com/abetusk/papers/blob/release/Generative/wfc_is_constraint_solving_in_the_wild.pdf)
* [Javascript wavefunctioncollapse](https://github.com/kchapelier/wavefunctioncollapse) by kchapelier
* [C++ wfc](https://github.com/emilk/wfc) by emilk
* [VoxModSynth (3D wfc)](https://github.com/sylefeb/VoxModSynth) by sylefeb
* ["Generating Worlds With Wave Function Collapse"](http://www.procjam.com/tutorials/wfc/) ([gist](https://gist.github.com/selfsame/e7ff11205c316888977f9cac04fe4035))


