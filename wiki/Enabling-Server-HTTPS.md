Enabling HTTPS Using Let's Encrypt
===

[Let's Encrypt](https://letsencrypt.org/) is a certificate authority that
gives out digital certificates to the community free of charge.

Using thir ["shell access"](https://letsencrypt.org/getting-started/) method,
one can install a program called [certbot](https://certbot.eff.org/) that
gives quick start instructions for installing and running certbot to
issue a certificate for your host and system.

Detailed below is what I did for some of my servers (HAProxy on Ubuntu and
Apache on Ubuntu).

HAProxy on Ubuntu
---

```
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot 
```

```
certbot certonly --webroot -w /var/www -d meowcad.com -d www.meowcad.com
```

I had to create a `meow.pem` for my version of HAProxy to work:

```
cd /etc/letsencrypt/live/meowcad.com
cat private.pem fullchain.pem > meow.pem
```


Apache on Ubuntu
---

```
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-apache 
```

```
certbot certonly -n --agree-tos --email $EMAIL --domain mechaelephant.com --domain www.mechaelephant.com --webroot --webroot-path /var/www/  --expand
```

Notes
---

* Make sure to add the extra domain so that both `www.domain.com` and `domain.com` work.
* If you've already issued a certificate and want to add a domain like I needed to for `www.mechalephant.com`, adding the domain `mechaelephant.com` because
  I forgot the non `www` prefixed web page, then I think the `--expand` flag will work to add an additional domain.
* I'm still not sure how to renew or automatically renew the certs...


###### 2017-06-12

