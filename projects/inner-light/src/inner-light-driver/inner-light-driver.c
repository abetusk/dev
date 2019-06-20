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


#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "/tmp/innerlight.led"
#define _DEFAULT_NUM_LED 180

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

  sleep_usec = 1*1000000;


  for (;;) {

    printf("...\n");

    gettimeofday(&tv_beg, NULL);

    print_led_map(led_map, n_led, 20);


    gettimeofday(&tv_end, NULL);
    dt = tv_del(&tv_end, &tv_beg);

    if (dt < sleep_usec) {
      usleep( (useconds_t)(sleep_usec - dt) );
      printf("slept for %lli\n", (long long int)(sleep_usec - dt));
    }
  }


}

int main(int argc, char **argv) {
  int led_map_fd;
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
