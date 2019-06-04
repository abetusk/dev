////////////////////////////////////////////////////////////////////////////////
///
/// SoundStretch main routine.
///
/// Author    : Copyright (c) Olli Parviainen
/// Author e-mail : oparviai 'at' iki.fi
/// SoundTouch WWW: http://www.surina.net/soundtouch
///
////////////////////////////////////////////////////////////////////////////////
//
// License :
//
//  SoundTouch audio processing library
//  Copyright (c) Olli Parviainen
//
//  This library is free software; you can redistribute it and/or
//  modify it under the terms of the GNU Lesser General Public
//  License as published by the Free Software Foundation; either
//  version 2.1 of the License, or (at your option) any later version.
//
//  This library is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
//  Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public
//  License along with this library; if not, write to the Free Software
//  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
////////////////////////////////////////////////////////////////////////////////

#include <stdexcept>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "SoundTouch.h"
#include "BPMDetect.h"

#include <vector>

using namespace soundtouch;
using namespace std;

// Processing chunk size (size chosen to be divisible by 2, 4, 6, 8, 10, 12, 14, 16 channels ...)
//
#define BUFF_SIZE       6720
//#define BUFF_SIZE       16384

static inline short _swap16(short &wData) {   
		wData = ((wData >> 8) & 0x00FF) |
						((wData << 8) & 0xFF00);
		return wData;
}

double special_sauce_weight(std::vector< double > &history, int pos) {
  int i, j, n, b;
  double _bpm_avg=0.0, _t=0.0;
  double w = 1.0, f = 1.0;

  double histo[256];
  double _max_bpm=0.0, _max_freq = 0.0;

  memset(histo, 0, sizeof(double)*256);

  n = (int)history.size();

  for (i=0; i<n; i++) { _bpm_avg += history[i]; }
  _bpm_avg /= (double)n;

  for (i=0; i<n; i++) {

    b = (int)history[i];
    if ((b>0) && (b<256)) {
      histo[b]+=1.0;
      b++;
      if ((b>0) && (b<256)) { histo[b]+=0.99; }
      b-=2;
      if ((b>0) && (b<256)) { histo[b]+=0.99; }
    }

    for (j=0; j<4; j++) {
      w *= 2.0;

      b = (int)(history[i]*w);
      if ((b>0) && (b<256)) {
        histo[b]+=1.0;
        b++;
        if ((b>0) && (b<256)) { histo[b]+=0.99; }
        b-=2;
        if ((b>0) && (b<256)) { histo[b]+=0.99; }
      }

      b = (int)(history[i]/w);
      if ((b>0) && (b<256)) {
        histo[b]+=1.0;
        b++;
        if ((b>0) && (b<256)) { histo[b]+=0.99; }
        b-=2;
        if ((b>0) && (b<256)) { histo[b]+=0.99; }
      }

    }

  }

  _max_bpm = 0.0;
  _max_freq = histo[0];
  for (i=0; i<256; i++) {
    if (histo[i] > _max_freq) {
      _max_bpm = i;
      _max_freq = histo[i];
    }
  }

  return _max_bpm;

  return _bpm_avg;
}

static void findThatBeat(FILE *fp) {
  int i;
  float bpmValue;
  int nChannels;
  size_t _buf_size = BUFF_SIZE;
  BPMDetect bpm(1, 44100);
  SAMPLETYPE sampleBuffer[_buf_size];

  char buf[_buf_size*2];
  double conv =  1.0 / 32768.0;

  int count=0;

  int avgwin_pos=0, avgwin_n=32;
  std::vector< double > avgwin;
  double _bpm_avg;

  for (i=0; i<avgwin_n; i++) { avgwin.push_back(0.0); }

  nChannels = 1;
  int readSize = _buf_size - _buf_size % nChannels;   // round read size down to multiple of num.channels 

  printf("# BUFF_SIZE %i, _buf_size %i\n", (int)BUFF_SIZE, (int)_buf_size);

  while (1) {
    int num, samples, numx2;
    float _bpm=0.0;

    num = fread(buf, 2, _buf_size, fp);
    if (num==0) { break; }

    short *tmp2 = (short *)buf;
    for (i=0; i<num; i++) {
      short val = tmp2[i];
      sampleBuffer[i] = (float)(_swap16(val) * conv);
    }

    samples = num / nChannels;
    bpm.inputSamples(sampleBuffer, samples);

    _bpm = bpm.getBpm();

    if (_bpm > 0.0) {
      avgwin[avgwin_pos] = _bpm;
      avgwin_pos = (avgwin_pos + 1) % avgwin_n;

      _bpm_avg = special_sauce_weight(avgwin, avgwin_pos);
    }

    printf("... %f (%f)\n", _bpm, _bpm_avg);

    count ++;
  }

}

int main(int argc, char **argv) {
  printf("beat\n");
  findThatBeat(stdin);
  printf("done...\n");
  return 0;
}
