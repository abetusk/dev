var test = require('tape');
var fq = require('../');

test('Calculating frequencies', function(t) {
  t.equal(fq([0, 0]), 440); // A4
  t.equal(fq([1, 0]), 880); // A5
  t.equal(fq([0, 1]), 659.2551138257398); // E5
  t.equal(fq([-4, 4]), 138.59131548843604); // C#3
  t.equal(fq([7, -5]), 7458.620184289437); // Bb8

  var fq440 = fq(440);
  var fq442 = fq(442);

  t.equal(fq440([0, 0]), 440);
  t.equal(fq440([2, -8]), 69.29565774421802); // Db2
  
  t.equal(fq442([0, 0]), 442);
  t.equal(fq442([1, 0]), 884);
  t.equal(fq442([3, -3]), 1051.2590896624054); // C6

  t.end();
});
