#include <stdio.h>
#include <stdlib.h>

int n=48;

int pwmSin[]={
  511, 444, 379, 315, 256, 200, 150, 106,
   68,  39,  17,   4,   0,   4,  17,  39,
   68, 106, 150, 200, 256, 315, 379, 444,
  511, 578, 643, 707, 767, 822, 872, 916,
  954, 983,1005,1018,1022,1018,1005, 983,
  954, 916, 872, 822, 767, 707, 643, 578,
  511
};

int main(int argc, char **argv) {
  int i, *x;
  double a;

  a = 0.5;
  x = (int *)malloc(sizeof(int)*(n+1));

  for (i=0; i<n; i++) {
    x[i] = (int)(a*(double)pwmSin[i]);
  }
  x[n] = (int)(a*(double)pwmSin[n]);

  printf("int pwmSin[]={");
  for (i=0; i<n; i++) {
    if ((i%8)==0) {
      printf("\n  ");
    }
    printf("%4i,", x[i]);
  }
  printf("\n  %4i", x[n]);
  printf("\n};\n");


  free(x);
}
