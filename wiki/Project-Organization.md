Project Organization
===

These are notes on "best practices" for Git project
organization.

Directory Structure
---

| File or Directory | Description | Misc |
| --- | --- | --- |
| `src/` | Source files. | |
| `dist/` | Should remain empty in repo.  Populated on compilation. | |
| `tests/` | Test suite. | |
| `examples/` | Example usage | |
| `README.md` | Project description | |
| `LICENSE` | License file for source | |
| `.gitignore` | Git ignore file. | |

Description
---

### `src/`

The source files of the project.

### `dist/`

The destination directory for compiled source files.
This directory should remain empty in the main Git repo.

### `tests/`

The test suite to make sure the running code passes testing.

### `examples/`

Example usage of your program on small datasets (where applicable).

### `README.md`

A description of the project.
This should contain the following, preferably in this order:

* Screenshot
* Description of what the project is
* A "quick start" section
* Motivation for why the project exists
* How to compile (if applicable)
* How to run
* Example usage
* The license it's under, even if you have a `LICENSE` file.
  If there are multiple licenses then describe what each portion
  of the project falls under which license or where to find that
  information out.
* Credits (if applicable)
* References (if applicable)

If a screenshot isn't appropriate for the project (say it's a simple command line
program) then either a block of test with a sample run or an arbitrary picture
should be used.
If it's unclear what to use as a screenshot, use a free/libre licensed cat picture.

### `LICENSE`

The license of the software.
If there are multiple licenses, some options are to make a file per license used
with some description either in the file or outside, as to which files in the project
fall under which license or to concatenate all licenses into a single file.

### `.gitignore`

The files for Git to ignore.

Some common options are :

* `*~` - ignore `vi` auto save files
* `*.swp` - ignore `vi` file lock files


Language Dependent Files
---

### JavaScript

* `package.json` - dependencies for your `npm` package
* `bower.json` - front end dependencies for your JavaScript package


### C/C++

* `configure.ac`
* `Makefile.am`
* `configure`
* `Makefile.in`


References
---


* ["Maintaining an Open Source Project: Project Organization"](https://www.gun.io/blog/maintaining-an-open-source-project) by Jacob Wenger

###### 2017-08-05
