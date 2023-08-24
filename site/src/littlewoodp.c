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

#include <string.h>
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

void print_rand_llp(int *p, int n_coef, int n, int *coef) {
  int i, c;

  for (i=0; i<n; i++) {
    c = (int)( ((double)n_coef) * rand() / (RAND_MAX + 1.0) );
    p[i] = c;
    //printf(">> [%i] %i\n", i, p[i]);
  }

  print_c(p, n, coef);
}

void show_usage(FILE *fp) {
  fprintf(fp, "\nusage:\n\n    littlewoodp [help] n [m]\n");
  fprintf(fp, "\n");
  fprintf(fp, "  n    degree of polynomial\n");
  fprintf(fp, "  m    number of polynomials to print (default:-1 enumerate all)\n");
  fprintf(fp, "  help show this screen\n");
  fprintf(fp, "\n");
}

int main(int argc, char **argv) {
  int i, j, k;
  int n = -1, m = -1;
  int coef[] = {-1, 0, 1}, n_coef = 3;
  int *c_idx;

  int it;

  long unsigned int sl = 5;

  int seed = 123;

  if (argc > 1) {

    if (strncmp(argv[1], "help", sl)==0) {
      show_usage(stdout);
      exit(0);
    }

    n = atoi(argv[1]);

    if (argc > 2) {
      m = atoi(argv[2]);

      if (argc > 3) {
        seed = (unsigned int)atoi(argv[3]);
      }
    }
  }
  else {
    show_usage(stderr);
    exit(-1);
  }

  if (seed >= 0) {
    srand((unsigned int)seed);
  }
  else {
    //...
  }

  c_idx = (int *)malloc(sizeof(int)*n);

  if (m<0) {
    f(c_idx,0, n_coef, n, coef);
  }
  else {


    for (it=0; it<m; it++) {
      //printf("%i ??\n", it);
      print_rand_llp(c_idx, n_coef, n, coef);
    }
  }

  free(c_idx);

}
