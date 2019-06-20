#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
  int count=0, nmod;
  nmod = 32;
  for (;;) {

    if ((count % nmod)==0) { printf("!"); }
    else { printf(" "); }
    printf("  ...................\n");
    fflush(stdout);

    usleep(10000);
    count++;
  }
}
