#!/bin/bash

pidmm=`ps aux | grep '[m]ode-manager' | sed 's/  */ /g' | cut -f2 -d' ' | head -n1`
if [[ "$pidmm" ]] ; then
  echo kill mode-manager $pidmm
  kill $pidmm
else
  echo "no mode-manager process, skipping"
fi


pidarec=`ps aux | grep '[a]record' | sed 's/  */ /g' | cut -f2 -d' '`

if [[ "$pidarec" ]] ; then
  echo kill arecord $pidarec
  kill $pidarec
else
  echo "no arecord process, skipping"
fi

pidencoder=`ps aux | grep '[e]ncoder-monitor' | grep '[p]ython' | sed 's/  */ /g' | cut -f2 -d' '`

if [[ "$pidencoder" ]] ; then
  echo kill encoder-monitor $pidencoder
  kill $pidencoder
else
  echo "no encoder-monitor, skipping"
fi

pidild=`ps aux | grep '[i]nner-light-drive' |  sed 's/  */ /g' | cut -f2 -d' ' | head -n1`

if [[ "$pidild" ]] ; then
  echo kill inner-light-drive $pidild
  sudo kill $pidild
else
  echo "no inner-light-drive, skipping"
fi


