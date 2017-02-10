### Install Dependencies

```bash
sudo apt-get install gpa gnupg2
```
### Generate Key Pair

```bash
gpg --gen-key
```

#### Suggestions

* Use `RSA and RSA` (the default)
* Use `4096` bits for the keysize
* Choose no expiration for key (`0` option, default)

Note: `Real name`, `Email address`, `Comment` and `passphrase` are needed.

### List Keys

```
gpg --list-keys
```

### Export ASCII Public Key

```
gpg --armor --export user@example.com
```

### Export Binary Public Key

```
gpg --output user.gpg --export user@example.com
```

### Export Private Key (careful)

```
gpg --export-secret-key -a user@example.net > private.key
```

### Add Binary Public Key

```
gpg --import friend.gpg
```

### Add Private Key

```
gpg --import private.key
```

### Encrypt Message

```
gpg -e -u "Sender ID" -r "Recipient ID" plaintext-message
```

### Decrypt Message

```
gpg -d encrypted-message
```

### Fin

```
gpg --armor --export abetusk@mechaelephant.com
```

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v1

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
IPY2
=tdhS
-----END PGP PUBLIC KEY BLOCK-----
```

###### 2017-02-09
