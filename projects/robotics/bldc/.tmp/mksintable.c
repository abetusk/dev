#include <stdio.h>
#include <stdlib.h>
#include <math.h>
//#define M_PI 3.14159265358979323846


int main(int argc, char **argv) {
  int i, n, ch;

  n = 512 + 256;
  printf("#define TABLE_SIZE %i\n", n);

  printf("#define OFFSET_0 0\n");
  printf("#define OFFSET_1 %i\n", n/3);
  printf("#define OFFSET_2 %i\n", 2*n/3);

  printf("\n\nbyte pwmSin[] = {\n");
  for (i=0; i<n; i++) {
    if ((i%16) == 0) { printf("\n  "); }

    if (i<(n-1)) { ch = ','; }
    else { ch = '\n'; }
    printf("%4i%c", (int)(255.0*((sin(-2.0*M_PI*(double)i/(double)n) + 1.0)/2.0)), ch);
  }
  printf("\n};\n");
}


