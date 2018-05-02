

var base_notes = [ -1, 0, 2, 4];

var sample_phrase = {
  "notes": [
    { "n" : "c4", "m": 60, "t" : 0, "v": 1, "d" : 1/16 }
  ]
};

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

function force_tune() {
  var m = new FamiliarSynths();

  var nbar = 180*m.bps;
  var nnotes = nbar * m.timeSignature[0];

  var cool_p = 5/60;

  var nbar_act = Math.floor(nbar/3);
  var nbar_act_ramp = Math.floor((1-cool_p)*(nbar_act));
  var nbar_act_cool = Math.floor((cool_p)*(nbar_act));

  var ts = m.timeSignature[0];

  var t0 = 0;
  var dt = 1/(m.timeSignature[0] * m.bps);
  var spn = dt;

  console.log("spn:", spn);

  var z = [ "b0", "c1", "d1", "e1" ];

  var bass_info = {
    "notes" : [ z[0], z[1], z[2], z[3] ],
    "pattern" : [
      [ [z[1], 4] ],
      [ [z[1], 4], [z[2], 4], [z[3], 4] ],
      [ [z[3], 4] ],
      [ [z[3], 4], [z[2], 4], [z[1], 4] ],
      [ [z[2], 3], [z[1], 3], [z[0], 2] ]
    ],
    "patternTransition": [
      [ 0.65,  0.25, 0.0, 0.0, 0.1 ],
      [  0.0,  0.0,  0.9, 0.1, 0.0 ],
      [  0.0,  0.0, 0.65,0.35, 0.0 ],
      [  0.9,  0.0, 0.00, 0.0, 0.1 ],
      [  1.0,  0.0, 0.00, 0.0, 0.0 ],
    ],
    "spn" : spn,
    "timeSignature" : ts
  };

  var bass_arp = [ "c1", "e1", "g1", "b1", "c2", "b1", "g1", "e1" ];
  var arp      = [ "c2", "e2", "g2", "b2", "c3", "b2", "g2", "e2" ];
  var arp_bridge = [ "c3", "e3", "g3", "b3", "c4", "b3", "g3", "e3" ];
  var arp_octave = [ "c4", "e4", "g4", "b4", "c5", "b4", "g4", "e4" ];

  var bass_pattern = [
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 2,
    3,-1, 3,-1,
    3,-1, 3,-1,
    3,-1, 3, 2,

    1, 1, 1, 1,
    1, 1, 1, 2,
    3, 3, 3, 3,
    3, 3, 3, 2,
    
    1, 1, 1, 1,
    1, 1, 1, 2,
    3, 3, 3, 3,
    3, 3, 3, 2,

    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 'x', 'y',
   -1,-1,-1,-1,

   'p0', 'p1', 'p0', 'p1',
   'p0', 'p1', 'p0', 'p1',
   'p0', 'p1', 'p0', 'p1',
   'p0', 'p1', 'p0', 'p1',

   0, 0, 0, 0,
   0, 0, 'p0', 'p1',
   0, 0, 0, 0,
   0, 0, 0, 0

  ];

  var bass_vel = [
    1, 0.8, 0.6, 0.5,    0.4, 0.3, 0.2, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5,  0.3, 0.4, 0.5, 0.5,   0.5, 0.25, 0.525, 0.5,

    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,

    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,

    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5
  ];


  var arp_pattern = [
     -1,-1,-1,-1,
    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',

    'p0', 'p1', 'p0', 'P0',
    'q0', 'q1', 'q0', 'q1',
    'q0', 'q1', 'P1', 'p1',
    'p0', 'p1', 'p0', 'p1',

    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',

    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',
    'p0', 'p1', 'p0', 'p1',

    -1,-1,-1,-1,
    'p0', 'p1', 'p0', 'p1',
    0, 0, 1, 1,
    -1,-1, 'x', 'y',

    -1,-1,-1,-1,
    -1,-1,-1,-1,
    -1,-1,-1,-1,
    -1,-1,-1,-1

  ];

  var z = [ "b1", "c2", "d2", "e2" ];
  var tune_bass = [];

  var vel = 0.125;

  var cur_t = 0;
  var bar_dt = m.timeSignature[0] * dt;
  for (var ii=0; ii<bass_pattern.length; ii++) {
    var note = {};

    vel = bass_vel[ii];

    if        (bass_pattern[ii] === -1) {
    } else if (bass_pattern[ii] ===  0) {

      note = m.note( z[0], cur_t, 4*spn, vel );
      var x = m.wreathDuration([note], [0.25, 0.75], 0.9 );
      for (var jj=0; jj<x.length; jj++) { tune_bass.push(x[jj]); }

    } else if (bass_pattern[ii] ===  1) {

      note = m.note( z[1], cur_t, 4*spn, vel );
      var x = m.wreathDuration([note], [0.25, 0.75], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_bass.push(x[jj]); }

    } else if (bass_pattern[ii] ===  2) {

      note = m.note( z[2], cur_t, 4*spn, vel );
      var x = m.wreathDuration([note], [0.25, 0.75], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_bass.push(x[jj]); }

    } else if (bass_pattern[ii] ===  3) {

      note = m.note( z[3], cur_t, 4*spn, vel );
      var x = m.wreathDuration([note], [0.25, 0.75], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_bass.push(x[jj]); }

    } else if (bass_pattern[ii] === 'x') {

      note = m.note( z[2], cur_t, 3*spn, vel );
      tune_bass.push(note);

      note = m.note( z[1], cur_t + 3*spn, 3*spn, vel );
      tune_bass.push(note);

      note = m.note( z[0], cur_t + 6*spn, 2*spn, vel );
      tune_bass.push(note);

    } else if (bass_pattern[ii] === 'y') {
    } else if (bass_pattern[ii] === 'p0') {

      for (var jj=0; jj<arp.length; jj++) {
        note = m.note( bass_arp[jj], cur_t + jj*spn, spn, vel );
        tune_bass.push(note);
      }
    } else if (bass_pattern[ii] === 'p1') {
    }

    cur_t += bar_dt;
  }


  var w = [ "b3", "c4", "d4", "e4" ];
  var tune_arp = [];

  cur_t = 0;
  bar_dt = m.timeSignature[0] * dt;
  for (var ii=0; ii<arp_pattern.length; ii++) {
    var note = {};

    if        (arp_pattern[ii] === -1) {
    } else if (arp_pattern[ii] ===  0) {

      note = m.note( w[0], cur_t, 4*spn, 0.8 );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] ===  1) {

      note = m.note( w[1], cur_t, 4*spn, 0.8 );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] ===  2) {

      note = m.note( w[2], cur_t, 4*spn, 0.8 );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] ===  3) {

      note = m.note( w[3], cur_t, 4*spn, 0.8 );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] === 'x') {

      note = m.note( w[2], cur_t, 3*spn, 0.8 );
      tune_arp.push(note);

      note = m.note( w[1], cur_t + 3*spn, 3*spn, 0.8 );
      tune_arp.push(note);

      note = m.note( w[0], cur_t + 6*spn, 2*spn, 0.8 );
      tune_arp.push(note);

    } else if (arp_pattern[ii] === 'y') {
    } else if (arp_pattern[ii] === 'p0') {

      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp[jj], cur_t + jj*spn, spn, 0.8 );
        tune_arp.push(note);
      }
    } else if (arp_pattern[ii] === 'p1') {

      var n2 = arp.length/2;
      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp[jj + n2], cur_t + jj*spn, spn, 0.8 );
        tune_arp.push(note);
      }

    } else if (arp_pattern[ii] === 'q0') {

      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_octave[jj], cur_t + jj*spn, spn, 0.8 );
        tune_arp.push(note);
      }
    } else if (arp_pattern[ii] === 'q1') {

      var n2 = arp.length/2;
      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_octave[jj + n2], cur_t + jj*spn, spn, 0.8 );
        tune_arp.push(note);
      }

    } else if (arp_pattern[ii] === 'P0') {

      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_bridge[jj], cur_t + jj*spn, spn, 0.8 );
        tune_arp.push(note);
      }
    } else if (arp_pattern[ii] === 'P1') {

      var n2 = arp.length/2;
      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_bridge[jj + n2], cur_t + jj*spn, spn, 0.8 );
        tune_arp.push(note);
      }

    }

    cur_t += bar_dt;
  }


  return { "bass":tune_bass, "arp": tune_arp };
}

function experiment1() {
  var m = new FamiliarSynths();

  var nbar = 180*m.bps;
  var nnotes = nbar * m.timeSignature[0];

  var cool_p = 5/60;

  var nbar_act = Math.floor(nbar/3);
  var nbar_act_ramp = Math.floor((1-cool_p)*(nbar_act));
  var nbar_act_cool = Math.floor((cool_p)*(nbar_act));

  var ts = m.timeSignature[0];

  var t0 = 0;
  var dt = 1/(m.timeSignature[0] * m.bps);
  var spn = dt;

  var z = [ "b0", "c1", "d1", "e1" ];

  var bass_info = {
    "notes" : [ z[0], z[1], z[2], z[3] ],
    "pattern" : [
      [ [z[1], 4] ],
      [ [z[1], 4], [z[2], 4], [z[3], 4] ],
      [ [z[3], 4] ],
      [ [z[3], 4], [z[2], 4], [z[1], 4] ],
      [ [z[2], 3], [z[1], 3], [z[0], 2] ]
    ],
    "patternTransition": [
      [ 0.65,  0.25, 0.0, 0.0, 0.1 ],
      [  0.0,  0.0,  0.9, 0.1, 0.0 ],
      [  0.0,  0.0, 0.65,0.35, 0.0 ],
      [  0.9,  0.0, 0.00, 0.0, 0.1 ],
      [  1.0,  0.0, 0.00, 0.0, 0.0 ],
    ],
    "spn" : spn,
    "timeSignature" : ts
  };

  console.log("spn:", spn);

  var tune_bass = [];
  var tune_arp = [];

  //var f_choose = function(n) { return Math.floor(Math.random()*n); }
  var f_choose = function(tr, idx) {
    var s = 0;
    var p = Math.random();

    for (var ii=0; ii<tr[idx].length; ii++) {
      s += tr[idx][ii];
      if (p < s) { return ii; }
    }

    return -1;
  }

  var phrase_bar_len = 4;
  var n_phrase = nbar / phrase_bar_len;
  var t = 0;

  var phrase_idx = 0;
  for (var p=0; p<n_phrase; p++) {

    //var phrase_idx = f_choose(bass_info.pattern.length);
    phrase_idx = f_choose(bass_info.patternTransition, phrase_idx);

    for (var ii=0; ii<bass_info.pattern[phrase_idx].length; ii++) {

      var note_str = bass_info.pattern[phrase_idx][ii][0];
      var note_span = bass_info.pattern[phrase_idx][ii][1] * spn;

      var note_dur = spn * bass_info.pattern[phrase_idx][ii][1];

      var note = m.note( note_str, t, note_dur, 0.8 );
      t += note_span;

      var x = m.wreathDuration([note], [0.25, 0.75], 0.9);
      for (var jj=0; jj<x.length; jj++) {
        tune_bass.push( x[jj] );
      }

    }
  }

  var arp = [ "c2", "e2", "g2", "b2", "c3", "b2", "g2", "e2" ];

  n_phrase = nnotes / (arp.length * m.timeSignature[0]);

  console.log(">>arp, n_phrase", n_phrase, "dt", dt);

  notedur=1/16;
  t = 0;
  for (var p=0; p<n_phrase; p++) {
    for (var ii=0; ii<arp.length; ii++) {
      var note = m.note( arp[ii], t, notedur, 1 );
      t += dt;
      tune_arp.push( note );
    }

  }

  return { "bass":tune_bass, "arp": tune_arp };
}

function experiment0() {
  var m = new FamiliarSynths();

  var nbar = 180*m.bps;
  var nnotes = nbar * m.timeSignature[0];

  var cool_p = 5/60;

  var nbar_act = Math.floor(nbar/3);
  var nbar_act_ramp = Math.floor((1-cool_p)*(nbar_act));
  var nbar_act_cool = Math.floor((cool_p)*(nbar_act));

  var ramp_del_u = (100/(3-(2*cool_p))) ;
  var ramp_del_d = (100 - (3*ramp_del_u))/2;

  var cost_prev = 0,
      cost_del   = ramp_del_u / nbar_act_ramp;
      cost_del_m = ramp_del_d / nbar_act_cool;
  var prev_cost = 0;
  var bar_cost_target = [];

  for (var ii=0; ii<nbar; ii++) {

    var tb = ii%nbar_act;

    if (tb < nbar_act_ramp) { cost_prev += cost_del;   }
    else                    { cost_prev += cost_del_m; }

    bar_cost_target.push(cost_prev);
  }

  var ts = m.timeSignature[0];

  var t0 = 0;
  var dt = 1/(m.timeSignature[0] * m.bps);
  var spn = dt;

  var z = [ "b0", "c1", "d1", "e1" ];

  var bass_info = {
    "notes" : [ z[0], z[1], z[2], z[3] ],
    "pattern" : [
      [ [z[1], 4] ],
      [ [z[1], 4], [z[2], 4], [z[3], 4] ],
      [ [z[3], 4] ],
      [ [z[3], 4], [z[2], 4], [z[1], 4] ],
      [ [z[2], 3], [z[1], 3], [z[0], 2] ]
    ],
    "patternTransition": [
      [ 0.65,  0.25, 0.0, 0.0, 0.1 ],
      [  0.0,  0.0,  0.9, 0.1, 0.0 ],
      [  0.0,  0.0, 0.65,0.35, 0.0 ],
      [  0.9,  0.0, 0.00, 0.0, 0.1 ],
      [  1.0,  0.0, 0.00, 0.0, 0.0 ],
    ],
    "spn" : spn,
    "timeSignature" : ts
  };

  console.log("spn:", spn);

  /*
  var dtnote = 4*dt * (1/8);

  var bar = [null, null, null, null];
  bar[0] = [ m.note(z[1], t0, dtnote*ts) ];
  bar[1] = [ m.note(z[2], t0, dtnote*ts),
             m.note(z[3], t0 + dtnote*ts, dtnote*ts) ];
  bar[2] = [ m.note(z[3], t0, dtnote*ts) ];
  bar[3] = [ m.note(z[2], t0, .75*dtnote*ts),
             m.note(z[1], t0 + .75*dtnote*ts, .75*dtnote*ts),
             m.note(z[0], t0 + 1.5*dtnote*ts, .25*dtnote*ts) ];

  var b0 = bar[0];
  var b1 = bar[1];
  var b2 = bar[2];
  var b3 = bar[3];

  var phrase = {
    "d":
      [
        [b0[0],b0[0],b0[0],b0[0]],  // base maintain
        [b1[0],b1[1],b2[0],b2[0]],  // rise
        [b2[0],b2[0],b2[0],b2[0]],  // rise maintain
        [b2[0],b2[0],b1[1],b0[0]],  // fall to base
        [b3[0],b3[1],b3[2]]         // end
      ],
    "transitionCost":
      [
        [ 0.5,   1,  10,  20,  5 ],
        [  10,  30,   1,   2, 20 ],
        [  10,  20, 0.5,   1,  5 ],
        [   1,  20,  30,  40, 20 ],
        [  30,  30,  30,  40, 20 ],
      ],
  };

  */

  var tune_bass = [];
  var tune_arp = [];

  var f_choose = function(n) {
    return Math.floor(Math.random()*n);
  }


  var phrase_bar_len = 4;
  var n_phrase = nbar / phrase_bar_len;
  var t = 0;

  console.log(">>bass n_phrase", n_phrase);

  for (var p=0; p<n_phrase; p++) {


    // blank phrase...seems a bit too long
    //
    //var phrase_idx = f_choose(phrase.d.length + 1);
    //if (phrase_idx >= phrase.d.length ) {
    //  t += phrase_bar_len * dtnote * 4 * ts;
    //  continue;
    //}

    //var phrase_idx = f_choose(phrase.d.length);
    var phrase_idx = f_choose(bass_info.pattern.length);

    //DEBUG
    phrase_idx=0;

    //for (var ii=0; ii<phrase.d[phrase_idx].length; ii++) {
    for (var ii=0; ii<bass_info.pattern[phrase_idx].length; ii++) {

      var note_str = bass_info.pattern[phrase_idx][ii][0];
      var note_span = bass_info.pattern[phrase_idx][ii][1] * spn;

      var note_dur = spn * bass_info.pattern[phrase_idx][ii][1];

      var note = m.note( note_str, t, note_dur, 0.8 );
      t += note_span;

      //tune_bass.push( note );

      var x = m.wreathDuration([note], [0.25, 0.75], 0.9);
      for (var jj=0; jj<x.length; jj++) {
        tune_bass.push( x[jj] );
      }

//      var note = m.notedup( phrase.d[phrase_idx][ii] );
//      note.t = t;
//      t += note.d;
//      //tune_bass.push( note );
//
//      var x = m.wreathDuration([note], [0.25, 0.75]);
//      console.log(note, x);
//      tune_bass.push( x[0] );

    }
  }


  var arp = [ "c2", "e2", "g2", "b2", "c3", "b2", "g2", "e2" ];

  n_phrase = nnotes / (arp.length * m.timeSignature[0]);

  console.log(">>arp, n_phrase", n_phrase, "dt", dt);

  notedur=1/16;
  t = 0;
  for (var p=0; p<n_phrase; p++) {
    for (var ii=0; ii<arp.length; ii++) {
      var note = m.note( arp[ii], t, notedur, 1 );
      t += dt;
      tune_arp.push( note );
    }

  }

  return { "bass":tune_bass, "arp": tune_arp };
}

var fs_bass = new FamiliarSynths();
var fs_arp = new FamiliarSynths();

//var tune = experiment1();
var tune = force_tune();

var midi_bass_tune = fs_bass.convertToMIDI(tune.bass);
var midi_arp_tune = fs_arp.convertToMIDI(tune.arp);


/*

var t0 = 0;
var dt = 0.125;
var xx = [];
xx.push( fs.note("c4", t0) )
xx.push( fs.note("e4", t0+dt) );
xx.push( fs.note("g4", t0+2*dt) );

console.log("orig\n----");
console.log(xx);
console.log("\n");


//--

var tn = {};

tn = fs.replicate(xx, 12);

console.log("replicate\n----");
console.log(tn);
console.log("\n");

//---

tn = fs.shift(xx, 12);

console.log("shift\n----");
console.log(tn);
console.log("\n");

//---

tn = fs.widen(xx);

console.log("widen\n----");
console.log(tn);
console.log("\n");

//---

tn = fs.inflate(xx);

console.log("inflate\n----");
console.log(tn);
console.log("\n");

//---

tn = fs.wreathDuration (xx, [0.25, .75] );

console.log("wreathDuration\n----");
console.log(tn);
console.log("\n");

//--

console.log("MIDI\n----");
console.log(fs.convertToMIDI(xx));
console.log("\n");

*/
