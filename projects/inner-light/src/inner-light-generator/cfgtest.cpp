#include "inner-light-generator.hpp"

int main(int argc, char ** argv) {
  std::string fn, ofn;
  int r;
  inner_light_config_t cfg;

  if (argc < 3) {
    printf("provide config file\n");
    exit(-1);
  }

  fn = argv[1];
  ofn = argv[2];

  r = cfg.load_config(fn);

  r = cfg.write_config(ofn);

  printf(">> got %i\n", r);
}
