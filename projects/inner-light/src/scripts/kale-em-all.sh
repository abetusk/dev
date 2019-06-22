#!/bin/bash

pidarec=`ps aux | grep '[a]record' | sed 's/  */ /g' | cut -f2 -d' '`

if [[ "$pidarec" ]] ; then
  echo kill arecord $pidarec
  kill $pidarec
else
  echo "no arecord process, skipping"
fi

pidencoder=`ps aux | grep '[e]ncoder-monitor' | sed 's/  */ /g' | cut -f2 -d' '`

if [[ "$pidencoder" ]] ; then
  echo kill encoder-monitor $pidencoder
  kill $pidencoder
else
  echo "no encoder-monitor, skipping"
fi
