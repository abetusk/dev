GCode Conversion Tools
---

At one point, I had good success with an Inkscape plugin called [Gcodetools](http://www.cnc-club.ru/forum/viewtopic.php?t=35) but
it seems to have succumbed to bit-rot and doesn't work on my current Ubuntu installation (16.04).

I'm settling on a rough toolchain that takes some base format (PostScript/PDF/SVG/etc.), converts
to `RS274` GCocde and then converts to something simpler.

Some tools of relevance are:

* [rsvg-convert](http://manpages.ubuntu.com/manpages/precise/man1/rsvg-convert.1.html)
* [pstoedit](http://www.pstoedit.net/)

Under Ubuntu, installation can be done via:

```
sudo apt-get install pstoedit librsvg2-bin
```

The following is an example script to convert an input SVG file into RS724 GCode:

```bash
#!/bin/bash

name=`basename $1 .svg`
rsvg-convert -f ps -o $name.ps $1
pstoedit -f gcode $name.ps $name.ngc
```

`RS724` GCode has expressions which may or may not work on your particular GCode interpreter.
I've written a script to do simple substitution (no nested expressions, no non-trivial functions,
run at your own risk):

```python
#!/usr/bin/python
#
# regexp substitution of variables.
# Uses Python's "eval" to evaluate interior
# after variable substitution.
#
# Source is copyright Abram Connelly, provided under the AGPLv3 license
#
import sys
import re

var_map = {}

# variable decleration
#
var_decl_pat = re.compile( r'\s*#(\d+)\s*=\s*([^\s]+)\s*(\([^\)]*\))?\s*$' )

# not [], [], not []
#
expr_pat = re.compile( r'([^\[]*)\[([^\]]*)\]([^\[]*)' )

# not #*, #\d+, not #*
#
var_sub_pat = re.compile( r'([^#]*)(#\d+)([^#]*)' )

# consider comments separately to avoid matching '#' and
# other special characters
#
comment_pat = re.compile( r'\([^\)]*\)' )

line_no = 0
for line in sys.stdin:
  line_no += 1

  line = line.rstrip()
  comments = ""
  for (comment) in re.findall(comment_pat, line):
    comments = comments + comment

  line = re.sub(comment_pat, '', line)
  m = re.match(var_decl_pat, line)
  if m:
    var_map[ "#" + str(m.group(1)) ] = str(m.group(2))
    continue

  varsub_line = ""
  for (pfx, var_subs, sfx) in re.findall(var_sub_pat, line):
    if var_subs in var_map:
      pass
    else:
      print " ERROR on line", line_no, ", no variable mapping for", var_subs
      sys.exit(1)
      continue

    varsub_line += pfx
    varsub_line += var_map[var_subs]
    varsub_line += sfx

  if varsub_line == "":
    varsub_line = line
    
  xpr_match = re.search(expr_pat, varsub_line)
  if not xpr_match:
    print varsub_line + comments
    continue
  
  cur_line = ""
  for (pfx, xpr, sfx) in re.findall(expr_pat, varsub_line):
    xpr_val = eval(xpr)
    cur_line += pfx + str(xpr_val) + sfx

  print cur_line +  comments
```

###### 2016-09-19

