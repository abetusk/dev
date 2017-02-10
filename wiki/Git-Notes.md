### Git User Settings

Local:

```bash
$ git config user.name
abevoid
$ git config user.email
abevoid@abevoid.com
$ git config user.name abetusk
abetusk
$ git config user.email abetusk@mechaelephant.com
abetusk@mechaelephant.com
$ git config user.name
abetusk
$ git config user.email
abetusk@mechaelephant.com
```

Global:

```bash
$ git config --global user.name
abevoid
$ git config --global user.email
abevoid@abevoid.com
$ git config --global user.name abetusk
abetusk
$ git config --global user.email abetusk@mechaelephant.com
abetusk@mechaelephant.com
$ git config --global user.name
abetusk
$ git config --global user.email
abetusk@mechaelephant.com
```
### Git Log

```bash
git log --decorate=full --graph
```

### Merge Branches and Keep DAG History

```bash
git checkout -b alt-branch
...
git commit
git checkout fin-branch
git merge --no-ff alt-branch
```

### Creating and Deleting Branches

```bash
git checkout -b x-branch
...
git commit 
git push -u origin x-branch
git checkout release
git merge --no-ff x-branch
git commit 
git push
...
git branch -d x-branch
git push origin :x-branch
```

### Destroy Local Changes To Files

```bash
git fetch ; git reset --hard origin/release
```

### Comparing Changes

Local changes since last commit:

```bash
git diff
```

Two commits ago:

```bash
git diff HEAD^^
```

or:

```bash
git diff HEAD@{2}
```

### Restore File

Single file:

```bash
git checkout -- fn
```

Everything in a repo:

```bash
#!/bin/bash

for f in `git ls-files -d`
do

  echo restoring $f
  git checkout -- $f

done
```

### Caching Git Password

```bash
git config --global credentail.helper 'cache --timeout=3600'
```

### Clear Git Credential Cache (Clear Git Cached Password)

```bash
git credential-cache exit
```

### Tracking Remote Branch

```bash
git remote add origin https://github.com/user/repo.git
```

```
git remote -v
```

### Checking Out Submodules

```bash
git clone --recursive https://github.com/user/repo
```

```bash
git submodule update --init --recursive
```

###### 2017-02-10
