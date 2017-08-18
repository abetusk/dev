File Naming Conventions
===

Three principles:

* Machine readable
* Human Readable
* Plays well with default ordering

Conventions
---

* `-` (dash) separate words in concept
* `_` (underscore) separate units of meta-data
* pad numbers to allow for default file sort
* use YYYY-MM-DD or YYYYMMDD format for dates ([ISO 8601](https://en.wikipedia.org/wiki/ISO_8601))
* put dates first to help with default ordering (where appropriate)
* prefer lower case to mixed case
* prefer upper case to mixed case
* prefer consistent case

Examples
---

### Good

```
2017-08-18_article01.md
2017-08-18_article02.md
2017-08-18_article10.md
2016-01-08_roy_wg.vcf.gz
2016-02-14_priss_wg.vcf.gz
2016-06-12_zora_wg.vcf.gz
2017-04-10_leon_wg.vcf.gz
```

### Bad

```
acticle1.md
article2.md
article10.md
priss2142015.vcf.gz
leon17410.vcf.gz
zora16612.vcf.gz
roy1618.vcf.gz
priss16214.vcf.gz
```

References
---

* [naming things by Jenny Bryan](http://www2.stat.duke.edu/~rcs46/lectures_2015/01-markdown-git/slides/naming-slides/naming-slides.pdf)

###### 2017-08-18

