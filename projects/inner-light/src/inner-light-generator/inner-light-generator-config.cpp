#include "inner-light-generator-config.hpp"

//---

static int _parse_kv(std::string &_key, std::string &_val, std::string &_line) {
  const char *chp=NULL, *chp_tok=NULL;

  chp = _line.c_str();
  chp_tok = strchr(chp, '=');
  if (!chp_tok) { return -1; }

  _key.clear();
  _val.clear();

  for ( ; chp != chp_tok; chp++) {
    _key += *chp;
  }

  chp = chp_tok+1;

  for (chp = (chp_tok+1); *chp ; chp++) {
    if (*chp == '\n') { continue; }
    _val += *chp;
  }

  return 0;
}

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

static int _parse_hex2rgb(unsigned char *rgb, std::string &_hex) {
  int i, p;
  unsigned int v, d;
  size_t n;
  std::string hx;

  n = _hex.size();

  for (p=0; p<n; p++) {
    if (((_hex[p] >= '0') && (_hex[p] <= '9')) ||
        ((_hex[p] >= 'a') && (_hex[p] <= 'f')) ||
        ((_hex[p] >= 'A') && (_hex[p] <= 'F'))) {
      if ((_hex[p] >= 'A') && (_hex[p] <= 'F')) {
        hx += _hex[p] - 'A' + 'a';
      }
      else {
        hx += _hex[p];
      }
    }
  }

  if ((hx.size() != 3) && (hx.size() != 6)) { return -1; }

  if (hx.size() == 3) {
    for (p=0; p<3; p++) {
      d=0;
      if ((hx[p] >= '0') && (hx[p] <= '9')) { d += hx[p] - '0'; }
      else { d += hx[p] - 'a' + 10; }
      v += 16*d;
      rgb[p] = (unsigned char)v;
    }

  }
  else if (hx.size() == 6) {
    for (p=0; p<6; p+=2) {

      v = 0;
      d = 0;
      if ((hx[p+1] >= '0') && (hx[p+1] <= '9')) { d += hx[p+1] - '0'; }
      else { d += hx[p+1] - 'a' + 10; }
      v += d;

      d = 0;
      if ((hx[p] >= '0') && (hx[p] <= '9')) { d += hx[p] - '0'; }
      else { d += hx[p] - 'a' + 10; }
      v += 16*d;

      rgb[p/2] = (unsigned char)v;

    }
  }

  //printf("... : %s -> %s (%02x %02x %02x)\n", _hex.c_str(), hx.c_str(), rgb[0], rgb[1], rgb[2]);

  return 0;
}

int inner_light_config_t::assign_key_value(std::string &_key, std::string &_val) {
  size_t n;
  int i;
  std::vector< std::string > var_a;
  unsigned char rgb[3];

  if (_key == "count_led") {
    m_count_led = atoi(_val.c_str());
  }
  else if (_key == "map") {
    var_a.clear();
    _parse_array(var_a, _val, ',');
    m_map.clear();
    for (i=0; i<var_a.size(); i++) {
      m_map.push_back(atoi(var_a[i].c_str()));
    }
  }
  else if (_key == "tap_bpm") {
    m_tap_bpm = atof(_val.c_str());
  }

  //--

  else if (_key == "mic_bullet.fg") {
    _parse_hex2rgb(m_mic_bullet_fg, _val);
  }
  else if (_key == "mic_bullet.bg") {
    _parse_hex2rgb(m_mic_bullet_bg, _val);
  }

  else if (_key == "mic_pulse.fg") {
    _parse_hex2rgb(m_mic_pulse_fg, _val);
  }
  else if (_key == "mic_pulse.bg") {
    _parse_hex2rgb(m_mic_pulse_bg, _val);
  }

  else if (_key == "mic_strobe.fg") {
    _parse_hex2rgb(m_mic_strobe_fg, _val);
  }
  else if (_key == "mic_strobe.bg") {
    _parse_hex2rgb(m_mic_strobe_bg, _val);
  }

  //--

  else if (_key == "tap_bullet.fg") {
    _parse_hex2rgb(m_tap_bullet_fg, _val);
  }
  else if (_key == "tap_bullet.bg") {
    _parse_hex2rgb(m_tap_bullet_bg, _val);
  }

  else if (_key == "tap_pulse.fg") {
    _parse_hex2rgb(m_tap_pulse_fg, _val);
  }
  else if (_key == "tap_pulse.bg") {
    _parse_hex2rgb(m_tap_pulse_bg, _val);
  }

  else if (_key == "tap_strobe.fg") {
    _parse_hex2rgb(m_tap_strobe_fg, _val);
  }
  else if (_key == "tap_strobe.bg") {
    _parse_hex2rgb(m_tap_strobe_bg, _val);
  }

  //--

  else if (_key == "noise.palette") {
    _parse_array(var_a, _val, ',');


    m_noise_palette.clear();
    for (i=0; i<var_a.size(); i++) {
      _parse_hex2rgb(rgb, var_a[i]);

      m_noise_palette.push_back(rgb[0]);
      m_noise_palette.push_back(rgb[1]);
      m_noise_palette.push_back(rgb[2]);

      n = m_noise_palette.size();

      printf("##-> %02x %02x %02x\n",
          m_noise_palette[n-3],
          m_noise_palette[n-2],
          m_noise_palette[n-1]);
    }

  }
  else if (_key == "noise.speed") {
    m_noise_speed = atof(_val.c_str());
  }

  //--

  else if (_key == "fill.speed") {
    m_fill_speed = atof(_val.c_str());
  }

  else if (_key == "pulse.fg") {
    _parse_hex2rgb(m_pulse_fg, _val);
  }
  else if (_key == "pulse.bg") {
    _parse_hex2rgb(m_pulse_bg, _val);
  }
  else if (_key == "pulse.speed") {
    m_pulse_speed = atof(_val.c_str());
  }

  else if (_key == "solid_color.color") {
    _parse_hex2rgb(m_solid_rgb, _val);
  }

  else if (_key == "solid.color") {
    // ignore
  }

  else if (_key == "rainbow.speed") {
    m_rainbow_speed = atof(_val.c_str());
  }

  else if (_key == "strobe.fg") {
    _parse_hex2rgb(m_strobe_fg, _val);
  }
  else if (_key == "strobe.bg") {
    _parse_hex2rgb(m_strobe_bg, _val);
  }
  else if (_key == "strobe.speed") {
    m_strobe_speed = atof(_val.c_str());
  }

  return 0;
}

int inner_light_config_t::load_config(std::string &fn) {
  FILE *fp;
  int ch, r, ret=0;
  unsigned char rgb[3];

  std::string line, _key, _val;

  fp = fopen(fn.c_str(), "r");
  if (!fp) { return -1; }

  while (!feof(fp)) {
    ch = fgetc(fp);
    if ((ch==EOF) || (ch=='\n')) {
      if (line.size() == 0) { continue; }
      if (line[0] == '#') { continue; }


      r = _parse_kv(_key, _val, line);
      if (r!=0) { ret = -2; break; }

      //printf("got '%s' '%s'\n", _key.c_str(), _val.c_str());

      r = assign_key_value(_key, _val);
      //printf("... got %i\n", r);

      //if (_key == "mic_pulse.fg") { _parse_hex2rgb(rgb, _val); }

      line.clear();
      continue;
    }

    line.push_back(ch);
  }

  fclose(fp);

  return ret;
}

//---

static void _rgb2str(std::string &_str, unsigned char *rgb) {
  char buf[33];

  snprintf(buf, 32, "%02x%02x%02x", rgb[0], rgb[1], rgb[2]);
  buf[32]='\0';
  _str = buf;
}

static void _rgbv2str(std::string &_str, std::vector< unsigned char > &rgbv) {
  int i;
  char buf[33];

  _str.clear();
  for (i=0; i<rgbv.size(); i+=3) {
    snprintf(buf, 32, "%02x%02x%02x", rgbv[i], rgbv[i+1], rgbv[i+2]);
    buf[32]='\0';
    if (i>0) { _str += ","; }
    _str += buf;
  }
}

static void _iv2str(std::string &_str, std::vector< int > &v) {
  int i;
  char buf[33];

  _str.clear();
  for (i=0; i<v.size(); i++) {
    snprintf(buf, 32, "%i", v[i]);
    buf[32]='\0';
    if (i>0) { _str += ","; }
    _str += buf;
  }
}

static void _f2str(std::string &_str, float f) {
  char buf[33];
  snprintf(buf, 32, "%f", f);
  buf[32]='\0';
  _str = buf;
}

static void _i2str(std::string &_str, int v) {
  char buf[33];

  snprintf(buf, 32, "%i", v);
  buf[32]='\0';
  _str = buf;
}


int inner_light_config_t::write_config(std::string &ofn) {
  FILE *fp;
  std::string line, s;

  fp = fopen(ofn.c_str(), "w");
  if (!fp) { return -1; }

  fprintf(fp, "tap_bpm=%f\n", m_tap_bpm);
  fprintf(fp, "count_led=%i\n", m_count_led);
  _iv2str(s, m_map);
  fprintf(fp, "map=%s\n", s.c_str());

  _rgb2str(s, m_solid_rgb);
  fprintf(fp, "solid_color.color=%s\n", s.c_str());

  _rgbv2str(s, m_noise_palette);
  fprintf(fp, "noise.palette=%s\n", s.c_str());
  fprintf(fp, "noise.speed=%f\n", m_noise_speed);

  _rgb2str(s, m_tap_pulse_fg);
  fprintf(fp, "tap_pulse.fg=%s\n", s.c_str());
  _rgb2str(s, m_tap_pulse_bg);
  fprintf(fp, "tap_pulse.bg=%s\n", s.c_str());

  _rgb2str(s, m_tap_bullet_fg);
  fprintf(fp, "tap_bullet.fg=%s\n", s.c_str());
  _rgb2str(s, m_tap_bullet_bg);
  fprintf(fp, "tap_bullet.bg=%s\n", s.c_str());

  _rgb2str(s, m_tap_strobe_fg);
  fprintf(fp, "tap_strobe.fg=%s\n", s.c_str());
  _rgb2str(s, m_tap_strobe_bg);
  fprintf(fp, "tap_strobe.bg=%s\n", s.c_str());

  _rgb2str(s, m_mic_pulse_fg);
  fprintf(fp, "mic_pulse.fg=%s\n", s.c_str());
  _rgb2str(s, m_mic_pulse_bg);
  fprintf(fp, "mic_pulse.bg=%s\n", s.c_str());

  _rgb2str(s, m_mic_bullet_fg);
  fprintf(fp, "mic_bullet.fg=%s\n", s.c_str());
  _rgb2str(s, m_mic_bullet_bg);
  fprintf(fp, "mic_bullet.bg=%s\n", s.c_str());

  _rgb2str(s, m_mic_strobe_fg);
  fprintf(fp, "mic_strobe.fg=%s\n", s.c_str());
  _rgb2str(s, m_mic_strobe_bg);
  fprintf(fp, "mic_strobe.bg=%s\n", s.c_str());

  fprintf(fp, "rainbow.speed=%f\n", m_rainbow_speed);

  fprintf(fp, "fill.speed=%f\n", m_fill_speed);

  _rgb2str(s, m_strobe_fg);
  fprintf(fp, "strobe.fg=%s\n", s.c_str());
  _rgb2str(s, m_strobe_bg);
  fprintf(fp, "strobe.bg=%s\n", s.c_str());
  fprintf(fp, "strobe.speed=%f\n", m_strobe_speed);

  _rgb2str(s, m_pulse_fg);
  fprintf(fp, "pulse.fg=%s\n", s.c_str());
  _rgb2str(s, m_pulse_bg);
  fprintf(fp, "pulse.bg=%s\n", s.c_str());
  fprintf(fp, "pulse.speed=%f\n", m_pulse_speed);


  fclose(fp);

  return 0;
}
