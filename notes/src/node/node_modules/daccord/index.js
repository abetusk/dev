var SYMBOLS = {
  'm': ['m3', 'P5'],
  'mi': ['m3', 'P5'],
  'min': ['m3', 'P5'],
  '-': ['m3', 'P5'],

  'M': ['M3', 'P5'],
  'ma': ['M3', 'P5'],
  '': ['M3', 'P5'],

  '+': ['M3', 'A5'],
  'aug': ['M3', 'A5'],

  'dim': ['m3', 'd5'],
  'o': ['m3', 'd5'],

  'maj': ['M3', 'P5', 'M7'],
  'dom': ['M3', 'P5', 'm7'],
  'ø': ['m3', 'd5', 'm7'],

  '5': ['P5'],

  '6/9': ['M3', 'P5', 'M6', 'M9']
};

module.exports = function(symbol) {
  var c, parsing = 'quality', additionals = [], name, chordLength = 2
  var notes = ['P1', 'M3', 'P5', 'm7', 'M9', 'P11', 'M13'];
  var explicitMajor = false;

  function setChord(name) {
    var intervals = SYMBOLS[name];
    for (var i = 0, len = intervals.length; i < len; i++) {
      notes[i + 1] = intervals[i];
    }

    chordLength = intervals.length;
  }

  // Remove whitespace, commas and parentheses
  symbol = symbol.replace(/[,\s\(\)]/g, '');
  for (var i = 0, len = symbol.length; i < len; i++) {
    if (!(c = symbol[i]))
      return;

    if (parsing === 'quality') {
      var sub3 = (i + 2) < len ? symbol.substr(i, 3).toLowerCase() : null;
      var sub2 = (i + 1) < len ? symbol.substr(i, 2).toLowerCase() : null;
      if (sub3 in SYMBOLS)
        name = sub3;
      else if (sub2 in SYMBOLS)
        name = sub2;
      else if (c in SYMBOLS)
        name = c;
      else
        name = '';

      if (name)
        setChord(name);

      if (name === 'M' || name === 'ma' || name === 'maj')
        explicitMajor = true;


      i += name.length - 1;
      parsing = 'extension';
    } else if (parsing === 'extension') {
      c = (c === '1' && symbol[i + 1]) ? +symbol.substr(i, 2) : +c;

      if (!isNaN(c) && c !== 6) {
        chordLength = (c - 1) / 2;

        if (chordLength !== Math.round(chordLength))
          return new Error('Invalid interval extension: ' + c.toString(10));

        if (name === 'o' || name === 'dim')
          notes[3] = 'd7';
        else if (explicitMajor)
          notes[3] = 'M7';

        i += c >= 10 ? 1 : 0;
      } else if (c === 6) {
        notes[3] = 'M6';
        chordLength = Math.max(3, chordLength);
      } else
        i -= 1;

      parsing = 'alterations';
    } else if (parsing === 'alterations') {
      var alterations = symbol.substr(i).split(/(#|b|add|maj|sus|M)/i),
          next, flat = false, sharp = false;

      if (alterations.length === 1)
        return new Error('Invalid alteration');
      else if (alterations[0].length !== 0)
        return new Error('Invalid token: \'' + alterations[0] + '\'');

      var ignore = false;
      alterations.forEach(function(alt, i, arr) {
        if (ignore || !alt.length)
          return ignore = false;

        var next = arr[i + 1], lower = alt.toLowerCase();
        if (alt === 'M' || lower === 'maj') {
          if (next === '7')
            ignore = true;

          chordLength = Math.max(3, chordLength);
          notes[3] = 'M7';
        } else if (lower === 'sus') {
          var type = 'P4';
          if (next === '2' || next === '4') {
            ignore = true;

            if (next === '2')
              type = 'M2';
          }

          notes[1] = type; // Replace third with M2 or P4
        } else if (lower === 'add') {
          if (next === '9')
            additionals.push('M9');
          else if (next === '11')
            additionals.push('P11');
          else if (next === '13')
            additionals.push('M13');

          ignore = true
        } else if (lower === 'b') {
          flat = true;
        } else if (lower === '#') {
          sharp = true;
        } else {
          var token = +alt, quality, intPos;
          if (isNaN(token) || String(token).length !== alt.length)
            return new Error('Invalid token: \'' + alt + '\'');

          if (token === 6) {
            if (sharp)
              notes[3] = 'A6';
            else if (flat)
              notes[3] = 'm6';
            else
              notes[3] = 'M6';

            chordLength = Math.max(3, chordLength);
            return;
          }

          // Calculate the position in the 'note' array
          intPos = (token - 1) / 2;
          if (chordLength < intPos)
            chordLength = intPos;

          if (token < 5 || token === 7 || intPos !== Math.round(intPos))
            return new Error('Invalid interval alteration: ' + token);

          quality = notes[intPos][0];

          // Alterate the quality of the interval according the accidentals
          if (sharp) {
            if (quality === 'd')
              quality = 'm';
            else if (quality === 'm')
              quality = 'M';
            else if (quality === 'M' || quality === 'P')
              quality = 'A';
          } else if (flat) {
            if (quality === 'A')
              quality = 'M';
            else if (quality === 'M')
              quality = 'm';
            else if (quality === 'm' || quality === 'P')
              quality = 'd';
          }

          sharp = flat = false;
          notes[intPos] = quality + token;
        }
      });
      parsing = 'ended';
    } else if (parsing === 'ended') {
      break;
    }
  }

  return notes.slice(0, chordLength + 1).concat(additionals);
}
