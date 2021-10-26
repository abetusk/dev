var test = require('tape'),
  scientific = require('./');

test('parsing scientific notation', function(t) {
  t.deepEqual(scientific('A4'), [0, 0]);
  t.deepEqual(scientific('C0'), [-3, -3]);
  t.deepEqual(scientific('c#3'), [-4, 4]);
  t.deepEqual(scientific('D2'), [-2, -1]);
  t.deepEqual(scientific('Ebb0'), [3, -13]);
  t.deepEqual(scientific('gx6'), [-5, 12]);
  t.deepEqual(scientific('fb3'), [5, -11]);
  t.end();
});
