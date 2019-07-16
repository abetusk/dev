#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
  int astep=0, bstep=0, abutton=0, bbutton=0;
  int nstep = 20;

  for (;;) {

    astep = rand()%nstep;
    bstep = rand()%nstep;
    abutton = rand()%2;
    bbutton = rand()%2;


    printf("%i %i %i %i\n",
        astep, bstep,
        abutton, bbutton);
    fflush(stdout);

    sleep(1);
  }
}
