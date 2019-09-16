#!/bin/bash

sleep 30

sudo ifdown --force wlan0 && \
  sudo ifdown --force ap0 && \
  sudo ifup ap0 && \
  sudo ifup wlan0

sudo sysctl -w net.ipv4.ip_forward=1
sudo iptables -t nat -A POSTROUTING -s 192.168.10.0/24 ! -d 192.168.10.0/24 -j MASQUERADE
sudo systemctl restart dnsmasq
