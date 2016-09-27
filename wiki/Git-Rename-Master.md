Renaming `master` branch to `release`
---

From [Adam Dymitruk on SO](http://stackoverflow.com/questions/8762601/how-do-i-rename-my-git-master-branch-to-release)

```
git checkout -b release master    # create and switch to the release branch
git push -u origin release        # push the release branch to the remote and track it
git branch -d master              # delete local master
```

If you're using GitHub (as I am), issuing the next needed comman (`git push --delete origin master`) will
fail because GitHub won't let you delete the default branch, which is stil `master`.

In order to successfully be able to delete the remote `master` branch, you have to set the default
branch on GitHub to be the newly created branch (i.e. `release`).

![GitHub Edit Default Branches Admin Web Page](/img/gh-branches.png)

After the default branch has been changed to the newly created branch (`release` in this case), issuing
the following commands will now work:

```
git push --delete origin master   # delete remote master
git remote prune origin           # delete the remote tracking branch
```

## NOTE

Apparantly GitHub does not allow wikis to be anything other than the master branch.
This is why I had to move to my own hosting service to continue this dev blog.

###### 2016-09-21

