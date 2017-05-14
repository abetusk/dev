### Remove highlights from less search

`ESC` `u`

### Jump to line in less

`ng` - Jump to line `n` relative to top of file

`nG` - Jump to line `n` relative to bottom of file

### Gzip without timestamps

By default, gzip keeps timestamp information for the file you're compressing.  This is problematic when you want reproducibility.

```bash
$ gzip -n inp.txt
```

This will create a file `inp.txt.gz` that, when uncompressed, will create a file with the current system timestamp.

As far as I know, `bgzip` does not keep file timestamp information.

### Read lines in a bash script

http://stackoverflow.com/questions/10929453/bash-scripting-read-file-line-by-line

```bash
#!/bin/bash
while IFS='' read -r line || [[ -n "$line" ]]; do
    echo $line
done < <( echo -e "this small script\nreads multiple\n lines" )
```

> IFS='' (or IFS=) prevents leading/trailing whitespace from being trimmed.
> -r prevents backslash escapes from being interpreted.
> || [[ -n $line ]] prevents the last line from being ignored if it doesn't end with a \n (since read returns a non-zero exit code when it encounters EOF).


sometimes you can just get away with this:

```bash
#!/bin/bash
while read line ; do
  echo $line
done < <( echo -e "this small script\nreads multiple\n lines" )
```

### Diff two streams

```bash
$ diff <( echo -e "stream\na" ) <( echo -e "stream\nb" )
2c2
< a
---
> b
```

### Find all files ending in `.md` and do an `ls -l`

```bash
$ find . -type f -name '*.md' -exec ls -l {} \;
```

### Put pairs of lines on their own line

```bash
$ echo -e 'a\nb\nc\nd\ne\nf' | paste - - | tr '\t' ' '
a b
c d
e f
```

### Differences, overlaps in two files

```bash
$ comm <( echo -e 'c\na\nb\nd' | sort ) <( echo -e 'e\nb\nd' | sort )
a
                b
c
                d
        e
```

### Print formatted columns

```bash
$ echo -e "column_0\tcol1\na\tbbbb\n"
column_0        col1
a       bbbb
$ echo -e "column_0\tcol1\na\tbbbb\n" | column -t
column_0  col1
a         bbbb
```

### bgzip

```bash
$ bgzip -i inp.txt
$ bgzip --stdout --offset 100 --size 32 inp.txt.gz
```

### parallel

```bash
#!/bin/bash
function process {
  z=$1
  time ( echo sleeping $z && sleep $z && echo waking up "($z)" )
}
export -f process

time echo -e '1\n3\n4' | parallel --max-procs 2 process {}
```

```
sleeping 1
waking up (1)

real	0m1.002s
user	0m0.000s
sys	0m0.000s
sleeping 3
waking up (3)

real	0m3.002s
user	0m0.000s
sys	0m0.000s
sleeping 4
waking up (4)

real	0m4.003s
user	0m0.000s
sys	0m0.000s

real	0m5.603s
user	0m0.140s
sys	0m0.072s
```

### xargs (parallel)

```bash
#!/bin/bash
function process {
  z=$1
  time ( echo sleeping $z && sleep $z && echo waking up "($z)" )
}
export -f process

time echo -e '1\n3\n4' | xargs -n 1 -P 2 -I{} bash -c 'process {}'
```

```
sleeping 1
sleeping 3
waking up (1)

real	0m1.003s
user	0m0.000s
sys	0m0.000s
sleeping 4
waking up (3)

real	0m3.002s
user	0m0.000s
sys	0m0.000s
waking up (4)

real	0m4.003s
user	0m0.000s
sys	0m0.000s

real	0m5.019s
user	0m0.000s
sys	0m0.000s
```

### sort on multiple fields

```bash
$ echo -e "5,cats,meow\n7,cute,mew\n2,cats,mewmew\n10,cats,meowmeowmeow\n2,cute,4you\n8,cute,4ever"
5,cats,meow
7,cute,mew
2,cats,mewmew
10,cats,meowmeowmeow
2,cute,4you
8,cute,4ever
$ echo -e "5,cats,meow\n7,cute,mew\n2,cats,mewmew\n10,cats,meowmeowmeow\n2,cute,4you\n8,cute,4ever" | \
  sort -k2,2 -k1,1nr -t,
10,cats,meowmeowmeow
5,cats,meow
2,cats,mewmew
8,cute,4ever
7,cute,mew
2,cute,4you
```


* `-t` field
* `-k<start>,<stop><opt>` key start and stop position along with opt (in the above `n` for numeric, `r` for reverse)


###### 2017-05-14
