/*
 * License: CC0
 *
 * To the extent possible under law, the person who associated CC0 with
 * this project has waived all copyright and related or neighboring rights
 * to this project.
 *  
 * You should have received a copy of the CC0 legalcode along with this
 * work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

#include <stdio.h>
#include <stdlib.h>
#include <getopt.h>

void print_c(int *c, int n, int *coef) {
  int i;

  int first = -1;

  for (i=0; i<n; i++) {
    if (coef[c[i]] == 0) { continue; }
    if (first < 0) { first = i; }
    if (i>first) { printf("%c", (coef[c[i]] == -1) ? '-' : '+'); }
    else if (coef[c[i]] < 0) { printf("-"); }

    printf("x^%i", i);
  }
  printf("\n");
}

void f(int *c, int idx, int m, int n, int *coef) {
  int i;

  if (idx == n) {
    print_c(c,n, coef);
    return;
  }

  for (i=0; i<m; i++) {
    c[idx] = i;
    f(c,idx+1,m,n,coef);
  }
}

int main(int argc, char **argv) {
  int i, j, k;
  int n = 4;
  int coef[] = {-1, 0, 1}, n_coef = 3;
  int *c_idx;

  if (argc > 1) {
    n = atoi(argv[1]);
  }

  c_idx = (int *)malloc(sizeof(int)*n);

  f(c_idx,0, n_coef, n, coef);

  free(c_idx);

}
