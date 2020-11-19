// License: CC0
//

#include <Adafruit_NeoPixel.h>

#define LED_PIN    6
#define N_DIGIT 10
#define N_DIGIT_LED 20
#define LED_COUNT (N_DIGIT_LED * N_DIGIT)

#define START_CHAR '!'

// end char is inclusive
//
#define END_CHAR '~'

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

//
//  a         b
//    f     d
// g     e      c
//    h     i
// m     k      p
//     l   j
//   n        o
//
// start, length, direction
uint8_t digit_segment[] = {

  // a          b          c
  0, 1, 1,   1, 1, 1,   2, 2, 1,

  // d          e          f
  4, 1, 1,   5, 1, 1,   6, 1, 1,

  // g          h          i
  7, 2, 1,   9, 1, 1,  10, 1, 1,

  //  j          k         l
  11, 1, 1,  12, 1, 1, 13, 1, 1,

  //  m          n         o
  14, 2, 1,  16, 1, 1, 17, 1, 1,

  // p
  18, 2, 1
};

uint16_t char_seg_map_start[] = {
0 , // en // !
2 , // ce // "
4 , // cehiknop // #
12 , // abeghiknop // $
22 , // adefghiklop // %
33 , // aefhjmno // &
41 , // e // '
42 , // dko // (
45 , // fkn // )
48 , // defhijkl // *
56 , // ehik // +
60 , // l // ,
61 , // ih // -
63 , // n // .
64 , // dl // /
66 , // abcdglmnop // 0
76 , // cdp // 1
79 , // abchimno // 2
87 , // abcinop // 3
94 , // cghip // 4
99 , // abghjno // 5
106 , // abghimnop // 6
115 , // abcp // 7
119 , // abcghimnop // 8
129 , // abcghip // 9
136 , // ek // :
138 , // el // ;
140 , // dj // <
142 , // ihno // =
146 , // fl // >
148 , // abcik // ?
153 , // abcegimno // @
162 , // abcghimp // A
170 , // abceiknop // B
179 , // abgmno // C
185 , // abceknop // D
193 , // abghmno // E
200 , // abghm // F
205 , // abgimnop // G
213 , // cghimp // H
219 , // abekno // I
225 , // cmnop // J
230 , // dghjm // K
235 , // gmno // L
239 , // cdfgmp // M
245 , // cfgjmp // N
251 , // abcgmnop // O
259 , // abcghim // P
266 , // abcgjmnop // Q
275 , // abcghijm // R
283 , // abghinop // S
291 , // abek // T
295 , // cgmnop // U
301 , // dglm // V
305 , // cgjlmp // W
311 , // dfjl // X
315 , // cghinop // Y
322 , // abdlno // Z
328 , // beko // [
332 , // fj // backslash
334 , // aekn // ]
338 , // lj // ^
340 , // no // _
342 , // f // `
343 , // hikmno // a
349 , // ghimnop // b
356 , // hmn // c
359 , // cikop // d
364 , // hlmno // e
369 , // behik // f
374 , // aeghkn // g
380 , // ghkm // h
384 , // k // i
385 , // ekmn // j
389 , // dejk // k
393 , // gm // l
395 , // hikmp // m
400 , // hkm // n
403 , // hkmn // o
407 , // aeghm // p
412 , // aeghk // q
417 , // hm // r
419 , // aghkn // s
424 , // ghmn // t
428 , // kmn // u
431 , // lm // v
433 , // jlmp // w
437 , // dfjl // x
441 , // ceiop // y
446 , // hln // z
449 , // behko // {
454 , // ek // |
456 , // aiekn // }
461 , // dfg // ~
464 // ...

};


char char_seg_map[] =
  // !
  "en"
  // "
  "ce"
  // #
  "cehiknop"
  // $
  "abeghiknop"
  // %
  "adefghiklop"
  // &
  "aefhjmno"
  // '
  "e"
  // (
  "dko"
  // )
  "fkn"
  // *
  "defhijkl"
  // +
  "ehik"
  // ,
  "l"
  // -
  "ih"
  // .
  "n"
  // /
  "dl"
  
  // 0
  "abcdglmnop"
  // 1
  "cdp"
  // 2
  "abchimno"
  // 3
  "abcinop"
  // 4
  "cghip"
  // 5
  "abghjno"
  // 6
  "abghimnop"
  // 7
  "abcp"
  // 8
  "abcghimnop"
  // 9
  "abcghip"

  // :
  "ek"
  
  // ;
  "el"
  
  // <
  "dj"
  
  // =
  "ihno"
  
  // >
  "fl"
  
  // ?
  "abcik"
  
  // @
  "abcegimno"
  

  // A
  "abcghimp"
  // B
  "abceiknop"
  // C
  "abgmno"
  // D
  "abceknop"
  // E
  "abghmno"
  // F
  "abghm"
  // G
  "abgimnop"
  // H
  "cghimp"
  // I
  "abekno"
  // J
  "cmnop"
  // K
  "dghjm"
  // L
  "gmno"
  // M
  "cdfgmp"
  // N
  "cfgjmp"
  // O
  "abcgmnop"
  // P
  "abcghim"
  // Q
  "abcgjmnop"
  // R
  "abcghijm"
  // S
  "abghinop"
  // T
  "abek"
  // U
  "cgmnop"
  // V
  "dglm"
  // W
  "cgjlmp"
  // X
  "dfjl"
  // Y
  "cghinop"
  // Z
  "abdlno"

  // [
  "beko"
  // backslash
  "fj"
  // ]
  "aekn"
  // ^
  "lj"
  // _
  "no"
  // `
  "f"
  
  // a
  "hikmno"
  // b
  "ghimnop"
  // c
  "hmn"
  // d
  "cikop"
  // e
  "hlmno"
  // f
  "behik"
  // g
  "aeghkn"
  // h
  "ghkm"
  // i
  "k"
  // j
  "ekmn"
  // k
  "dejk"
  // l
  "gm"
  // m
  "hikmp"
  // n
  "hkm"
  // o
  "hkmn"
  // p
  "aeghm"
  // q
  "aeghk"
  // r
  "hm"
  // s
  "aghkn"
  // t
  "ghmn"
  // u
  "kmn"
  // v
  "lm"
  // w
  "jlmp"
  // x
  "dfjl"
  // y
  "ceiop"
  // z
  "hln"

  // {
  "behko"
  // |
  "ek"
  // }
  "aiekn"
  // ~
  "dfg"
  ;

void clear_char(uint32_t char_idx) {
  int _s;

  _s = char_idx * N_DIGIT_LED;
  for (int i=_s; i < (_s + N_DIGIT_LED); i++) {
    strip.setPixelColor(i, 0);
  }
  strip.show();

}

// char_seg_map, char_seg_map_start, digit_segment
void display_char(uint32_t color, uint32_t char_idx, char ch) {
  int _s, _n, _idx, start;
  int rel_idx, rel_n;
  char chseg;

  if ((ch < START_CHAR) || (ch > END_CHAR)) { return; }

  start = char_idx * N_DIGIT_LED;

  _s = char_seg_map_start[ch - START_CHAR];
  _n = char_seg_map_start[ch - START_CHAR + 1] - _s;

  for (int i=0; i<_n; i++) {
    _idx = char_seg_map[_s + i] - 'a';
    rel_idx = digit_segment[ 3*_idx ];
    rel_n = digit_segment[ 3*_idx + 1];
    for (int j=0; j<rel_n; j++) {
      strip.setPixelColor( start + rel_idx + j, color );
    }
    //strip.setPixelColor( start + rel_idx, color );

    //strip.setPixelColor( i, color );
  }

  strip.show();
  
}
  

void setup() {
  strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
  strip.show();            // Turn OFF all pixels ASAP
  strip.setBrightness(200); // Set BRIGHTNESS to about 1/5 (max = 255)
}

void _test_chars() {
  char ch;
  int digi_idx=0;
  uint32_t color;

  int n=1;

  for (ch = START_CHAR; ch <= END_CHAR; ch++) {
    color = random_color();
    clear_char(digi_idx);
    display_char(color, digi_idx, ch);
    digi_idx = (digi_idx+1)%N_DIGIT;
    delay(1000);
  }

}

void _test_full_brightness() {
  char ch;
  int digi_idx=0;
  uint32_t color;

  int n=1;

  for (int i=0; i<10; i++) { clear_char(i);  }
  for (int i=0; i<(20*10); i++) {
    strip.setPixelColor( i, strip.Color(255,255,255));
  }
  strip.show();
  delay(1000);


}

void _test_random() {
  char ch;
  int digi_idx=0;
  uint32_t color;

  int n=1;

  
  n += random(2);


  for (int i=0; i<n; i++) {

    digi_idx = random(10);
    color = random_color();
    //color = strip.Color(255,255,255);
    ch = random(START_CHAR, END_CHAR + 1);
  
    clear_char(digi_idx);
    display_char(color, digi_idx, ch);
  
    delay( 100 + random(250) );
  }

}

void show_message(uint32_t color, const char *msg) {
  for (int i=0; i<N_DIGIT; i++) { clear_char(i); }
  for (int i=0; i<N_DIGIT; i++) {
    if (msg[i]==0) { break; }
    display_char(color, i, msg[i]);
  }
}

void loop() {
  char ch;
  int digi_idx=0;
  uint32_t color;

  int n=1;

  char msg[] = "STAY ALIVE";

  
  //_test_random();
  //_test_full_brightness();
  //_test_chars();

  color = strip.Color(255,0,0);
  
  show_message(color, "STAY ALIVE");
  delay(1000);

  show_message(color, "GOTO HELL");
  delay(5000);
  return;

}

void step(uint32_t color, uint32_t n, int wait) {
  for (int i=0; i<n; i++) {
    strip.setPixelColor(i, color);
    strip.show();
    delay(wait);
  }
}

// Some functions of our own for creating animated effects -----------------

// Fill strip pixels one after another with a color. Strip is NOT cleared
// first; anything there will be covered pixel by pixel. Pass in color
// (as a single 'packed' 32-bit value, which you can get by calling
// strip.Color(red, green, blue) as shown in the loop() function above),
// and a delay time (in milliseconds) between pixels.
void colorWipe(uint32_t color, int wait) {
  for(int i=0; i<strip.numPixels(); i++) { // For each pixel in strip...
    strip.setPixelColor(i, color);         //  Set pixel's color (in RAM)
    strip.show();                          //  Update strip to match
    delay(wait);                           //  Pause for a moment
  }
}

// Theater-marquee-style chasing lights. Pass in a color (32-bit value,
// a la strip.Color(r,g,b) as mentioned above), and a delay time (in ms)
// between frames.
void theaterChase(uint32_t color, int wait) {
  for(int a=0; a<10; a++) {  // Repeat 10 times...
    for(int b=0; b<3; b++) { //  'b' counts from 0 to 2...
      strip.clear();         //   Set all pixels in RAM to 0 (off)
      // 'c' counts up from 'b' to end of strip in steps of 3...
      for(int c=b; c<strip.numPixels(); c += 3) {
        strip.setPixelColor(c, color); // Set pixel 'c' to value 'color'
      }
      strip.show(); // Update strip with new contents
      delay(wait);  // Pause for a moment
    }
  }
}

uint32_t random_color() {
  return strip.gamma32(strip.ColorHSV( random(65536L) ));
}

// Rainbow cycle along whole strip. Pass delay time (in ms) between frames.
void rainbow(int wait) {
  // Hue of first pixel runs 5 complete loops through the color wheel.
  // Color wheel has a range of 65536 but it's OK if we roll over, so
  // just count from 0 to 5*65536. Adding 256 to firstPixelHue each time
  // means we'll make 5*65536/256 = 1280 passes through this outer loop:
  for(long firstPixelHue = 0; firstPixelHue < 5*65536; firstPixelHue += 256) {
    for(int i=0; i<strip.numPixels(); i++) { // For each pixel in strip...
      // Offset pixel hue by an amount to make one full revolution of the
      // color wheel (range of 65536) along the length of the strip
      // (strip.numPixels() steps):
      int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
      // strip.ColorHSV() can take 1 or 3 arguments: a hue (0 to 65535) or
      // optionally add saturation and value (brightness) (each 0 to 255).
      // Here we're using just the single-argument hue variant. The result
      // is passed through strip.gamma32() to provide 'truer' colors
      // before assigning to each pixel:
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
    }
    strip.show(); // Update strip with new contents
    delay(wait);  // Pause for a moment
  }
}

// Rainbow-enhanced theater marquee. Pass delay time (in ms) between frames.
void theaterChaseRainbow(int wait) {
  int firstPixelHue = 0;     // First pixel starts at red (hue 0)
  for(int a=0; a<30; a++) {  // Repeat 30 times...
    for(int b=0; b<3; b++) { //  'b' counts from 0 to 2...
      strip.clear();         //   Set all pixels in RAM to 0 (off)
      // 'c' counts up from 'b' to end of strip in increments of 3...
      for(int c=b; c<strip.numPixels(); c += 3) {
        // hue of pixel 'c' is offset by an amount to make one full
        // revolution of the color wheel (range 65536) along the length
        // of the strip (strip.numPixels() steps):
        int      hue   = firstPixelHue + c * 65536L / strip.numPixels();
        uint32_t color = strip.gamma32(strip.ColorHSV(hue)); // hue -> RGB
        strip.setPixelColor(c, color); // Set pixel 'c' to value 'color'
      }
      strip.show();                // Update strip with new contents
      delay(wait);                 // Pause for a moment
      firstPixelHue += 65536 / 90; // One cycle of color wheel over 90 frames
    }
  }
}
