#include <stdio.h>
#include <stdlib.h>

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <stdint.h>

#include <sys/mman.h>
#include <sys/time.h>



#include "clk.h"
#include "gpio.h"
#include "dma.h"
#include "pwm.h"
#include "version.h"

#include "ws2811.h"

//#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "/tmp/innerlight.led"
#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "/home/pi/data/innerlight.led"
#define _DEFAULT_NUM_LED 180


// defaults for cmdline options
#define TARGET_FREQ             WS2811_TARGET_FREQ
#define GPIO_PIN                18
#define DMA                     10
//#define STRIP_TYPE            WS2811_STRIP_RGB		// WS2812/SK6812RGB integrated chip+leds
#define STRIP_TYPE              WS2811_STRIP_GBR		// WS2812/SK6812RGB integrated chip+leds
//#define STRIP_TYPE            SK6812_STRIP_RGBW		// SK6812RGBW (NOT SK6812RGB)

#define LED_COUNT               (60*3)

int g_verbose_level = 1;

ws2811_t ledstring =
{
    .freq = TARGET_FREQ,
    .dmanum = DMA,
    .channel =
    {
        [0] =
        {
            .gpionum = GPIO_PIN,
            .count = LED_COUNT,
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

  if (rgb[0] == 1) {
    printf("!! mid update? skipping\n");
    return;
  }

  for (idx=0; idx<n_led; idx++) {

    u32 = 0;
    t32 = (uint32_t)rgb[3*idx+1];
    u32 |= (t32 << 0);

    t32 = (uint32_t)rgb[3*idx+2];
    u32 |= (t32 << 8);

    t32 = (uint32_t)rgb[3*idx+3];
    u32 |= (t32 << 16);

    ledstring.channel[0].leds[idx] = (ws2811_led_t)u32;

    //x = (ws2811_led_t)((uint32_t)rgb[3*idx+1]);
    //ledstring.channel[0].leds[idx] = x;
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
  int64_t dt, sleep_usec;
  struct timeval tv_beg, tv_end;

  unsigned char frame=1;

  int64_t count=0, print_every=30;

  ws2811_return_t led_ret;
  ws2811_led_t *ws281x_buf;

  led_ret = ws2811_init(&ledstring);
  if (led_ret != WS2811_SUCCESS) {
    fprintf(stderr, "ws2811_init failed %s\n", ws2811_get_return_t_str(led_ret));
    return led_ret;
  }


  // 1 sec
  //sleep_usec = 1*1000000;

  sleep_usec = 1000000 / 30;


  for (;;) {

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

int main(int argc, char **argv) {
  int led_map_fd, r;
  unsigned char *led_map;
  size_t led_map_len, n_led;

  char *led_fn=NULL;

  if (!led_fn) { led_fn = strdup(INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE); }
  n_led = _DEFAULT_NUM_LED;
  led_map_len = 1 + (3*n_led);

  //!!!!
  create_led_file(led_fn, n_led);

  led_map_fd = open(led_fn, O_RDWR);
  if (led_map_fd<0) {
    fprintf(stderr, "ERROR: opening file %s, got errno:%i\n", led_fn, errno);
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

  printf("starting\n");

  _main(led_map, n_led);


  munmap(led_map, led_map_len);
  free(led_fn);
}
