var test = require('tape');
    icoords = require('../');

test('Simple format to coordinate conversion', function(t) {
  var coordinates = {
    'P1': [0, 0],
    'M2': [-1, 2],
    'm-2': [-3, 5],
    'P4': [1, -1],
    'M7': [-2, 5],
    'P8': [1, 0],
    'P15': [2, 0],
    'AA3': [-10, 18],
    'd5': [4, -6],
    'm7': [2, -2],
    'M9': [0, 2],
    'm13': [4, -4],
    'A4': [-3, 6],
    'dd22': [11, -14]
  };

  Object.keys(coordinates).forEach(function(simple) {
    t.deepEqual(icoords(simple), coordinates[simple]);
  });

  t.end();
});
