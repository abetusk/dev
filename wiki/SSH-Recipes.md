SSH Recipes
===

```
ssh -L local:local.host:remote remote.host
```

```
ssh -R local:local.host:remote remote.host
```

For example:

```
ssh -R 2222:localhost:22 user@remote.host
```

###### 2019-09-24

