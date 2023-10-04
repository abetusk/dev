//
// LICENSE: CC0
//


#include <stdio.h>
#include <stdlib.h>

int pos2cell(int x,int y,int z, int n) {
  return z*n*n + y*n + x;
}

int cell2pos(int *x, int *y, int *z, int cell, int n) {

  *x = cell % n;
  cell -= *x;
  cell /= n;

  *y = cell % n;
  cell -= *y;
  cell /= n;

  *z = cell;

  return 0;
}

int check_cellpos(int n) {
  int x, y, z, cell;
  int _x, _y, _z;
 
  for (z=0; z<n; z++) {
    for (y=0; y<n; y++) {
      for (x=0; x<n; x++) {

        cell = pos2cell(x,y,z,n);
        cell2pos(&_x, &_y, &_z, cell, n);

        if ((x!=_x) || (y!=_y) || (z!=_z)) {
          return -1;
        }

      }
    }
  }

  return 0;
}

void printM(int *M, int n) {
  int x, y, z, cell;

  for (z=0; z<n; z++) {
    for (y=0; y<n; y++) {
      for (x=0; x<n; x++) {

        cell = pos2cell(x,y,z,n);

        printf(" %2i", M[cell]);
      }
      printf("\n");
    }
    printf("\n");
  }

}

int main(int argc, char **argv) {
  int x, y, z, cell;
  int _x, _y, _z;

  int s, n, n_b;
  int r;

  int id=0;

  int *M;

  s = 5;
  n = 7;
  n_b = n-s;


  M = (int *)malloc(sizeof(int)*n*n*n);
  for (cell=0; cell<(n*n*n); cell++) {
    //M[cell] = cell % 100;
    M[cell] = -1;
  }

  M[ pos2cell(0,0,0,n) ] = id++;
  M[ pos2cell(s,0,0,n) ] = id++;
  M[ pos2cell(0,s,0,n) ] = id++;
  M[ pos2cell(0,0,s,n) ] = id++;
  M[ pos2cell(0,s,s,n) ] = id++;
  M[ pos2cell(s,0,s,n) ] = id++;
  M[ pos2cell(s,s,0,n) ] = id++;
  M[ pos2cell(s,s,s,n) ] = id++;

  for (x=1; x<s; x++) {
    M[ pos2cell(x, 0, 0, n) ] = id+0;
    M[ pos2cell(x, s, 0, n) ] = id+1;
    M[ pos2cell(x, 0, s, n) ] = id+2;
    M[ pos2cell(x, s, s, n) ] = id+3;
  }
  id+=4;

  for (y=1; y<s; y++) {
    M[ pos2cell(0, y, 0, n) ] = id+0;
    M[ pos2cell(0, y, s, n) ] = id+1;
    M[ pos2cell(s, y, 0, n) ] = id+2;
    M[ pos2cell(s, y, s, n) ] = id+3;
  }
  id+=4;

  for (z=1; z<s; z++) {
    M[ pos2cell(0, 0, z, n) ] = id+0;
    M[ pos2cell(0, s, z, n) ] = id+1;
    M[ pos2cell(s, 0, z, n) ] = id+2;
    M[ pos2cell(s, s, z, n) ] = id+3;
  }
  id+=4;

  for (x=1; x<s; x++) {
    for (y=1; y<s; y++) {
      M[ pos2cell(x,y,0,n) ] = id+0;
      M[ pos2cell(x,y,s,n) ] = id+1;
    }
  }
  id+=2;

  for (x=1; x<s; x++) {
    for (z=1; z<s; z++) {
      M[ pos2cell(x,0,z,n) ] = id+0;
      M[ pos2cell(x,s,z,n) ] = id+1;
    }
  }
  id+=2;

  for (y=1; y<s; y++) {
    for (z=1; z<s; z++) {
      M[ pos2cell(0,y,z,n) ] = id+0;
      M[ pos2cell(s,y,z,n) ] = id+1;
    }
  }
  id+=2;

  for (z=1; z<s; z++) {
    for (y=1; y<s; y++) {
      for (x=1; x<s; x++) {
        M[ pos2cell(x,y,z,n) ] = id;
      }
    }
  }
  id++;

  printM(M, n);

}
