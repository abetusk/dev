Python Regex Cheatsheet
===

```
import re
...

# match only beginning of line
#
re.match(pat, s)

# match anywhere
#
re.search(pat, s)
```

Match a Real
---

`^\s*([-]?(\d+|\d+\.\d+|\.\d+|\d+\.))\s*$`

```
import re

v = ['1', '-5', '0', '.1', '-.7', '1.2', '-3.4', '-10.', '91.']
x = ['  a', 'b', 'c']

for _v in v:
  m = re.search('^\s*([-]?(\d+|\d+\.\d+|\.\d+|\d+\.))\s*$', _v)
  if m:
    print "matched:", m.group(1)

for _x in x:
  m = re.search('^\s*([-]?(\d+|\d+\.\d+|\.\d+|\d+\.))\s*$', _x)
  if m:
    print "matched??", m.group(1)
```

Match an Integer
---

`^\s*([-]?\d+)\s*$`

```
import re

v = ['1', '-5', '0', '.1', '-.7', '1.2', '-3.4', '-10.', '91.']
x = ['  a', 'b', 'c']

for _v in v:
  m = re.search('^\s*([-]?\d+)\s*$', _v)
  if m:
    print "matched:", m.group(1)

for _x in x:
  m = re.search('^\s*([-]?\d+)\s*$', _x)
  if m:
    print "matched??", m.group(1)
```


###### 2020-04-18
