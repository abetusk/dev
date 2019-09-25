/*
 * Adapted from ncurses-fire.c
 * ---------------------------
 * This C function adapted from python cfire by Matthew Simpson (https://gist.github.com/msimpson/1096950)
 *
 * Email from Matthew Simpson (Jan 31, 2016):
 * Thanks for the complements, but I didn't invent the effect. I too adapted it from someone else's work.
 * Originally it was written in JavaScript by Thiemo Mättig, found here: http://maettig.com/code/javascript/asciifire.html
 * ---------------------------
 *
 * Copyright 2016 Frank Cox <theatre@melvilletheatre.com>
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 *     Redistributions of source code must retain the above copyright notice, this list of conditions and
 *     the following disclaimer.
 *     Redistributions in binary form must reproduce the above copyright notice, this list of conditions
 *     and the following disclaimer in the documentation and/or other materials provided with the
 *     distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <stdint.h>

#include <sys/mman.h>
#include <sys/time.h>




#include <ncurses.h>
#include <time.h>
#include <string.h>
#include <errno.h>

#include "simplexnoise1234.h"

//#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "/home/pi/data/innerlight.led"
#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "./innerlight.led"
#define _DEFAULT_NUM_LED 180

//#define NCHAR 10
//char characters[] = {' ', '.', ':', '^', '*', 'x', 's', 'S', '#', '$'};

int NCOLOR = 8*8;
int NCHAR = -1;
char *characters;

void _init_characters() {
  int i;

  NCHAR = 127-32;
  characters = malloc(sizeof(char)*NCHAR);
  for (i=32; i<127; i++) {
    characters[i-32] = i;
  }
}

size_t g_n_led;
unsigned char *g_led_map;

void update_noise_line(int *b, int width, int height) {
  int i, j, v;
  float M=65.0, m=0.0, f, x;
  float t0, t1, dt=1.0/64.0;
  static float cur_t=0.0;

  memset(b, 0, sizeof(int)*width*height);

  for (i=0; i<width; i++) {
    j = height/2;
    x = (float)i/(float)width;
    f = snoise2(x,cur_t);
    v = (int)( f*(M-m) + m );
    b[j*width + i] = v;
  }

  cur_t += dt;
}

void update_led_line(int *b, int width, int height) {
  int i, j, v, p;
  unsigned char _r, _g, _b;
  float _fr, _fg, _fb;

  memset(b, 0, sizeof(int)*width*height);

  for (i=0; i<width; i++) {
    j = height/2;

    if (i < g_n_led) {
      p = 1 + 3*i;
      _r = g_led_map[p];
      _g = g_led_map[p+1];
      _b = g_led_map[p+2];

      _fr = (float)_r / 255.0;
      _fg = (float)_g / 255.0;
      _fb = (float)_b / 255.0;

      v = (int) ( ((float)NCHAR) * ((_fr + _fg + _fb) / 3.0) );
      //v = (unsigned int)_r;

    }
    else { v=0; }


    b[j*width + i] = v;
  }

}

void update(int *b, int width, int height) {
  //update_noise_line(b, width, height);
  update_led_line(b, width, height);
}

void display(int *b, int width, int height, int *cmap) {
  int i, size;
  int colorpair;
  size = width*height;

  for (i=0; i < size; i++) {
    if (cmap == NULL) {
      if (b[i] > 15)      { colorpair = 4; }
      else if (b[i] > 9)  { colorpair = 3; }
      else if (b[i] > 4)  { colorpair = 2; }
      else                { colorpair = 1; }
    }
    else{
      colorpair = cmap[ b[i] ];
    }

    attrset(COLOR_PAIR(colorpair)|A_BOLD);

    if (i < size-1) {
      move(i/width, i%width);
      //if (b[i] > 9) { addch(characters[9]); }
      if (b[i] > NCHAR) { addch(characters[NCHAR-1]); }
      else          { addch(characters[b[i]]); }
    }

  }

}

void init(int width, int height) {
  init_pair(1,0,0);
  init_pair(2,1,0);
  init_pair(3,3,0);
  init_pair(4,4,0);
  clear();

  nodelay(stdscr,TRUE);
  srand(time(NULL));
}

int load_ledmap() {
  char *led_fn=NULL;
  int led_map_fd, r;
  size_t led_map_len;

  g_n_led = _DEFAULT_NUM_LED;
  led_map_len = 1 + (3*g_n_led);

  led_fn = strdup(INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE);

  led_map_fd = open(led_fn, O_RDWR);
  if (led_map_fd<0) {
    fprintf(stderr, "ERROR: opening file %s, got errno:%i\n", led_fn, errno);
    exit(-1);
  }

  r = fchmod(led_map_fd, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH );
  if (r != 0) { perror("fchmod"); return r; }

  g_led_map = mmap(NULL, led_map_len, PROT_NONE | PROT_READ | PROT_WRITE | PROT_EXEC, MAP_SHARED, led_map_fd, 0);

  if (g_led_map == MAP_FAILED) { fprintf(stderr, "failed\n"); exit(-1); }

  if (g_led_map == NULL) {
    fprintf(stderr, "ERROR: could not map file (fd:%i), got errno:%i, exiting\n",
        led_map_fd, errno);
    exit(-1);
  }

}

int main(int argc, char** argv) {
  int i, *b, size, width, height;

  int *cmap;

  cmap = malloc(sizeof(int)*256);
  for (i=0; i<256; i++) { cmap[i] = (i/64) + 1; }

  _init_characters();

  load_ledmap();

  initscr();
  start_color();


  getmaxyx(stdscr,height,width);
  size = height*width;
  b = calloc((size+width+1),sizeof(int));
  init(width, height);

  for (;;) {
    update(b, width, height);
    //display(b, width, height, NULL);
    display(b, width, height, cmap);
    refresh();
    timeout(30);
    if (getch() != ERR) { break; }
  }

  endwin();

  free(b);

  return 0;
}

