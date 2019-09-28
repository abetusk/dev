#!/bin/bash
# 
# This is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License.
# If not, see <https://www.gnu.org/licenses/>.
#

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



