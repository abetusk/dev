#include <stdio.h>
#include <stdlib.h>

#include <getopt.h>
#include <unistd.h>

#include <string>
#include <vector>

#define _VERSION "0.1.0"

struct option _longopt[] = {
  {"help", no_argument, 0, 'h'},
  {0,0,0,0},
};

void show_help_and_exit(FILE *fp) {
  fprintf(fp, "help...\n");
  if (fp==stdin) { exit(0); }
  exit(1);
}

void show_version_and_exit(FILE *fp) {
  fprintf(fp, "version %s\n", _VERSION);
  if (fp==stdin) { exit(0); }
  exit(1);
}

int main(int argc, char **argv) {
  int ch;
  int option_index;
  std::string ifn;

  while ((ch=getopt_long(argc, argv, "vhi:", _longopt, &option_index)) >= 0) {
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
        ifn = optarg;
        break;

      default:
        show_help_and_exit(stderr);
        break;
    }
  }

  if (optind < argc) {
    ifn = argv[optind];
  }

}
