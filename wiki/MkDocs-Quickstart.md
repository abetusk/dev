MkDocs Static Site - Quickstart
===

```
sudo pip install mkdocs
mkdocs new $site
cd $site
```

Assume the following all work under `$site`.

Create the directory structure:

```
mkdir dev_theme dev_theme/css dev_theme/js
wget https://raw.githubusercontent.com/abetusk/minimal/master/stylesheets/pygment_trac.css -O dev_theme/css/pygment_trac.css
wget https://raw.githubusercontent.com/abetusk/minimal/master/stylesheets/styles.css -O dev_theme/css/styles.css
wget https://raw.githubusercontent.com/abetusk/minimal/master/javascripts/scale.fix.js -O dev_theme/js/scale.fix.js
```

`mkdocs.yml` using the [minimal theme](https://github.com/orderedlist/minimal):

```
site_name: dev
pages:
  - index.md
  - "Textile-Cheat-Sheet.md"
  - "Image-Resize.md"
  - "Screenshots-Screencasts-Animated-Gifs.md"
  - "ffmpeg-notes.md"
  - "Unix-y-notes.md"
  - "lattice-reduction.md"
  - "GCode-Conversion.md"
  - "Git-Rename-Master.md"
  - "MkDocs-Quickstart.md"

docs_dir: 'wiki'
theme_dir: 'dev_theme'
extra:
  base : "/dev/"
```

MkDocs uses [jinja2](http://jinja.pocoo.org/docs/dev/templates/) for
templates.

To test (note, you need to change `config.extra.base` for this setup):

```
mkdocs serve
```

To build the static site in the `site` subdir:

```
mkdocs build
```

###### 2016-09-28
