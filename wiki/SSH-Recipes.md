SSH Recipes
===

| Command | Description |
|---------|-------------|
| `ssh -L local:local.host:remote remote.host` | Tunnel port `local` on `local.host` to `remote` port on `remote.host` |
| `ssh -R remote:local.host:local remote.host` | Tunnel port `remote` on `remote.host` to `local` port on `local.host` |


| Example | Description |
|---------|-------------|
| `ssh -L 8080:localhost:80 user@remote.host` | Send port `8080` connections on `localhost` to port `80` on `remote.host` |
| `ssh -R 2222:localhost:22 user@remote.host` | Send port `2222` connections on `remote.host` to port `22` locally (ssh redirection from remote to local) |


---

| Command | Description |
|---------|-------------|
| `ssh -i key -D local -f -C -q -N user@remote.host` | Open an ssh tunnel with SOCKSv5 proxy enabled (`-D` socks, `-f` fork, `-C` compress, `-q` quiet, `-N` no command) |

| Example | Description |
|---------|-------------|
| `ssh -i ~/.ssh/priv.key -D 8080 -f -C -q -N user@remote.host` | Send localhost port `8080` out through `remote.host` |

Browser should have a `Configure Proxy Access` somewhere which should be set to `SOCKS v5`, `localhost`/`127.0.0.1` as host
and the appropriate port (`8080`).


###### 2019-09-24

