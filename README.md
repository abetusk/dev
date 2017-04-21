[Dev Blog](http://mechaelephant.com/dev/)
===

Overview
---

See my [Dev Blog](http://mechaelephant.com/dev/).

Mostly notes for myself in a Blog-esque presentation.

Uses `mkdocs` to generate a list of Blog-like entries.
`orderedlist` is used for the theme.


Compilation
---

```bash
$ mkdocs build
$ mkdocs serve
```

Workflow
---

As a convention, each blog entry is stored in it's own Markdown file, with a timestamp at the end in the form:

```
###### YYYY-MM-DD
```


The compilation workflow is pretty clunky.  To test local, make sure the `base` variable in `mkdocs.yml` is set to `"/"`.
For production deployment, set the `base` variable to `"/dev"`.

Make sure to update a new entry in:

* `wiki/home.md`
* `wiki/Home.textile`
* `wiki/_Sidebar.textile`
* `dev_theme/base.html`
* `mkdocs.yml`

Probably only the `base.html`, `home.md` and `mkdocs.yml` are actually needed.  The others were a hold over from
when I was trying to get things working under GitHub's wiki.
