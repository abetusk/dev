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
mkdir custom_theme doc/css doc/js
wget https://raw.githubusercontent.com/abetusk/minimal/master/stylesheets/pygment_trac.css -O doc/css/pygment_trac.css
wget https://raw.githubusercontent.com/abetusk/minimal/master/stylesheets/styles.css -O doc/css/styles.css
wget https://raw.githubusercontent.com/abetusk/minimal/master/javascripts/scale.fix.js -O doc/js/scale.fix.js
```

`mkdocs.yml` using the [minimal theme](https://github.com/orderedlist/minimal):

```
site_name: Site Name
pages:
  - Home: index.md
theme_dir: 'custom_theme'
```

MkDocs uses [jinja2](http://jinja.pocoo.org/docs/dev/templates/) for
templates.


```
mkdocs build
```

`site` should now hold the static site.
