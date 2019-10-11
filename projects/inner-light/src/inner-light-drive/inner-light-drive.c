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
#include <getopt.h>

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <stdint.h>
#include <signal.h>

#include <sys/mman.h>
#include <sys/time.h>

#include "clk.h"
#include "gpio.h"
#include "dma.h"
#include "pwm.h"
#include "version.h"

#include "ws2811.h"

#define NBUF 8192

#define INNER_LIGHT_DRIVE_VERSION "0.1.1"

#define INNER_LIGHT_DEFAULT_CONFIG_FILE "./innerlight.ini"

#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "./innerlight.led"
//#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "/home/pi/data/innerlight.led"

#define INNER_LIGHT_DRIVER_DEFAULT_PID_FILE "./inner-light-drive.pid"

#define _DEFAULT_NUM_LED 180

// defaults for cmdline options
//
#define TARGET_FREQ             WS2811_TARGET_FREQ
#define GPIO_PIN                18
#define DMA                     10

//#define STRIP_TYPE            WS2811_STRIP_RGB    // WS2812/SK6812RGB integrated chip+leds
#define STRIP_TYPE              WS2811_STRIP_GBR    // WS2812/SK6812RGB integrated chip+leds
//#define STRIP_TYPE            SK6812_STRIP_RGBW    // SK6812RGBW (NOT SK6812RGB)


volatile sig_atomic_t g_reload = 0;

char *g_config_fn = NULL;
char *g_led_fn=NULL;
char *g_pid_fn=NULL;

unsigned char *g_led_map;

int LED_COUNT = _DEFAULT_NUM_LED;
int LED_COUNT_PRV = _DEFAULT_NUM_LED;

int g_verbose_level = 0;

ws2811_t ledstring =
{
    .freq = TARGET_FREQ,
    .dmanum = DMA,
    .channel =
    {
        [0] =
        {
            .gpionum = GPIO_PIN,
            .count = 0,
            .invert = 0,
            .brightness = 255,
            .strip_type = STRIP_TYPE,
        },
        [1] =
        {
            .gpionum = 0,
            .count = 0,
            .invert = 0,
            .brightness = 0,
        },
    },
};

int _reload(void);

static void _init(void) {
  ledstring.channel[0].count = LED_COUNT;
}

void _clear(void) {
  int i;
  for (i=0; i<LED_COUNT; i++) {
    ledstring.channel[0].leds[i] = 0;
  }
}

void _render(unsigned char *rgb, size_t n_led) {
  size_t idx;
  ws2811_led_t x;

  uint32_t u32, t32;

  for (idx=0; idx<n_led; idx++) {

    u32 = 0;
    t32 = (uint32_t)rgb[3*idx+1];
    u32 |= (t32 << 0);

    t32 = (uint32_t)rgb[3*idx+2];
    u32 |= (t32 << 8);

    t32 = (uint32_t)rgb[3*idx+3];
    u32 |= (t32 << 16);

    ledstring.channel[0].leds[idx] = (ws2811_led_t)u32;

  }
}

int create_led_file(char *fn, size_t n_led) {
  int i;
  unsigned char u, rgb[3];
  FILE *fp=NULL;

  fp = fopen(fn, "w");
  if (!fp) { return -1; }

  u=0;
  rgb[0] = 0;
  rgb[1] = 0;
  rgb[2] = 0;

  fwrite(&u, 1, 1, fp);
  for (i=0; i<n_led; i++) {
    fwrite(rgb, 3, 1, fp);
  }

  fclose(fp);
}

int64_t tv_del(struct timeval *tv0, struct timeval *tv1) {
  int64_t dt = 0;

  dt = (int64_t)(tv0->tv_sec - tv1->tv_sec);
  dt *= 1000000;
  dt += (int64_t)(tv0->tv_usec - tv1->tv_usec);

  return dt;
}

void print_led_map(unsigned char *led_map, size_t n_led, int c) {
  int i;
  float f;

  printf("%02x:", (unsigned char)led_map[0]);
  for (i=0; i<n_led; i++) {

    if ((i%c)==0) { printf("\n"); }
    printf(" %02x%02x%02x",
        (unsigned char)(led_map[3*i+1]),
        (unsigned char)(led_map[3*i+2]),
        (unsigned char)(led_map[3*i+3]));

  }

  printf("\n");
}

int _main(unsigned char *led_map, size_t n_led) {
  int r;
  int64_t dt, sleep_usec;
  struct timeval tv_beg, tv_end;

  unsigned char frame=1;

  int64_t count=0, print_every=30;

  ws2811_return_t led_ret;
  ws2811_led_t *ws281x_buf;

  _init();

  led_ret = ws2811_init(&ledstring);
  if (led_ret != WS2811_SUCCESS) {
    fprintf(stderr, "ws2811_init failed %s\n", ws2811_get_return_t_str(led_ret));
    return led_ret;
  }

  // 1 sec
  //sleep_usec = 1*1000000;

  sleep_usec = 1000000 / 30;


  for (;;) {

    if (g_reload) {
      g_reload=0;
      r = _reload();
      if (r < 0) { break; }
    }

    gettimeofday(&tv_beg, NULL);


    _render(led_map, n_led);

    led_ret = ws2811_render(&ledstring);
    if (led_ret != WS2811_SUCCESS) {
      fprintf(stderr, "ws2811_render failed: %s\n", ws2811_get_return_t_str(led_ret));
      return led_ret;
    }


    gettimeofday(&tv_end, NULL);
    dt = tv_del(&tv_end, &tv_beg);

    if (g_verbose_level > 0) {
      if ((count % print_every)==0) {
        print_led_map(led_map, n_led, 20);
      }
    }
    count++;

    if (dt < sleep_usec) {
      usleep( (useconds_t)(sleep_usec - dt) );
      if (g_verbose_level > 2) {
        printf("slept for %lli\n", (long long int)(sleep_usec - dt));
      }
    }
  }

}

//---

static int _parse_kv(char *_key, char *_val, char *_line, int nmax) {
  const char *chp=NULL, *chp_tok=NULL;
  int _ki=0, _vi=0, _li=0;

  if (nmax < 1) { return -1; }

  chp = _line;
  chp_tok = strchr(chp, '=');
  if (!chp_tok) { return -1; }

  _key[0] = '\0';
  _val[0] = '\0';

  for ( ; chp != chp_tok; chp++) {


    if ((_ki+1) >= nmax) { return -2; }

    _key[_ki++] = *chp;
    _key[_ki] = '\0';
  }

  for (chp = (chp_tok+1); *chp ; chp++) {

    if ((_vi+1) >= nmax) { return -3; }

    if (*chp == '\n') { continue; }
    _val[_vi++] = *chp;
    _val[_vi] = '\0';
  }

  return 0;
}


int load_config(char *fn) {
  FILE *fp;
  int ch, r, ret=0;
  unsigned char rgb[3];

  char *line=NULL, *_key=NULL, *_val=NULL;
  int _li=0;

  line = (char *)malloc(sizeof(char)*NBUF);
  _key = (char *)malloc(sizeof(char)*NBUF);
  _val = (char *)malloc(sizeof(char)*NBUF);

  line[0]='\0';
  _key[0]='\0';
  _val[0]='\0';

  fp = fopen(fn, "r");
  if (!fp) { ret=-1; goto _load_config_free_exit; }

  while (!feof(fp)) {
    ch = fgetc(fp);
    if ((ch==EOF) || (ch=='\n')) {
      if (_li == 0) { continue; }
      if (line[0] == '#') { continue; }

      r = _parse_kv(_key, _val, line, NBUF);
      if (r!=0) { ret = -2; break; }

      if ( strncmp(_key, "count_led", NBUF-1) == 0 ) {
        r = atoi(_val);
        if ((r<1) || (r>1000)) {
          fprintf(stderr, "load_config: 'count_led' = %i, param out of bounds\n", r);
          ret = -1;
          break;
        }
        LED_COUNT = r;
      }

      _li = 0;
      line[_li] = '\0';

      continue;
    }

    if ((_li + 1) >= NBUF) { ret=-3; goto _load_config_free_exit; }
    line[_li++] = ch;
    line[_li] = '\0';
  }

  fclose(fp);

_load_config_free_exit:
  if (line) { free(line); }
  if (_key) { free(_key); }
  if (_val) { free(_val); }

  return ret;
}




//---

struct option _longopt[] = {
  {"help", no_argument, 0, 'h'},
  {0,0,0,0},
};

void show_version(FILE *fp) {
  fprintf(fp, "version %s\n", INNER_LIGHT_DRIVE_VERSION);
}

void show_help(FILE *fp) {
  fprintf(fp, "Usage: inner-light-drive [-L ledfn] [-n numled] [-h] [-v]\n");
  fprintf(fp, "\n");
  fprintf(fp, "  -n <nled>      number of leds (default to %i)\n", _DEFAULT_NUM_LED);
  fprintf(fp, "  -c <configfn>  config file (default %s)\n", INNER_LIGHT_DEFAULT_CONFIG_FILE);
  fprintf(fp, "  -L <ledfile>   LED file (default %s)\n", INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE);
  fprintf(fp, "  -p <pidfile>   file containing pid (default %s)\n", INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE);
  fprintf(fp, "  -C             create LED file and exit (default %s)\n", INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE);
  fprintf(fp, "  -F             force creation of LED file (default is to use pre-existing)\n");
  fprintf(fp, "  -h             help (this screen)\n");
  fprintf(fp, "  -v             increase verbose level\n");
  fprintf(fp, "  -V             show version\n");
  fprintf(fp, "\n");
}

int write_pid_file(char *fn) {
  FILE *fp;
  pid_t pid;

  pid = getpid();

  fp = fopen(fn, "w");
  if (fp==NULL) { return -1; }
  fprintf(fp, "%i", (int)pid);
  fclose(fp);
}

int _reload(void) {
  int r;

  r = load_config(g_config_fn);
  if (r<0) {
    fprintf(stderr, "inner-light-drive: _reload: error loading config %s, got %i\n", g_config_fn, r);
    return r;
  }

  if (g_verbose_level>0) {
    printf("inner-light-drive: _reload: LED_COUNT now %i\n", LED_COUNT);
  }

  if (LED_COUNT != LED_COUNT_PRV) {
    ledstring.channel[0].count = LED_COUNT;
  }
  LED_COUNT_PRV = LED_COUNT;

  return r;
}

void sighup_handler(int signo) {
  if (signo == SIGHUP) { g_reload = 1; }
}

int load_ledmap(unsigned char **led_map, int led_map_len) {
  int led_map_fd, r;

  // map our .led file to our memroy
  //
  led_map_fd = open(g_led_fn, O_RDWR);
  if (led_map_fd<0) {
    fprintf(stderr, "ERROR: opening file %s, got errno:%i\n", g_led_fn, errno);
    return -1;
  }

  r = fchmod(led_map_fd, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH );
  if (r != 0) { perror("fchmod"); return r; }

  *led_map = mmap(NULL, led_map_len, PROT_NONE | PROT_READ | PROT_WRITE | PROT_EXEC, MAP_SHARED, led_map_fd, 0);

  if (*led_map == MAP_FAILED) {
    fprintf(stderr, "failed\n");
    return -1;
  }

  if (*led_map == NULL) {
    fprintf(stderr, "ERROR: could not map file (fd:%i), got errno:%i, exiting\n",
        led_map_fd, errno);
    return -1;
  }

  return 0;
}

int main(int argc, char **argv) {
  int led_map_fd, r;
  unsigned char *led_map;
  size_t led_map_len;
  int n_led;
  int option_index, ch;

  int create_and_exit=0;
  int force_create = 0;

  n_led = -1;

  while ((ch=getopt_long(argc, argv, "Vhn:L:CvFc:p:", _longopt, &option_index)) >= 0) {
    switch (ch) {
      case 'L':
        g_led_fn = strdup(optarg);
        break;
      case 'c':
        g_config_fn = strdup(optarg);
        break;
      case 'p':
        g_pid_fn = strdup(optarg);
        break;

      case 'n':
        n_led = atoi(optarg);
        LED_COUNT = n_led;
        break;
      case 'F':
        force_create=1;
        break;
      case 'C':
        create_and_exit=1;
        break;
      case 'v':
        g_verbose_level++;
        break;
      case 'V':
        show_version(stdout);
        exit(0);
        break;
      case 'h':
        show_help(stdout);
        exit(0);
        break;
      default:
        show_help(stderr);
        exit(-1);
        break;
    }
  }

  // n_led is taken from the config file.
  // If the command line n_led is set, prefer that over the config
  // file option.
  // If either is not set, default set above.
  //

  r = load_config(g_config_fn);

  if (r==0) {
    if (n_led < 0) {
      n_led = LED_COUNT;
    }
  }
  else {
    if (n_led<0) {
      n_led = _DEFAULT_NUM_LED;
    }
  }

  if (n_led < 1) {
    fprintf(stderr, "n_led must be greater than 0 (%i)\n", n_led);
    show_help(stderr);
    exit(-1);
  }

  printf("# n_led: %i, LED_COUNT: %i\n", n_led, LED_COUNT);

  signal(SIGHUP, sighup_handler);

  if (!g_led_fn) { g_led_fn = strdup(INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE); }
  led_map_len = 1 + (3*n_led);

  if (!g_config_fn) { g_config_fn = strdup(INNER_LIGHT_DEFAULT_CONFIG_FILE); }

  if (!g_pid_fn) { g_pid_fn = strdup(INNER_LIGHT_DRIVER_DEFAULT_PID_FILE); }

  // Just create the .led file and exit
  //
  if (create_and_exit==1) {

    create_led_file(g_led_fn, n_led);

    if (g_verbose_level>0) {
      printf("created %s (n_led %i), exiting\n", g_led_fn, (int)n_led);
    }

    free(g_led_fn);
    free(g_config_fn);
    exit(0);
  }

  // Force the creation of the .led file on startup
  //
  if (force_create) {
    create_led_file(g_led_fn, n_led);
  }

  // Only if we're actually doing a persistent run, write the pid file
  //
  r = write_pid_file(g_pid_fn);
  if (r<0) {
    fprintf(stderr, "could not write pid file '%s', ignoring\n", g_pid_fn);
  }


  // map our .led file to our memroy
  //
  led_map_fd = open(g_led_fn, O_RDWR);
  if (led_map_fd<0) {
    fprintf(stderr, "ERROR: opening file %s, got errno:%i\n", g_led_fn, errno);
    exit(-1);
  }

  r = fchmod(led_map_fd, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH );
  if (r != 0) { perror("fchmod"); return r; }

  led_map = mmap(NULL, led_map_len, PROT_NONE | PROT_READ | PROT_WRITE | PROT_EXEC, MAP_SHARED, led_map_fd, 0);

  if (led_map == MAP_FAILED) { fprintf(stderr, "failed\n"); exit(-1); }

  if (led_map == NULL) {
    fprintf(stderr, "ERROR: could not map file (fd:%i), got errno:%i, exiting\n",
        led_map_fd, errno);
    exit(-1);
  }

  if (g_verbose_level) { printf("starting\n"); }

  // start our main loop
  //
  _main(led_map, n_led);

  // cleanup after exit
  //
  munmap(led_map, led_map_len);

  if (g_led_fn) { free(g_led_fn); }
  if (g_config_fn) { free(g_config_fn); }
  if (g_pid_fn) { free(g_pid_fn); }
}
