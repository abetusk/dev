//
// LICENSE: CC0
//
#include <stdio.h>
#include <stdlib.h>

#include <stdint.h>

void _printM3(int *M, int n) {
  int x,y,z;

  printf("M[%i][%i][%i]:\n", n, n, n);

  for (z=0; z<n; z++) {
    for (y=0; y<n; y++) {
      for (x=0; x<n; x++) {
        printf(" %2i", M[ z*n*n + y*n + x ]);
      }
      printf("\n");
    }
    printf("\n");
  }
  printf("\n\n");
}

int checkM3(int *A, int *B, int n) {
  int x, y, z;

  for (z=0; z<n; z++) {
    for (y=0; y<n; y++) {
      for (x=0; x<n; x++) {
        if (A[ z*n*n + y*n + x] != B[ z*n*n + y*n + x]) { return -1; }
      }
    }
  }
  return 0;
}

int sum_dp3(int *B, int *M, int n, int s) {
  int i, j, c_idx;
  int x, y, z, xx, yy, zz;
  int n_b = n-s+1;

  //              0  1  2  3  4  5  6  7
  //              +  -  +  +  -  +  +  -
  int coef[8] = { 1,-1, 1, 1,-1, 1, 1,-1 };

  int d_idx[8][3] = {
    { -1, -1, -1 },
    { -1, -1,  0 },
    { -1,  0, -1 },
    { -1,  0,  0 },
    {  0, -1, -1 },
    {  0, -1,  0 },
    {  0,  0, -1 },
    {  0,  0,  0 }
  };


  for (i=0; i<8; i++) {
    printf(" %i: %2i {%2i,%2i,%2i}\n", i, coef[i],
        d_idx[i][0], d_idx[i][1], d_idx[i][2]);
  }
  printf("\n");

  // init initial B
  //

  B[0] = 0;
  for (z=0; z<s; z++) {
    for (y=0; y<s; y++) {
      for (x=0; x<s; x++) {
        B[0] += M[ z*n*n + y*n + x ];
      }
    }
  }

  //WIP

  return 0;


  for (z=1; z<n_b; z++) {
    for (y=1; y<n_b; y++) {
      for (x=1; x<n_b; x++) {

        for (c_idx=0; c_idx<8; c_idx++) {
          xx = x + d_idx[c_idx][0];
          yy = y + d_idx[c_idx][1];
          zz = z + d_idx[c_idx][2];
          B[ z*n_b*n_b + y*n_b + x ] += coef[c_idx]*B[ zz*n_b*n_b + yy*n_b + xx ];

          xx = x - 1 - s*d_idx[c_idx][0];
          yy = y - 1 - s*d_idx[c_idy][1];
          zz = z - 1 - s*d_idx[c_idx][2];
          B[ z*n_b*n_b + y*n_b + x ] += -coef[c_idx]*M[ zz*n*n + yy*n*n + xx ];

        }

      }
    }
  }
}

int main(int argc, char **argv) {
  int zz, yy, xx;
  int i, j, k, ii, jj;
  int x, y, z;
  int *B, *Bcheck, *M, s;
  int n, n_b;

  srand(123);

  s = 3;
  n = 6;
  n_b = n - s + 1;

  Bcheck = (int *)malloc(sizeof(int)*n_b*n_b*n_b);
  B = (int *)malloc(sizeof(int)*n_b*n_b*n_b);
  M = (int *)malloc(sizeof(int)*n*n*n);


  for (z=0; z<n; z++) {
    for (y=0; y<n; y++) {
      for (x=0; x<n; x++) {
        M[ z*n*n + y*n + x ] = rand()%100;
      }
    }
  }

  printf(">>>M\n");
  _printM3(M, n);

  for (z=0; z<n_b; z++) {
    for (y=0; y<n_b; y++) {
      for (x=0; x<n_b; x++) {

        Bcheck[ z*n_b*n_b + y*n_b + x ] = 0;
        for (zz=z; zz<(z+s); zz++) {
          for (yy=y; yy<(y+s); yy++) {
            for (xx=x; xx<(x+s); xx++) {
              Bcheck[ z*n_b*n_b + y*n_b + x ] += M[ zz*n*n + yy*n + xx ];
            }
          }
        }

      }
    }
  }

  printf(">>>Bcheck\n");
  _printM3(Bcheck, n_b);

  sum_dp3(B,M,n,s);

  exit(0);

  // initial  setup

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
  _printM3(Bcheck, n_b);

  printf("B...\n");
  _printM3(B, n_b);

  printf(">>> %i\n", checkM3(Bcheck, B, n_b));

}
