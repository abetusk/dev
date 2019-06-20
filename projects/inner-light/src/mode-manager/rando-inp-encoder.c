#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
  int a, b;
  float f_a, f_b;

  a = 0;
  b = 0;
  f_a = 0;
  f_b = 0;

  for (;;) {

    printf("%i %f %i %f\n", a, f_a, b, f_b);
    fflush(stdout);

    a = rand()%2;
    b = rand()%2;

    f_a = (float)rand()/(RAND_MAX+1.0);
    f_b = (float)rand()/(RAND_MAX+1.0);

    sleep(1);
  }
}
