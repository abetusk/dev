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
