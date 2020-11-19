// License: CC0
//

#include <Adafruit_NeoPixel.h>

#define LED_PIN    6
#define N_DIGIT 10
#define N_DIGIT_LED 20
#define LED_COUNT (N_DIGIT_LED * N_DIGIT)

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
0 , // abcdglmnop // 0
10 , // cdp // 1
13 , // abchimnop // 2
22 , // abcinop // 3
29 , // cghip // 4
34 , // abghjno // 5
41 , // abghimnop // 6
50 , // abcp // 7
54 , // abcghimnop // 8
64 , // abcghip // 9

//  :   ;   <   =   >   ?   @
   71, 71, 71, 71, 71, 71, 71,

71 , // abcghimp // A
79 , // abceiknop // B
88 , // abgmno // C
94 , // abceknop // D
102 , // abghmno // E
109 , // abghm // F
114 , // abgimnop // G
122 , // cghimp // H
128 , // abekno // I
134 , // cmnop // J
139 , // dghijm // K
145 , // gmno // L
149 , // cdfgmp // M
155 , // cfgjmp // N
161 , // abcgmnop // O
169 , // abcghim // P
176 , // abcgjmnop // Q
185 , // abcghijm // R
193 , // abghinop // S
201 , // abek // T
205 , // cgmnop // U
211 , // dglm // V
215 , // cgjlmp // W
221 , // dfjl // X
225 , // cghinop // Y
232 , // abdlno // Z

// [    \    ]    ^    _    1
  238, 238, 238, 238, 238, 238,

238 , // hikmno // a
244 , // ghimnop // b
251 , // hmn // c
254 , // cikop // d
259 , // hlmno // e
264 , // behik // f
269 , // aeghkn // g
275 , // ghkm // h
279 , // k // i
280 , // ekmn // j
284 , // dejk // k
288 , // gm // l
290 , // hikmp // m
295 , // hkm // n
298 , // hkmn // o
302 , // aeghm // p
307 , // aeghk // q
312 , // hm // r
314 , // aghkn // s
319 , // ghmn // t
323 , // kmn // u
326 , // lm // v
328 , // jlmp // w
332 , // dfjl // x
336 , // ceiop // y
341 , // hln // z
344 // ...

};

char char_seg_map[] =
  // 0
  "abcdglmnop"
  // 1
  "cdp"
  // 2
  "abchimnop"
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
  "dghijm"
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

  if ((ch < '0') || (ch > 'z')) { return; }

  start = char_idx * N_DIGIT_LED;

  _s = char_seg_map_start[ch - '0'];
  _n = char_seg_map_start[ch - '0' + 1] - _s;

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
  strip.setBrightness(250); // Set BRIGHTNESS to about 1/5 (max = 255)
}


void loop() {
  char ch;
  int digi_idx=0;
  uint32_t color;

  int n=1;

  n += random(2);

  for (int i=0; i<n; i++) {

    digi_idx = random(10);
    color = random_color();
    ch = random('z' - '0') + '0';
  
    clear_char(digi_idx);
    display_char(color, digi_idx, ch);
  
    delay( 100 + random(250) );
  }
return;

  /*
  for (ch = '0'; ch <= 'z'; ch++) {
    clear_char(digi_idx);
    display_char(strip.Color(255, 0, 0), digi_idx, ch);
    digi_idx = (digi_idx + 1)%10;

    delay(100);
  }
  */

  color = strip.Color(255,0,0);

  for (int i=0; i<10; i++) { clear_char(i); }
  display_char(color, 0, 'S');
  display_char(color, 1, 'T');
  display_char(color, 2, 'A');
  display_char(color, 3, 'Y');

  display_char(color, 5, 'A');
  display_char(color, 6, 'L');
  display_char(color, 7, 'I');
  display_char(color, 8, 'V');
  display_char(color, 9, 'E');
  delay(1000);
  //colorWipe(strip.Color(255, 0, 0), 100);
  //rainbow(10);
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
