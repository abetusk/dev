var test = require('tape'),
    daccord = require('../');

test('Parsing chops', function(t) {
  var cache = t.deepEqual;
  t.deepEqual = function(res, exp) {
    if (res instanceof Error)
      console.log('ERROR', res)
    
    cache(res, exp);
  }

  t.deepEqual(daccord('-'), ['P1', 'm3', 'P5']);
  t.deepEqual(daccord('m'), ['P1', 'm3', 'P5']);
  t.deepEqual(daccord('mi'), ['P1', 'm3', 'P5']);
  t.deepEqual(daccord('min'), ['P1', 'm3', 'P5']);
  t.deepEqual(daccord('mi7'), ['P1', 'm3', 'P5', 'm7']);
  t.deepEqual(daccord('M'), ['P1', 'M3', 'P5']);
  t.deepEqual(daccord('Ma'), ['P1', 'M3', 'P5']);
  t.deepEqual(daccord('M#5'), ['P1', 'M3', 'A5']);
  t.deepEqual(daccord('maj7'), ['P1', 'M3', 'P5', 'M7']);
  t.deepEqual(daccord('+'), ['P1', 'M3', 'A5']);
  t.deepEqual(daccord('6'), ['P1', 'M3', 'P5', 'M6']);
  t.deepEqual(daccord('#6'), ['P1', 'M3', 'P5', 'A6']);
  t.deepEqual(daccord('m6'), ['P1', 'm3', 'P5', 'M6']);
  t.deepEqual(daccord('b5'), ['P1', 'M3', 'd5']);
  t.deepEqual(daccord('7b5'), ['P1', 'M3', 'd5', 'm7']);
  t.deepEqual(daccord('9'), ['P1', 'M3', 'P5', 'm7', 'M9']);
  t.deepEqual(daccord('#9'), ['P1', 'M3', 'P5', 'm7', 'A9']);
  t.deepEqual(daccord('b9'), ['P1', 'M3', 'P5', 'm7', 'm9']);
  t.deepEqual(daccord('#11'), ['P1', 'M3', 'P5', 'm7', 'M9', 'A11']);
  t.deepEqual(daccord('13'), ['P1', 'M3', 'P5', 'm7', 'M9', 'P11', 'M13']);
  t.deepEqual(daccord('13#9b5'), ['P1', 'M3', 'd5', 'm7', 'A9', 'P11', 'M13']);
  t.deepEqual(daccord('7sus4'), ['P1', 'P4', 'P5', 'm7']);
  t.deepEqual(daccord('maj9'), ['P1', 'M3', 'P5', 'M7', 'M9']);
  t.deepEqual(daccord('mb6'), ['P1', 'm3', 'P5', 'm6']);
  t.deepEqual(daccord('#5#9'), ['P1', 'M3', 'A5', 'm7', 'A9']);
  t.deepEqual(daccord('m(maj7)'), ['P1', 'm3', 'P5', 'M7']);
  t.deepEqual(daccord('m(11b5b9)'), ['P1', 'm3', 'd5', 'm7', 'm9', 'P11']);
  t.deepEqual(daccord('o'), ['P1', 'm3', 'd5']);
  t.deepEqual(daccord('o7'), ['P1', 'm3', 'd5', 'd7']);
  t.deepEqual(daccord('ø'), ['P1', 'm3', 'd5', 'm7']);
  t.deepEqual(daccord('ø7'), ['P1', 'm3', 'd5', 'm7']);
  t.deepEqual(daccord('min11'), ['P1', 'm3', 'P5', 'm7', 'M9', 'P11']);
  t.deepEqual(daccord('+M7'), ['P1', 'M3', 'A5', 'M7']);
  t.deepEqual(daccord('dom7b5'), ['P1', 'M3', 'd5', 'm7']);
  t.deepEqual(daccord('5'), ['P1', 'P5']);
  t.deepEqual(daccord('add9'), ['P1', 'M3', 'P5', 'M9']);
  t.deepEqual(daccord('m13b5#9'), ['P1', 'm3', 'd5', 'm7', 'A9', 'P11', 'M13']);
  t.deepEqual(daccord('6/9'), ['P1', 'M3', 'P5', 'M6', 'M9']);
  t.deepEqual(daccord('M7'), ['P1', 'M3', 'P5', 'M7']);
  t.deepEqual(daccord('M9'), ['P1', 'M3', 'P5', 'M7', 'M9']);
  t.deepEqual(daccord('Ma9'), ['P1', 'M3', 'P5', 'M7', 'M9']);
  t.deepEqual(daccord('mM7'), ['P1', 'm3', 'P5', 'M7']);
  t.end();
});
