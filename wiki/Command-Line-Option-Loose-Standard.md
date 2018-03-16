Loose Standards for Command Line Options
===


| option | description |
|--------|-------------|
| -a     | all         |
| -b     | buffer / block size |
| -c     | comand      |
| -d     | debug or delete |
| -D     | define |
| -e     | execute |
| -f     | file (input) |
| -h     | help |
| -i     | interactive / initialize |
| -I     | include |
| -k     | keep / kill |
| -l     | list / load / login / length / lock |
| -m     | message / mode |
| -n     | number |
| -o     | output |
| -p     | port / protocol |
| -q     | quiet |
| -r / -R | recurse |
| -s     | silent / subject |
| -t     | tag |
| -u     | user |
| -v     | verbose / version |
| -V     | version |
| -w     | width / warning |
| -x     | debug / extract |
| -y     | yes |
| -z     | compress |
 

From an answer on [SO](https://stackoverflow.com/questions/2199624/should-the-command-line-usage-be-printed-on-stdout-or-stderr),
a good convention seems to be:

* When no options are given, show help and print to `stderr` with an error code
* When the `-h` or `--help` option are given, provide help on `stdout` and give no error

References
---

* [taoup ch. 10](http://www.catb.org/esr/writings/taoup/html/ch10s05.html)
* [SO: Should the command line “usage” be printed on stdout or stderr?](https://stackoverflow.com/questions/2199624/should-the-command-line-usage-be-printed-on-stdout-or-stderr)

###### 2017-12-25
