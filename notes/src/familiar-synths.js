// Licnese: CC0
//

var stoch = require("stochastic");
var alg = require("./familiar-synths-alg_v_0_1_8.js");

function _mk_simple_tidal(drum_dict) {
  var beat_a = [];
  for (var instrument in drum_dict) {
    var s = drum_dict[instrument].replace(/ /g, '');
    for (var idx=0; idx<s.length; idx++) {
      if (idx >= beat_a.length) { beat_a.push([]); }
      if ((s[idx] == '~') || (s[idx] == '.')) { continue; }
      beat_a[idx].push(instrument);
    }
  }

  var _out = '';
  for (var ii=0; ii<beat_a.length; ii++) {
    if (beat_a[ii].length == 0) {
      _out += " ~";
      continue;
    }
    _out += " {" + beat_a[ii].join(",") + "}";
  }
  return _out;
}

function FamiliarSynths() {
  this.noteName = [ "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b" ];
  this.noteMod = {
    "c":0, "c#":1, "db":1, "d":2, "d#":3, "eb":3, "e":4, "f":5, "f#":6, "gb":6, "g":7, "g#":8, "ab":8, "a":9, "a#":10, "bb":10, "b":11,
    "C":0, "C#":1, "Db":1, "D":2, "D#":3, "Eb":3, "E":4, "F":5, "F#":6, "Gb":6, "G":7, "G#":8, "ab":8, "A":9, "A#":10, "Bb":10, "B":11,
    "C":0, "C#":1, "DB":1, "D":2, "D#":3, "EB":3, "E":4, "F":5, "F#":6, "GB":6, "G":7, "G#":8, "aB":8, "A":9, "A#":10, "BB":10, "B":11
  };
  this.midiC4 = 60;
  this.noteMidiLookup = {};
  this.midiNoteLookup = {};

  // b - bass (kick)
  // s - snare
  // c - clap
  // H - high hat (open)
  // h - high hat (closed)
  //
  // 8
  //


  // see https://docs.google.com/spreadsheets/d/19_3BxUMy3uy1Gb0V8Wc-TcG7q16Amfn6e8QVw4-HuD0/edit#gid=0
  //
                          // : : : :      : : : :
                          // 0   4        0   4
                          // 01234567     01234567
  this.drumBeat = {
    "four_on_the_floor" : ["b...b..." + "b...b.b.",
                            "....s..." + "....s...",
                            "........" + ".h......",
                            "..H...H." + "..H...H.",
                            "....c..." + "....c..." ],


    "billie_jean" :       [ "b......." + "b.......",
                            "....s..." + "....s...",
                            "H.H.H.H." + "H.H.H.H." ],

                          // : : : :      : : : :
                          // 0   4        0   4
                          // 01234567     01234567
    "funky_drummer" :     [ "b.b...b." + "..b..b..",
                            "....s..s" + ".s.ss..s",
                            "........" + ".h......",
                            "hhhhhhh." + "hhhhh.hh",
                            ".......H" + ".....H.." ]

  };

  this.drumBeatCode = { "b" : 1, "s": 2, "h": 4, "H": 8, "c": 16 }


  this.chord = {
    "major" : [0,4,7],
    "minor": [0,3,7],
    "augmented":[0,4,8],
    "diminished":[0,3,6],
    "major7":[0,4,7,11]
  };


  this.musicalMode = {
    "aeolian":[0,+2,+3,+5,+7,+8,+10],
    "locrian": [0,+1,+3,+5,+6,+8,+10],
    "ionian":  [0,+2,+4,+5,+7,+9,+11],
    "dorian":  [0,+2,+3,+5,+7,+9,+10],
    "phrygian": [0,+1,+3,+5,+7,+8,+10],
    "lydian":  [0,+2,+4,+6,+7,+9,+11] ,
    "mixolydian":  [0,+2,+4,+5,+7,+9,+10]
  };

  this.musicalModeList = [ "aeolian", "locrian", "ionian", "dorian", "phrygian", "lydian", "mixolydian" ];

  // key is mode (from musicalMode)
  // val array of objects of  {"type":..., "chord":[...],"name":...}
  //
  this.musicalModeChord = { };
  this.musicalModeChord4 = { };

  this._modeChordName = {
    "maj" : ["I", "II", "III", "IV", "V", "VI", "VII"],
    "min" : ["i", "ii", "iii", "iv", "v", "vi", "vii"],
    "dim" : ["id", "iid", "iiid", "ivd", "vd", "vid", "viid"]
  };

  this._modeChordName4 = {
    "maj7" : ["I7", "II7", "III7", "IV7", "V7", "VI7", "VII7"],
    "maj7f" : ["I7f", "II7f", "III7f", "IV7f", "V7f", "VI7f", "VII7f"],
    "min7" : ["i7", "ii7", "iii7", "iv7", "v7", "vi7", "vii7"],
    "min7f" : ["i7f", "ii7f", "iii7f", "iv7f", "v7f", "vi7f", "vii7f"],
    "dim7" : ["id7", "iid7", "iiid7", "ivd7", "vd7", "vid7", "viid7"],
    "dim7f" : ["id7f", "iid7f", "iiid7f", "ivd7f", "vd7f", "vid7f", "viid7f"]
  };

  for (var ii=0; ii<this.musicalModeList.length; ii++) {
    var mode_name = this.musicalModeList[ii];
    var mode = this.musicalMode[ mode_name ];

    this.musicalModeChord[mode_name] = [];
    this.musicalModeChord4[mode_name] = [];

    var occupancy = [];
    for (var _i=0; _i<24; _i++) { occupancy.push(0); }
    for (var _i=0; _i<mode.length; _i++) {
      occupancy[mode[_i]] = 1;
      occupancy[mode[_i]+12] = 1;
    }

    chord_check_name = ["maj", "min", "dim"];
    chord_check = [ [0,4,7], [0,3,7], [0,3,6] ];
    chord_check4_name = ["maj7", "maj7f", "min7", "min7f", "dim7", "dim7f"];
    chord_check4 = [ [0,4,7,10], [0,4,7,11],
                     [0,3,7,10], [0,3,7,11],
                     [0,3,6,9], [0,3,6,10] ];

    for (var nidx=0; nidx < mode.length; nidx++) {
      var chord_info = { "type":"", "chord":[], "name":""};
      var base_note = mode[nidx];

      for (var ch_idx=0; ch_idx < chord_check.length; ch_idx++) {
        var found = true;
        for (var _n=0; _n<chord_check[ch_idx].length; _n++) {
          if (occupancy[base_note + chord_check[ch_idx][_n]] == 0) {
            found = false;
            break;
          }
        }
        if (found) {
          chord_info.type = chord_check_name[ch_idx];
          chord_info.name = this._modeChordName[ chord_check_name[ch_idx] ][nidx];
          chord_info.chord = [
            base_note + chord_check[ch_idx][0],
            base_note + chord_check[ch_idx][1],
            base_note + chord_check[ch_idx][2] ];
          break;
        }
      }
      this.musicalModeChord[mode_name].push(chord_info);

      // now '4' chords
      //
      var chord_info4 = {"type":"", "chord":[], "name":"" };
      for (var ch_idx=0; ch_idx < chord_check4.length; ch_idx++) {
        var found = true;
        for (var _n=0; _n<chord_check4[ch_idx].length; _n++) {
          if (occupancy[base_note + chord_check4[ch_idx][_n]] == 0) {
            found = false;
            break;
          }
        }
        if (found) {
          chord_info4.type = chord_check4_name[ch_idx];
          chord_info4.name = this._modeChordName4[ chord_check4_name[ch_idx] ][nidx];
          chord_info4.chord = [
            base_note + chord_check4[ch_idx][0],
            base_note + chord_check4[ch_idx][1],
            base_note + chord_check4[ch_idx][2],
            base_note + chord_check4[ch_idx][3] ];
          break;
        }
      }
      this.musicalModeChord4[mode_name].push(chord_info4);

    }

  }



  this.defaults =  {
    "PPQ" : 480,
    "timeSignature": [ 4, 4],
    "bpm" : 90,
    "name": "FamiliarSynths",
    "noteDur": 1/16,
    "velocity": 1
  };

  this.MIDI = {
    "header" : {
      "PPQ": this.defaults.PPQ,
      "timeSignature": this.defaults.timeSignature,
      "bpm" : this.defaults.bpm,
      "name": ""
    },
    "startTime":this.defaults.startTime,
    "duration":0,
    "tracks" : [],
    "controlChanges": {},
    "id": 0,
    "instrumentNumber": 0,
    "instrument": "acoustic grand piano",
    "instrumentFamily": "piano",
    "channelNumber": 1,
    "isPercussion": false
  };

  this.timeSignature = this.defaults.timeSignature;
  this.bpm = this.defaults.bpm;
  this.bps = this.bpm / 60;

  //notes per bar
  //
  this.npb = this.defaults.timeSignature[0]

  var octave = -2;
  for (var ii=0; ii<128; ii++) {
    m = ii%12;
    if (m==0) { octave+=1; }

    var midiNote = this.noteName[m] + octave.toString();
    this.noteMidiLookup[ midiNote ] = ii;
    this.noteMidiLookup[ midiNote.toUpperCase() ] = ii;
    this.midiNoteLookup[ii] = midiNote;
  }

  this.init = 1;
  return this;
}


FamiliarSynths.prototype._mirror = function(a) {
  var m = a.length/2;
  var b = [];

  for (var i=0; i<a.length; i++) {
    b.push(a[i]);
  }

  for (var i=(a.length-2); i>0; i--) {
    b.push(a[i]);
  }

  return b;
}

FamiliarSynths.prototype._permute = function(a, s, n) {
  var b = [];
  if (n > (a.length - s)) { n = a.length-s; }
  if (n<=0) { return; }
  for (var ii=0; ii<a.length; ii++) { b.push(a[ii]); }

  for (var ii=0; ii<n; ii++) {
    var p = this._irnd(n-ii);
    var t = b[s+ii];
    b[s+ii] = b[s+p];
    b[s+p] = t;
  }
  return b;
}

FamiliarSynths.prototype._apick = function(a, n) {
  var b = this._permute(a, 0, a.length);
  var r = [];
  for (var ii=0; ii<n; ii++) {
    r.push(b[ii]);
  }
  return r;
}

FamiliarSynths.prototype._quantize = function(val, q) {
    return Math.floor(val / q) * q;
}


FamiliarSynths.prototype._irnd = function(irange) {
  _r = ((typeof irange === "undefined") ? 2 : irange);
  return Math.floor(_r * Math.random());
}

FamiliarSynths.prototype._drnd = function(drange) {
  _r = ((typeof drange === "undefined") ? 1.0 : drange);
  return Math.random()*_r;
}

FamiliarSynths.prototype._mk_beat_measure =  function( pareto_m, pareto_alpha, beat_quantize, max_beat ) {
  pareto_m = ((typeof pareto_m === "undefined") ? 0.1 : pareto_m);
  pareto_alpha = ((typeof pareto_alpha === "undefined") ? 1.25 : pareto_alpha);
  beat_quantize = ( (typeof beat_quantize === "undefined") ? 0.25 : beat_quantize );
  max_beat = ( (typeof max_beat === "undefined") ? 16 : max_beat );

  var beat_sum = 0.0;
  var _measure = [];

  for (var jj=0; jj<max_beat; jj++) {
    var dt = this._quantize( stoch.pareto(pareto_m, pareto_alpha), beat_quantize ) + beat_quantize;
    if ((beat_sum+dt) >= 1.0) {
      _measure.push(1.0 - beat_sum);
      beat_sum += dt;
      break;
    }
    else {
      _measure.push(dt);
    }
    beat_sum += dt;
  }

  if (beat_sum < 1.0) {
    _measure.push( 1.0 - beat_sum );
  }

  return _measure;

}




FamiliarSynths.prototype.encodeBeat = function(_beat_str) {
  var beat_str = ((typeof x === "string") ? [_beat_str] : _beat_str);

  var reslen=0;
  var res = [];

  for (var ii=0; ii<beat_str.length; ii++) {
    if (beat_str[ii].length > res.length) {
      for (jj=res.length; jj<beat_str[ii].length; jj++) {
        res.push(0);
      }
    }
    for (jj=0; jj<beat_str[ii].length; jj++) {
      if ((beat_str[ii][jj] == ' ') ||
          (beat_str[ii][jj] == '.')) { continue; }
      if (!(beat_str[ii][jj] in this.drumBeatCode)) { continue; }
      res[jj] |= this.drumBeatCode[beat_str[ii][jj]];
    }
  }
  return res;
}

FamiliarSynths.prototype.musicMode2Notev = function(mode, root_note_str) {
  root_note_str = ((typeof root_note_str === "undefined") ? "c0" : root_note_str);
  var mode = this.musicalMode[mode];
  var r = [];
  var midi_root = this.note2midi(root_note_str);
  for (var ii=0; ii<mode.length; ii++) {
    r.push( this.midi2note(midi_root + mode[ii]) );
  }
  return r;
}

FamiliarSynths.prototype.convertToMIDI = function(notes) {
  this.MIDI.tracks = [];
  for (var ii=0; ii<notes.length; ii++) {
    var note = {
      "name": notes[ii].n,
      "midi": notes[ii].m,
      "time": notes[ii].t,
      "velocity": notes[ii].v,
      "duration": notes[ii].d
    };
    this.MIDI.tracks.push(note);
  }
  return this.MIDI;
}

FamiliarSynths.prototype.note = function(note_str, t, d, v) {
  v = ((typeof v === "undefined") ? this.defaults.velocity : v);
  d = ((typeof d === "undefined") ? this.defaults.noteDur : d);

  var midi = this.note2midi(note_str);
  var note = { "n": note_str, "m":midi, "t":t, "v":v, "d":d };
  return note;
}

FamiliarSynths.prototype.notedup = function(note) {
  return this.note(note.n, note.t, note.d, note.v);
}

FamiliarSynths.prototype.note2midi = function(note_str) {
  return this.noteMidiLookup[note_str];
}

FamiliarSynths.prototype.midi2note = function(midi) {
  return this.midiNoteLookup[midi];
}

FamiliarSynths.prototype.inflate = function(notes, scale) {
  scale = ((typeof scale === "undefined") ? 2 : scale);
  var t0 = notes[0].t;
  var new_notes = [];

  for (var ii=0; ii<notes.length; ii++) {
    var note = { "n":notes[ii].n, "m":notes[ii].m, "t":notes[ii].t, "v":notes[ii].v, "d":notes[ii].d };
    note.t = (notes[ii].t - t0)*scale + t0;
    note.d *= 2;
    new_notes.push(note);
  }

  return new_notes;
}

FamiliarSynths.prototype.widen = function(notes) {
  var t0 = notes[0].t;
  var new_notes = [];

  for (var ii=0; ii<notes.length; ii++) {
    var note = { "n":notes[ii].n, "m":notes[ii].m, "t":notes[ii].t, "v":notes[ii].v, "d":notes[ii].d };
    note.t = (notes[ii].t - t0)*2 + t0;
    new_notes.push(note);
  }

  return new_notes;
}

FamiliarSynths.prototype.wreathDuration = function(notes, pvec, fudge) {
  fudge = ((typeof fudge === "undefined") ? 1 : fudge);
  var new_notes = [];
  for (var ii=0; ii<notes.length; ii++) {
    var cur_t = notes[ii].t;
    var note_total_t = notes[ii].d;
    for (var jj=0; jj<pvec.length; jj++) {
      var note = { "n":notes[ii].n, "m":notes[ii].m, "t":cur_t, "v":notes[ii].v, "d":notes[ii].d };
      note.d *= pvec[jj] * fudge;
      cur_t += note_total_t * pvec[jj];
      new_notes.push(note);
    }
  }

  return new_notes;
}


FamiliarSynths.prototype.shift = function(notes, del) {
  var new_notes = [];
  for (var ii=0; ii<notes.length; ii++) {
    var note = { "n":notes[ii].n, "m":notes[ii].m, "t":notes[ii].t, "v":notes[ii].v, "d":notes[ii].d };
    var midi = this.note2midi(note.n);

    midi += del;
    note.n = this.midi2note(midi);
    note.m = midi;

    new_notes.push(note);
  }

  return new_notes;
}

FamiliarSynths.prototype.replicate = function(notes, del) {
  var new_notes = [];
  for (var ii=0; ii<notes.length; ii++) {
    var note = { "n":notes[ii].n, "m":notes[ii].m, "t":notes[ii].t, "v":notes[ii].v, "d":notes[ii].d };
    new_notes.push(note);

    note = { "n":notes[ii].n, "m":notes[ii].m, "t":notes[ii].t, "v":notes[ii].v, "d":notes[ii].d };
    var midi = this.note2midi(note.n);

    midi += del;
    note.n = this.midi2note(midi);
    note.m = midi;

    new_notes.push(note);
  }

  return new_notes;
}

var famsynth = new FamiliarSynths();

alg.v_0_1_8(famsynth);

