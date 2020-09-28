#!/bin/bash

sleep 30

dt=`date +'%Y-%m-%d %H:%M:%s'`
echo "$dt: start-ap-managed staring" >> /home/pi/log/ap.log

sudo ifdown --force wlan0 && \
  sleep 1 && \
  sudo ifdown --force ap0 && \
  sleep 1 && \
  sudo ifup ap0 && \
  sleep 1 && \
  sudo ifup wlan0

sleep 1

dt=`date +'%Y-%m-%d %H:%M:%s'`
echo "dt: start-ap-managed cp" >> /home/pi/log/ap.log

sudo sysctl -w net.ipv4.ip_forward=1 2>&1 > /dev/null
sudo iptables -t nat -A POSTROUTING -s 192.168.10.0/24 ! -d 192.168.10.0/24 -j MASQUERADE
sudo systemctl restart dnsmasq

dt=`date +'%Y-%m-%d %H:%M:%s'`
echo "dt: start-ap-managed finishing" >> /home/pi/log/ap.log
