Git Notes
===

```
$ mkdir x ; cd x
$ git init
$ a=`echo 'hello' | git hash-object -w --stdin `
$ b=`echo 'meow' | git hash-object -w --stdin `
$ git cat-file -p $a
hello
$ git cat-file -p $b
meow
$ zlib-flate -uncompress < .git/objects/`echo $a | cut -c1-2`/`echo $a | cut -c3-`
blob 6hello
$ zlib-flate -uncompress < .git/objects/`echo $b | cut -c1-2`/`echo $b | cut -c3-`
blob 5meow
$ h=`printf '%s %s %s\t%s\n' 100644 blob $a hello.txt 100644 blob $b meow.txt | git mktree `
$ $ zlib-flate -uncompress < .git/objects/`echo $h | cut -c1-2`/`echo $h | cut -c3-` | hexdump -C
00000000  74 72 65 65 20 37 33 00  31 30 30 36 34 34 20 68  |tree 73.100644 h|
00000010  65 6c 6c 6f 2e 74 78 74  00 ce 01 36 25 03 0b a8  |ello.txt...6%...|
00000020  db a9 06 f7 56 96 7f 9e  9c a3 94 46 4a 31 30 30  |....V......FJ100|
00000030  36 34 34 20 6d 65 6f 77  2e 74 78 74 00 37 5d 5c  |644 meow.txt.7]\|
00000040  3c e5 4c 13 19 0b 2b e1  79 e7 f3 71 7e bd fd 5a  |<.L...+.y..q~..Z|
00000050  df                                                |.|
00000051
$ git read-tree $h
$ git ls-files -s
100644 ce013625030ba8dba906f756967f9e9ca394464a 0       hello.txt
100644 375d5c3ce54c13190b2be179e7f3717ebdfd5adf 0       meow.txt
$ git checkout-index -a
$ ls
hello.txt  meow.txt
$ cat hello.txt 
hello
$ cat meow.txt 
meow



```


References
---

* [Internal Git Architechture](https://indepth.dev/becoming-a-git-pro-part-1-internal-git-architecture/)
