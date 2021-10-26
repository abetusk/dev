var pattern = /^(AA|A|P|M|m|d|dd)(-?\d+)$/;

// The interval it takes to raise a note a semitone
var sharp = [-4, 7];

var pAlts = ['dd', 'd', 'P', 'A', 'AA'];
var mAlts = ['dd', 'd', 'm', 'M', 'A', 'AA'];

var baseIntervals = [
  [0, 0],
  [3, -5],
  [2, -3],
  [1, -1],
  [0, 1],
  [3, -4],
  [2, -2],
  [1, 0]
];

module.exports = function(simple) {
  var parser = simple.match(pattern);
  if (!parser) return null;

  var quality = parser[1];
  var number = +parser[2];
  var sign = number < 0 ? -1 : 1;

  number = sign < 0 ? -number : number;

  var lower = number > 8 ? (number % 7 || 7) : number;
  var octaves = (number - lower) / 7;

  var base = baseIntervals[lower - 1];
  var alts = base[0] <= 1 ? pAlts : mAlts;
  var alt = alts.indexOf(quality) - 2;

  // this happens, if the alteration wasn't suitable for this type
  // of interval, such as P2 or M5 (no "perfect second" or "major fifth")
  if (alt === -3) return null;

  return [
    sign * (base[0] + octaves + sharp[0] * alt),
    sign * (base[1] + sharp[1] * alt)
  ];
}

// Copy to avoid overwriting internal base intervals
module.exports.coords = baseIntervals.slice(0);
