#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <math.h>

#include <sys/time.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>


#include <sys/mman.h>

#include <getopt.h>
#include <unistd.h>

#include <string>
#include <vector>

//#include "RGBConverter.h"

#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "/home/pi/data/innerlight.led"
#define _VERSION "0.1.0"

enum inner_light_mode_state {
  _MODE_SOLID = 0,
  _MODE_SOLID_COLOR,
  _MODE_TAP_PULSE ,
  _MODE_TAP_BULLET,
  //_MODE_TAP_RAIN,
  _MODE_TAP_STROBE,

  _MODE_FILL,
  _MODE_STROBE,
  _MODE_PULSE,
  _MODE_RAINBOW,

  _MODE_MIC_STROBE,
  //_MODE_MIC_RAIN,
  _MODE_MIC_BULLET,
  _MODE_MIC_PULSE ,

  _MODE_N,

  _MODE_TRANSITION,
};

char _mode_name[][64] = {
  "solid",
  "solid_color",
  "tap_pulse",
  "tap_bullet",
  //"tap_rain",
  "tap_strobe",
  "fill",
  "strobe",
  "pulse",
  "rainbow",
  "mic_strobe",
  //"mic_rain",
  "mic_pulse",
  "n",
  "transition",
  "n/a",
};

static double _tv2d(struct timeval &tv) {
  double x=0.0;
  x = (double)tv.tv_sec;
  x *=  1000000.0;
  x += (double)tv.tv_usec;
  return x;
}

static float _dtv(struct timeval &tv0, struct timeval &tv1) {
  float x=0.0;
  x = (float)(tv0.tv_sec - tv1.tv_sec);
  x *=  1000000.0;
  x += (float)(tv0.tv_usec - tv1.tv_usec);
  return x;
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

typedef struct inner_light_mode_type {
  std::string m_encoder_line;
  int m_beat_signal;

  int m_mic_beat_signal;

  float m_update_usec;

  size_t m_led_count;
  int m_mode;

  int m_encoder_pos[2];
  int m_encoder_button[2];

  int m_encoder_n;

  int m_transition_mode_to;
  double m_transition_t0;
  double m_transition_t_cur;
  double m_transition_dt;

  unsigned char m_frame;

  float m_pulse_f;
  float m_pulse_ds;
  float m_pulse_dir;
  unsigned char m_bg_rgb[3];

  std::vector< int > m_particle;
  std::vector< int > m_particle_ttl;
  std::vector< int > m_particle_dir;
  int m_particle_v;
  int m_particle_max_height;

  std::string m_led_fn;
  int m_led_fd;
  int m_led_mapped;

  float m_hue, m_saturation, m_lightness;

  double  m_usec_cur;
  double  m_usec_prev;

  int     m_tap_ready;
  double  m_tap_bpm;
  int     m_tap_n;
  int     m_tap_beat_signal;
  std::vector< double > m_tap_time;

  // back buffer for rgb array
  //
  std::vector< unsigned char > m_rgb_buf, m_rgb_buf1;

  // rgb array
  // first element is 'counter'
  // size is n_led * 3 + 1
  //
  unsigned char *m_rgb;
  size_t m_rgb_sz;

  inner_light_mode_type(size_t led_count=1) {
    struct timeval tv;

    m_led_count = led_count;
    m_led_fd = 0;
    m_led_mapped = 1;

    //m_mode = _MODE_PULSE;
    //m_mode = _MODE_BEAT;
    //m_mode = _MODE_PRESET0;
    m_mode = _MODE_SOLID;

    m_pulse_f = 0.0;
    //m_pulse_ds = 1.0/256.0;
    m_pulse_ds = 8.0/256.0;
    m_pulse_dir = 1.0;

    m_transition_mode_to = 0;
    m_transition_dt = 1.0*1000000.0;

    m_frame = 0;

    m_update_usec = 1000000.0 / 30.0;

    m_particle_v = 4;
    m_particle_max_height = 6;

    m_tap_ready = 0;
    m_tap_bpm = 60.0;
    m_tap_n = 12;
    m_tap_beat_signal =0;

    gettimeofday(&tv, NULL);
    m_usec_prev = _tv2d(tv);
    m_usec_cur  = m_usec_prev;

    m_bg_rgb[0] = 255;
    m_bg_rgb[1] = 255;
    m_bg_rgb[2] = 255;

    m_encoder_n = 20;
    m_encoder_pos[0] = 0;
    m_encoder_pos[1] = 0;

    m_encoder_button[0] = 0;
    m_encoder_button[1] = 0;


  }


  // map m_rgb to the mmap'd file
  // save a copy in m_rgb_buf
  //
  int led_mmap(int fd) {
    int i;
    void *v;
    unsigned char *chp;

    m_rgb_sz = m_led_count*3 + 1;

    m_rgb_buf.resize(m_rgb_sz);
    m_rgb_buf1.resize(m_rgb_sz);

    v = mmap(NULL, m_rgb_sz, PROT_NONE | PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (v==MAP_FAILED) { perror("map failed"); m_rgb = NULL; return -1; }
    if (v==NULL) { perror("mmap null"); return -2; }
    m_rgb = (unsigned char *)v;

    memcpy(&(m_rgb_buf[0]), m_rgb, m_rgb_sz);
    return 0;
  }

  // wrapper for filename
  //
  int led_mmap_fn(const char *fn) {
    int r;
    m_led_fn = fn;
    m_led_fd = open(fn, O_RDWR);
    if (m_led_fd < 0) { perror("mmap failed"); return -1; }

    r = led_mmap(m_led_fd);
    return r;
  }

  int cleanup(void) {
    if (m_led_fd > 0) {
      if (m_led_mapped) {
        munmap(m_rgb, m_rgb_sz);
      }
      close(m_led_fd);
    }
    return 0;
  }

  void add_particle(int pos, int dir=1, int ttl=32) {
    m_particle.push_back(pos);
    m_particle_dir.push_back(dir);
    m_particle_ttl.push_back(ttl);
  }

  void rem_particle(int idx) {
    int x;
    x = (int)(m_particle.size()-1);
    m_particle[idx] = m_particle[x];
    m_particle_dir[idx] = m_particle_dir[x];
    m_particle_ttl[idx] = m_particle_ttl[x];

    m_particle.resize(x);
    m_particle_dir.resize(x);
    m_particle_ttl.resize(x);
  }

  int tick(void);

  int tick_solid(void);
  int tick_solid_color(void);
  int tick_fill(void);
  int tick_strobe(void);
  int tick_pulse(void);
  int tick_rainbow(void);
  int tick_transition(void);

  int tick_tap_pulse(void);
  int tick_mic_pulse(void);
  int tick_tap_bullet(void);
  int tick_mic_bullet(void);
  int tick_tap_rain(void);
  int tick_mic_rain(void);
  int tick_tap_strobe(void);
  int tick_mic_strobe(void);

  void beat_pulse(void);
  void beat_bullet(void);
  void beat_rain(void);
  void beat_strobe(void);

  //int tick_beat(void);
  //int tick_preset0(void);

  int update_led(void);
  int process_mic_beat(int);
  int process_encoder(int);

  int process_tap(void);

} inner_light_mode_t;

inner_light_mode_t g_mode;

struct option _longopt[] = {
  {"help", no_argument, 0, 'h'},
  {0,0,0,0},
};

void show_help_and_exit(FILE *fp) {
  fprintf(fp, "usage:\n");
  fprintf(fp, "\n  mode-manage [-L mmap.led] [-n led_count] <( MIC ) <( ENCODER )\n\n");
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
  static int x = 0;

  if (!m_led_mapped) { return -1; }

  memcpy(m_rgb, &(m_rgb_buf[0]), m_rgb_sz);

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

/*
int inner_light_mode_type::tick_pulse(void) {
  int i;
  unsigned char v_r, v_g, v_b;

  m_pulse_f += m_pulse_ds*m_pulse_dir;
  if (m_pulse_f < 0.0) {
    m_pulse_f = 0.0;
    m_pulse_dir = 1.0;
  }
  if (m_pulse_f > 1.0) {
    m_pulse_f = 1.0;
    m_pulse_dir = -1.0;
  }
  //v = (unsigned char)(m_pulse_f * 255.0);
  v_r = (unsigned char)(m_pulse_f * (float)m_bg_rgb[0]);
  v_g = (unsigned char)(m_pulse_f * (float)m_bg_rgb[1]);
  v_b = (unsigned char)(m_pulse_f * (float)m_bg_rgb[2]);

  for (i=0; i<m_led_count; i++) {
    m_rgb_buf[3*i+1] = v_r;
    m_rgb_buf[3*i+2] = v_g;
    m_rgb_buf[3*i+3] = v_b;
  }

  m_rgb_buf[0] = m_frame;

  m_frame++;
}
*/

/*
int inner_light_mode_type::tick_beat(void) {
  int i, j, u, p, d, _irgb;
  unsigned char _deflate = 32, _deflate1 = 16;

  unsigned char _floor = 64, _ceil = 255, _ds0 = 64, _ds;

  int alg=1;

  m_beat_signal = m_mic_beat_signal;

  if (alg==0) {
    if (m_beat_signal) {
      for (i=0; i<m_led_count; i++) {
        m_rgb_buf[3*i+1] = 255;
        m_rgb_buf[3*i+2] = 0;
        m_rgb_buf[3*i+3] = 0;
      }

    }
    else {
      for (i=0; i<m_led_count; i++) {
        if (m_rgb_buf[3*i+1] > _deflate) {
          m_rgb_buf[3*i+1] -= _deflate;
        }
        else {
          m_rgb_buf[3*i+1] = 0;
        }
        m_rgb_buf[3*i+2] = 0;
        m_rgb_buf[3*i+3] = 0;
      }
    }
  }
  else if (alg==1) {

    // start the particle in the moddle
    //
    if (m_beat_signal) {
      p = m_led_count / 2;
      m_particle[0].push_back(p + (rand()%m_particle_v));
      m_particle[1].push_back(p - (rand()%m_particle_v));
    }

    // clear buffer
    //
    for (i=0; i<m_led_count; i++) {
      m_rgb_buf1[3*i+1] = _floor;
      m_rgb_buf1[3*i+2] = _floor;
      m_rgb_buf1[3*i+3] = _floor;
    }

    // update particles in both directions
    //
    for (d = 0; d<2; d++) {
      for (i=0; i<m_particle[d].size(); i++) {
        if (d==0) { m_particle[d][i] += m_particle_v; }
        else { m_particle[d][i] -= m_particle_v; }
        if ((m_particle[d][i] >= m_led_count) || (m_particle[d][i] < 0)) {
          m_particle[d][i] = m_particle[d][ m_particle[d].size()-1 ];
          m_particle[d].resize( m_particle[d].size()-1 );
          i--;
          continue;
        }
      }
    }

    // update center particle
    //
    for (d=0; d<2; d++) {
      for (i=0; i<m_particle[d].size(); i++) {
        m_rgb_buf1[ 3*(m_particle[d][i]) + 1 ] = 255;
        m_rgb_buf1[ 3*(m_particle[d][i]) + 2 ] = 255;
        m_rgb_buf1[ 3*(m_particle[d][i]) + 3 ] = 255;
      }
    }

    // smooth out edges of particle to get nicer gradation
    //
    for (d=0; d<2; d++) {
      for (i=0; i<m_particle[d].size(); i++) {

        p = m_particle[d][i];
        _ds = _ds0;
        for (j=0; j<3; j++) {
          p--;
          if (p<0) { break; }

          for (_irgb=0; _irgb<3; _irgb++) {
            if (m_rgb_buf1[ 3*p + _irgb ] < (256-_ds)) { m_rgb_buf1[3*p+_irgb]+=_ds; }
            else { m_rgb_buf1[3*p + _irgb] = 255; }
          }

          _ds /= 2;
          if (_ds == 0) { break; }
        }

        p = m_particle[d][i];
        _ds = _ds0;
        for (j=0; j<3; j++) {
          p++;
          if (p>=m_led_count) { break; }

          for (_irgb=0; _irgb<3; _irgb++) {
            if (m_rgb_buf1[ 3*p + _irgb ] < (256-_ds)) { m_rgb_buf1[3*p+_irgb]+=_ds; }
            else { m_rgb_buf1[3*p + _irgb] = 255; }
          }

          _ds /= 2;
          if (_ds == 0) { break; }
        }

      }

    }

    // copy it back to original buffer
    //
    memcpy((void *)(&(m_rgb_buf[0])),
           (const void *)(&(m_rgb_buf1[0])),
           sizeof(unsigned char)*((m_led_count*3) + 1));

  }
  else if (alg==2) {
    if (m_beat_signal) {
      m_rgb_buf1[3*0 + 1] = 255;
      m_rgb_buf1[3*0 + 2] = 0;
      m_rgb_buf1[3*0 + 3] = 0;
    }

    for (i=1; i<(m_led_count-1); i++) {


      for (j=0; j<3; j++) {
        u = 0;
        u += m_rgb_buf[3*(i-1)+j];
        u += m_rgb_buf[3*(i+0)+j];
        u += m_rgb_buf[3*(i+1)+j];
        m_rgb_buf1[3*i+j] = (unsigned char)(u/3);
      }
    }

    for (j=0; j<3; j++) {
      u = 0;
      u += m_rgb_buf[3*(m_led_count-2)+j];
      u += m_rgb_buf[3*(m_led_count-1)+j];
      m_rgb_buf1[3*(m_led_count-1) + j] = (unsigned char)(u/3);
      if (m_rgb_buf1[3*(m_led_count-1) + j] > _deflate1) {
        m_rgb_buf1[3*(m_led_count-1) + j] -= _deflate1;
      }
    }

    for (i=0; i<m_led_count; i++) {
      for (j=0; j<3; j++) {
        if (m_rgb_buf1[3*i + j] > _deflate1) {
          m_rgb_buf1[3*i + j] -= _deflate1;
        }
        else {
          m_rgb_buf1[3*i + j] = 0;
        }
      }
    }

    for (i=1; i<m_led_count; i++) {
      m_rgb_buf[3*i+1] = m_rgb_buf1[3*i+1];
      m_rgb_buf[3*i+2] = m_rgb_buf1[3*i+2];
      m_rgb_buf[3*i+3] = m_rgb_buf1[3*i+3];
    }

  }

  m_beat_signal = 0;
  m_mic_beat_signal = 0;

  m_rgb_buf[0] = m_frame;
  m_frame++;
}
*/

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

  for (i=0; i<m_led_count; i++) {
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
  if (process_tap()) {
    m_beat_signal = m_tap_beat_signal;
    beat_pulse();
  }
  return 0;
}

int inner_light_mode_type::tick_mic_pulse(void) {
  m_beat_signal = m_mic_beat_signal;
  m_mic_beat_signal = 0;
  beat_pulse();
  return 0;
}

int inner_light_mode_type::tick_tap_bullet(void) {
  if (process_tap()) {
    m_beat_signal = m_tap_beat_signal;
    beat_bullet();
  }
  return 0;
}

int inner_light_mode_type::tick_mic_bullet(void) {
  m_beat_signal = m_mic_beat_signal;
  m_mic_beat_signal = 0;
  beat_bullet();
  return 0;
}

int inner_light_mode_type::tick_tap_rain(void) {
  if (process_tap()) {
    m_beat_signal = m_tap_beat_signal;
    beat_rain();
  }
  return 0;
}

int inner_light_mode_type::tick_mic_rain(void) {
  m_beat_signal = m_mic_beat_signal;
  m_mic_beat_signal = 0;
  beat_rain();
  return 0;
}

int inner_light_mode_type::tick_tap_strobe(void) {
  if (process_tap()) {
    m_beat_signal = m_tap_beat_signal;
    beat_strobe();
  }
  return 0;
}

int inner_light_mode_type::tick_mic_strobe(void) {
  m_beat_signal = m_mic_beat_signal;
  m_mic_beat_signal = 0;
  beat_strobe();
  return 0;
}


void inner_light_mode_type::beat_pulse(void) {
  int i;
  float w, f, f_del, f_decay = 32.0/255.0, f_min=64.0/255.0, f_max=255.0/255.0;
  unsigned char rgb[3], rgbCur[3];
  static float f_cur=0.0;

  f_del = f_max - f_min;

  f_cur -= f_decay;
  if (m_beat_signal) { f_cur = f_max; }
  if (f_cur <= f_min) { f_cur = f_min; }
  if (f_cur >= f_max) { f_cur = f_max; }

  if (m_encoder_pos[0] == 0) {
    rgb[0] = (unsigned char)f_max*255.0;
    rgb[1] = (unsigned char)f_max*255.0;
    rgb[2] = (unsigned char)f_max*255.0;
  }
  else {
    w = (float)(m_encoder_pos[0]-1.0)/((float)(m_encoder_n-1));
    _wheel( (unsigned char)(w*255.0), &(rgb[0]), &(rgb[1]), &(rgb[2]));
  }

  _color_interpolate( f_cur, f_min, f_max, rgb, rgbCur);

  /*
  rgbCur[0] = (unsigned char)((float)rgb[0]*f_cur/255.0);
  rgbCur[1] = (unsigned char)((float)rgb[1]*f_cur/255.0);
  rgbCur[2] = (unsigned char)((float)rgb[2]*f_cur/255.0);
  */

  for (i=0; i<m_led_count; i++) {
    m_rgb_buf[3*i+1] = rgbCur[0];
    m_rgb_buf[3*i+2] = rgbCur[1];
    m_rgb_buf[3*i+3] = rgbCur[2];
  }

}

void inner_light_mode_type::beat_bullet(void) {
  int i, j, u, p, d, _irgb;
  unsigned char _deflate = 32, _deflate1 = 16;
  unsigned char _floor = 64, _ceil = 255, _ds0 = 64, _ds;

  float f, f_del, f_min=64.0/255.0, f_max=255.0/255.0;
  unsigned char w, rgb[3], rgbCur[3], rgbMin[3], rgbMax[3];

  f_del = f_max - f_min;

  if (m_encoder_pos[0] == 0) {
    rgb[0] = 255;
    rgb[1] = 255;
    rgb[2] = 255;
  }
  else {
    f = (float)(m_encoder_pos[0]-1)/19.0;
    _wheel( (unsigned char)(f*255.0), &(rgb[0]),&(rgb[1]),&(rgb[2]));
  }


  // start the particle in the middle
  //
  if (m_beat_signal) {
    p = m_led_count / 2;
    add_particle(p + (rand()%m_particle_v), 1);
    add_particle(p - (rand()%m_particle_v), -1);
  }

  // clear buffer
  //
  _color_interpolate(f_min, f_min, f_max, rgb, rgbMin);
  for (i=0; i<m_led_count; i++) {
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
    if ((m_particle[i] >= m_led_count) || (m_particle[i] < 0)) {
      rem_particle(i);
      i--;
      continue;
    }
  }

  // update center particle
  //
  _color_interpolate(f_max, f_min, f_max, rgb, rgbMax);
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
      if (p>=m_led_count) { break; }

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
         sizeof(unsigned char)*((m_led_count*3) + 1));

}

void inner_light_mode_type::beat_rain(void) {
  int i, j, u, p, d, _irgb;
  int winl, winr;
  unsigned char _deflate = 32, _deflate1 = 16;
  unsigned char _floor = 64, _ceil = 255, _ds0 = 64, _ds;

  float f, f_del, f_min=64.0/255.0, f_max=255.0/255.0, f_height;
  unsigned char w, rgb[3], rgbCur[3], rgbMin[3], rgbMax[3];

  f_height = (float)m_particle_max_height;
  f_del = f_max - f_min;

  return;

  // start the particle in the middle
  //
  if (m_beat_signal) {

    p = m_led_count/2;
    d = rand() % (m_led_count/2);
    if (rand()%2) {
      add_particle(p-d, -1, 2*m_particle_max_height);
    }
    else {
      add_particle(p+d,  1, 2*m_particle_max_height);
    }
  }

  if (m_encoder_pos[0] == 0) {
    rgb[0] = 255;
    rgb[1] = 255;
    rgb[2] = 255;
  }
  else {
    f = (float)(m_encoder_pos[0]-1)/19.0;
    _wheel( (unsigned char)(f*255.0), &(rgb[0]),&(rgb[1]),&(rgb[2]));
  }

  // clear buffer
  //
  _color_interpolate(f_min, f_min, f_max, rgb, rgbMin);
  for (i=0; i<m_led_count; i++) {
    m_rgb_buf1[3*i+1] = rgbMin[0];
    m_rgb_buf1[3*i+2] = rgbMin[1];
    m_rgb_buf1[3*i+3] = rgbMin[2];
  }

  // update particles in both directions
  //
  for (i=0; i<m_particle.size(); i++) {

    d = m_particle_dir[i];
    m_particle_ttl[i]--;

    if (d==1) { m_particle[i] += m_particle_v; }
    else      { m_particle[i] -= m_particle_v; }

    // particle has reached boundary, swap with end and destroy
    //
    if ((m_particle[i] >= m_led_count) ||
        (m_particle[i] < 0) ||
        (m_particle_ttl[i] <= 0)) {
      rem_particle(i);
      i--;
      continue;
    }
  }

  //DEBUG
  for (i=0;i <m_particle.size(); i++) {
    f = 1.0;
    _color_interpolate(f_max - f*f_del, f_min, f_max, rgb, rgbCur);
    m_rgb_buf1[3*p + 1] = rgbCur[0];
    m_rgb_buf1[3*p + 2] = rgbCur[1];
    m_rgb_buf1[3*p + 3] = rgbCur[2];

  }
  memcpy((void *)(&(m_rgb_buf[0])),
         (const void *)(&(m_rgb_buf1[0])),
         sizeof(unsigned char)*((m_led_count*3) + 1));

  return;

  // make trail
  //
  for (i=0; i<m_particle.size(); i++) {

    if (m_particle_dir[i] == -1) {
      winl = m_particle[i] - m_particle_ttl[i] + (m_particle_max_height);
      winr = m_particle[i] - m_particle_ttl[i] + (2*m_particle_max_height);
    }
    else {
      winl = m_particle[i] + m_particle_ttl[i] - (m_particle_max_height);
      winr = m_particle[i] + m_particle_ttl[i] - (2*m_particle_max_height);
    }
    for (j=0; j<(m_particle_max_height); j++) {
      p = m_particle[i] - m_particle_dir[i]*j;
      if ((p<0) || (p>=m_led_count)) { continue; }
      if (p<=winl) { continue; }
      if (p>=winl) { continue; }

      f = (float)(j)/(float)(m_particle_max_height);

      _color_interpolate(f_max - f*f_del, f_min, f_max, rgb, rgbCur);
      m_rgb_buf1[3*p + 1] = rgbCur[0];
      m_rgb_buf1[3*p + 2] = rgbCur[1];
      m_rgb_buf1[3*p + 3] = rgbCur[2];

    }

  }


  // copy it back to original buffer
  //
  memcpy((void *)(&(m_rgb_buf[0])),
         (const void *)(&(m_rgb_buf1[0])),
         sizeof(unsigned char)*((m_led_count*3) + 1));


}

void inner_light_mode_type::beat_strobe(void) {
  int i, j, p;
  int strobe_size=3, strobe_n =16;

  float w, f, f_del, f_decay = 32.0/255.0, f_min=64.0/255.0, f_max=255.0/255.0;
  unsigned char rgb[3], rgbMin[3], rgbMax[3];
  static float f_cur=0.0;

  f_del = f_max - f_min;

  f_cur -= f_decay;
  if (m_beat_signal) { f_cur = f_max; }
  if (f_cur <= f_min) { f_cur = f_min; }
  if (f_cur >= f_max) { f_cur = f_max; }

  if (m_encoder_pos[0] == 0) {
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

  for (i=0; i<m_led_count; i++) {
    m_rgb_buf[3*i+1] = rgbMin[0];
    m_rgb_buf[3*i+2] = rgbMin[1];
    m_rgb_buf[3*i+3] = rgbMin[2];
  }

	if (!m_beat_signal) { return; }

  for (i=0; i<strobe_n; i++) {
    p = rand()%m_led_count;
    for (j=0; j<strobe_size; j++) {
      if ( (p+j) >= m_led_count ) { break; }
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

/*
int inner_light_mode_type::tick_preset0(void) {
  int i;
  unsigned char r, g, b;
  double p, v, _fhase;

  static int _phase=0;

  m_beat_signal = m_mic_beat_signal;

  if (m_beat_signal)  { _phase = (_phase + 3) % m_led_count; }
  else                { _phase = (_phase+1)%m_led_count; }
  _fhase = (float)_phase / (float)m_led_count;

  for (i=0; i<m_led_count; i++) {
    v = ((double)i/(double)m_led_count);
    p = 3.0*_f_mod(v + _fhase);

    if (p < 1.0) {
      v = p;
      r = (unsigned char)((v)*255.0);
      g = 255 - r;
      b = 0;
    }
    else if (p < 2.0) {
      v = (p-1.0);
      b = (unsigned char)((v)*255.0);
      r = 255 - b;
      g = 0;
    }
    else {
      v = (p-2.0);
      g = (unsigned char)((v)*255.0);
      b = 255 - g;
      r = 0;
    }

    m_rgb_buf[3*i+1] = r;
    m_rgb_buf[3*i+2] = g;
    m_rgb_buf[3*i+3] = b;
  }

  m_frame++;
  m_rgb_buf[0] = m_frame;

  m_beat_signal = 0;
  m_mic_beat_signal = 0;

  return 0;
}
*/

//---

int inner_light_mode_type::tick_solid(void) {
  int i;
  float v;
  unsigned char u;

  v = (float)m_encoder_pos[0] / (float)m_encoder_n;
  u = (unsigned char)(v*255.0);

  for (i=0; i<m_led_count; i++) {
    m_rgb_buf[3*i+1] = u;
    m_rgb_buf[3*i+2] = u;
    m_rgb_buf[3*i+3] = u;
  }

}

int inner_light_mode_type::tick_solid_color(void) {
  int i;
  float v;
  unsigned char u, r, g, b;
  static int _last_button=0, _state=0, _color_param=0;

  if ((_last_button == 0) && (m_encoder_button[0] == 1)) {
    _state = (_state + 1)%2;
  }
  _last_button = m_encoder_button[0];

  // change color
  //
  if (_state == 0) {
    _color_param = m_encoder_pos[0];
  }

  if (_color_param == 0) {
    r = 255;
    g = 255;
    b = 255;
  }
  else {
    v = (float)_color_param / (float)(m_encoder_n-1.0);
    u = (unsigned char)(v*255.0);
    _wheel(u, &r, &g, &b);
  }

  if (_state == 1) {
    v = (float)m_encoder_pos[0] / (float)m_encoder_n;
    r = (unsigned char)((float)r*v);
    g = (unsigned char)((float)g*v);
    b = (unsigned char)((float)b*v);
  }

  for (i=0; i<m_led_count; i++) {
    m_rgb_buf[3*i+1] = r;
    m_rgb_buf[3*i+2] = g;
    m_rgb_buf[3*i+3] = b;
  }

}

int inner_light_mode_type::tick_fill(void) {
  int i, pos_ds = 1, n;
  static int pos = 0;
  static int color_idx, color_idx_n=3;
  static int color_mod=0;
  int color_mod_n=7, color_mod_del=4;
  float f;
  unsigned char rgb[3], rgbprv[3], w;


  pos_ds = m_encoder_pos[0];

  pos += pos_ds;
  n = ( (pos<m_led_count) ? pos : m_led_count );

  f = (float)color_mod*255.0/(float)color_mod_n;
  w = (int)f;
  _wheel(w, &(rgb[0]), &(rgb[1]), &(rgb[2]));

  f = (float)((color_mod+color_mod_n-color_mod_del)%color_mod_n)*255.0/(float)color_mod_n;
  w = (int)f;
  _wheel(w, &(rgbprv[0]), &(rgbprv[1]), &(rgbprv[2]));

  for (i=0; i<n; i++) {
    m_rgb_buf[3*i+1] = rgb[0];
    m_rgb_buf[3*i+2] = rgb[1];
    m_rgb_buf[3*i+3] = rgb[2];
  }
  for (; i<m_led_count; i++) {
    m_rgb_buf[3*i+1] = rgbprv[0];
    m_rgb_buf[3*i+2] = rgbprv[1];
    m_rgb_buf[3*i+3] = rgbprv[2];
  }

  if (pos >= m_led_count) {
    color_mod = (color_mod + color_mod_del) % color_mod_n;
    pos=0;
  }

}

int inner_light_mode_type::tick_strobe(void) {
  int i, j, p;
  int strobe_size=3, strobe_n =4;
  int strobe_delay = 2;
  static int strobe_tick=0;

  float w, f, f_del, f_decay = 32.0/255.0, f_min=64.0/255.0, f_max=255.0/255.0;
  unsigned char rgb[3], rgbMin[3], rgbMax[3];
  static float f_cur=0.0;

  f_del = f_max - f_min;

  f_cur -= f_decay;
  if (m_beat_signal) { f_cur = f_max; }
  if (f_cur <= f_min) { f_cur = f_min; }
  if (f_cur >= f_max) { f_cur = f_max; }

  if (m_encoder_pos[0] == 0) {
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

  for (i=0; i<m_led_count; i++) {
    m_rgb_buf[3*i+1] = rgbMin[0];
    m_rgb_buf[3*i+2] = rgbMin[1];
    m_rgb_buf[3*i+3] = rgbMin[2];
  }

  strobe_tick = (strobe_tick+1)%strobe_delay;
  if (strobe_tick!=0) { return 0; }

  for (i=0; i<strobe_n; i++) {
    p = rand()%m_led_count;
    for (j=0; j<strobe_size; j++) {
      if ( (p+j) >= m_led_count ) { break; }
      m_rgb_buf[3*(p+j)+1] = rgbMax[0];
      m_rgb_buf[3*(p+j)+2] = rgbMax[1];
      m_rgb_buf[3*(p+j)+3] = rgbMax[2];
    }
  }

  return 0;
}

int inner_light_mode_type::tick_pulse(void) {
  int i;
  int pulse_max = 255, pulse_min = 32, pulse_del = 16;
  static int pulse_dir = 1, pulse_x=32;

  static double phase = 0.0;
  double phase_del = 2.0*M_PI/8.0;

  static int init=0;
  static unsigned char rgb[3];
  unsigned char rgbCur[3];
  float w, f, f_min=64.0/255.0, f_max=255.0/255.0, f_del;

  static int _last_button=0, _state=0;
  static float _color_val=0.0;

  f_del = f_max - f_min;

  if (!init) {
    rgb[0] = (unsigned char)f_max*255.0;
    rgb[1] = (unsigned char)f_max*255.0;
    rgb[2] = (unsigned char)f_max*255.0;
    init = 1;
  }

  if ((_last_button == 0) && (m_encoder_button[0] == 1)) {
    _state = (_state + 1)%2;
  }
  _last_button = m_encoder_button[0];

	if (_state == 0) {
		pulse_del = m_encoder_pos[0];
		phase_del = (double)pulse_del / 32.0;
  }
  else {

    if (m_encoder_pos[0] == 0) {
      rgb[0] = (unsigned char)f_max*255.0;
      rgb[1] = (unsigned char)f_max*255.0;
      rgb[2] = (unsigned char)f_max*255.0;
    }
    else {
      w = (float)(m_encoder_pos[0]-1.0)/((float)(m_encoder_n-1));
      _wheel( (unsigned char)(w*255.0), &(rgb[0]), &(rgb[1]), &(rgb[2]));
    }

  }

  phase = _f_mod(phase+phase_del, 0.0, 2.0*M_PI);
  f = (f_del*(sin(phase)+1.0)/2.0) + f_min;


  _color_interpolate( f, f_min, f_max, rgb, rgbCur);

  for (i=0; i<m_led_count; i++) {
    m_rgb_buf[3*i+1] = rgbCur[0];
    m_rgb_buf[3*i+2] = rgbCur[1];
    m_rgb_buf[3*i+3] = rgbCur[2];
  }

  return 0;
}

int inner_light_mode_type::tick_rainbow(void) {
  int i, x;
  int p_del = 1;
  static int p=0;
  unsigned char _p, _r, _g, _b;

  // encoder position sets 'velocity' of
  // rainbow
  //
  p_del = m_encoder_pos[0];

  p = (p+p_del)%255;

  for (i=0; i<m_led_count; i++) {
    x = (i+p)%255;
    _p = (unsigned char)(x);
    _wheel(_p, &_r, &_g, &_b);

    m_rgb_buf[3*i+1] = (unsigned char)_r;
    m_rgb_buf[3*i+2] = (unsigned char)_g;
    m_rgb_buf[3*i+3] = (unsigned char)_b;
  }

  return 0;
}

//--

int inner_light_mode_type::tick_transition(void) {
  int i, to;
  struct timeval tv;
  static int v=0;
  unsigned char r, g, b;

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

  //else if (to == _MODE_TAP_RAIN) {
  //  r = ( v ? 255 : 0 );
  //  g = ( v ? 0: 0 );
  //  b = ( v ? 255 : 0 );
  //}

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

  //else if (to == _MODE_MIC_RAIN) {
  //  r = ( v ? 255 : 255 );
  //  g = ( v ? 0: 255);
  //  b = ( v ? 255: 255  );
  //}

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

  v = 1-v;

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
    //case _MODE_TAP_RAIN:    r = tick_tap_rain();    break;
    //case _MODE_MIC_RAIN:    r = tick_mic_rain();    break;
    case _MODE_TAP_STROBE:  r = tick_tap_strobe();  break;
    case _MODE_MIC_STROBE:  r = tick_mic_strobe();  break;
    case _MODE_FILL:        r = tick_fill();        break;
    case _MODE_STROBE:      r = tick_strobe();      break;
    case _MODE_PULSE:       r = tick_pulse();       break;
    case _MODE_RAINBOW:     r = tick_rainbow();     break;
    case _MODE_TRANSITION:  r = tick_transition();  break;

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

        dm = (bpos - bpos_prev) % _MODE_N;
        dm = (dm + _MODE_N) % _MODE_N;

        mode_next = (m_mode + dm) % _MODE_N;

        printf("changing state.... from %i to %i (dm %i)\n", m_mode, mode_next, dm);

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

int main(int argc, char **argv) {
  float dt;
  int ch;
  int option_index;
  std::string beat_fn, encoder_fn;
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

  std::string led_fn = INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE;

  while ((ch=getopt_long(argc, argv, "vhi:L:n:", _longopt, &option_index)) >= 0) {
    switch(ch) {
      case 0:
        break;
      case 'h':
        show_help_and_exit(stdout);
        break;
      case 'v':
        show_version_and_exit(stdout);
        break;

      case 'i':
        beat_fn = optarg;
        break;

      case 'L':
        led_fn = optarg;
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

  //g_mode.m_led_count = 60*3;
  g_mode.m_led_count = led_count;

  //g_mode.m_led_fn = "/tmp/innerlight.led";
  //g_mode.m_led_fn = INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE;
  g_mode.m_led_fn = led_fn;


  printf("# connecting to mmap file %s (n:%i)\n", g_mode.m_led_fn.c_str(), g_mode.m_led_count);
  ret = g_mode.led_mmap_fn(g_mode.m_led_fn.c_str());
  if (ret < 0) {
    fprintf(stderr, "could not mmap file %s, exiting\n", g_mode.m_led_fn.c_str());
    exit(-1);
  }

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
