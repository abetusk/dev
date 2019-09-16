RPi Access Point (Zero W)
===

I still have trouble figuring out what's going on but I think the
basics are:

* `hostapd` to act as a WiFi 'hotspot' (access point)
* `dnsmasq` to provide IPs to connected machines through `wlan0` as an access point
* Turn off `dhcpcd`
* Route traffic from the access point through to the wider internet

Sample config files are provided in the `mnt` directory.

Recipe
---

Using [thewalr.us](https://blog.thewalr.us/2017/09/26/raspberry-pi-zero-w-simultaneous-ap-and-managed-mode-wifi/)'s tutorial as
a guide:

```
#!/bin/bash
#
# License: cc0
#
# Meant to be run as root.
#

CLIENT_SSID="$1"
CLIENT_PASS="$2"
AP_SSID="InnerLight"
AP_PASS="cosmicdread"

# Install pre-requisite packages
#
apt-get install -y dnsmasq hostapd

# Disable dhcpcd and other services
#
systemctl mask networking.service dhcpcd.service

# add ap0 as access point interface
#
wifimac=`cat /sys/class/net/wlan0/address`
cat > /etc/udev/rules.d/70-persistent-net.rules <<EOF
SUBSYSTEM=="ieee80211", ACTION=="add|change", ATTR{macaddress}=="$wifimac" KERNEL=="phy0", \
  RUN+="/sbin/iw phy phy0 interface add ap0 type __ap", \
  RUN+="/bin/ip link set ap0 address $wifimac"
EOF

# Setup access point config file
#
cat > /etc/hostapd/hostapd.conf <<EOF
ctrl_interface=/var/run/hostapd
ctrl_interface_group=0
interface=ap0
driver=nl80211
ssid=$AP_SSID
wpa_passphrase=$AP_PASS
hw_mode=g
channel=11
wmm_enabled=0
macaddr_acl=0
auth_algs=1
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP CCMP
rsn_pairwise=CCMP
EOF

# Point hostapd to appropriate config file
#
sed -i 's;^#\?DAEMON_CONF=.*;DAEMON_CONF="/etc/hostapd/hostapd.conf";' /etc/default/hostapd

# Populate wpa_supplicant.conf (left commented out as this can be used as is if this is already set up)
#
#echo > /etc/wpa_supplicant/wpa_supplicant.conf <<EOF
#country=US
#ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
#update_config=1
#
#network={
#  ssid="$CLIENT_SSID"
#  psk="$CLIENT_PASS"
#  id_str="AP1"
#}
#EOF

# Setup networking
#
echo > /etc/network/interfaces <<EOF
# interfaces(5) file used by ifup(8) and ifdown(8)

# Please note that this file is written to be used with dhcpcd
# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'

# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d

auto lo
auto ap0
auto wlan0
iface lo inet loopback

allow-hotplug ap0
iface ap0 inet static
    address 192.168.10.1
    netmask 255.255.255.0
    hostapd /etc/hostapd/hostapd.conf

allow-hotplug wlan0
iface wlan0 inet manual
    wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
iface AP1 inet dhcp
EOF

# There are problems with bringing up the interface so we have to do some trickery
# to wait a bit after reboot and then force them down and up again, as well
# as 'manually' add routing from the access point to the wider internet
#
cat > /home/pi/start-ap-managed-wifi.sh <<EOF
#!/bin/bash
sleep 30
sudo ifdown --force wlan0 && \
  sudo ifdown --force ap0 && \
  sudo ifup ap0 && \
  sudo ifup wlan0
sudo sysctl -w net.ipv4.ip_forward=1
sudo iptables -t nat -A POSTROUTING -s 192.168.10.0/24 ! -d 192.168.10.0/24 -j MASQUERADE
sudo systemctl restart dnsmasq
EOF

chown pi:pi /home/pi/start-ap-managed-wifi.sh
chmod 744 /home/pi/start-ap-managed-wifi.sh

cat > /home/pi/crontab <<EOF
@reboot /home/pi/start-ap-managed-wifi.sh
EOF

chown pi:pi /home/pi/crontab
chmod 744 /home/pi/crontab

su - pi bash -c "crontab < /home/pi/crontab"
```

The above is untested so use at your own risk.

Now, a reboot should set the system up and have the access point be available.

Simple Web Test
---

To test that you can access the access point directly, run a test web server as `root` or as `pi`:

```
echo "hello, friend" > index.html
python -m SimpleHTTPServer

```

After connecting your client to the `InnerLight` access point, you can then
point your browser to `192.168.10.1:8000` to make sure the page is being served properly.

References
---

* [How  to use your Raspberry Pi as a wireless access point](http://thepi.io/how-to-use-your-raspberry-pi-as-a-wireless-access-point/)
* [Setting up a Raspberry Pi as a Wireless Access Point](https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md)
* [RPI3: Module nl80211 not found, required for HostAPD?](https://www.raspberrypi.org/forums/viewtopic.php?t=141807)
* [SE: Creating WiFi Access point on a single interface in Linux](https://superuser.com/questions/615664/creating-wifi-access-point-on-a-single-interface-in-linux)
* [Raspberry Pi Zero W Simultaneous AP and Managed Mode Wifi](https://blog.thewalr.us/2017/09/26/raspberry-pi-zero-w-simultaneous-ap-and-managed-mode-wifi/)
* [SE: Access point as WiFi router/repeater, optional with bridge](https://raspberrypi.stackexchange.com/questions/89803/access-point-as-wifi-router-repeater-optional-with-bridge)
* [Gist of walr.us blog post](https://gist.github.com/lukicdarkoo/6b92d182d37d0a10400060d8344f86e4)
