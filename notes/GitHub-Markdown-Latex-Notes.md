GitHub Flavored Markdown Latex Notes
===

GitHub renders Latex (through MathJax?) in Markdown documents
but it has some major quirks that get in the way that are not
at all obvious.

Here are some workarounds.


Not Rendering Curly Brackets (`{`, `}`)
---

These need a double escape (`\\{`, `\\}`) ($\\{ \\}$):

$$
\\{ \\}
$$

Note: Latex uses curly braces are part of the grammar for grouping.

Not Rendering Percent Sign (`%`):
---

These need a double escape (`\\%`) ($\\%$):

$$
\\%
$$

Note: percent signs are used as comments in Latex

Latex String Not Rendering Even Though Its Encapsulated In Dollar Signs
---

This won't render properly:

```
This has $ x $ problems
```

The solution is to remove whitespace after the first dollar sign and
before the last dollar sign

```
This is $a b$ ok...
```

This is $a b$ ok...

Also, putting characters too close to the outside of the dollar signs causes problems.
For example

```
This ($x$) fails
```

The fix is to put spaces on the outside:

```
This ( $x$ ) works...
```

This ( $x$ ) works...

Underscores Interpreted as Italics by Markdown Instead of Subscripts by Latex
---

I'm a little confused under what exact conditions this happens but it looks like
when there are multiple underscores (maybe an even number?) that sit between
curly braces, things get confused.

For example, the following has troubles:

```
${x}_{y} {z}_{w}$
```

The fix is to put spaces before and after the underscore.
This should render:

```
${x} _ {y} {z} _ {w}$
```

... ${x} _ {y} {z} _ {w}$ ...

$$
{x} _ {y} {z} _ {w}
$$

Sum and/or Product Sub/Superscripts Get Mispositioned
---

The sum and product (sigma and pi) symbols insist on jumping to the top in the following:

```
$\sum ^ {n} _ {i} \prod _ {i} ^ {n} \sum^m_j \prod_k^p$ 
```

To fix, wrap the sum and product in curly braces:

```
${\sum} ^ {n} _ {i} {\prod} _ {i} ^ {n} {\sum}^m_j {\prod}_k^p$ 
```

...  ${\sum} ^ {n} _ {i} {\prod} _ {i} ^ {n} {\sum}^m_j {\prod}_k^p$  ...

$$
{\sum} ^ {n} _ {i} {\prod} _ {i} ^ {n} {\sum}^m_j {\prod}_k^p
$$

