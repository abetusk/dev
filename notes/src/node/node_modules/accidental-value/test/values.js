var test = require('tape'),
    accval = require('../');

test('Values of accidentals', function(t) {
  t.equal(accval('x'), 2);
  t.equal(accval('#'), 1);
  t.equal(accval(''), 0);
  t.equal(accval('b'), -1);
  t.equal(accval('bb'), -2);
  
  t.deepEqual(accval.interval('x'), [-8, 14]);
  t.deepEqual(accval.interval('#'), [-4, 7]);
  t.deepEqual(accval.interval(''), [0, 0]);
  t.deepEqual(accval.interval('b'), [4, -7]);
  t.deepEqual(accval.interval('bb'), [8, -14]);
  t.end();
});
