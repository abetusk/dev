#ifndef INNER_LIGHT_GENERATOR_CONFIG_HPP
#define INNER_LIGHT_GENERATOR_CONFIG_HPP

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

typedef struct inner_light_config_type {

  float m_tap_bpm;
  int m_count_led;
  std::vector<int> m_map;

  //--

  unsigned char m_solid_rgb[3];

  std::vector<unsigned char> m_noise_palette;
  float m_noise_speed;

  float m_rainbow_speed;

  //--

  unsigned char m_tap_pulse_fg[3];
  unsigned char m_tap_pulse_bg[3];

  unsigned char m_tap_bullet_fg[3];
  unsigned char m_tap_bullet_bg[3];

  unsigned char m_tap_strobe_fg[3];
  unsigned char m_tap_strobe_bg[3];

  //--

  unsigned char m_mic_pulse_fg[3];
  unsigned char m_mic_pulse_bg[3];

  unsigned char m_mic_bullet_fg[3];
  unsigned char m_mic_bullet_bg[3];

  unsigned char m_mic_strobe_fg[3];
  unsigned char m_mic_strobe_bg[3];

  //--

  float m_fill_speed;

  unsigned char m_strobe_fg[3];
  unsigned char m_strobe_bg[3];
  float m_strobe_speed;

  unsigned char m_pulse_fg[3];
  unsigned char m_pulse_bg[3];
  float m_pulse_speed;

  int assign_key_value(std::string &_key, std::string &_val);
  int load_config(std::string &fn);
  int write_config(std::string &fn);

  inner_light_config_type(void) {
    m_tap_bpm = 120.0;
    m_count_led = 190;
    m_solid_rgb[0] = 0xff;
    m_solid_rgb[1] = 0xff;
    m_solid_rgb[2] = 0xff;

    m_noise_speed = 120;
    m_noise_palette.push_back(0xe8); m_noise_palette.push_back(0xbb); m_noise_palette.push_back(0xc9);
    m_noise_palette.push_back(0x9a); m_noise_palette.push_back(0x3e); m_noise_palette.push_back(0x82);
    m_noise_palette.push_back(0x8c); m_noise_palette.push_back(0xd1); m_noise_palette.push_back(0xe0);
    m_noise_palette.push_back(0x22); m_noise_palette.push_back(0x4a); m_noise_palette.push_back(0x8e);
    m_noise_palette.push_back(0xd5); m_noise_palette.push_back(0x77); m_noise_palette.push_back(0x3d);

    m_rainbow_speed = 120;

    m_tap_pulse_fg[0] = 0xff; m_tap_pulse_fg[1] = 0xff; m_tap_pulse_fg[2] = 0xff;
    m_tap_pulse_bg[0] = 0x00; m_tap_pulse_bg[1] = 0x00; m_tap_pulse_bg[2] = 0x00;

    m_tap_bullet_fg[0] = 0xff; m_tap_bullet_fg[1] = 0xff; m_tap_bullet_fg[2] = 0xff;
    m_tap_bullet_bg[0] = 0x00; m_tap_bullet_bg[1] = 0x00; m_tap_bullet_bg[2] = 0x00;

    m_tap_strobe_fg[0] = 0xff; m_tap_strobe_fg[1] = 0xff; m_tap_strobe_fg[2] = 0xff;
    m_tap_strobe_bg[0] = 0x00; m_tap_strobe_bg[1] = 0x00; m_tap_strobe_bg[2] = 0x00;

    m_mic_pulse_fg[0] = 0xff; m_mic_pulse_fg[1] = 0xff; m_mic_pulse_fg[2] = 0xff;
    m_mic_pulse_bg[0] = 0x00; m_mic_pulse_bg[1] = 0x00; m_mic_pulse_bg[2] = 0x00;

    m_mic_bullet_fg[0] = 0xff; m_mic_bullet_fg[1] = 0xff; m_mic_bullet_fg[2] = 0xff;
    m_mic_bullet_bg[0] = 0x00; m_mic_bullet_bg[1] = 0x00; m_mic_bullet_bg[2] = 0x00;

    m_mic_strobe_fg[0] = 0xff; m_mic_strobe_fg[1] = 0xff; m_mic_strobe_fg[2] = 0xff;
    m_mic_strobe_bg[0] = 0x00; m_mic_strobe_bg[1] = 0x00; m_mic_strobe_bg[2] = 0x00;

    m_fill_speed = 100;

    m_strobe_fg[0] = 0xff; m_strobe_fg[1] = 0xff; m_strobe_fg[2] = 0xff;
    m_strobe_bg[0] = 0xff; m_strobe_bg[1] = 0xff; m_strobe_bg[2] = 0xff;
    m_strobe_speed = 100;

    m_pulse_fg[0] = 0xff; m_pulse_fg[1] = 0xff; m_pulse_fg[2] = 0xff;
    m_pulse_bg[0] = 0xff; m_pulse_bg[1] = 0xff; m_pulse_bg[2] = 0xff;
    m_pulse_speed = 100;
  }

} inner_light_config_t;

#endif
