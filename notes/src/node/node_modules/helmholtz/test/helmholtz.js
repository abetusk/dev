var test = require('tape'),
  helmholtz = require('../');

test('parsing helmholtz notation', function(t) {
  t.deepEqual(helmholtz('a\''), [0, 0]);
  t.deepEqual(helmholtz(',,C'), [-3, -3]);
  t.deepEqual(helmholtz('c#'), [-4, 4]);
  t.deepEqual(helmholtz('D'), [-2, -1]);
  t.deepEqual(helmholtz('Ebb,,'), [3, -13]);
  t.deepEqual(helmholtz('gx\'\'\''), [-5, 12]);
  t.deepEqual(helmholtz('fb'), [5, -11]);
  t.end();
});
