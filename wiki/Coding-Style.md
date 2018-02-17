Elements of Coding Style
===

This is meant as a light style guide for coding.
Rules here are guides and not meant to be used
when common sense dictates otherwise.

The following rules are mostly semantic and are
done with a 'polyglot' point of view even though
JavaScript is mostly used for coding examples.

These are coding format rules that I mostly
gravitate towards and is my attempt at formalizing
them in some way.



Prefer two space indentation to tab or four spaces
---

Two space indentation should be preferred to four spaces or tabs for indentation.
Four spaces causes code to gravitate too far to the right.
Tabs are inconsistently rendered, annoying to manipulate and camouflage themselves
as spaces.

```
function f() {
  console.log("hello");
  if (true) {
    console.log("hello, friend");
  }
}
```

Prefer start block token on the same line as control statements and function headings
---

For languages that have a start block token, a `{` say,
prefer to put them on the same line as the function heading.
Putting start blocks only increases vertical length with no real
benefit.
If breaks in text are needed, add returns as needed.

```
function f() {

  for (var i=0; i<1; i++) {
    console.log("hello");
  }

}
```

Encase conditional blocks within block tokens even if the language allows otherwise
---

Even if the language allows you to forgo block tokens to encase the control block
of a conditional, encase them in the block tokens anyway.
If statements are extended, it's an easy mistake to think the added code
falls within the same conditional if not encased in the block tokens.


```
  if (true) {
    console.log("hello");
  }
```

Place small conditional statements on a single line
---

If the conditional expression and statement body is small enough, place it all on the same line.
If the line is too long, this should be avoided but for small statements, terseness wins
over beauty.

```
  if (true) { console.log("hello"; }
```

Prefer alternate `else` conditionals on their own line
---

For ease of reading, put `else` and `else if` conditionals on their own line.
Each alternate conditional is easier to read, align and comment if necessary
if they're as independent as possible from the surrounding sibling conditionals.

```
  if (ok) {
    console.log("hello");
  }
  else if (ko) {
    console.log("goodbye");
  }
  else {
    console.log("hello and goodbye");
  }
```

Prefer ternary conditional assignment over `if/else` assignment
---

If the language allows for ternary expressions, use them for alternate assignments.
Terseness wins out over beauty.

```
  var v = ( vv ? true : false );
```

Prefer putting comments at the top of statement blocks and put a blank comment line after the comment text
---

Comments should appear on their own line, indented appropriately, above the logic
it's commenting on, where appropriate.
In the cases that comments need to go into a statement block instead of above
it, they should appear at the top of the statement block.
Inline comments should be avoided.

Comments should describe what the high level concept of a piece of code is.
The least it should do is to remind the author of the intent of the code were it to be
revisited after a time.
Comment blocks should have a trailing 'blank' comment line to ease of reading.

Prefer not to put comments inline with code
Don't put comments 


```
  // If everything is 'ok',
  // provide a friendly greeting.
  //
  if (ok) {
    console.log("hello");
  }
```

End of function returns should have no blank line between the ending block token
---

Trailing newlines after the last return should be culled for conciseness.

```
function f() {

  console.log("hello");

  return true;
}
```

No trailing whitespace at end of lines
---

Trailing whitespace should be culled at the end of the line.
Use whitespace highlighting in your editor to notice it.


When doing many variable assignments, align them for readability
---

When assigning variables values, on initialization say, prefer
to format them so they can easily be read by aligning the equals
sign and putting multiple variables on a single line if need be.
Small differences are more noticeable when aligned in this way.
Structure and intent of why the variables are being assigned
is sometimes more apparent when aligned properly.

Add space between the end of the variable and the `=` if need be.
Group in blocks to ease readability.

```
  var x00 = 0, x01 = 1,
      x10 = 1, x11 = 0;

  var mammal  = 'cat',
      reptile = 'chameleon',
      fish    = 'catfish',
      insect  = 'ladybug',

      dinosaur         = 'brontosaurus',
      extinct_elephant = 'woolly mammoth';

```

Space between parent expression and nested sub expressions, aligning inner expressions with proper indentation.  Place Boolean operations at end of line, where appropriate.
---

For a parent control statement expression, put a space between the outer parenthesis and the inner expression.
For the expressions within the control statement, align them for readability with proper indentation
if the control is nested.

Boolean tokens should be placed at the end of the line so the first relevant piece of information
on the line is relevant logic.

Nested multi-line conditionals are hard enough to read, try to ease the cognitive load on the reader
as much as possible.

```
function f(v) {
  var k=0;
  while ( (v>10) &&
          (k<v) &&
          ( ((k+v) > 100) || 
            ((k-v) < 50) ) ) {
    console.log("hello");
  }
}
```


Use parenthesis for explicit order of operations
---

Use parenthesis to explicitly show what the order of
operations should be for an expression or statement.
It puts a lot of cognitive load on the reader to
remember which order of operations takes precedence
in the language that the code is written in.

Sometimes order of operations aren't the same
between languages.
Sometimes a token is overloaded and mean different
things in different contexts, often within the same
line.

Ease the readers burden by explicitly spelling it out
for them.

```
  while ( ((*p) != 0) &&
          ((5*(*p)) > 100) ) {
    p++;
  }
```

###### 2018-02-17
