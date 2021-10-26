/* global describe it */

var assert = require('assert')
var parser = require('..')

function map (fn) {
  return function (str) {
    return str.split(' ').map(fn)
  }
}

describe('note parser', function () {
  describe('parse', function () {
    var parse = parser.parse
    it('parse pitch classes', function () {
      assert.deepEqual(parse('fx'),
        { letter: 'F', acc: '##', pc: 'F##', step: 3, alt: 2, chroma: 7 })
    })
    it('parse notes', function () {
      assert.deepEqual(parse('Cb4'),
      { letter: 'C', acc: 'b', pc: 'Cb', step: 0, alt: -1, chroma: 11,
        oct: 4, midi: 59, freq: 246.94165062806206 })
      assert.deepEqual(parse('A#4'),
      { letter: 'A', acc: '#', pc: 'A#', step: 5, alt: 1, chroma: 10,
        oct: 4, midi: 70, freq: 466.1637615180899 })
    })
    it('parse tonicOf', function () {
      assert.equal(parse('CMaj7', true).tonicOf, 'Maj7')
      assert.equal(parse('C4 major', true).tonicOf, 'major')
      assert.equal(parse('C64', true).tonicOf, '')
      assert.equal(parse('G7', true).tonicOf, '')
    })
    it('different tunning', function () {
      assert.equal(parse('A2', false, 444).freq, 111)
    })
  })

  describe('build', function () {
    var build = parser.build
    it('build letters', function () {
      assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(function (s) {
        return build(s)
      }), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
      assert.equal(build(-1), null)
    })
    it('build letters and accidentals', function () {
      assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(function (i) {
        return build(0, i)
      }), [ 'C', 'C#', 'C##', 'C###', 'C####', 'C#####', 'C######' ])
      assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(function (i) {
        return build(0, -i)
      }), [ 'C', 'Cb', 'Cbb', 'Cbbb', 'Cbbbb', 'Cbbbbb', 'Cbbbbbb' ])
    })
    it('build letter accidentals and octaves', function () {
      assert.deepEqual([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 10].map(function (i) {
        return build(0, 0, i)
      }), [ 'C-4', 'C-3', 'C-2', 'C-1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C10' ])
    })
    it('accepts the parsed object', function () {
      assert.deepEqual(['c', 'd3', 'e#', 'fx', 'gbb4', 'ab-5', 'bbbbbb-11', 'blah'].map(function (s) {
        return build(parser.parse(s))
      }), [ 'C', 'D3', 'E#', 'F##', 'Gbb4', 'Ab-5', 'Bbbbbb-11', null ])
      assert.equal(build(), null)
    })
  })

  describe('regex', function () {
    it('regex return a RegExp object', function () {
      assert(parser.regex() instanceof RegExp)
    })
  })
  describe('letter', function () {
    var letters = map(parser.letter)
    it('get note letters', function () {
      assert.deepEqual(letters('a b c d e f g'),
        [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ])
    })
  })
  describe('acc', function () {
    var accs = map(parser.acc)
    it('get note accidentals', function () {
      assert.deepEqual(accs('c d e f g a b'), [ '', '', '', '', '', '', '' ])
      assert.deepEqual(accs('c# d# e# f# g# a# b#'), [ '#', '#', '#', '#', '#', '#', '#' ])
      assert.deepEqual(accs('c## d## e## f## g## a## b##'), [ '##', '##', '##', '##', '##', '##', '##' ])
      assert.deepEqual(accs('cx dx ex fx gx ax bx'), [ '##', '##', '##', '##', '##', '##', '##' ])
      assert.deepEqual(accs('cb db eb fb gb ab bb'), [ 'b', 'b', 'b', 'b', 'b', 'b', 'b' ])
      assert.deepEqual(accs('cbb dbb ebb fbb gbb abb bbb'), [ 'bb', 'bb', 'bb', 'bb', 'bb', 'bb', 'bb' ])
    })
  })
  describe('pc', function () {
    var pcs = map(parser.pc)
    it('get pitch classes', function () {
      assert.deepEqual(pcs('c d# e## fx gb abb bbb'),
        [ 'C', 'D#', 'E##', 'F##', 'Gb', 'Abb', 'Bbb' ])
    })
  })
  describe('steps', function () {
    var steps = map(parser.step)
    it('get note steps', function () {
      assert.deepEqual(steps('c d e f g a b'),
        [ 0, 1, 2, 3, 4, 5, 6 ])
    })
  })
  describe('alt', function () {
    var alts = map(parser.alt)
    it('get alteration', function () {
      assert.deepEqual(alts('c d# e## fx gb abb bbb'),
        [ 0, 1, 2, 2, -1, -2, -2 ])
    })
  })
  describe('chroma', function () {
    var chromas = map(parser.chroma)
    it('get chroma', function () {
      assert.deepEqual(chromas('cb c db d eb e fb f gb g ab a bb b'),
        [ 11, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11 ])
      assert.deepEqual(chromas('c c# d d# e e# f f# g g# a a# b b#'),
        [ 0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 0 ])
    })
    it('can be used to find enharmonics', function () {
      assert.equal(parser.chroma('Cb'), parser.chroma('B'))
      assert.equal(parser.chroma('B#'), parser.chroma('C'))
    })
  })
  describe('oct', function () {
    it('no octaves for pitch classes', function () {
      assert(parser.oct('c') === undefined)
    })
    it('no max octaves', function () {
      assert.deepEqual(parser.oct('C9999'), 9999)
    })
    it('no min octaves', function () {
      assert.deepEqual(parser.oct('C-9999'), -9999)
    })
    it('get octaves', function () {
      var octs = map(parser.oct)
      assert.deepEqual(octs('c-1 d0 e1 f2 g3 a4 b5'),
        [ -1, 0, 1, 2, 3, 4, 5 ])
    })
  })
  describe('midi', function () {
    it('no midi for pitch classes', function () {
      assert(parser.midi('c') === null)
    })
    it('follows general midi number', function () {
      assert.equal(parser.midi('c-1'), 0)
    })
    it('get midis', function () {
      var midis = map(parser.midi)
      assert.deepEqual(midis('c4 d4 e4 f4 g4 a4 b4'),
        [ 60, 62, 64, 65, 67, 69, 71 ])
    })
    it('bypasses midi numbers', function () {
      assert.equal(parser.midi(60), 60)
      assert.equal(parser.midi(-1), null)
      assert.equal(parser.midi(128), null)
    })
    it('bypasses string midi numbers', function () {
      assert.equal(parser.midi('60'), 60)
    })
  })
  describe('freq', function () {
    it('no freq for pitch classes', function () {
      assert.equal(parser.freq('c'))
    })
    it('get frequencies', function () {
      var freqs = map(function (n) { return parser.freq(n) })
      assert.deepEqual(freqs('c4 d4 e4 f4 g4 a4 b4'),
      [ 261.6255653005986, 293.6647679174076, 329.6275569128699,
        349.2282314330039, 391.99543598174927, 440, 493.8833012561241])
    })
    it('get frequencies with different tunning', function () {
      assert.equal(parser.freq('a4', 444), 444)
      assert.equal(parser.freq('c4', 442), 262.81477241560134)
    })
    it('accepts midi numbers', function () {
      assert.equal(parser.freq(69, 440), 440)
      assert.equal(parser.freq('69', 444), 444)
    })
  })
})
