#ifndef INNER_LIGHT_GENERATOR_HPP
#define INNER_LIGHT_GENERATOR_HPP

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

#include "simplexnoise1234.h"

#include "inner-light-generator-config.hpp"

#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "/home/pi/data/innerlight.led"
#define _VERSION "0.1.0"

enum inner_light_mode_state {
  _MODE_SOLID = 0,
  _MODE_SOLID_COLOR,
  _MODE_TAP_PULSE ,
  _MODE_TAP_BULLET,
  _MODE_TAP_STROBE,

  _MODE_NOISE,
  _MODE_FILL,
  _MODE_STROBE,
  _MODE_PULSE,
  _MODE_RAINBOW,

  _MODE_MIC_STROBE,
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

void _rgblerp(unsigned char *rgb_out,  float p, unsigned *rgb_src, unsigned char *rgb_dst);
void _wheel(unsigned char pos, unsigned char *r, unsigned char *g, unsigned char *b);

//---

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
  unsigned char m_fg_rgb[3];
  unsigned char m_bg_rgb[3];

  std::vector< int > m_particle;
  std::vector< int > m_particle_ttl;
  std::vector< int > m_particle_dir;
  int m_particle_v;
  int m_particle_max_height;

  std::vector< unsigned char > m_noise_palette;

  //---

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

  // config file
  //
  inner_light_config_t m_config;

  // parameters for different modes
  //
  float m_beat_pulse_f_cur;

  int m_solid_color_last_button,
      m_solid_color_state,
      m_solid_color_param;

  float m_noise_t;

  int m_fill_pos,
      m_fill_color_mod;

  int m_strobe_tick;
  float m_strobe_f;

  int m_pulse_x,
      m_pulse_init,
      m_pulse_last_button,
      m_pulse_state;
  double m_pulse_phase;

  unsigned char m_pulse_rgb[3];

  int m_rainbow_p;

  int m_transition_v;


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

    // setup default color palette
    //
    m_noise_palette.push_back(23);
    m_noise_palette.push_back(63);
    m_noise_palette.push_back(98);

    m_noise_palette.push_back(91);
    m_noise_palette.push_back(143);
    m_noise_palette.push_back(153);

    m_noise_palette.push_back(250);
    m_noise_palette.push_back(171);
    m_noise_palette.push_back(92);

    m_noise_palette.push_back(191);
    m_noise_palette.push_back(52);
    m_noise_palette.push_back(20);

    m_noise_palette.push_back(133);
    m_noise_palette.push_back(24);
    m_noise_palette.push_back(38);

    m_beat_pulse_f_cur = 0.0;

    m_solid_color_last_button = 0;
    m_solid_color_state = 0;
    m_solid_color_param = 0;

    m_noise_t = 0;

    m_fill_pos = 0;
    m_fill_color_mod = 0;

    m_strobe_tick = 0;
    m_strobe_f = 0;

    m_pulse_dir = 0;
    m_pulse_x = 0;
    m_pulse_init = 0;
    m_pulse_last_button = 0;
    m_pulse_state = 0;
    m_pulse_phase = 0.0;
    m_pulse_rgb[0] = 255;
    m_pulse_rgb[0] = 255;
    m_pulse_rgb[0] = 255;

    m_rainbow_p = 0;

    m_transition_v = 0;

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

  int tick_noise(void);

  int tick_fill(void);
  int tick_strobe(void);
  int tick_pulse(void);
  int tick_rainbow(void);
  int tick_transition(void);

  int tick_tap_pulse(void);
  int tick_mic_pulse(void);
  int tick_tap_bullet(void);
  int tick_mic_bullet(void);
  int tick_tap_strobe(void);
  int tick_mic_strobe(void);

  void beat_pulse(void);
  void beat_bullet(void);
  void beat_strobe(void);

  int update_led(void);
  int process_mic_beat(int);
  int process_encoder(int);

  int process_tap(void);

} inner_light_mode_t;

inner_light_mode_t g_mode;

#endif
