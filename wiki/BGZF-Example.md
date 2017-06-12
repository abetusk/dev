BGZF Example
===

`BGZIP` allows for quick random access to a `bgzip` file by creating an index.
As an example, here is a way to compress a file with `bgzip` and access a random
portion of it:

```
$ ls -la
total 685104
drwxrwxr-x 2 abetusk abetusk      4096 Jun 12 17:33 .
drwxrwxr-x 5 abetusk abetusk      4096 Jun 12 17:33 ..
-rw-rw-r-- 1 abetusk abetusk 701533731 Jun 12 17:33 hu826751.gff
$ bgzip -i hu826751.gff 
$ ls
hu826751.gff.gz  hu826751.gff.gz.gzi
$ bgzip -h

Version: 1.4.1
Usage:   bgzip [OPTIONS] [FILE] ...
Options:
   -b, --offset INT        decompress at virtual file pointer (0-based uncompressed offset)
   -c, --stdout            write on standard output, keep original files unchanged
   -d, --decompress        decompress
   -f, --force             overwrite files without asking
   -h, --help              give this help
   -i, --index             compress and create BGZF index
   -I, --index-name FILE   name of BGZF index file [file.gz.gzi]
   -r, --reindex           (re)index compressed file
   -g, --rebgzip           use an index file to bgzip a file
   -s, --size INT          decompress INT bytes (uncompressed size)
   -@, --threads INT       number of compression threads to use [1]

$ time bgzip -b 100000000 -s 100 hu826751.gff.gz
54      .       +       .       alleles C/T;db_xref dbsnp.120:rs11035863;ref_allele C
chr11   CGI     REF     40509955        40510029        .       +       .
real    0m0.009s
user    0m0.004s
sys     0m0.004s
```

C Example
---

Here's a `C` example:


```
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#include "bgzf.h"

#include <vector>
#include <string>

int main(int argc, char **argv) {
  int i, j, k, r;
  BGZF *bgzfp;
  std::string ifn, idx_fn;
  int64_t pos=-1;
  char buf[1024];
  ssize_t s;
  size_t buflen=1024;

  if (argc<2) {
    printf("provide bgzip file\n");
    exit(-1);
  }
  ifn = argv[1];

  printf("loading bgzip file %s\n", ifn.c_str());
  bgzfp = bgzf_open(ifn.c_str(), "r");
  if (!bgzfp) {
    fprintf(stderr, "error opening file %s\n", ifn.c_str());
    exit(1);
  }

  printf("loading index bgzip file %s%s\n", ifn.c_str(), ".gzi");
  r = bgzf_index_load(bgzfp, ifn.c_str(), ".gzi");
  printf("got %i\n", r);

  r = bgzf_useek(bgzfp, 100000000, SEEK_SET);
  printf("got %i\n", r);
  if (r<0) {
    perror("...");
    exit(-1);
  }
  s = bgzf_read(bgzfp, buf, sizeof(char)*buflen);
  printf("...%i\n", (int)s);

  printf("---\n");
  for (i=0; i<s; i++) { printf("%c", buf[i]); }
  printf("\n---\n");

  bgzf_close(bgzfp);

}
```

To compile:

```
g++ -I $HTSDIR/htslib-1.4.1/htslib -lhts bgzf-example.cpp -o bgzf-example -L $HTSLIB/htslib-1.4.1 -lhts
```

To run:

```
LD_LIBRARY_PATH=$HOME/htslib-1.4.1 ./bgzf-example hu826751.gff.gz
```

Which assumes the `hu826751.gff.gz.gzi` file is in the same directory as the `hu826751.gff.gz` file.

This assumes `htslib` is installed under the directory pointed to by the `HTSLIB` environment variable.

See the [htslib](https://github.com/samtools/htslib) repo for details on how to download and install.

###### 2017-06-12

