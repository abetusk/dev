Networking Cheat Sheet
===

DNS
---

* `dig example.com`
* `dig -t NS example.com +short   # query nameserver, return short description`
* `dig -x 8.8.8.8                 # reverse lookup`

Interfaces
---

* `ip link show`
* `ip -s link show`
* `ip addr show`
* `ip route`

Scanning
--

* `nmap -sP ...  # Ping Scan - Scan network and find out which devices are up and running`
* `nmap -sL ...  # List targets in network`
* `nmap -O ...  # OS detection`
* `nmap -p 22,21,80,8080 -sV ...  # Detect version of service running on port`
* `nmap -A ...  #  OS detection, version detection, script scanning, and traceroute`
* `nmap -p 192.168.0.1 #  Also '-p "*"' works for scanning all ports`

---

([src](https://martinheinz.dev/blog/38))
