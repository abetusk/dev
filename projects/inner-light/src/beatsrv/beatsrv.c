// gcc beatsrv.c -o beatsrv -lfftw3 -lm
//
// Implemenation of ideas in:
//
//    from http://archive.gamedev.net/archive/reference/programming/features/beatdetection/
//
// real time use:
//
//   micfeed=` pacmd list-sources | grep 'name:' | grep input | grep -o '<.*>' | tr -d '<>' `
//   parec --channels=1 --format=float32le -d $micfeed | ./beatsrv
//
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>
#include <fftw3.h>

#include <math.h>

//---

#define _N 16

// https://stackoverflow.com/a/22059819
//
int _worked_example(void) {
  size_t N;
  fftw_complex in[_N], out[_N], in2[_N]; /* double [2] */
  fftw_plan p, q;
  int i;

  N = _N;

  /* prepare a cosine wave */
  for (i = 0; i < N; i++) {
    in[i][0] = cos(3 * 2*M_PI*i/N);
    in[i][1] = 0;
  }

  /* forward Fourier transform, save the result in 'out' */
  p = fftw_plan_dft_1d(N, in, out, FFTW_FORWARD, FFTW_ESTIMATE);
  fftw_execute(p);
  for (i = 0; i < N; i++)
    printf("freq: %3d %+9.5f %+9.5f I\n", i, out[i][0], out[i][1]);
  fftw_destroy_plan(p);

  /* backward Fourier transform, save the result in 'in2' */
  printf("\nInverse transform:\n");
  q = fftw_plan_dft_1d(N, out, in2, FFTW_BACKWARD, FFTW_ESTIMATE);
  fftw_execute(q);
  /* normalize */
  for (i = 0; i < N; i++) {
    in2[i][0] *= 1./N;
    in2[i][1] *= 1./N;
  }
  for (i = 0; i < N; i++)
    printf("recover: %3d %+9.5f %+9.5f I vs. %+9.5f %+9.5f I\n",
        i, in[i][0], in[i][1], in2[i][0], in2[i][1]);
  fftw_destroy_plan(q);

  fftw_cleanup();
  return 0;
}

//---

// https://stackoverflow.com/a/22059819
//
int _worked_example_repeat(void) {
  size_t N;
  fftw_complex in[_N], out[_N], in2[_N]; /* double [2] */
  fftw_plan p, q;
  int i, it, n_it;

  N = _N;
  n_it=10;

  p = fftw_plan_dft_1d(N, in, out, FFTW_FORWARD, FFTW_ESTIMATE);
  q = fftw_plan_dft_1d(N, out, in2, FFTW_BACKWARD, FFTW_ESTIMATE);

  for (it=0; it<n_it; it++) {

    printf("\n\n\n\n###it %i\n", it);

    /* prepare a cosine wave */
    for (i = 0; i < N; i++) {
      in[i][0] = cos((3.0 * 2.0*M_PI*i/N) + ((double)it*2.0*M_PI/(double)n_it) );
      in[i][1] = 0;
    }

    /* forward Fourier transform, save the result in 'out' */
    fftw_execute(p);
    for (i = 0; i < N; i++)
      printf("freq: %3d %+9.5f %+9.5f I\n", i, out[i][0], out[i][1]);

    /* backward Fourier transform, save the result in 'in2' */
    printf("\nInverse transform:\n");

    fftw_execute(q);

    /* normalize */
    for (i = 0; i < N; i++) {
      in2[i][0] *= 1./N;
      in2[i][1] *= 1./N;
    }
    for (i = 0; i < N; i++)
      printf("recover: %3d %+9.5f %+9.5f I vs. %+9.5f %+9.5f I\n",
          i, in[i][0], in[i][1], in2[i][0], in2[i][1]);
  }

  fftw_destroy_plan(p);
  fftw_destroy_plan(q);

  fftw_cleanup();
  return 0;
}

int gnubeat_energy_rt(FILE *fp) {
  int i, j, k;
  size_t N, _n;
  float _z, z, s_win = 2.2;
  float *v, *V;
  float en, EN, C=1.3;

  uint64_t pos, beg_V=0, count=0, sample_rate = 44100;
  uint64_t E_win = 44032;

  N = (size_t)((double)sample_rate * s_win);
  v = (float *)malloc(sizeof(float)*1024);
  V = (float *)malloc(sizeof(float)*N);

  memset(v, 0, sizeof(float)*1024);
  memset(V, 0, sizeof(float)*N);

  while (1) {
    if (fread(&_z, sizeof(_z), 1, fp)!=1) { break; }
    if (fread(&_z, sizeof(_z), 1, fp)!=1) { break; }

    z = fabs(_z);

    //printf(">> %f %f\n", z, _z);

    v[count % 1024] = z;
    //V[count%N] = z;
    V[count % E_win] = z;

    count++;
    if ((count%1024)==0) {

      for (en=0.0, i=0; i<1024; i++) { en += v[i]*v[i]; }

      //_n = ((count < sample_rate) ? count : N);
      _n = ((count < sample_rate) ? count : E_win);

      if (count > E_win) {

        for (EN=0.0, i=0; i<_n; i++) {
          pos = (i + beg_V) % E_win;
          EN += V[pos]*V[pos];
        }
        EN *= (1024.0/(double)sample_rate);

        beg_V = (beg_V + 1024) % E_win;

        printf("%c e %f C*E %f\n", (en > (C*EN)) ? '!' : ' ', en, EN*C);

      }

    }

  }

  free(v);
  free(V);

}

int gnubeat_energy_adaptive_rt(FILE *fp) {
  int i, j, k, bin_idx;
  size_t N, _n;
  float _z, z, s_win = 2.2;
  float *v, *V, *Ebin;
  float en, EN, C=1.3, Var, _y;
  float alpha = -0.0025714, beta = 1.5142857;

  uint64_t pos, beg_V=0, count=0, sample_rate = 44100;
  uint64_t E_win = 44032;

  N = (size_t)((double)sample_rate * s_win);
  v = (float *)malloc(sizeof(float)*1024);
  V = (float *)malloc(sizeof(float)*N);

  Ebin = (float *)malloc(sizeof(float)*43);

  memset(v, 0, sizeof(float)*1024);
  memset(V, 0, sizeof(float)*N);
  memset(Ebin, 0, sizeof(float)*43);

  while (1) {
    if (fread(&_z, sizeof(_z), 1, fp)!=1) { break; }

    z = fabs(_z);

    //printf(">> %f %f\n", z, _z);

    v[count % 1024] = z;
    //V[count%N] = z;
    V[count % E_win] = z;

    count++;
    if ((count%1024)==0) {

      for (en=0.0, i=0; i<1024; i++) { en += v[i]*v[i]; }

      //_n = ((count < sample_rate) ? count : N);
      //_n = ((count < sample_rate) ? count : E_win);

      if (count > E_win) {

        bin_idx = 0;
        memset(Ebin, 0, sizeof(float)*43);

        for (EN=0.0, i=0; i<E_win; i++) {
          pos = (i + beg_V) % E_win;
          _y = V[pos]*V[pos];
          EN += _y;
          Ebin[bin_idx] += _y;
          if (((i+1)%1024)==0) { bin_idx++; }
        }
        EN *= (1024.0/(double)sample_rate);

        for (Var = 0.0, i=0; i<43; i++) {
          Var += (Ebin[i] - EN)*(Ebin[i] - EN);
        }
        Var /= 43.0;

        C = alpha*Var + beta;

        beg_V = (beg_V + 1024) % E_win;

        printf("%c e %f C*E (%f*%f = %f)\n", (en > (C*EN)) ? '!' : ' ', en, C, EN, EN*C);

      }

    }

  }

  free(v);
  free(V);
  free(Ebin);

}

//---

void _complex_example(void) {
  size_t N;
  fftw_complex *in, *out;
  fftw_plan p;

  N = 1024;

  in = (fftw_complex*) fftw_malloc(sizeof(fftw_complex) * N);
  out = (fftw_complex*) fftw_malloc(sizeof(fftw_complex) * N);
  p = fftw_plan_dft_1d(N, in, out, FFTW_FORWARD, FFTW_ESTIMATE);

  /* repeat as needed */
  fftw_execute(p);

  fftw_destroy_plan(p);
  fftw_free(in);
  fftw_free(out);
}

/*
fftw_plan fftw_plan_dft_r2c_1d(int n, double *in, fftw_complex *out, unsigned flags);
fftw_plan fftw_plan_dft_c2r_1d(int n, fftw_complex *in, double *out, unsigned flags);

fftw_plan fftw_plan_r2r_1d(int n, double *in, double *out,
                           fftw_r2r_kind kind, unsigned flags);
fftw_plan fftw_plan_r2r_2d(int n0, int n1, double *in, double *out,
                           fftw_r2r_kind kind0, fftw_r2r_kind kind1,
                           unsigned flags);
fftw_plan fftw_plan_r2r_3d(int n0, int n1, int n2,
                           double *in, double *out,
                           fftw_r2r_kind kind0,
                           fftw_r2r_kind kind1,
                           fftw_r2r_kind kind2,
                           unsigned flags);
fftw_plan fftw_plan_r2r(int rank, const int *n, double *in, double *out,
                        const fftw_r2r_kind *kind, unsigned flags);
*/

int main(int argc, char **argv) {
  //_worked_example_repeat();
  gnubeat_energy_rt(stdin);
}
