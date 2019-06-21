// test program to touch the innerlight.led memory mapped file for debugging
//
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#include <sys/mman.h>

#include <getopt.h>
#include <unistd.h>
#include <errno.h>

#include <vector>
#include <string>


#define INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE "/tmp/innerlight.led"
#define _DEFAULT_NUM_LED 180
#define _VERSION "0.1.0"


struct option _longopt[] = {
  {"help", no_argument, 0, 'h'},

  {0,0,0,0}
};

void show_help_and_exit(FILE *fp) {
  fprintf(fp, "help...\n");
  if (fp==stdout) { exit(0); }
  exit(1);
}

void show_version_and_exit(FILE *fp) {
  fprintf(fp, "%s\n", _VERSION);
  if (fp==stdout) { exit(0); }
  exit(1);
}



int main(int argc, char **argv) {
  int i;
  int led_map_fd;
  std::string led_fn;
  size_t n_led=0, led_map_len;

  int ch, opt_idx;
  unsigned char *led_map;

  while ((ch = getopt_long(argc, argv, "hvi:n:", _longopt, &opt_idx)) >= 0) {
    switch (ch) {
      case 0:
        break;
      case 'h':
        show_help_and_exit(stdout);
        break;
      case 'v':
        show_version_and_exit(stdout);
        break;
      case 'n':
        n_led = atoi(optarg);
        break;
      case 'i':
        led_fn = optarg;
        break;
      default:
        show_help_and_exit(stderr);
        break;
    }
  }

  if (led_fn.size() == 0) {
    if (optind < argc) {
      led_fn = argv[optind];
    }
    else {
      led_fn = INNER_LIGHT_DRIVER_DEFAULT_MAP_FILE;
    }
  }

  if (n_led==0) {
    n_led = _DEFAULT_NUM_LED;
  }

  led_map_len = n_led*3+1;

  led_map_fd = open(led_fn.c_str(), O_RDWR);
  if (led_map_fd < 0) {
    fprintf(stderr, "error opening %s, errno:%i\n", led_fn.c_str(), errno);
    exit(-1);
  }

  led_map = (unsigned char *)mmap(NULL, led_map_len, PROT_NONE | PROT_READ | PROT_WRITE | PROT_EXEC, MAP_SHARED, led_map_fd, 0);

  if (led_map == MAP_FAILED) { fprintf(stderr, "failed\n"); exit(-1); }
  if (led_map == NULL) {
    fprintf(stderr, "ERROR: could not map file (fd:%i), got errno:%i, exiting\n",
      led_map_fd, errno);
    exit(-1);
  }

  led_map[0] = 1;
  for (i=0; i<n_led; i++) {
    led_map[3*i+1] = (unsigned char)(i%255);
    led_map[3*i+2] = (unsigned char)(i%255);
    led_map[3*i+3] = (unsigned char)(i%255);
  }


  printf(">>> %s, %i\n", led_fn.c_str(), (int)n_led);


  munmap(led_map, led_map_len);
  close(led_map_fd);
}
