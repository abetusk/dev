Example C Project Template
===

This is a basic template for using automake tools for creating the `configure` and `Makefile`
in a C/C++ program.

Requirements
---

* `automake` - e.g. `sudo apt-get install automake`
* `gcc`

`main.c`
---

```
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
  printf("hello, friend\n");
}
```

`configure.in`
---

```
AC_INIT([hellofriend], [0.1], [abetusk@mechaelephant.com])
AM_INIT_AUTOMAKE
AC_PROG_CC
AC_CONFIG_FILES([Makefile])
AC_OUTPUT
```

`Makefile.am`
---

```
AUTOMAKE_OPTIONS = foreign
bin_PROGRAMS = hellofriend
hellofriend_SOURCES = main.c
```

Run automake
---

```
aclocal
autoconf
automake --add-missing
```

`configure, make, make install`
---

```
./configure
make
make install
```

References
---

* [The magic behind configure, make, make install]( https://robots.thoughtbot.com/the-magic-behind-configure-make-make-install)

###### 2017-08-05
