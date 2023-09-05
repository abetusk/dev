//
// LICENSE: CC0
//
#include <stdio.h>
#include <stdlib.h>

#include <stdint.h>

void _printM(int *M, int n) {
  int i, j;

  printf("M[%i][%i]:\n", n, n);
  for (j=0; j<n; j++) {
    for (i=0; i<n; i++) {
      printf(" %2i", M[ j*n + i ]);
    }
    printf("\n");
  }
  printf("\n\n");
}

int checkM(int *A, int *B, int n) {
  int i, j;

  for (i=0; i<n; i++) {
    for (j=0; j<n; j++) {
      if (A[j*n + i] != B[j*n + i]) { return -1; }
    }
  }
  return 0;
}

int main(int argc, char **argv) {
  int i, j, k, ii, jj;
  int *B, *Bcheck, *M, s;
  int n, n_b;

  srand(123);

  s = 3;
  n = 16;
  n_b = n - s + 1;

  Bcheck = (int *)malloc(sizeof(int)*n_b*n_b);
  B = (int *)malloc(sizeof(int)*n_b*n_b);
  M = (int *)malloc(sizeof(int)*n*n);


  for (j=0; j<n; j++) {
    for (i=0; i<n; i++) {
      M[ j*n + i ] = rand()%100;
    }
  }

  _printM(M, n);

  for (j=0; j<n_b; j++) {
    for (i=0; i<n_b; i++) {

      Bcheck[ j*n_b + i ] = 0;
      for (jj=j; jj<(j+s); jj++) {
        for (ii=i; ii<(i+s); ii++) {
          Bcheck[ j*n_b + i ] += M[ jj*n + ii ];
        }
      }
    }
  }

  B[0] = 0;
  for (j=0; j<s; j++) {
    for (i=0; i<s; i++) {
      B[0] += M[ j*n + i];
    }
  }

  for (i=1; i<n_b; i++) {
    B[ 0*n_b + i ] = B[ 0*n_b + (i-1) ];
    for (j=0; j<s; j++) {
      B[ 0*n_b + i ] += M[ j*n + (i+s-1) ] - M[ j*n + (i-1) ];
    }
  }

  for (j=1; j<n_b; j++) {
    B[ j*n_b + 0 ] = B[ (j-1)*n_b + 0 ];
    for (i=0; i<s; i++) {
      B[ j*n_b + 0 ] += M[ (j+s-1)*n + i ] - M[ (j-1)*n + i ];
    }
  }

  for (j=1; j<n_b; j++) {
    for (i=1; i<n_b; i++) {
      B[ j*n_b + i ] = 0
        + B[ (j-1)*n_b + i ]
        + B[     j*n_b + (i-1) ]
        - B[ (j-1)*n_b + (i-1) ]
        + M[ (j  -1)*n + (i  -1) ]
        - M[ (j+s-1)*n + (i  -1) ]
        - M[ (j  -1)*n + (i+s-1) ]
        + M[ (j+s-1)*n + (i+s-1) ];
    }
  }


  printf("Bcheck...\n");
  _printM(Bcheck, n_b);

  printf("B...\n");
  _printM(B, n_b);

  printf(">>> %i\n", checkM(Bcheck, B, n_b));

}
