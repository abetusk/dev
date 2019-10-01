/*
 * 
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License.
 * If not, see <https://www.gnu.org/licenses/>.
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <math.h>

#include <sys/time.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#include <signal.h>

#include <sys/mman.h>

#include <getopt.h>
#include <unistd.h>

#include <string>
#include <vector>

#include "inner-light-generator.hpp"

inner_light_mode_t g_mode;

char _mode_name[][64] = {
  "solid",
  "solid_color",
  "tap_pulse",
  "tap_bullet",
  "tap_strobe",

  "noise",
  "fill",
  "strobe",
  "pulse",
  "rainbow",

  "mic_strobe",
  "mic_pulse",
  "n",
  "transition",
  "n/a",
  "\0",
};

double _tv2d(struct timeval &tv) {
  double x=0.0;
  x = (double)tv.tv_sec;
  x *=  1000000.0;
  x += (double)tv.tv_usec;
  return x;
}

float _dtv(struct timeval &tv0, struct timeval &tv1) {
  float x=0.0;
  x = (float)(tv0.tv_sec - tv1.tv_sec);
  x *=  1000000.0;
  x += (float)(tv0.tv_usec - tv1.tv_usec);
  return x;
}

void _rgblerp(unsigned char *rgb_out,  float p, unsigned char *rgb_src, unsigned char *rgb_dst) {
  float f;

  if (p<0) { p=0.0; }
  if (p>1.0) { p=1.0; }

  f = (float)rgb_src[0] + p*((float)rgb_dst[0] - (float)rgb_src[0]);
  if (f<0.0) { f=0.0; }
  else if (f > 255.0) { f = 255.0; }
  rgb_out[0] = (unsigned char)f;

  f = (float)rgb_src[1] + p*((float)rgb_dst[1] - (float)rgb_src[1]);
  if (f<0.0) { f=0.0; }
  else if (f > 255.0) { f = 255.0; }
  rgb_out[1] = (unsigned char)f;

  f = (float)rgb_src[2] + p*((float)rgb_dst[2] - (float)rgb_src[2]);
  if (f<0.0) { f=0.0; }
  else if (f > 255.0) { f = 255.0; }
  rgb_out[2] = (unsigned char)f;

}

void _wheel(unsigned char pos, unsigned char *r, unsigned char *g, unsigned char *b) {
  if (pos < 85) {
    *r = pos*3;
    *g = 255 - pos*3;
    *b = 0;
  }
  else if (pos < 170) {
    pos -= 85;
    *r = 255-pos*3;
    *g = 0;
    *b = pos*3;
  }
  else {
    pos -= 170;
    *r = 0;
    *g = pos*3;
    *b = 255 - pos*3;
  }
}

//---

struct option _longopt[] = {
  {"help", no_argument, 0, 'h'},
  {0,0,0,0},
};

void show_help_and_exit(FILE *fp) {
  fprintf(fp, "usage:\n");
  fprintf(fp, "\n  inner-light-generator [-L mmap.led] [-n led_count] [-c config] [-T ledtest] [-F] [-h] <( MIC ) <( ENCODER )\n\n");
  if (fp==stdin) { exit(0); }
  exit(1);
}

void show_version_and_exit(FILE *fp) {
  fprintf(fp, "version %s\n", _VERSION);
  if (fp==stdin) { exit(0); }
  exit(1);
}

//---

int inner_light_mode_type::update_led(void) {
  int i, n, p;
  static int x = 0;
  size_t m;

  if (!m_led_mmap) { return -1; }

  m = m_led_map.size();

  m_rgb[0] = 1;
  for (i=0; i<g_mode.m_count_led; i++) {
    if (i >= m) { continue; }
    p = m_led_map[i];
    if ((p < 0) ||
        (p >= g_mode.m_count_led)) {
      continue;
    }
    m_rgb[3*p+1] = m_rgb_buf[3*i+1];
    m_rgb[3*p+2] = m_rgb_buf[3*i+2];
    m_rgb[3*p+3] = m_rgb_buf[3*i+3];
  }
  m_rgb[0] = 0;

  return 0;
}

void _color_interpolate(float f, float f_min, float f_max, unsigned char *rgbIn, unsigned char *rgbOut) {
  float p, f_r, f_g, f_b;

  if (f_min < 0.0) { f_min = 0.0; }
  if (f_max > 1.0) { f_max = 1.0; }

  if (f < f_min) { f = f_min; }
  if (f > f_max) { f = f_max; }

  f_r = (float)rgbIn[0];
  f_g = (float)rgbIn[1];
  f_b = (float)rgbIn[2];

  p = f*(f_max-f_min) + f_min;
  rgbOut[0] = (unsigned char)(p*f_r);
  rgbOut[1] = (unsigned char)(p*f_g);
  rgbOut[2] = (unsigned char)(p*f_b);
}

//---

//---------------
//---------------
//---------------
//---------------


// beat functions
//

int inner_light_mode_type::process_tap(void) {
  int i;
  double _usec_beat_thresh;
  struct timeval tv;
  float f;
  unsigned char r, g, b;

  if (m_tap_ready) {

    _usec_beat_thresh = 60.0 * 1000000.0 / m_tap_bpm;

    gettimeofday(&tv, NULL);
    m_usec_cur = _tv2d(tv);

    m_tap_beat_signal = 0;
    if ((m_usec_cur - m_usec_prev) > _usec_beat_thresh) {
      m_tap_beat_signal = 1;
      m_usec_prev = m_usec_cur;
    }

  }
  else {
    gettimeofday(&tv, NULL);
    m_usec_prev = _tv2d(tv);
  }

  // ready
  //
  if (m_tap_time.size() == 0) { return 1; }

  for (i=0; i<m_count_led; i++) {
    if (i < m_tap_time.size()) {
      f = (float)i/12.0;
      f *=255.0;
      _wheel( (unsigned char)f, &r, &g, &b);
      m_rgb_buf[3*i+1] = r;
      m_rgb_buf[3*i+2] = g;
      m_rgb_buf[3*i+3] = b;
    }
    else {
      m_rgb_buf[3*i+1] = 0;
      m_rgb_buf[3*i+2] = 0;
      m_rgb_buf[3*i+3] = 0;
    }
  }
  
  return 0;
}

int inner_light_mode_type::tick_tap_pulse(void) {

  m_fg_rgb[0] = m_config.m_tap_pulse_fg[0];
  m_fg_rgb[1] = m_config.m_tap_pulse_fg[1];
  m_fg_rgb[2] = m_config.m_tap_pulse_fg[2];

  m_bg_rgb[0] = m_config.m_tap_pulse_bg[0];
  m_bg_rgb[1] = m_config.m_tap_pulse_bg[1];
  m_bg_rgb[2] = m_config.m_tap_pulse_bg[2];

  if (process_tap()) {
    m_beat_signal = m_tap_beat_signal;
    beat_pulse();
  }
  return 0;
}

int inner_light_mode_type::tick_mic_pulse(void) {

  m_fg_rgb[0] = m_config.m_mic_pulse_fg[0];
  m_fg_rgb[1] = m_config.m_mic_pulse_fg[1];
  m_fg_rgb[2] = m_config.m_mic_pulse_fg[2];

  m_bg_rgb[0] = m_config.m_mic_pulse_bg[0];
  m_bg_rgb[1] = m_config.m_mic_pulse_bg[1];
  m_bg_rgb[2] = m_config.m_mic_pulse_bg[2];

  m_beat_signal = m_mic_beat_signal;
  m_mic_beat_signal = 0;
  beat_pulse();
  return 0;
}

int inner_light_mode_type::tick_tap_bullet(void) {

  m_fg_rgb[0] = m_config.m_tap_bullet_fg[0];
  m_fg_rgb[1] = m_config.m_tap_bullet_fg[1];
  m_fg_rgb[2] = m_config.m_tap_bullet_fg[2];

  m_bg_rgb[0] = m_config.m_tap_bullet_bg[0];
  m_bg_rgb[1] = m_config.m_tap_bullet_bg[1];
  m_bg_rgb[2] = m_config.m_tap_bullet_bg[2];

  if (process_tap()) {
    m_beat_signal = m_tap_beat_signal;
    beat_bullet();
  }
  return 0;
}

int inner_light_mode_type::tick_mic_bullet(void) {

  m_fg_rgb[0] = m_config.m_mic_bullet_fg[0];
  m_fg_rgb[1] = m_config.m_mic_bullet_fg[1];
  m_fg_rgb[2] = m_config.m_mic_bullet_fg[2];

  m_bg_rgb[0] = m_config.m_mic_bullet_bg[0];
  m_bg_rgb[1] = m_config.m_mic_bullet_bg[1];
  m_bg_rgb[2] = m_config.m_mic_bullet_bg[2];

  m_beat_signal = m_mic_beat_signal;
  m_mic_beat_signal = 0;
  beat_bullet();
  return 0;
}

int inner_light_mode_type::tick_tap_strobe(void) {

  m_fg_rgb[0] = m_config.m_tap_strobe_fg[0];
  m_fg_rgb[1] = m_config.m_tap_strobe_fg[1];
  m_fg_rgb[2] = m_config.m_tap_strobe_fg[2];

  m_bg_rgb[0] = m_config.m_tap_strobe_bg[0];
  m_bg_rgb[1] = m_config.m_tap_strobe_bg[1];
  m_bg_rgb[2] = m_config.m_tap_strobe_bg[2];

  if (process_tap()) {
    m_beat_signal = m_tap_beat_signal;
    beat_strobe();
  }
  return 0;
}

int inner_light_mode_type::tick_mic_strobe(void) {

  m_fg_rgb[0] = m_config.m_mic_strobe_fg[0];
  m_fg_rgb[1] = m_config.m_mic_strobe_fg[1];
  m_fg_rgb[2] = m_config.m_mic_strobe_fg[2];

  m_bg_rgb[0] = m_config.m_mic_strobe_bg[0];
  m_bg_rgb[1] = m_config.m_mic_strobe_bg[1];
  m_bg_rgb[2] = m_config.m_mic_strobe_bg[2];

  m_beat_signal = m_mic_beat_signal;
  m_mic_beat_signal = 0;
  beat_strobe();
  return 0;
}


void inner_light_mode_type::beat_pulse(void) {
  int i;
  //float w, f, f_del, f_decay = 32.0/255.0, f_min=64.0/255.0, f_max=255.0/255.0;
  float w, f, f_decay = 32.0/255.0, f_min=0.0/255.0, f_max=255.0/255.0;
  unsigned char rgb[3], rgbCur[3];
  float f_cur;

  f_cur = m_pulse_f;

  f_cur -= f_decay;
  if (m_beat_signal) { f_cur = f_max; }
  if (f_cur <= f_min) { f_cur = f_min; }
  if (f_cur >= f_max) { f_cur = f_max; }

  // taken from config file
  //
  if (m_encoder_pos[0] == 0) {
    _rgblerp(rgbCur, f_cur, m_fg_rgb, m_bg_rgb);
  }

  // otherwise take it from encoder
  //
  else {
    if (m_encoder_pos[0] == 1) {
      rgb[0] = (unsigned char)f_max*255.0;
      rgb[1] = (unsigned char)f_max*255.0;
      rgb[2] = (unsigned char)f_max*255.0;
    }
    else {
      w = (float)(m_encoder_pos[0]-1.0)/((float)(m_encoder_n-1));
      _wheel( (unsigned char)(w*255.0), &(rgb[0]), &(rgb[1]), &(rgb[2]));
    }

    _color_interpolate( f_cur, f_min, f_max, rgb, rgbCur);
  }

  for (i=0; i<m_count_led; i++) {
    m_rgb_buf[3*i+1] = rgbCur[0];
    m_rgb_buf[3*i+2] = rgbCur[1];
    m_rgb_buf[3*i+3] = rgbCur[2];
  }

}

void inner_light_mode_type::beat_bullet(void) {
  int i, j, u, p, d;

  //float f, f_del, f_min=64.0/255.0, f_max=255.0/255.0;
  float f, f_del, f_min=0.0/255.0, f_max=255.0/255.0;
  unsigned char w, rgb[3], rgbCur[3], rgbMin[3], rgbMax[3];

  f_del = f_max - f_min;

  // taken from config file
  //
  if (m_encoder_pos[0] == 0) {
    rgb[0] = m_fg_rgb[0];
    rgb[1] = m_fg_rgb[1];
    rgb[2] = m_fg_rgb[2];

    rgbMin[0] = m_bg_rgb[0];
    rgbMin[1] = m_bg_rgb[1];
    rgbMin[2] = m_bg_rgb[2];

    rgbMax[0] = m_fg_rgb[0];
    rgbMax[1] = m_fg_rgb[1];
    rgbMax[2] = m_fg_rgb[2];
  }

  // otherwise take it from encoder
  //
  else {
    if (m_encoder_pos[0] == 1) {
      rgb[0] = 255;
      rgb[1] = 255;
      rgb[2] = 255;
    }
    else {
      f = (float)(m_encoder_pos[0]-1)/19.0;
      _wheel( (unsigned char)(f*255.0), &(rgb[0]),&(rgb[1]),&(rgb[2]));
    }
    _color_interpolate(f_min, f_min, f_max, rgb, rgbMin);
    _color_interpolate(f_max, f_min, f_max, rgb, rgbMax);
  }


  // start the particle in the middle
  //
  if (m_beat_signal) {
    p = m_count_led / 2;
    add_particle(p + (rand()%m_particle_v), 1);
    add_particle(p - (rand()%m_particle_v), -1);
  }

  // clear buffer
  //
  for (i=0; i<m_count_led; i++) {
    m_rgb_buf1[3*i+1] = rgbMin[0];
    m_rgb_buf1[3*i+2] = rgbMin[1];
    m_rgb_buf1[3*i+3] = rgbMin[2];
  }

  // update particles in both directions
  //
  for (i=0; i<m_particle.size(); i++) {

    d = m_particle_dir[i];

    if (d==1) { m_particle[i] += m_particle_v; }
    else      { m_particle[i] -= m_particle_v; }

    // particle has reached boundary, swap with end and destroy
    //
    if ((m_particle[i] >= m_count_led) || (m_particle[i] < 0)) {
      rem_particle(i);
      i--;
      continue;
    }
  }

  // update center particle
  //
  for (i=0; i<m_particle.size(); i++) {
    m_rgb_buf1[ 3*(m_particle[i]) + 1 ] = rgbMax[0];
    m_rgb_buf1[ 3*(m_particle[i]) + 2 ] = rgbMax[1];
    m_rgb_buf1[ 3*(m_particle[i]) + 3 ] = rgbMax[2];
  }

  // smooth out edges of particle to get nicer gradation
  //
  for (i=0; i<m_particle.size(); i++) {

    p = m_particle[i];
    for (j=0; j<3; j++) {
      p--;
      if (p<0) { break; }

      _color_interpolate(f_max - ((float)(j+1)*f_del/3.0), f_min, f_max, rgb, rgbCur);
      m_rgb_buf1[3*p + 1] = rgbCur[0];
      m_rgb_buf1[3*p + 2] = rgbCur[1];
      m_rgb_buf1[3*p + 3] = rgbCur[2];
    }

    p = m_particle[i];
    for (j=0; j<3; j++) {
      p++;
      if (p>=m_count_led) { break; }

      _color_interpolate(f_max - ((float)(j+1)*f_del/3.0), f_min, f_max, rgb, rgbCur);
      m_rgb_buf1[3*p + 1] = rgbCur[0];
      m_rgb_buf1[3*p + 2] = rgbCur[1];
      m_rgb_buf1[3*p + 3] = rgbCur[2];
    }

  }

  // copy it back to original buffer
  //
  memcpy((void *)(&(m_rgb_buf[0])),
         (const void *)(&(m_rgb_buf1[0])),
         sizeof(unsigned char)*((m_count_led*3) + 1));

}

void inner_light_mode_type::beat_strobe(void) {
  int i, j, p;
  int strobe_size=3, strobe_n =16;

  //float w, f, f_del, f_decay = 32.0/255.0, f_min=64.0/255.0, f_max=255.0/255.0;
  float w, f, f_decay = 32.0/255.0, f_min=0.0/255.0, f_max=255.0/255.0;
  unsigned char rgb[3], rgbMin[3], rgbMax[3];
  float f_cur;

  f_cur = m_strobe_f;

  f_cur -= f_decay;
  if (m_beat_signal) { f_cur = f_max; }
  if (f_cur <= f_min) { f_cur = f_min; }
  if (f_cur >= f_max) { f_cur = f_max; }

  // taken from config file
  //
  if (m_encoder_pos[0] == 0) {
    _rgblerp(rgb, f_cur, m_fg_rgb, m_bg_rgb);

    rgbMin[0] = m_bg_rgb[0];
    rgbMin[1] = m_bg_rgb[1];
    rgbMin[2] = m_bg_rgb[2];

    rgbMax[0] = m_fg_rgb[0];
    rgbMax[1] = m_fg_rgb[1];
    rgbMax[2] = m_fg_rgb[2];


  }

  // otherwise use encoder value
  //
  else {
    if (m_encoder_pos[0] == 1) {
      rgb[0] = (unsigned char)f_max*255.0;
      rgb[1] = (unsigned char)f_max*255.0;
      rgb[2] = (unsigned char)f_max*255.0;
    }
    else {
      w = (float)(m_encoder_pos[0]-1.0)/((float)(m_encoder_n-1));
      _wheel( (unsigned char)(w*255.0), &(rgb[0]), &(rgb[1]), &(rgb[2]));
    }

    _color_interpolate(f_min, f_min, f_max, rgb, rgbMin);
    _color_interpolate(f_max, f_min, f_max, rgb, rgbMax);
  }

  for (i=0; i<m_count_led; i++) {
    m_rgb_buf[3*i+1] = rgbMin[0];
    m_rgb_buf[3*i+2] = rgbMin[1];
    m_rgb_buf[3*i+3] = rgbMin[2];
  }

	if (!m_beat_signal) { return; }

  for (i=0; i<strobe_n; i++) {
    p = rand()%m_count_led;
    for (j=0; j<strobe_size; j++) {
      if ( (p+j) >= m_count_led ) { break; }
      m_rgb_buf[3*(p+j)+1] = rgbMax[0];
      m_rgb_buf[3*(p+j)+2] = rgbMax[1];
      m_rgb_buf[3*(p+j)+3] = rgbMax[2];
    }
  }

}

//---------------
//---------------
//---------------
//---------------

float _f_mod(float x, float _min=0.0, float _max=1.0) {
  int qi;
  float r, q, d;

  d = _max - _min;
  qi = (int)(x / d);
  q = (float)qi;
  r = x - q*d;

  return r;
}

//---

int inner_light_mode_type::tick_solid(void) {
  int i;
  float v;
  unsigned char u;

  // take from config file
  //
  if (m_encoder_pos[0] == 0) {

    for (i=0; i<m_count_led; i++) {
      m_rgb_buf[3*i+1] = m_config.m_solid_rgb[0];
      m_rgb_buf[3*i+2] = m_config.m_solid_rgb[1];
      m_rgb_buf[3*i+3] = m_config.m_solid_rgb[2];
    }

  }

  // otherwise use encoder value to determine color
  //
  else {
    v = (float)m_encoder_pos[0] / (float)m_encoder_n;
    u = (unsigned char)(v*255.0);

    for (i=0; i<m_count_led; i++) {
      m_rgb_buf[3*i+1] = u;
      m_rgb_buf[3*i+2] = u;
      m_rgb_buf[3*i+3] = u;
    }
  }

}

int inner_light_mode_type::tick_solid_color(void) {
  int i;
  float v;
  unsigned char u, r, g, b;

  // take from config file
  //
  if (m_encoder_pos[0] == 0) {
    r = m_config.m_solid_rgb[0];
    g = m_config.m_solid_rgb[1];
    b = m_config.m_solid_rgb[2];
  }

  // otherwise use encoder position
  //
  else {
    if ((m_solid_color_last_button == 0) && (m_encoder_button[0] == 1)) {
      m_solid_color_state = (m_solid_color_state + 1)%2;
    }
    m_solid_color_last_button = m_encoder_button[0];

    // change color
    //
    if (m_solid_color_state == 0) {
      m_solid_color_param = m_encoder_pos[0];
    }

    if (m_solid_color_param == 0) {
      r = 255;
      g = 255;
      b = 255;
    }
    else {
      v = (float)m_solid_color_param / (float)(m_encoder_n-1.0);
      u = (unsigned char)(v*255.0);
      _wheel(u, &r, &g, &b);
    }

    if (m_solid_color_state == 1) {
      v = (float)m_encoder_pos[0] / (float)m_encoder_n;
      r = (unsigned char)((float)r*v);
      g = (unsigned char)((float)g*v);
      b = (unsigned char)((float)b*v);
    }
  }

  for (i=0; i<m_count_led; i++) {
    m_rgb_buf[3*i+1] = r;
    m_rgb_buf[3*i+2] = g;
    m_rgb_buf[3*i+3] = b;
  }

}

//---

int inner_light_mode_type::tick_noise(void) {
  int i, n_palette, v;
  float x, dt, f;
  float cur_t;

  cur_t = m_noise_t;

  if (m_encoder_pos[0] == 0)  {
    if (m_config.m_noise_speed < 60.0) {
      dt = 1.0/128.0;
    }
    else {
      dt = m_config.m_noise_speed / (60.0*128.0);
    }
  }

  else {
    dt = (float)(m_encoder_pos[0]+1.0)/128.0;
  }

  n_palette = m_config.m_noise_palette.size()/3;

  /*
  for (i=0; i<n_palette; i++) {
    printf(" %02x%02x%02x",
       (int)m_config.m_noise_palette[3*i+0],
       (int)m_config.m_noise_palette[3*i+1],
       (int)m_config.m_noise_palette[3*i+2]);
  }
  printf("\n");
  */

  for (i=0; i<m_count_led; i++) {
    x = (float)i/(float)m_count_led;
    f = (snoise2(x, cur_t) + 1.0)/(2.0 + (1.0/65536.0));

    v = (int)( f*(float)(n_palette) );

    /*
    if ((v<0) || ((3*v+2) >= m_config.m_noise_palette.size())) {
      printf("!!! v%i, npal%i f %f\n", (int)v, (int)m_config.m_noise_palette.size(), f);
    }
    */

    m_rgb_buf[3*i+1] = m_config.m_noise_palette[3*v+0];
    m_rgb_buf[3*i+2] = m_config.m_noise_palette[3*v+1];
    m_rgb_buf[3*i+3] = m_config.m_noise_palette[3*v+2];

  }

  m_noise_t += dt;

  return 0;
}

//---

int inner_light_mode_type::tick_fill(void) {
  int i, pos_ds = 1, n;
  int color_mod_n=7, color_mod_del=4;
  float f;
  unsigned char rgb[3], rgbprv[3], w;

  //int pos, color_mod;
  //pos = m_fill_pos;
  //color_mod = m_fill_color_mod;


  // take from config file
  //
  if (m_encoder_pos[0] == 0) {
    if (m_config.m_fill_speed < 60.0) {
      pos_ds = 1;
    }
    else {
      pos_ds = (int)(12.0*((m_config.m_fill_speed - 60.0) / 60.0));
    }
  }

  // encoder position otherwise
  //
  else {
    pos_ds = m_encoder_pos[0];
  }

  m_fill_pos += pos_ds;
  n = ( (m_fill_pos<m_count_led) ? m_fill_pos : m_count_led );

  f = (float)m_fill_color_mod*255.0/(float)color_mod_n;
  w = (int)f;
  _wheel(w, &(rgb[0]), &(rgb[1]), &(rgb[2]));

  f = (float)((m_fill_color_mod+color_mod_n-color_mod_del)%color_mod_n)*255.0/(float)color_mod_n;
  w = (int)f;
  _wheel(w, &(rgbprv[0]), &(rgbprv[1]), &(rgbprv[2]));

  for (i=0; i<n; i++) {
    m_rgb_buf[3*i+1] = rgb[0];
    m_rgb_buf[3*i+2] = rgb[1];
    m_rgb_buf[3*i+3] = rgb[2];
  }
  for (; i<m_count_led; i++) {
    m_rgb_buf[3*i+1] = rgbprv[0];
    m_rgb_buf[3*i+2] = rgbprv[1];
    m_rgb_buf[3*i+3] = rgbprv[2];
  }

  if (m_fill_pos >= m_count_led) {
    m_fill_color_mod = (m_fill_color_mod + color_mod_del) % color_mod_n;
    m_fill_pos=0;
  }

}

int inner_light_mode_type::tick_strobe(void) {
  int i, j, p;
  int strobe_size=3, strobe_n =4;
  int strobe_delay = 2;

  //float w, f, f_del, f_decay = 32.0/255.0, f_min=64.0/255.0, f_max=255.0/255.0;
  float w, f, f_decay = 32.0/255.0, f_min=0.0/255.0, f_max=255.0/255.0;
  unsigned char rgb[3], rgbMin[3], rgbMax[3];

  //int strobe_tick;
  //float f_cur;
  //strobe_tick = m_strobe_tick;
  //f_cur = m_strobe_f;


  m_strobe_f -= f_decay;
  if (m_beat_signal) { m_strobe_f = f_max; }
  if (m_strobe_f <= f_min) { m_strobe_f = f_min; }
  if (m_strobe_f >= f_max) { m_strobe_f = f_max; }

  // take from config file
  //
  if (m_encoder_pos[0] == 0) {
    rgbMin[0] = m_config.m_strobe_bg[0];
    rgbMin[1] = m_config.m_strobe_bg[1];
    rgbMin[2] = m_config.m_strobe_bg[2];

    rgbMax[0] = m_config.m_strobe_fg[0];
    rgbMax[1] = m_config.m_strobe_fg[1];
    rgbMax[2] = m_config.m_strobe_fg[2];

    strobe_delay = (int)(10.0*((m_config.m_strobe_speed - 60.0) / (240.0-60.0)));
    strobe_delay += 2;
  }

  // use encoder value otherwise
  //
  else {
    if (m_encoder_pos[0] == 1) {
      rgb[0] = (unsigned char)f_max*255.0;
      rgb[1] = (unsigned char)f_max*255.0;
      rgb[2] = (unsigned char)f_max*255.0;
    }
    else {
      w = (float)(m_encoder_pos[0]-1.0)/((float)(m_encoder_n-1));
      _wheel( (unsigned char)(w*255.0), &(rgb[0]), &(rgb[1]), &(rgb[2]));
    }

    _color_interpolate(f_min, f_min, f_max, rgb, rgbMin);
    _color_interpolate(f_max, f_min, f_max, rgb, rgbMax);
  }

  for (i=0; i<m_count_led; i++) {
    m_rgb_buf[3*i+1] = rgbMin[0];
    m_rgb_buf[3*i+2] = rgbMin[1];
    m_rgb_buf[3*i+3] = rgbMin[2];
  }

  m_strobe_tick = (m_strobe_tick+1)%strobe_delay;
  if (m_strobe_tick!=0) { return 0; }

  for (i=0; i<strobe_n; i++) {
    p = rand()%m_count_led;
    for (j=0; j<strobe_size; j++) {
      if ( (p+j) >= m_count_led ) { break; }
      m_rgb_buf[3*(p+j)+1] = rgbMax[0];
      m_rgb_buf[3*(p+j)+2] = rgbMax[1];
      m_rgb_buf[3*(p+j)+3] = rgbMax[2];
    }
  }

  return 0;
}

int inner_light_mode_type::tick_pulse(void) {
  int i;
  int pulse_del = 16;
  double phase_del = 2.0*M_PI/8.0;
  unsigned char rgbCur[3];
  float w, f, f_min=64.0/255.0, f_max=255.0/255.0, f_del;

  f_del = f_max - f_min;

  if (m_encoder_pos[0] == 0) {
    f_min = 0.0;
    f_max = 1.0;
    phase_del = (m_config.m_pulse_speed-60.0)/(240.0-60.0);
  }
  else {
    if ((m_pulse_last_button == 0) && (m_encoder_button[0] == 1)) {
      m_pulse_state = (m_pulse_state + 1)%2;
    }
    m_pulse_last_button = m_encoder_button[0];

    if (m_pulse_state == 0) {
      pulse_del = m_encoder_pos[0];
      phase_del = (double)pulse_del / 32.0;
    }
    else {

      if (m_encoder_pos[0] == 0) {
        m_pulse_rgb[0] = (unsigned char)f_max*255.0;
        m_pulse_rgb[1] = (unsigned char)f_max*255.0;
        m_pulse_rgb[2] = (unsigned char)f_max*255.0;
      }
      else {
        w = (float)(m_encoder_pos[0]-1.0)/((float)(m_encoder_n-1));
        _wheel( (unsigned char)(w*255.0), &(m_pulse_rgb[0]), &(m_pulse_rgb[1]), &(m_pulse_rgb[2]));
      }

    }
  }

  m_pulse_phase = _f_mod(m_pulse_phase+phase_del, 0.0, 2.0*M_PI);
  f = (f_del*(sin(m_pulse_phase)+1.0)/2.0) + f_min;


  if (m_encoder_pos[0] == 0)  {
    _rgblerp(rgbCur, f, m_config.m_pulse_bg, m_config.m_pulse_fg);
  }
  else {
    _color_interpolate( f, f_min, f_max, m_pulse_rgb, rgbCur);
  }

  for (i=0; i<m_count_led; i++) {
    m_rgb_buf[3*i+1] = rgbCur[0];
    m_rgb_buf[3*i+2] = rgbCur[1];
    m_rgb_buf[3*i+3] = rgbCur[2];
  }

  return 0;
}

int inner_light_mode_type::tick_rainbow(void) {
  int i, x;
  int p_del = 1;
  unsigned char _p, _r, _g, _b;

  // encoder position sets 'velocity' of
  // rainbow
  //


  // take from config
  //
  if (m_encoder_pos[0] == 0) {
    if (m_config.m_rainbow_speed < 60.0) {
      p_del = 1;
    }
    else {
      p_del = (int)(12.0*((m_config.m_rainbow_speed - 60.0)/(240.0-60.0)));
    }
  }

  // use encoder value otherwise
  //
  else {
    p_del = m_encoder_pos[0];
  }

  m_rainbow_p = (m_rainbow_p+p_del)%255;

  for (i=0; i<m_count_led; i++) {
    x = (i+m_rainbow_p)%255;
    _p = (unsigned char)(x);
    _wheel(_p, &_r, &_g, &_b);

    m_rgb_buf[3*i+1] = (unsigned char)_r;
    m_rgb_buf[3*i+2] = (unsigned char)_g;
    m_rgb_buf[3*i+3] = (unsigned char)_b;
  }

  return 0;
}

//--

// run a single led up and down the range
//
int inner_light_mode_type::tick_ledtest(void) {
  int i, j, to, p, _start, _m, _m2, _d = 0, x;
  struct timeval tv;
  unsigned char r, g, b;

  int dp;

  gettimeofday(&tv, NULL);
  m_ledtest_t_cur = _tv2d(tv);

  if ((m_ledtest_t_cur - m_ledtest_t0) >= m_ledtest_dt) {

    printf(">>> tick_ledtest, changing mode to %i\n", m_ledtest_mode_to);

    m_mode = m_ledtest_mode_to;
    return 0;
  }

  for (i=0; i<m_count_led; i++) {
    m_rgb_buf[3*i+1] = 0;
    m_rgb_buf[3*i+2] = 0;
    m_rgb_buf[3*i+3] = 0;
  }

  for (i=0; i<m_ledtest_pos.size(); i++) {

    _start = m_ledtest_range[3*i];
    _m = m_ledtest_range[3*i+1];
    _d = m_ledtest_range[3*i+2];

    // force positive direction
    //
    //_d = 1;

    p = m_ledtest_pos[i];

    //_d = 1;

    dp = p - _start;
    dp = (dp + _d + _m) % _m;
    p = _start + dp;

    //printf("## p %3i (%3i+%2i d%2i) (%i)\n", p, _start, _m, _d, (int)m_ledtest_pos.size());

    m_ledtest_pos[i] = p;

    _m2 = _m/2;
    for (j=0; j<_m2; j++) {
      x = p+j;
      if (x < _start) { x += _m; }
      if (x >= (_start + _m)) { x -= _m; }

      if (x<0) { continue; }
      if (x>=m_count_led) { continue; }

      m_rgb_buf[3*x+1] = 128;
      m_rgb_buf[3*x+2] = 128;
      m_rgb_buf[3*x+3] = 128;
    }

  }


}

int inner_light_mode_type::tick_transition(void) {
  int i, to;
  struct timeval tv;
  unsigned char r, g, b;
  int v;

  v = m_transition_v;

  gettimeofday(&tv, NULL);
  m_transition_t_cur = _tv2d(tv);

  if ((m_transition_t_cur - m_transition_t0) >= m_transition_dt) {
    m_tap_time.clear();
    m_mode = m_transition_mode_to;
    return 0;
  }

  r = ( v ? 255 : 0 );
  g = ( v ? 0 : 255 );
  b = 0;

  to = m_transition_mode_to;
  if (to == _MODE_SOLID) {
    r = ( v ? 255 : 0 );
    g = ( v ? 255 : 0 );
    b = ( v ? 255 : 0 );
  }
  else if (to == _MODE_SOLID_COLOR) {
    r = ( v ? 255 : 0 );
    g = ( v ?  0 : 0 );
    b = ( v ? 0 : 0 );
  }

  else if (to == _MODE_TAP_PULSE) {
    r = ( v ? 0 : 0 );
    g = ( v ?  255 : 0 );
    b = ( v ? 0 : 0 );
  }
  else if (to == _MODE_TAP_BULLET) {
    r = ( v ? 0 : 0 );
    g = ( v ? 0 : 0 );
    b = ( v ? 255 : 0 );
  }

  else if (to == _MODE_TAP_STROBE) {
    r = ( v ? 0: 0 );
    g = ( v ? 255: 0 );
    b = ( v ? 255 : 0 );
  }

  else if (to == _MODE_FILL) {
    r = ( v ? 255: 0 );
    g = ( v ? 0: 255 );
    b = ( v ? 0: 255  );
  }
  else if (to == _MODE_STROBE) {
    r = ( v ? 0: 255 );
    g = ( v ? 255: 0 );
    b = ( v ? 0: 255  );
  }
  else if (to == _MODE_PULSE) {
    r = ( v ? 0: 255 );
    g = ( v ? 0 : 255 );
    b = ( v ? 255: 0);
  }

  else if (to == _MODE_RAINBOW) {
    r = ( v ? 255: 0 );
    g = ( v ? 255: 255);
    b = ( v ? 0 : 255);
  }

  else if (to == _MODE_MIC_STROBE) {
    r = ( v ? 0: 255 );
    g = ( v ? 255 : 255);
    b = ( v ? 255: 255  );
  }

  else if (to == _MODE_MIC_BULLET) {
    r = ( v ? 0: 255 );
    g = ( v ? 0: 255);
    b = ( v ? 255: 255  );
  }

  else if (to == _MODE_MIC_PULSE) {
    r = ( v ? 0: 255 );
    g = ( v ? 0: 255);
    b = ( v ? 255: 255  );
  }


  for (i=0; i<8; i++) {
    m_rgb_buf[3*i+1] = r;
    m_rgb_buf[3*i+2] = g;
    m_rgb_buf[3*i+3] = b;
  }

  m_transition_v = 1-m_transition_v;

  return 0;
}

//--

int inner_light_mode_type::tick(void) {
  int r = -1;

  switch(m_mode) {

    case _MODE_SOLID:       r = tick_solid();       break;
    case _MODE_SOLID_COLOR: r = tick_solid_color(); break;
    case _MODE_TAP_PULSE:   r = tick_tap_pulse();   break;
    case _MODE_MIC_PULSE:   r = tick_mic_pulse();   break;
    case _MODE_TAP_BULLET:  r = tick_tap_bullet();  break;
    case _MODE_MIC_BULLET:  r = tick_mic_bullet();  break;
    case _MODE_TAP_STROBE:  r = tick_tap_strobe();  break;
    case _MODE_MIC_STROBE:  r = tick_mic_strobe();  break;
    case _MODE_FILL:        r = tick_fill();        break;
    case _MODE_STROBE:      r = tick_strobe();      break;
    case _MODE_NOISE:       r = tick_noise();       break;
    case _MODE_PULSE:       r = tick_pulse();       break;
    case _MODE_RAINBOW:     r = tick_rainbow();     break;
    case _MODE_TRANSITION:  r = tick_transition();  break;
    case _MODE_LEDTEST:     r = tick_ledtest();  break;

    default:
      r = -1;
      break;
  }

  return r;
}

int inner_light_mode_type::process_mic_beat(int beat_fd) {
  int i;
  ssize_t n_read;
  size_t buf_sz = 1024;
  char buf[1024];

  static int _counter=0, _n_counter = 16;

  n_read = read(beat_fd, buf, buf_sz-1);

  if ((n_read < 0) && (errno!=EINTR)) {
    perror("beat_fd read failed");
    return -1;
  }
  if ((n_read == 0) && (errno != EAGAIN)) {
    fprintf(stderr, "process_mic_beat: n_read == 0 but errno != EAGAIN, returning\n");
    return -1;
  }
  if (n_read==0) { return 0; }

  buf[n_read-1] = '\0';

  for (i=0; i<n_read; i++) {
    if (buf[i] == '!') {

      m_mic_beat_signal = 1;

      printf("."); fflush(stdout);

      _counter = (_counter + 1) % _n_counter;
      if ((_counter % _n_counter)==0) { printf("\n"); fflush(stdout); }
      break;
    }
  }

  return 0;
}

// Find BPM doing a least squares fit.
// tap times are in usec.
//
static float _bpm_regress(std::vector< double > &tap_t) {
  int i;
  double est_beat = 0.0, _n=1;

  double m, b, N, y0, y;
  double xsum=0.0,  ysum=0.0,
         xxsum=0.0, yysum=0.0,
         xysum=0.0;
  double denom = 0.0;
  double bpm, phase;

  if (tap_t.size()<2) { return 0.0; }

  N = (double)tap_t.size();

  y0 = tap_t[0];
  for (i=0; i<tap_t.size(); i++) {

    y = tap_t[i] - y0;

    xsum += (double)i;
    ysum += y;

    xxsum += (double)(i*i);
    yysum += y*y;

    xysum += ((double)i)*y;
  }

  denom = N*xxsum - xsum*xsum;

  // slope is bp us
  //
  m = ((N*xysum) - (xsum*ysum)) / denom;
  bpm = 60.0 * 1000000.0 / m;
  return (float)bpm;
}

int inner_light_mode_type::process_encoder(int encoder_fd) {
  int i, r;
  ssize_t n_read;
  size_t buf_sz = 1024;
  char buf[1024];

  int apos, bpos, abutton, bbutton;
  static int bpos_prev=-1, apos_prev=-1;
  int mode_next, dm;

  struct timeval tv;

  n_read = read(encoder_fd, buf, buf_sz-1);

  if ((n_read < 0) && (errno!=EINTR)) {
    perror("encoder_fd read failed");
    return -1;
  }
  if ((n_read == 0) && (errno != EAGAIN)) {
    fprintf(stderr, "process_encoder: n_read == 0 but errno != EAGAIN, returning\n");
    return -1;
  }
  if (n_read==0) { return 0; }

  buf[n_read] = '\0';

  for (i=0; i<n_read; i++) {

    if (buf[i] == '\n') {

      if ((m_encoder_line.size()==0) ||
          (m_encoder_line[0] == '#')) {
        m_encoder_line.clear();
        continue;
      }

      r = sscanf(m_encoder_line.c_str(), "%i %i %i %i", &apos, &abutton, &bpos, &bbutton);
      if (r != 4) {
        fprintf(stderr, "#bad conversion for encoder: %s\n", m_encoder_line.c_str());
        m_encoder_line.clear();
        continue;
      }

      if (apos_prev < 0) { apos_prev = apos; }
      if (bpos_prev < 0) { bpos_prev = bpos; }

      m_encoder_pos[0] = apos;
      m_encoder_pos[1] = bpos;
      m_encoder_button[0] = abutton;
      m_encoder_button[1] = bbutton;

      printf("# encoder: a(%i %i) b(%i %i)\n", apos, abutton, bpos, bbutton);

      if (abutton == 1) {
        gettimeofday(&tv, NULL);
        m_tap_time.push_back( _tv2d(tv) );

        if (m_tap_time.size() == m_tap_n) {
          m_tap_bpm = _bpm_regress(m_tap_time);
          m_tap_ready = 1;
          m_tap_time.clear();

          printf("BANG: %f\n", m_tap_bpm);
        }
        else {
          m_tap_ready = 0;
        }

      }

      if (bpos != bpos_prev) {

        // Take delta position of encoder and not absolute.
        // This way, initial state of encoder is irrelevant.
        //
        dm = (bpos - bpos_prev) % _MODE_N;
        dm = (dm + _MODE_N) % _MODE_N;

        mode_next = (m_mode + dm) % _MODE_N;

        printf("changing state.... from %i to %i (dm %i)\n", m_mode, mode_next, dm);

        // Setup transition 'mode' and destination mode
        // after transition animation.
        //
        m_transition_mode_to = mode_next;
        gettimeofday(&tv, NULL);
        m_transition_t0 = _tv2d(tv);
        m_transition_t_cur = m_transition_t0;

        m_mode = _MODE_TRANSITION;

        printf(">>> switching mode to transition. mode will go to %i (%s) after\n", m_transition_mode_to, _mode_name[m_transition_mode_to]);

        bpos_prev = bpos;

      }

      m_encoder_line.clear();
      continue;
    }

    m_encoder_line += buf[i];
  }

  return 0;
}

//---

int inner_light_mode_type::update_led_map(void) {
  int i;

  // resize and transfer relevant mapped leds
  //
  if (g_mode.m_led_map.size() < g_mode.m_count_led) {
    g_mode.m_led_map.resize( g_mode.m_count_led );
  }
  for (i=0; i<g_mode.m_count_led; i++) {
    g_mode.m_led_map[i] = i;
  }
  for (i=0; i<g_mode.m_count_led; i++) {
    if (i >= g_mode.m_config.m_map.size()) { break; }
    g_mode.m_led_map[i] = g_mode.m_config.m_map[i];
  }

}

//---

static int _parse_array(std::vector< std::string > &_va, std::string &_line, int delim) {
  const char *chp=NULL, *chp_tok=NULL, *chp_idx=NULL;
  int i;
  std::string _val;

  _va.clear();

  chp = _line.c_str();

  for (chp = _line.c_str();
       (*chp) && (chp_tok = strchr(chp, delim)) ;
       chp = (chp_tok+1) ) {
    _val.clear();
    for (chp_idx=chp; chp_idx!=chp_tok; chp_idx++) {
      _val += *chp_idx;
    }
    _va.push_back(_val);
  }

  _val.clear();
  for (chp_idx=chp; *chp_idx; chp_idx++) {
    _val += *chp_idx;
  }
  _va.push_back(_val);


  return 0;
}

int inner_light_mode_type::load_ledtest_file(std::string &fn) {
  int i, ret = 0, ch, r;
  FILE *fp;
  std::vector< std::string > _str_a;
  std::string line;

  int p;

  int _start, _m, _d;
  std::vector< int > _range, _pos;

  fp = fopen(fn.c_str(), "r");
  if (!fp) { return -1; }

  while (!feof(fp)) {
    ch = fgetc(fp);
    if ((ch==EOF) || (ch=='\n')) {
      if (line.size()==0) { continue; }
      if (line[0] == '#') { line.clear(); continue; }

      r = _parse_array(_str_a, line, ',');
      if (r!=0) { ret = -2; break; }
      if (_str_a.size() != 3) { ret = -3; break; }

      _start = atoi(_str_a[0].c_str());
      _m = atoi(_str_a[1].c_str());
      _d = atoi(_str_a[2].c_str());

      printf("?? %i %i %i\n", (int)_start, (int)_m, (int)_d);

      if ((_start < 0) || (_start >= m_count_led)) { ret = -4; break; }
      if ((_m < 1) || ((_start+_m) > m_count_led)) {
        fprintf(stderr, "load_ledtest_file(): ERROR: _start %i + _m %i (%i) >= m_count_led %i\n",
            _start, _m, _start+_m, (int)m_count_led);
        ret = -5; break;
      }
      if ((_d != 1) && (_d != -1)) { ret=-6; break; }

      _range.push_back(_start);
      _range.push_back(_m);
      _range.push_back(_d);

      //DEBUG
      //
      for (i=_start; (i<(_start+_m)) && (i<m_count_led); i++) {
        p = -1;
        if ((i>0) && (i<m_led_map.size())) { p = m_led_map[i]; }
        printf(" [%i->%i]\n", i, p);
      }
      //
      //DEBUG

      _pos.push_back(_start);
      line.clear();
      continue;
    }
    line += ch;
  }
  fclose(fp);

  if (ret == 0) {
    m_ledtest_range.clear();
    m_ledtest_pos.clear();

    m_ledtest_range = _range;
    m_ledtest_pos = _pos;
  }


  //DEBUG
  printf("ledtest: ret %i\n", ret);
  for (i=0; i<m_ledtest_range.size(); i+=3) {
    printf(" %i,%i,%i\n", m_ledtest_range[i], m_ledtest_range[i+1], m_ledtest_range[i+2]);
  }


  return ret;
}

void inner_light_mode_type::start_ledtest(void) {
  struct timeval tv;
  gettimeofday(&tv, NULL);
  m_ledtest_t0 = _tv2d(tv);
  m_ledtest_t_cur = m_ledtest_t0;
  m_ledtest_mode_to = m_mode;

  m_mode = _MODE_LEDTEST;
}


void sighup_handler(int signo) {
  int i, ret;
  FILE *fp;
  static int count=0;

  if (signo == SIGHUP) {
    printf("caught SIGHUP (%i)\n", count);
    count++;

    ret = g_mode.m_config.load_config( g_mode.m_config_fn );
    if (ret<0) {
      fprintf(stderr, "Couldn't read config file %s, ignoreing and moving on\n", g_mode.m_config_fn.c_str());
      fprintf(stdout, "Couldn't read config file %s, ignoreing and moving on\n", g_mode.m_config_fn.c_str());
    }
    else {

      if ((g_mode.m_config.m_count_led < 1) ||
          (g_mode.m_config.m_count_led > 1024)) {
        fprintf(stderr, "g_mode.m_config.m_count_led out of range (%i). giving up\n", (int)g_mode.m_config.m_count_led);
        exit(-1);
      }

      g_mode.m_mode = g_mode.m_config.m_mode;
      g_mode.m_tap_ready = 1;
      g_mode.m_tap_bpm = g_mode.m_config.m_tap_bpm;

      if (g_mode.m_config.m_count_led != g_mode.m_count_led) {

        g_mode.cleanup();

        //printf("\n....sleeping\n");
        //sleep(5);
        //printf("\n....waking up\n");

        g_mode.m_count_led = g_mode.m_config.m_count_led;
        ret = g_mode.led_mmap_fn( g_mode.m_led_fn.c_str() );
        if (ret!=0) {
          fprintf(stderr, "sighup_hander: ERROR, could not load %s, got %i\n", g_mode.m_led_fn.c_str(), ret);
        }

        printf("sighup_handler: m_count_led now %i\n", (int)g_mode.m_count_led);

      }

      g_mode.update_led_map();
    }

    if (g_mode.load_ledtest_file( g_mode.m_ledtest_fn )==0) {
      g_mode.start_ledtest();
      unlink(g_mode.m_ledtest_fn.c_str());
    }


    printf("mode now %i tap %f?\n", g_mode.m_mode, (float)g_mode.m_tap_bpm);

  }

}

int write_pid_file(std::string &pid_fn) {
  FILE *fp;
  pid_t pid;

  pid = getpid();
  fp = fopen(pid_fn.c_str(), "w");
  if (fp==NULL) { return -1; }
  fprintf(fp, "%i", pid);
  fclose(fp);

  return 0;
}


//---

int main(int argc, char **argv) {
  float dt;
  int ch;
  int option_index;
  std::string beat_fn, encoder_fn, config_fn, ledtest_fn, pid_fn;
  int beat_fd, encoder_fd;

  fd_set active_fds, read_fds;
  struct timeval tv, tv_prv, tv_now;
  int ret, r;

  ssize_t n_read;
  size_t buf_sz = 1024;
  char buf[1024];

  int maxfd = 0;
  int i;

  int led_count = 60*3;

  int force_run_no_bound_check=0;

  if (signal(SIGHUP, sighup_handler) == SIG_ERR)  {
    fprintf(stderr, "can't catch SIGHUP, exiting\n");
    exit(-1);
  }

  std::string led_fn = INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE;

  while ((ch=getopt_long(argc, argv, "vhi:L:n:c:p:T:F", _longopt, &option_index)) >= 0) {
    switch(ch) {
      case 0:
        break;
      case 'h':
        show_help_and_exit(stdout);
        break;
      case 'v':
        show_version_and_exit(stdout);
        break;

      case 'F':
        force_run_no_bound_check=1;
        break;

      case 'p':
        pid_fn = optarg;
        break;

      case 'c':
        config_fn = optarg;
        break;

      case 'i':
        beat_fn = optarg;
        break;

      case 'L':
        led_fn = optarg;
        break;

      case 'T':
        ledtest_fn = optarg;
        break;

      case 'n':
        led_count = atoi(optarg);
        break;


      default:
        show_help_and_exit(stderr);
        break;
    }
  }

  if (optind < argc) {
    beat_fn = argv[optind];
    optind++;
  }

  if (optind < argc) {
    encoder_fn = argv[optind];
    optind++;
  }

  if ((beat_fn.size() == 0) ||
      (beat_fn == "-")) {
    beat_fd = 0;
  }
  else {
    beat_fd = open(beat_fn.c_str(), O_RDONLY);
    if (beat_fd < 0) {
      perror(beat_fn.c_str());
      exit(-1);
    }
  }

  if ((encoder_fn.size() == 0) ||
      (encoder_fn == "-")) {
    encoder_fd = 0;
  }
  else {
    encoder_fd = open(encoder_fn.c_str(), O_RDONLY);
    if (encoder_fd < 0) {
      perror(encoder_fn.c_str());
      exit(-1);
    }
  }

  if ((beat_fd == 0) && (encoder_fd == 0)) {
    printf("beat and encoder must not be the same\n");
  }

  maxfd = beat_fd + 1;
  if (maxfd <= encoder_fd) { maxfd = encoder_fd + 1; }

  printf("beat_fd %i (%s), encoder_fd %i (%s), maxfd %i\n",
      beat_fd, beat_fn.c_str(),
      encoder_fd, encoder_fn.c_str(),
      maxfd);

  //----

  g_mode.m_count_led = led_count;
  g_mode.m_led_fn = led_fn;
  if (config_fn.size() > 0) {
    g_mode.m_config_fn = config_fn;
  }
  else {
    g_mode.m_config_fn = INNER_LIGHT_DRIVER_DEFAULT_CONFIG_FILE;
  }

  if (ledtest_fn.size() > 0) {
    g_mode.m_ledtest_fn = ledtest_fn;
  }
  else {
    g_mode.m_ledtest_fn = INNER_LIGHT_DRIVER_DEFAULT_LEDTEST_FILE;
  }

  ret = g_mode.m_config.load_config(g_mode.m_config_fn);
  if (ret<0) {
    fprintf(stderr, "Couldn't read config file %s, ignoreing and moving on\n", g_mode.m_config_fn.c_str());
  }
  else {
    g_mode.m_mode = g_mode.m_config.m_mode;
    g_mode.m_tap_ready = 1;
    g_mode.m_tap_bpm = g_mode.m_config.m_tap_bpm;

    g_mode.m_count_led = g_mode.m_config.m_count_led;
    g_mode.update_led_map();
  }

  if (!force_run_no_bound_check) {
    if ((g_mode.m_count_led < 1) || (g_mode.m_count_led > 1024)) {
      fprintf(stderr, "g_mode.m_count_led is out of range (%i). Use '-F' to not do bound checks. exiting\n", (int)g_mode.m_count_led);
      exit(-1);
    }
  }

  printf("# connecting to mmap file %s (n:%i)\n", g_mode.m_led_fn.c_str(), (int)g_mode.m_count_led);
  ret = g_mode.led_mmap_fn(g_mode.m_led_fn.c_str());
  if (ret < 0) {
    fprintf(stderr, "could not mmap file %s, exiting\n", g_mode.m_led_fn.c_str());
    exit(-1);
  }

  //----
  //
  // save pid file
  //
  r = write_pid_file(pid_fn);
  if (r!=0) {
    fprintf(stderr, "error in writing pid file %s, ignoring\n", pid_fn.c_str());
  }

  //
  //----

  // main even loop
  //

  FD_ZERO(&active_fds);
  FD_SET(beat_fd, &active_fds);
  FD_SET(encoder_fd, &active_fds);

  gettimeofday(&tv_prv, NULL);
  gettimeofday(&tv_now, NULL);

  for (;;) {

    read_fds = active_fds;

    tv.tv_sec = 0;
    tv.tv_usec = 10000;

    ret = select(maxfd, &read_fds, NULL, NULL, &tv);
    if (ret<0) {

      // ignore EINTR in the case of interrupted sys call
      // as in the case of a SIGHUP
      //
      if (errno == EINTR) { continue; }

      // Otherwise terminate
      //
      perror("select");
      break;
    }

    if (ret!=0) {
      if (FD_ISSET(beat_fd, &read_fds)) {
        r=g_mode.process_mic_beat(beat_fd);
        if (r<0) {
          fprintf(stderr, "ERROR: invalid microphone read, exiting\n");
          break;
        }
      }
      if (FD_ISSET(encoder_fd, &read_fds)) {
        r=g_mode.process_encoder(encoder_fd);
        if (r<0) {
          fprintf(stderr, "ERROR: invalid encoder read, exiting\n");
          break;
        }
      }
    }

    gettimeofday(&tv_now, NULL);
    dt = _dtv(tv_now, tv_prv);

    if (dt >= g_mode.m_update_usec) {
      g_mode.tick();
      g_mode.update_led();
      gettimeofday(&tv_prv, NULL);
    }

  }

  //---

  close(beat_fd);
  close(encoder_fd);

}
