RPi Notes
===

Fast booting ([src](http://himeshp.blogspot.com/2018/08/fast-boot-with-raspberry-pi.html))

---


`/boot/config.txt`:

```
# Disable the rainbow splash screen
disable_splash=1

# Disable bluetooth
dtoverlay=pi3-disable-bt

#Disable Wifi
dtoverlay=pi3-disable-wifi
 
# Overclock the SD Card from 50 to 100MHz
# This can only be done with at least a UHS Class 1 card
dtoverlay=sdtweak,overclock_50=100
 
# Set the bootloader delay to 0 seconds. The default is 1s if not specified.
boot_delay=0

# Overclock the raspberry pi. This voids its warranty. Make sure you have a good power supply.
force_turbo=1
```

---

`/boot/comdline.txt`:

```
dwc_otg.lpm_enable=0 console=serial0,115200 console=tty1 root=PARTUUID=32e07f87-02 rootfstype=ext4 elevator=deadline fsck.repair=yes quiet rootwait
```

---

`systemd-analyze blame`

suggested:

```
sudo systemctl disable dhcpcd.service
sudo systemctl disable networking.service
sudo systemctl disable ssh.service
sudo systemctl disable ntp.service
sudo systemctl disable dphys-swapfile.service
sudo systemctl disable keyboard-setup.service
sudo systemctl disable apt-daily.service
sudo systemctl disable wifi-country.service
sudo systemctl disable hciuart.service
sudo systemctl disable raspi-config.service
sudo systemctl disable avahi-daemon.service
sudo systemctl disable triggerhappy.service
```

---

Custom service:

`etc/systemd/system/myveryown.service`

```
[Unit]
Description=Custom Service

[Service]
ExecStart=/home/pi/myveryown.sh
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=piservice
User=pi
Group=pi
WorkingDirectory=/root/myveryown/

[Install]
WantedBy=basic.target
```

---

Custom kernel compilation ([src](https://www.raspberrypi.org/documentation/linux/kernel/))


