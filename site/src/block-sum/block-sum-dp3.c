//
// LICENSE: CC0
//
#include <stdio.h>
#include <stdlib.h>

#include <stdint.h>

void _printM3(int *M, int n) {
  int x,y,z;

  printf("[%i][%i][%i]:\n", n, n, n);

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
  int bx,by,bz,mx,my,mz;
  int n_b = n-s+1;

  //              0  1  2  3  4  5  6  7
  //              +  -  -  +  -  +  +  -
  int coef[8] = { 1,-1,-1, 1,-1, 1, 1,-1 };

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


  // init boundaries of B
  //

  // first 0,0,0
  // O( s * s )
  //
  B[0] = 0;
  for (z=0; z<s; z++) {
    for (y=0; y<s; y++) {
      for (x=0; x<s; x++) {
        B[0] += M[ z*n*n + y*n + x ];
      }
    }
  }

  // z axis init
  // O( n_b * s * s )
  //
  x = 0;
  y = 0;
  for (z=1; z<n_b; z++) {
    B[ z*n_b*n_b + y*n_b + x ] = B[ (z-1)*n_b*n_b + y*n_b + x ];
    for (yy=0; yy<s; yy++) {
      for (xx=0; xx<s; xx++) {
        B[ z*n_b*n_b + y*n_b + x ] += M[ (z+s-1)*n*n + yy*n + xx ] - M[ (z-1)*n*n + yy*n + xx ];
      }
    }
  }

  // y axis init
  // O( n_b * s * s )
  //
  x = 0;
  z = 0;
  for (y=1; y<n_b; y++) {
    B[ z*n_b*n_b + y*n_b + x ] = B[ z*n_b*n_b + (y-1)*n_b + x ];
    for (zz=0; zz<s; zz++) {
      for (xx=0; xx<s; xx++) {
        B[ z*n_b*n_b + y*n_b + x ] += M[ zz*n*n + (y+s-1)*n + xx ] - M[ zz*n*n + (y-1)*n + xx ];
      }
    }
  }

  // x axis init
  // O( n_b * s * s )
  //
  y = 0;
  z = 0;
  for (x=1; x<n_b; x++) {
    B[ z*n_b*n_b + y*n_b + x ] = B[ z*n_b*n_b + y*n_b + (x-1) ];
    for (zz=0; zz<s; zz++) {
      for (yy=0; yy<s; yy++) {
        B[ z*n_b*n_b + y*n_b + x ] += M[ zz*n*n + yy*n + (x+s-1) ] - M[ zz*n*n + yy*n + (x-1) ];
      }
    }
  }

  // xy,z=0 plane init
  // O( n_b * n_b * s )
  //
  z = 0;
  for (y=1; y<n_b; y++) {
    for (x=1; x<n_b; x++) {
      B[ z*n_b*n_b + y*n_b + x ] = 
          B[ z*n_b*n_b + (y-1)*n_b + x     ]
        + B[ z*n_b*n_b + (y  )*n_b + (x-1) ]
        - B[ z*n_b*n_b + (y-1)*n_b + (x-1) ];

      for (zz=0; zz<s; zz++) {
        B[ z*n_b*n_b + y*n_b + x ] +=
            M[ zz*n*n +   (y-1)*n +   (x-1) ]
          - M[ zz*n*n + (y+s-1)*n +   (x-1) ]
          - M[ zz*n*n +   (y-1)*n + (x+s-1) ]
          + M[ zz*n*n + (y+s-1)*n + (x+s-1) ];

      }
    }
  }

  // xz, y=0 plane init
  // O( n_b * n_b *s )
  //
  y = 0;
  for (z=1; z<n_b; z++) {
    for (x=1; x<n_b; x++) {
      B[ z*n_b*n_b + y*n_b + x ] = 
          B[ (z-1)*n_b*n_b + y*n_b + x     ]
        + B[   (z)*n_b*n_b + y*n_b + (x-1) ]
        - B[ (z-1)*n_b*n_b + y*n_b + (x-1) ];

      for (yy=0; yy<s; yy++) {
        B[ z*n_b*n_b + y*n_b + x ] +=
            M[   (z-1)*n*n + yy*n +   (x-1) ]
          - M[ (z+s-1)*n*n + yy*n +   (x-1) ]
          - M[   (z-1)*n*n + yy*n + (x+s-1) ]
          + M[ (z+s-1)*n*n + yy*n + (x+s-1) ];

      }
    }
  }

  // yz, x=0 plane init
  // O( n_b * n_b *s )
  //
  x = 0;
  for (z=1; z<n_b; z++) {
    for (y=1; y<n_b; y++) {
      B[ z*n_b*n_b + y*n_b + x ] = 
          B[ (z-1)*n_b*n_b +   (y)*n_b + x ]
        + B[   (z)*n_b*n_b + (y-1)*n_b + x ]
        - B[ (z-1)*n_b*n_b + (y-1)*n_b + x ];

      for (xx=0; xx<s; xx++) {
        B[ z*n_b*n_b + y*n_b + x ] +=
            M[   (z-1)*n*n +   (y-1)*n + xx ]
          - M[ (z+s-1)*n*n +   (y-1)*n + xx ]
          - M[   (z-1)*n*n + (y+s-1)*n + xx ]
          + M[ (z+s-1)*n*n + (y+s-1)*n + xx ];

      }
    }
  }



  // rest of the grid.
  //
  // O( n_b * n_b * n_b )
  //

  for (z=1; z<n_b; z++) {
    for (y=1; y<n_b; y++) {
      for (x=1; x<n_b; x++) {

        B[ z*n_b*n_b + y*n_b + x ] = 0;
        for (c_idx=0; c_idx<8; c_idx++) {
          bx = x + d_idx[c_idx][0];
          by = y + d_idx[c_idx][1];
          bz = z + d_idx[c_idx][2];

          if (c_idx < 7) {
            B[ z*n_b*n_b + y*n_b + x ] += coef[c_idx]*B[ bz*n_b*n_b + by*n_b + bx ];
          }

          xx = x - 1 + s*(d_idx[c_idx][0]+1);
          yy = y - 1 + s*(d_idx[c_idx][1]+1);
          zz = z - 1 + s*(d_idx[c_idx][2]+1);

          B[ z*n_b*n_b + y*n_b + x ] += -coef[c_idx]*M[ zz*n*n + yy*n + xx ];

          //debug
          /*
          printf("B[%i][%i][%i] += %cB[%i][%i][%i]{%i} %c M[%i][%i][%i]{%i} ==> {...%i}\n",
              x,y,z,
              (coef[c_idx] > 0) ? '+' : '-',
              bx,by,bz,
              B[ bz*n_b*n_b + by*n_b + bx ],
              (coef[c_idx] < 0) ? '+' : '-',
              xx,yy,zz,
              M[ zz*n*n + yy*n + xx ],
              B[ z*n_b*n_b + y*n_b + x ]);
              */


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

  s = 16;
  n = 128;
  n_b = n - s + 1;

  Bcheck = (int *)malloc(sizeof(int)*n_b*n_b*n_b);
  B = (int *)malloc(sizeof(int)*n_b*n_b*n_b);
  M = (int *)malloc(sizeof(int)*n*n*n);

  for (z=0; z<n_b; z++) {
    for (y=0; y<n_b; y++) {
      for (x=0; x<n_b; x++) {
        Bcheck[z*n_b*n_b + y*n_b + x ] = -1;
        B[z*n_b*n_b + y*n_b + x ] = -100000;
      }
    }
  }



  for (z=0; z<n; z++) {
    for (y=0; y<n; y++) {
      for (x=0; x<n; x++) {
        M[ z*n*n + y*n + x ] = rand()%100;
      }
    }
  }

  //printf(">>>M\n");
  //_printM3(M, n);

  printf("bcheck start\n"); fflush(stdout);

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

  printf("bcheck end\n"); fflush(stdout);

  //printf(">>>Bcheck\n");
  //_printM3(Bcheck, n_b);

  //printf(">>>>B (before)\n");
  //_printM3(B, n_b);

  printf("B start\n"); fflush(stdout);
  sum_dp3(B,M,n,s);
  printf("B end\n"); fflush(stdout);

  //printf(">>>>B\n");
  //_printM3(B, n_b);

  printf("check: %i\n", checkM3(Bcheck, B, n_b));


}
