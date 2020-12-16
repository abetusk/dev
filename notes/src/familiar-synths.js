// Licnese: CC0
//

var stoch = require("stochastic");

function _irnd(irange) {
  _r = ((typeof irange === "undefined") ? 2 : irange);
  return Math.floor(_r * Math.random());
}

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
    "phyrgian": [0,+1,+3,+5,+7,+8,+10],
    "lydian":  [0,+2,+4,+6,+7,+9,+11] ,
    "mixolydian":  [0,+2,+4,+5,+7,+9,+10]
  };

  this.musicalModeList = [ "aeolian", "locrian", "ionian", "dorian", "phyrgian", "lydian", "mixolydian" ];

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

function ok() {
  var fs = new FamiliarSynths();
  var permute_arp = false;
  //permute_arp = true;

  var tempo = 90;
  var s_per_bar = 60/tempo;

  var nbar = 90;
  var npb = 4;

  var base_mkey = [0,+2,+4,+5,+7,+9,+11];
  var mkey = [0,+2,+4,+5,+7,+9,+11,12];

  console.log(mkey);

  // set up basic arp battern
  //

  var arp_info = {
    "n" : 5,
    "type": "looped",
    "midi": {},
    "midiNote": [],
    "noteTune": [],
    "idx" : []

  };

  // choose a basic pattern through the key
  //
  for (var ii=0; ii<arp_info.n; ii++) { arp_info.idx.push(ii); }

  // permute randomely
  //
  if (permute_arp) {
    console.log("???");
    var n = arp_info.idx.length;
    for (var ii=0; ii<arp_info.idx.length; ii++) {
      var p = ii + Math.floor(Math.random()*(n-ii));
      var t = arp_info.idx[p];
      arp_info.idx[p] = arp_info.idx[ii];
      arp_info.idx[ii] = t;
    }
  }

  // and reflect if it's looped
  //
  if (arp_info.type=="looped") {
    for (var ii=1; ii<(arp_info.n-1); ii++) { arp_info.idx.push(arp_info.idx[ arp_info.n-1-ii ]); }
  }

  //----

  var del_b = 1;
  if (arp_info.type=="looped") { del_b=2; }

  var m = arp_info.idx.length;
  //var base_midi = fs.note2midi("c2");
  var base_midi = fs.note2midi("c3");

  // choose a random starting point in our key
  //
  var base_idx = Math.floor(Math.random()*m);

  console.log("arp base_midi", base_midi, "base_idx", base_idx);

  var arp_bar_mask = [];
  for (var ii=0; ii<nbar; ii++) { arp_bar_mask.push('.'); }
  for (var ii=0; ii<nbar; ii+=del_b) {

    //if (ii < (nbar/6)) {
    if (ii < 16) {
      arp_bar_mask[ii]='.';
      arp_bar_mask[ii+1]='.';
      continue;
    }
    //else if (ii > (nbar - (nbar/12))) {
    else if (ii > (nbar - 8)) {
      arp_bar_mask[ii]='.';
      arp_bar_mask[ii+1]='.';
      continue;
    }


    for (var jj=0; jj<del_b; jj++) {
      arp_bar_mask[ii+jj]='i';

    }
  }

  console.log(arp_bar_mask);


  // Set up the midi note (without velocity or timing)
  //
  for (var ii=0; ii<nbar; ii+=del_b) {

    for (var d=0; d<del_b; d++) {

      if ((ii+d) >= nbar) { continue; }

      for (var jj=0; jj<npb; jj++) {

        if (arp_bar_mask[ii+d] == '.') { arp_info.midiNote.push(null); continue; }
        else if (arp_bar_mask[ii+d] == 'i') {
          arp_info.midiNote.push( mkey[arp_info.idx[(jj+base_idx)%m]] + base_midi );
          if ((jj+base_idx) > m) { arp_info.midiNote[ arp_info.midiNote.length-1 ] += 12; }
        }

      }

    }

  }

  // Finally translate to a note object for playability
  //
  var cur_t = 0;
  for (var ii=0; ii<arp_info.midiNote.length; ii++) {
    if (arp_info.midiNote[ii] != null) {
      var note = fs.note( fs.midi2note(arp_info.midiNote[ii]), cur_t, 1/6, 0.9 );
      arp_info.noteTune.push( note );
    }
    cur_t += 1/6;
  }

  var arp_fs = new FamiliarSynths();
  arp_info.midi = arp_fs.convertToMIDI(arp_info.noteTune);

  //DEBUG
  //console.log(JSON.stringify(arp_info));

  // ---
  // bass
  // ---

  var bass_info = {
    "n" : 4,
    "type":"",
    "pattern": [],
    "inote": [],
    "midiNote":[],
    "noteTune":[],
    "idx":[]
  };

  // for the bass, go down an active from the arpeggio
  //
  //base_midi = fs.note2midi("c1");
  base_midi -= 12;

  var del_bass = Math.floor( Math.random()*2 ) + 1;
  var del_bass1 = Math.floor( Math.random()*2 ) + 1;
  if (Math.random() < 0.5) {
    del_bass  = -del_bass;
    del_bass1 = -del_bass1;
  }

  var pat = [];
  
  pat = [];
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx + del_bass);
  pat.push(base_idx + del_bass);
  pat.push(base_idx + del_bass);
  pat.push(base_idx + del_bass);

  pat.push(base_idx - del_bass1);
  pat.push(base_idx - del_bass1);
  pat.push(base_idx - del_bass1);
  pat.push(base_idx - del_bass1);

  bass_info.pattern.push(pat);

  pat = [];
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx + del_bass);
  pat.push(base_idx + del_bass);
  pat.push(base_idx - del_bass1);
  pat.push(base_idx - del_bass1);
  bass_info.pattern.push(pat);

  pat = [];
  pat.push(base_idx);
  pat.push(base_idx);
  pat.push(base_idx + del_bass);
  pat.push(base_idx - del_bass);
  bass_info.pattern.push(pat);

  pat = [];
  pat.push(base_idx);
  pat.push(base_idx + del_bass);
  pat.push(base_idx + 2*del_bass);
  bass_info.pattern.push(pat);

  pat = [];
  pat.push(base_idx);
  pat.push(base_idx + del_bass);
  pat.push(base_idx);
  pat.push(base_idx - del_bass);
  bass_info.pattern.push(pat);

  console.log(JSON.stringify(bass_info));

  var note_sec = s_per_bar / npb;
  var play_note_sec = s_per_bar / npb;

  var pat_ele_per_bar = 2;

  cur_t = 0;
  var pat_idx = 0, note_idx=0;
  for (var ii=0; ii<nbar; ii++) {

    // trying to generalize...
    /*
    note_sec = pat_ele_per_bar * s_per_bar / npb;
    play_note_sec = 0.75*note_sec;
    for (var jj=0; j<npb; jj+=pat_ele_per_bar) {
      var rel_idx = bass_info.pattern[pat_idx][note_idx];
      var rel_note = base_mkey[(rel_idx+base_mkey.length)%base_mkey.length];

      if (rel_idx<0) { rel_note -= 12; }
      else if (rel_idx>=base_mkey.length) { rel_note += 12; }

      var note = fs.note( fs.midi2note( base_midi + rel_note), cur_t, play_note_sec, 0.9 );
      bass_info.noteTune.push(note);

      cur_t += note_sec;

      note_idx = (note_idx+1) % bass_info.pattern[pat_idx].length;
    }
    */

    // old...
    //
    /*
    var pat_ele_len = 4;
    note_sec = pat_ele_len*s_per_bar / npb;
    play_note_sec = note_sec;
    play_note_sec = 0.95 * note_sec;
    pat_idx=1;
    for (var jj=0; jj<npb; jj+=pat_ele_len) {
      var rel_idx = bass_info.pattern[pat_idx][note_idx];
      var rel_note = base_mkey[(rel_idx+base_mkey.length)%base_mkey.length];
      if (rel_idx<0) { rel_note -= 12; }
      else if (rel_idx>=base_mkey.length) { rel_note += 12; }

      var note = fs.note( fs.midi2note( base_midi + rel_note), cur_t, play_note_sec, 0.9 );
      bass_info.noteTune.push(note);

      cur_t += note_sec;

      note_idx = (note_idx+1) % bass_info.pattern[pat_idx].length;
    }
    */

    // experimental
    //
    pat_idx=2;
    note_sec = 8*s_per_bar / npb;
    play_note_sec = 0.5 * note_sec;

    if (ii%2) { continue; }

    console.log(note_sec, play_note_sec, s_per_bar, npb);

    for (var jj=0; jj<1; jj+=4) {
      var rel_idx = bass_info.pattern[pat_idx][note_idx];
      var rel_note = base_mkey[(rel_idx+base_mkey.length)%base_mkey.length];

      if (rel_idx<0) { rel_note -= 12; }
      else if (rel_idx>=base_mkey.length) { rel_note += 12; }

      var note = fs.note( fs.midi2note( base_midi + rel_note), cur_t, play_note_sec, 0.9 );
      bass_info.noteTune.push(note);

      cur_t += note_sec;

      note_idx = (note_idx+1) % bass_info.pattern[pat_idx].length;
    }

    // current
    /*
    note_sec = 2*s_per_bar / npb;
    play_note_sec = note_sec;
    play_note_sec = 0.95 * note_sec;
    for (var jj=0; jj<npb; jj+=2) {
      var rel_idx = bass_info.pattern[pat_idx][note_idx];
      var rel_note = base_mkey[(rel_idx+base_mkey.length)%base_mkey.length];

      if (rel_idx<0) { rel_note -= 12; }
      else if (rel_idx>=base_mkey.length) { rel_note += 12; }

      var note = fs.note( fs.midi2note( base_midi + rel_note), cur_t, play_note_sec, 0.9 );
      bass_info.noteTune.push(note);

      cur_t += note_sec;

      note_idx = (note_idx+1) % bass_info.pattern[pat_idx].length;
    }
    */

    // old...
    //
    /*
    note_sec = 4*s_per_bar / npb;
    play_note_sec = note_sec;
    for (var jj=0; jj<npb; jj+=4) {
      var rel_idx = bass_info.pattern[pat_idx][note_idx];
      var rel_note = base_mkey[(rel_idx+base_mkey.length)%base_mkey.length];
      if (rel_idx<0) { rel_note -= 12; }
      else if (rel_idx>=base_mkey.length) { rel_note += 12; }

      var note = fs.note( fs.midi2note( base_midi + rel_note), cur_t, play_note_sec, 0.9 );
      bass_info.noteTune.push(note);

      cur_t += note_sec;

      note_idx = (note_idx+1) % bass_info.pattern[pat_idx].length;
    }
    */

    //note_idx = (note_idx+1) % bass_info.pattern[pat_idx].length;
  }

  var fs_bass = new FamiliarSynths();
  bass_info.midi = fs_bass.convertToMIDI(bass_info.noteTune);


  // ----
  // drums
  // ----

  var drum_info = {
    "kick" : [],
    "snare": [],
    "hihat":[],
    "closedhat":[],
    "clap":[],

    "flourish": {
      "act" : [
        { "intro" : [8,14], "lead": [14,16], "body":[16,nbar-4], "outro":[nbar-4,nbar] },
        { },
        { },
      ]
    },

    "actSection" : function(act_idx, bar_idx) {
      for (var key in this.flourish.act[act_idx]) {
        if ((bar_idx >= this.flourish.act[act_idx][key][0]) &&
            (bar_idx < this.flourish.act[act_idx][key][1])) {
          return key;
        }
      }
      return "default";
    }
  };


  var drum_bar_mask = [];
  for (var ii=0; ii<nbar; ii++) { drum_bar_mask.push('....'); }
  for (var ii=0; ii<nbar; ii++) {

    var section = drum_info.actSection(0, ii);

    if (section=="default") { continue; }

    if (section=="intro") {

      if ((ii%4)==0)      { drum_bar_mask[ii] = 'b.b.'; }
      else if ((ii%4)==1) { drum_bar_mask[ii] = "c..."; }
      else if ((ii%4)==2) { drum_bar_mask[ii] = "b..."; }
      else if ((ii%4)==3) { drum_bar_mask[ii] = "c..."; }

      continue;
    }

    if (section=="lead") {

      if ((ii%2)==0) { drum_bar_mask[ii] = 'bbbb'; }
      else           { drum_bar_mask[ii] = 'c.c.'; }

      continue;
    }

    if (section=="body") {

      if ((ii%4)==0)      { drum_bar_mask[ii] = 'b.b.'; }
      else if ((ii%4)==1) { drum_bar_mask[ii] = "s.b."; }
      else if ((ii%4)==2) { drum_bar_mask[ii] = "b.b."; }
      else if ((ii%4)==3) { drum_bar_mask[ii] = "s.b."; }

      continue;
    }

    if (section == "outro") {
      drum_bar_mask[ii] = 'c.c.';
      continue;
    }

  }

  cur_t=0;
  var kick_fudge = 0,
      snare_fudge = 0,
      hihat_fudge = 0,
      closedhat_fudge = 0,
      clap_fudge = 0;

  for (var ii=0; ii<nbar; ii++) {

    if (ii>0) {
      kick_fudge = -0.08;
      snare_fudge = -0.08;
      clap_fudge = -0.08;
      closedhat_fudge = -0.08;
      hihat_fudge = -0.08;
    }

    var drum_parts = drum_bar_mask[ii].split('|');
    if (drum_parts.length==1) {
      drum_parts = drum_bar_mask[ii].split('');
    }

    var drum_t = cur_t;

    //for (jj=0; jj<npb; jj++) {
    for (var jj=0; jj<drum_parts.length; jj++) {

      if (jj >= drum_parts.length) {
      }
      if (drum_parts[jj].includes('.')) {
      }
      if (drum_parts[jj].includes('b')) {
        drum_info.kick.push( fs.note("c0", drum_t+kick_fudge, 1/6, 0.9) );
      }
      if (drum_parts[jj].includes('H')) {
        drum_info.hihat.push( fs.note("c0", drum_t+hihat_fudge, 1/6, 0.9) );
      }
      if (drum_parts[jj].includes('h')) {
        drum_info.closedhat.push( fs.note("c0", drum_t+closedhat_fudge, 1/6, 0.9) );
      }
      if (drum_parts[jj].includes('s')) {
        drum_info.snare.push( fs.note("c0", drum_t+snare_fudge, 1/6, 0.9) );
      }
      if (drum_parts[jj].includes('c')) {
        drum_info.clap.push( fs.note("c0", drum_t+clap_fudge, 1/6, 0.9) );
      }

      drum_t += (s_per_bar/drum_parts.length);
    }

    cur_t += s_per_bar;
  }


  //return { "bass": bass_info, "drum":drum_info };
  return { "bass": bass_info, "arp":arp_info, "drum":drum_info };
  //return { "arp":arp_info, "drum":drum_info };
}

function xx() {
  var fs = new FamiliarSynths();

  var mScale = fs.musicalMode["ionian"];
  var n = mScale.length;

  var root_bass_note = "c2";
  var root_bass_midi = fs.note2midi(root_bass_note);

  var delScale = [];
  for (var ii=0; ii<mScale.length; ii++) {
    var t = [ mScale[(ii+n-1)%n] - mScale[ii], mScale[(ii+1)%n] - mScale[ii] ];
    t[0] = (t[0] + 12)%12;
    t[1] = (t[1] + 12)%12;
    if (t[0] > 6) { t[0] -= 12; }
    if (t[1] > 6) { t[1] -= 12; }
    delScale.push(t);
  }

  var spos = Math.floor(Math.random()*n);

  var n_act = 3;
  var n_bar_per_act = 90;
  var nbpa0 = n_bar_per_act/3;
  var nbpa1 = 2*n_bar_per_act/3;

  var bass_bar = [];
  for (var ii=0; ii<n_act * n_bar_per_act; ii++) {
    if ((ii%2)==0) { bass_bar.push('b'); }
    else { bass_bar.push(''); }
  }

  for (var ii=nbpa0; ii<n_bar_per_act; ii++) {
    if ((ii%4)==0) { }
    else if ((ii%4)==2) {
      bass_bar[0*n_bar_per_act + ii] += 'u';
      bass_bar[1*n_bar_per_act + ii] += 'u';
      bass_bar[2*n_bar_per_act + ii] += 'u';
    }
    else if ((ii%4)==3) {
      bass_bar[0*n_bar_per_act + ii] += 's';
      bass_bar[1*n_bar_per_act + ii] += 's';
      bass_bar[2*n_bar_per_act + ii] += 's';
    }
    else if ((ii%4)==4) {
      bass_bar[0*n_bar_per_act + ii] += 'f';
      bass_bar[1*n_bar_per_act + ii] += 'f';
      bass_bar[2*n_bar_per_act + ii] += 'f';
    }
  }


  console.log(JSON.stringify(bass_bar));

  //console.log(">>>", root_bass_note, root_bass_midi);
  console.log(mScale);
}

function custom_tune() {
  return {};
}

// n, v, t, l
//
function custom_synthwave(sw_info) {
  var default_sw_info = {
    "n_s" : 180,
    "bpm" : 90,
    "bps" : 90/60,
    "n_bar" : (90/60)*180,
    "musicMode" : "ionian",
    "baseBarLen": 2,
    "bassPattern" : [
      'b',   '',  'b',   '',   'b',   '',  'b',   '',
      'b', 'bu', 'uf',  'b',   'b', 'bu', 'uf',  'b',
      ''
    ],
  };

  var m = new FamiliarSynths();

  sw_info = ((typeof sw_info === "undefined") ? {} : sw_info);


  var nbar = 180*m.bps;
  var nnotes = nbar * m.timeSignature[0];

  var cool_p = 5/60;

  var nbar_act = Math.floor(nbar/3);
  var nbar_act_ramp = Math.floor((1-cool_p)*(nbar_act));
  var nbar_act_cool = Math.floor((cool_p)*(nbar_act));

  var ts = m.timeSignature[0];

  var t0 = 0;
  var dt = 1/(m.timeSignature[0] * m.bps);

  var wholenote_dt = 1/(m.timeSignature[0] * m.bps);
  var bar_dt = 1/m.bps;
  var spn = dt;

  console.log("bar_dt:", bar_dt, ", wholenote_dt:", wholenote_dt );

  var z = [ "b0", "c1", "d1", "e1" ];

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
    0.15, 0.15, 0.16, 0.2,  0.25, 0.25, 0.25, 0.3,   0.4, 0.4, 0.4, 0.45,
    0.5, 0.5, 0.5, 0.5,     0.4, 0.4, 0.5, 0.5,      0.5, 0.5, 0.5, 0.5,

    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,

    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,

    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.45,   0.4, 0.35, 0.3, 0.25
  ];

  var arp_act_info = [
    [ 0, 6*4 ],
    [ 6*4, 18*4 ],
    [ 18*4, 26*4 ]
  ];
  var arp_filt_sched = [ ];

  var bass_act_info = [
    [ 0, 6*4 ],
    [ 6*4, 18*4 ],
    [ 18*4, 26*4 ]
  ];
  var bass_filt_sched = [ ];

  var min_f = -1, max_f = -1, del_f = -1, cur_f = -1;

  min_f = 2000; max_f = 10000-3000; del_f = 150;
  cur_f = min_f;
  for (var jj=arp_act_info[0][0]; jj<arp_act_info[0][1]; jj++) {
    arp_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f += del_f;
    if (cur_f > max_f) { cur_f = max_f; }
  }

  min_f = 2000+2000; max_f = 10000; del_f = 150;
  cur_f = min_f;
  for (var jj=arp_act_info[1][0]; jj<arp_act_info[1][1]; jj++) {
    arp_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f += del_f;
    if (cur_f > max_f) { cur_f = max_f; }
  }

  min_f = 2000; max_f = 10000; del_f = 150;
  cur_f = max_f;
  for (var jj=arp_act_info[2][0]; jj<arp_act_info[2][1]; jj++) {
    arp_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f -= del_f;
    if (cur_f < min_f) { cur_f = min_f; }
  }



  min_f = 1000; max_f = 10000; del_f = 150;
  cur_f = min_f;
  for (var jj=bass_act_info[0][0]; jj<bass_act_info[0][1]; jj++) {
    bass_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f += del_f;
    if (cur_f > max_f) { cur_f = max_f; }
  }

  min_f = 1000+2000; max_f = 10000; del_f = 150;
  cur_f = max_f;
  for (var jj=bass_act_info[1][0]; jj<bass_act_info[1][1]; jj++) {
    bass_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f += del_f;
    if (cur_f > max_f) { cur_f = max_f; }
  }

  min_f = 1000; max_f = 10000; del_f = 150;
  cur_f = max_f;
  for (var jj=bass_act_info[2][0]; jj<bass_act_info[2][1]; jj++) {
    bass_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f -= del_f;
    if (cur_f < min_f) { cur_f = min_f; }
  }

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

  //var nd = 4*spn; 
  var nd = 2*spn; 
  //var nd = spn; 

  var vel = 1.0;

  cur_t = 0;
  bar_dt = m.timeSignature[0] * dt;
  for (var ii=0; ii<arp_pattern.length; ii++) {
    var note = {};

    if        (arp_pattern[ii] === -1) {
    } else if (arp_pattern[ii] ===  0) {

      note = m.note( w[0], cur_t, bar_dt, vel );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] ===  1) {

      note = m.note( w[1], cur_t, bar_dt, vel );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] ===  2) {

      note = m.note( w[2], cur_t, bar_dt, vel );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] ===  3) {

      note = m.note( w[3], cur_t, bar_dt, vel );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] === 'x') {

      note = m.note( w[2], cur_t, 3*nd, vel );
      tune_arp.push(note);

      note = m.note( w[1], cur_t + 3*spn, 3*nd, vel );
      tune_arp.push(note);

      note = m.note( w[0], cur_t + 6*spn, 2*nd, vel );
      tune_arp.push(note);

    } else if (arp_pattern[ii] === 'y') {
    } else if (arp_pattern[ii] === 'p0') {

      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp[jj], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }
    } else if (arp_pattern[ii] === 'p1') {

      var n2 = arp.length/2;
      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp[jj + n2], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }

    } else if (arp_pattern[ii] === 'q0') {

      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_octave[jj], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }
    } else if (arp_pattern[ii] === 'q1') {

      var n2 = arp.length/2;
      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_octave[jj + n2], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }

    } else if (arp_pattern[ii] === 'P0') {

      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_bridge[jj], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }
    } else if (arp_pattern[ii] === 'P1') {

      var n2 = arp.length/2;
      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_bridge[jj + n2], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }

    }

    cur_t += bar_dt;
  }


  return {
    "bass":tune_bass,
    "arp": tune_arp,
    "arp_filt_sched": arp_filt_sched,
    "bass_filt_sched": bass_filt_sched
  };
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

  var bar_dt = m.timeSignature[0] * dt;

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

//  var bass_vel = [
//    1, 0.8, 0.6, 0.5,    0.4, 0.3, 0.2, 0.5,   0.5, 0.5, 0.5, 0.5,
//    0.5, 0.5, 0.5, 0.5,  0.3, 0.4, 0.5, 0.5,   0.5, 0.25, 0.525, 0.5,
//
//    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
//    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
//    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
//
//    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
//
//    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
//    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5
//  ];

  var bass_vel = [
    0.15, 0.15, 0.16, 0.2,  0.25, 0.25, 0.25, 0.3,   0.4, 0.4, 0.4, 0.45,
    0.5, 0.5, 0.5, 0.5,     0.4, 0.4, 0.5, 0.5,      0.5, 0.5, 0.5, 0.5,

    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,

    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,

    0.5, 0.5, 0.5, 0.5,   0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.45,   0.4, 0.35, 0.3, 0.25
  ];

  var arp_act_info = [
    [ 0, 6*4 ],
    [ 6*4, 18*4 ],
    [ 18*4, 26*4 ]
  ];
  var arp_filt_sched = [ ];

  var bass_act_info = [
    [ 0, 6*4 ],
    [ 6*4, 18*4 ],
    [ 18*4, 26*4 ]
  ];
  var bass_filt_sched = [ ];

  var min_f = -1, max_f = -1, del_f = -1, cur_f = -1;

  min_f = 2000; max_f = 10000-3000; del_f = 150;
  cur_f = min_f;
  for (var jj=arp_act_info[0][0]; jj<arp_act_info[0][1]; jj++) {
    arp_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f += del_f;
    if (cur_f > max_f) { cur_f = max_f; }
  }

  min_f = 2000+2000; max_f = 10000; del_f = 150;
  cur_f = min_f;
  for (var jj=arp_act_info[1][0]; jj<arp_act_info[1][1]; jj++) {
    arp_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f += del_f;
    if (cur_f > max_f) { cur_f = max_f; }
  }

  min_f = 2000; max_f = 10000; del_f = 150;
  cur_f = max_f;
  for (var jj=arp_act_info[2][0]; jj<arp_act_info[2][1]; jj++) {
    arp_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f -= del_f;
    if (cur_f < min_f) { cur_f = min_f; }
  }


//  for (var ii=0; ii<arp_act_info.length; ii++) {
//    var min_f = 300, max_f = 5000, del_f = 150;
//    var cur_f = min_f;
//    for (var jj=arp_act_info[ii][0]; jj<arp_act_info[ii][1]; jj++) {
//      arp_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
//      cur_f += del_f;
//      if (cur_f > max_f) { cur_f = max_f; }
//    }
//  }


  min_f = 1000; max_f = 10000; del_f = 150;
  cur_f = min_f;
  for (var jj=bass_act_info[0][0]; jj<bass_act_info[0][1]; jj++) {
    bass_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f += del_f;
    if (cur_f > max_f) { cur_f = max_f; }
  }

  min_f = 1000+2000; max_f = 10000; del_f = 150;
  cur_f = max_f;
  for (var jj=bass_act_info[1][0]; jj<bass_act_info[1][1]; jj++) {
    bass_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f += del_f;
    if (cur_f > max_f) { cur_f = max_f; }
  }

  min_f = 1000; max_f = 10000; del_f = 150;
  cur_f = max_f;
  for (var jj=bass_act_info[2][0]; jj<bass_act_info[2][1]; jj++) {
    bass_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
    cur_f -= del_f;
    if (cur_f < min_f) { cur_f = min_f; }
  }

//  for (var ii=0; ii<bass_act_info.length; ii++) {
//    var min_f = 300, max_f = 5000, del_f = 150;
//    var cur_f = max_f;
//    for (var jj=bass_act_info[ii][0]; jj<bass_act_info[ii][1]; jj++) {
//      bass_filt_sched.push( {"f":cur_f, "t": jj * bar_dt });
//      cur_f -= del_f;
//      if (cur_f < min_f) { cur_f = min_f; }
//    }
//  }


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

  //var nd = 4*spn; 
  var nd = 2*spn; 
  //var nd = spn; 

  var vel = 1.0;

  cur_t = 0;
  bar_dt = m.timeSignature[0] * dt;
  for (var ii=0; ii<arp_pattern.length; ii++) {
    var note = {};

    if        (arp_pattern[ii] === -1) {
    } else if (arp_pattern[ii] ===  0) {

      note = m.note( w[0], cur_t, bar_dt, vel );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] ===  1) {

      note = m.note( w[1], cur_t, bar_dt, vel );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] ===  2) {

      note = m.note( w[2], cur_t, bar_dt, vel );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] ===  3) {

      note = m.note( w[3], cur_t, bar_dt, vel );
      var x = m.wreathDuration([note], [0.25, 0.25, 0.25, 0.25], 0.9);
      for (var jj=0; jj<x.length; jj++) { tune_arp.push(x[jj]); }

    } else if (arp_pattern[ii] === 'x') {

      note = m.note( w[2], cur_t, 3*nd, vel );
      tune_arp.push(note);

      note = m.note( w[1], cur_t + 3*spn, 3*nd, vel );
      tune_arp.push(note);

      note = m.note( w[0], cur_t + 6*spn, 2*nd, vel );
      tune_arp.push(note);

    } else if (arp_pattern[ii] === 'y') {
    } else if (arp_pattern[ii] === 'p0') {

      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp[jj], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }
    } else if (arp_pattern[ii] === 'p1') {

      var n2 = arp.length/2;
      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp[jj + n2], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }

    } else if (arp_pattern[ii] === 'q0') {

      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_octave[jj], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }
    } else if (arp_pattern[ii] === 'q1') {

      var n2 = arp.length/2;
      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_octave[jj + n2], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }

    } else if (arp_pattern[ii] === 'P0') {

      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_bridge[jj], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }
    } else if (arp_pattern[ii] === 'P1') {

      var n2 = arp.length/2;
      for (var jj=0; jj<arp.length/2; jj++) {
        note = m.note( arp_bridge[jj + n2], cur_t + jj*spn, nd, vel );
        tune_arp.push(note);
      }

    }

    cur_t += bar_dt;
  }


  return {
    "bass":tune_bass,
    "arp": tune_arp,
    "arp_filt_sched": arp_filt_sched,
    "bass_filt_sched": bass_filt_sched
  };
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

  //console.log(">>arp, n_phrase", n_phrase, "dt", dt);

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

  //console.log(">>bass n_phrase", n_phrase);

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

  //console.log(">>arp, n_phrase", n_phrase, "dt", dt);

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

function print_mode_chords() {
  var fs = new FamiliarSynths();
  var mode_list =  fs.musicalModeList;
  for (var ii=0; ii<mode_list.length; ii++) {
    var mode_name = mode_list[ii];
    var _m = fs.musicalModeChord[mode_name];
    var s = mode_name + ":";
    for (var jj=0; jj<_m.length; jj++) {
      s += " " + _m[jj].name;
    }
    console.log(s);
  }
}

function _mirror(a) {
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

function _permute(a, s, n) {
  var b = [];
  if (n > (a.length - s)) { n = a.length-s; }
  if (n<=0) { return; }
  for (var ii=0; ii<a.length; ii++) { b.push(a[ii]); }

  for (var ii=0; ii<n; ii++) {
    var p = _irnd(n-ii);
    var t = b[s+ii];
    b[s+ii] = b[s+p];
    b[s+p] = t;
  }
  return b;
}

function _apick(a, n) {
  var b = _permute(a, 0, a.length);
  var r = [];
  for (var ii=0; ii<n; ii++) {
    r.push(b[ii]);
  }
  return r;
}

function _alg_v_1_0() {

  var rythm_opt = [
    [ [2, 2], [1, 1, 1, 1], [2,2], [1, 1, 1, 1] ],
    [ [3, 1], [2, 2], [3, 1], [2, 2] ],
    [ [1, 0.5, 0.5, 1, 1 ], [1, 0.5, 0.5, 1, 1 ], [1, 0.5, 0.5, 1, 1 ],  [4] ],
    [ [1, 1, 0.5, 0.5, 0.5, 0.5], [1, 1, 0.5, 0.5, 0.5, 0.5], [1, 1, 0.5, 0.5, 0.5, 0.5], [1, 1, 0.5, 0.5, 0.5, 0.5] ],
    [ [1, 1, 0.5, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5, 1, 1], [ 0.5, 0.5, 0.5, 0.5, 1, 1], [1, 1, 0.5, 0.5, 0.5, 0.5] ]
  ];
  var rythm_opt_idx = _irnd(rythm_opt.length);
  var fs = new FamiliarSynths();

  var drum_beat = fs.encodeBeat(fs.drumBeat['four_on_the_floor']);

  var root_note_idx = _irnd(12);
  var root_note_name = fs.noteName[ root_note_idx ];

  // transition from one mode to another?
  //
  var song_mode = ["lydian", "aeolian"];

  // Get the chord progression for the mode of our choice
  //
  var mode_chord = fs.musicalModeChord[song_mode[1]];
  var mode_chord4 = fs.musicalModeChord4[song_mode[1]];

  // Get list of major chords for chord progression below.
  // Also save the index lookup from major chords back to the
  // original chord list.
  //
  var mode_maj_chord_idx_map = {};
  var mode_maj_chord = [];
  for (var i=0; i<mode_chord.length; i++) {
    if (mode_chord[i].type == "maj") {
      mode_maj_chord_idx_map[mode_maj_chord.length] = i;
      mode_maj_chord.push(mode_chord[i]);
    }
  }

  var chord_prog_idx = [];

  // basic chord progression:
  // * 4 bars
  // * root chord to start
  // * any two chord transitions
  // * end on major chord
  //
  var chord_prog = [];
  chord_prog_idx.push(0);
  chord_prog.push(mode_chord[0]);
  for (var i=1; i<3; i++) {
    var r = _irnd(mode_chord.length);
    chord_prog_idx.push(r);
    chord_prog.push( mode_chord[r] );
  }
  var r = _irnd(mode_maj_chord.length);
  chord_prog_idx.push(r);
  chord_prog.push( mode_maj_chord[r] );


  // playing with 7th chords for arp
  //
  var arp_chord = [];
  arp_chord.push( mode_chord4[0] );
  for (var i=0; i<(chord_prog.length-1); i++) {
    arp_chord.push( mode_chord4[i] );
  }
  var idx = mode_maj_chord_idx_map[ chord_prog_idx[ chord_prog_idx.length-1 ] ];
  arp_chord.push( mode_chord4[idx] );

  var arp_chord_note = [];
  var arp_chord_note_dt = [];
  for (var i=0; i<arp_chord.length; i++) {
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push(0.5);
    }
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push(0.5);
    }
  }


  // arp
  //

  // simple hill ( _/-\_ )
  //

  var arp_note_occ = [];
  for (var ii=0; ii<24; ii++) { arp_note_occ.push(0); }
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      arp_note_occ[ chord_prog[ii].chord[jj] ] = 1;
    }
  }
  var arp_note = [];
  for (var ii=0; ii<arp_note_occ.length; ii++) {
    if (arp_note_occ[ii] == 1) {
      arp_note.push(ii);
    }
  }

  // mirror the arp, permute all but first note,
  // then restrict to only
  // 8 notes
  //
  var x = _mirror(arp_note);
  //x = _permute(x, 1, arp_note.length-1);
  var arp_prog =  [];
  var n_arp = 8;
  for (var prev=-1, ii=0; ii<x.length; ii++) {
    var idx = Math.floor( n_arp * ii / x.length );
    if (idx<=prev) { continue; }
    arp_prog.push(x[ii]);
    prev = idx;
  }

  // play with permuting arp...
  //
  for (var ii=1; ii<arp_prog.length; ii++) {
    var nt = arp_prog[ii];
    var p = ii + Math.floor( Math.random() * (arp_prog.length - ii) );
    arp_prog[ii] = arp_prog[p];
    arp_prog[p] = nt;
  }

  // create melody by choosing random two notes from
  // each bar of chord progression
  //

  var melody0_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);
    rythm = rythm_opt[ rythm_opt_idx ][ii];
    for (var jj=0; jj<rythm.length; jj++) {
      melody0_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm[jj] } );
    }
  }

  var rythm1_opt_idx = _irnd(rythm_opt.length);
  var melody1_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);
    //rythm = [ 1, 1, 1, 1 ];

    rythm = rythm_opt[ rythm1_opt_idx ][ii];
    console.log(bar_notes, bar_notes.length, _irnd(bar_notes.length), bar_notes[_irnd(bar_notes.length)]);
    for (var jj=0; jj<rythm.length; jj++) {
      melody1_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm[jj] } );
    }
  }


  var _song_structure = [ [''] ];



  // print sonic-pi output
  //
  var s;
  var note_name = [];
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "4" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "5" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "6" ); }

  s = "chord_prog = (ring";
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      if ((ii+jj)>0) { s += ","; }
      s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]].toUpperCase() + '"';
    }
  }
  s += ")";
  console.log(s);

  s = "chord_prog_rep = (ring";
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var rr=0; rr<4; rr++) {
      for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
        if ((ii+jj+rr)>0) { s += ","; }
        s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]].toUpperCase() + '"';
      }
    }
  }
  s += ")";
  console.log(s);

  s = "arp_chord_prog = (ring";
  for (var ii=0; ii<arp_chord_note.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' "' + note_name[root_note_idx + arp_chord_note[ii]].toUpperCase() + '"';
  }
  s += ")";
  console.log(s);

  s = "arp_chord_prog_dt = (ring";
  for (var ii=0; ii<arp_chord_note_dt.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + arp_chord_note_dt[ii];
  }
  s += ")";
  console.log(s);


  s = "melody = (ring";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' "' + note_name[root_note_idx + melody0_info[ii].note].toUpperCase() + '"';
  }
  s += ")";
  console.log(s);

  s = "melody_s = (ring";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    var _n = note_name[root_note_idx + melody0_info[ii].note].toUpperCase();
    _n = _n.replace(/#/, 's');
    //s += ' :' + note_name[root_note_idx + melody0_info[ii].note].toUpperCase() + '';
    s += ' :' +_n; 
  }
  s += ")";
  console.log(s);

  s = "melody1 = (ring";
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' "' + note_name[root_note_idx + melody1_info[ii].note].toUpperCase() + '"';
  }
  s += ")";
  console.log(s);

  s = "melody_dt = (ring";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody0_info[ii].dur.toString();
  }
  s += ")";
  console.log(s);

  s = "melody1_dt = (ring";
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody1_info[ii].dur.toString();
  }
  s += ")";
  console.log(s);

  s = "arp = (ring";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' "' + note_name[root_note_idx + arp_prog[ii]].toUpperCase() + '"';
  }
  s += ")";

  console.log("// arp progression");
  s = "[";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' "' + note_name[root_note_idx + arp_prog[ii]].toUpperCase() + '"';
  }
  s += "]";

  console.log(s);

  console.log(root_note_name, root_note_idx);

  console.log("// chord progression");
  console.log(chord_prog);

  console.log("// arp chord");
  console.log(arp_chord);

  //console.log(arp_note, arp_note.length, x, x.length, arp_prog, arp_prog.length);
  
  console.log("// arp progression");
  console.log(arp_prog);

  _sonic_pi_beat(drum_beat);


}

function _alg_v_1_1() {
  var rythm_rescale = 4.0;

  var rythm_opt = [
    [ [2, 2], [1, 1, 1, 1], [2,2], [1, 1, 1, 1] ],
    [ [3, 1], [2, 2], [3, 1], [2, 2] ],
    [ [1, 0.5, 0.5, 1, 1 ], [1, 0.5, 0.5, 1, 1 ], [1, 0.5, 0.5, 1, 1 ],  [4] ],
    [ [1, 1, 0.5, 0.5, 0.5, 0.5], [1, 1, 0.5, 0.5, 0.5, 0.5], [1, 1, 0.5, 0.5, 0.5, 0.5], [1, 1, 0.5, 0.5, 0.5, 0.5] ],
    [ [1, 1, 0.5, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5, 1, 1], [ 0.5, 0.5, 0.5, 0.5, 1, 1], [1, 1, 0.5, 0.5, 0.5, 0.5] ]
  ];
  var rythm_opt_idx = _irnd(rythm_opt.length);
  var fs = new FamiliarSynths();

  var drum_beat = fs.encodeBeat(fs.drumBeat['four_on_the_floor']);

  var root_note_idx = _irnd(12);
  var root_note_name = fs.noteName[ root_note_idx ];

  // transition from one mode to another?
  //
  var song_mode = ["lydian", "aeolian"];

  // Get the chord progression for the mode of our choice
  //
  var mode_chord = fs.musicalModeChord[song_mode[1]];
  var mode_chord4 = fs.musicalModeChord4[song_mode[1]];

  // Get list of major chords for chord progression below.
  // Also save the index lookup from major chords back to the
  // original chord list.
  //
  var mode_maj_chord_idx_map = {};
  var mode_maj_chord = [];
  for (var i=0; i<mode_chord.length; i++) {
    if (mode_chord[i].type == "maj") {
      mode_maj_chord_idx_map[mode_maj_chord.length] = i;
      mode_maj_chord.push(mode_chord[i]);
    }
  }

  var chord_prog_idx = [];

  // basic chord progression:
  // * 4 bars
  // * root chord to start
  // * any two chord transitions
  // * end on major chord
  //
  var chord_prog = [];
  chord_prog_idx.push(0);
  chord_prog.push(mode_chord[0]);
  for (var i=1; i<3; i++) {
    var r = _irnd(mode_chord.length);
    chord_prog_idx.push(r);
    chord_prog.push( mode_chord[r] );
  }
  var r = _irnd(mode_maj_chord.length);
  chord_prog_idx.push(r);
  chord_prog.push( mode_maj_chord[r] );


  // playing with 7th chords for arp
  //
  var arp_chord = [];
  arp_chord.push( mode_chord4[0] );
  for (var i=0; i<(chord_prog.length-1); i++) {
    arp_chord.push( mode_chord4[i] );
  }
  var idx = mode_maj_chord_idx_map[ chord_prog_idx[ chord_prog_idx.length-1 ] ];
  arp_chord.push( mode_chord4[idx] );

  var arp_chord_note = [];
  var arp_chord_note_dt = [];
  for (var i=0; i<arp_chord.length; i++) {
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push( 1.0 / rythm_rescale );
    }
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push( 1.0 / rythm_rescale );
    }
  }


  // arp
  //

  // simple hill ( _/-\_ )
  //

  var arp_note_occ = [];
  for (var ii=0; ii<24; ii++) { arp_note_occ.push(0); }
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      arp_note_occ[ chord_prog[ii].chord[jj] ] = 1;
    }
  }
  var arp_note = [];
  for (var ii=0; ii<arp_note_occ.length; ii++) {
    if (arp_note_occ[ii] == 1) {
      arp_note.push(ii);
    }
  }

  // mirror the arp, permute all but first note,
  // then restrict to only
  // 8 notes
  //
  var x = _mirror(arp_note);
  //x = _permute(x, 1, arp_note.length-1);
  var arp_prog =  [];
  var n_arp = 8;
  for (var prev=-1, ii=0; ii<x.length; ii++) {
    var idx = Math.floor( n_arp * ii / x.length );
    if (idx<=prev) { continue; }
    arp_prog.push(x[ii]);
    prev = idx;
  }

  // play with permuting arp...
  //
  for (var ii=1; ii<arp_prog.length; ii++) {
    var nt = arp_prog[ii];
    var p = ii + Math.floor( Math.random() * (arp_prog.length - ii) );
    arp_prog[ii] = arp_prog[p];
    arp_prog[p] = nt;
  }

  // create melody by choosing random two notes from
  // each bar of chord progression
  //

  var melody0_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);
    rythm = rythm_opt[ rythm_opt_idx ][ii];
    for (var jj=0; jj<rythm.length; jj++) {
      melody0_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm[jj] / rythm_rescale } );
    }
  }

  var rythm1_opt_idx = _irnd(rythm_opt.length);
  var melody1_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);
    //rythm = [ 1, 1, 1, 1 ];

    rythm = rythm_opt[ rythm1_opt_idx ][ii];
    //console.log(bar_notes, bar_notes.length, _irnd(bar_notes.length), bar_notes[_irnd(bar_notes.length)]);
    for (var jj=0; jj<rythm.length; jj++) {
      melody1_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm[jj] / rythm_rescale } );
    }
  }


  var _song_structure = [ [''] ];



  //**************************
  //**************************
  //**************************
  //**************************
  //**************************
  // print gibber output
  //

  var use_str_note = false;

  var s;
  var note_name = [];
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "4" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "5" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "6" ); }


  var bass_instrument = { "type":"PolySynth", "preset":"stringPad", "loudness":1, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"brass", "loudness":1, "decay":4};

  //var arp_instrument = {"type":"FM", "preset":"bass"};
  var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":0.8, "decay":0.12}; // **

  // having some trouble...
  // lead, lead2, dark, short.dry,
  // easy, easyfx, jump,
  // chords, bass, bass2
  //
  // short, arpy, shinybass2,
  // dirty, bass2 (?),
  // 
  // looks like loudness > 1 might screw things up
  //
  //var melody0_instrument = {"type":"FM", "preset":"brass"};

  // ones I like...
  //var melody0_instrument = {"type":"Monosynth", "preset":"short.dry"};
  //var melody0_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"lead", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dirty", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"pluckedEcho", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dark", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass", "loudness":2, "decay":0.95}; // **
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"easy", "loudness":1, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass2", "loudness":2, "decay":0.95}; // **
  var melody0_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":1, "decay":0.95}; // **
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass.muted", "loudness":4, "decay":1.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"short", "loudness":1, "decay":0.95};
  //
  // oof, shinybass2 has some problems, as does lead

  var melody1_instrument = {"type":"Monosynth", "preset":"bass", "loudness":1, "decay":0.95}; // **

  console.log("");
  console.log('Gibber.clear();');
  console.log("Clock.bpm=180;");
  console.log('Theory.mode = "chromatic";');
  console.log('Theory.root = "' + note_name[root_note_idx] + '";');
  console.log('sv = Bus2("spaceverb");');

  // simple drums for now
  console.log("// simple drums");
  console.log('e = EDrums().connect( sv, .1 );');
  console.log('e.tidal("kd <cp kd cp kd>");');
  console.log('e.kick.gain = 2.5;');
  console.log('e.kick.decay = .995;');
  console.log('e.kick.frequency = 60;');


  console.log("// chord progression");
  s = 'bass = ' + bass_instrument.type + '("' + bass_instrument.preset + '", {"decay":' + bass_instrument.decay.toString() + ', "maxVoices":4, "loudness":' + bass_instrument.loudness.toString() + '});\n';
  s += 'bass.connect(sv, .35);\n';
  s += "bass.chord.seq( [";
  for (var ii=0; ii<chord_prog.length; ii++) {
    if (ii > 0) { s+= ','; }
    s += ' [';
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      if ((jj)>0) { s += ","; }
      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]] + '"';
      } else{
        var _n = root_note_idx + chord_prog[ii].chord[jj];
        s += ' ' + _n.toString() + ' ';
      }
    }
    s += ' ]';
  }
  s += "], 4);";
  console.log(s);

  console.log("// arp progression");
  s = 'a = ' + arp_instrument.type + '("' + arp_instrument.preset + '", {"decay":' + arp_instrument.decay.toString() + ',"loudness":' + arp_instrument.loudness.toString() + '});\n';
  s += 'a.connect(sv, 0.5);\n';
  s += "a.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii]] + '"';
    } else {
      var _n = root_note_idx + arp_prog[ii] ;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' 0.125';
  }
  s += "]);";
  console.log(s);

  //---
  // melody 0
  //---

  console.log("// melody0");

  s = 'm0 = ' + melody0_instrument.type + '("' + melody0_instrument.preset + '", {"decay":' + melody0_instrument.decay.toString() + ',"loudness":' + melody0_instrument.loudness.toString() + '});\n';
  s += 'm0.connect(sv, 0.5);\n';
  s += 'm0.note.seq( [';
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + melody0_info[ii].note].toUpperCase() + '"';
    } else {
      var _n = root_note_idx + melody0_info[ii].note;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += " ], [ ";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody0_info[ii].dur.toString();
  }
  s += "] );";
  console.log(s);


  //---
  // melody 1
  //---

  console.log("");
  console.log("// melody1");

  s = 'm1 = ' + melody1_instrument.type + '("' + melody1_instrument.preset + '", {"loudness": ' + melody1_instrument.loudness.toString() + '});\n';
  s += 'm1.connect(sv, 0.5);\n';
  s += 'm1.note.seq( [';
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + melody1_info[ii].note].toUpperCase() + '"';
    } else {
      var _n = root_note_idx + melody1_info[ii].note;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += " ], [ ";
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody1_info[ii].dur.toString();
  }
  s += "] );";
  console.log(s);

}

function _quantize(val, q) {
  return Math.floor(val / q) * q;
}

function _alg_v_1_2() {

  var rythm_rescale = 4.0;

  var fs = new FamiliarSynths();

  var rythm_symmetry = [
    [0, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 1]
    //[0, 0, 1, 0],
    //[0, 1, 0, 0],
    //[0, 1, 1, 1],
    //[0, 0, 1, 1]
  ];
  var rythm0 = [], rythm1 = [];

  // random rythms...
  //
  //var beat_quantize = 0.125;
  var beat_quantize = 0.25;

  //var pareto_m = 0.125, pareto_alpha = 2.5;
  //var pareto_m = 0.2, pareto_alpha = 2.95;
  var pareto_m = 0.1, pareto_alpha = 1.25;

  // measure patterns hold the two measures,
  // each randomely generated (4 below, but only 2 are used).
  // They symmetry above is used to give some structure
  // to the 4 bar measure so it doesn't sound completely random.
  //
  var _measure_pattern0 = [],
      _measure_pattern1 = [];
  for (var ii=0; ii<4; ii++) {
    var beat_sum = 0.0;
    var _measure = [];
    for (var jj=0; jj<16; jj++) {
      var dt = _quantize( stoch.pareto(pareto_m, pareto_alpha), beat_quantize ) + beat_quantize;
      if ((beat_sum+dt) >= 1.0) {
        _measure.push(1.0 - beat_sum);
        break;
      }
      else {
        _measure.push(dt);
      }
      beat_sum += dt;
    }
    _measure_pattern0.push(_measure);

    beat_sum = 0.0;
    _measure = [];
    for (var jj=0; jj<16; jj++) {
      var dt = _quantize( stoch.pareto(pareto_m, pareto_alpha), beat_quantize ) + beat_quantize;
      if ((beat_sum+dt) >= 1.0) {
        _measure.push(1.0 - beat_sum);
        break;
      }
      else {
        _measure.push(dt);
      }
      beat_sum += dt;
    }
    _measure_pattern1.push(_measure);
  }

  //console.log("// >>", rythm_symmetry.length);
  //console.log("// measure_pattern0:", _measure_pattern0);
  //console.log("// measure_pattern1:", _measure_pattern1);

  var rythm_symmetry_idx = _irnd(rythm_symmetry.length);

  console.log("// sym:", rythm_symmetry[rythm_symmetry_idx]);

  for (var jj=0; jj<4; jj++) {

    var _m = _measure_pattern0[ rythm_symmetry[rythm_symmetry_idx][jj] ];
    var _measure = [];
    for (var _n=0; _n<_m.length; _n++) {
      //rythm0.push( _m[_n] );
      _measure.push( _m[_n] );
    }
    rythm0.push(_measure);
  }

  rythm_symmetry_idx = _irnd(rythm_symmetry.length);

  console.log("// sym:", rythm_symmetry[rythm_symmetry_idx]);

  for (var jj=0; jj<4; jj++) {

    var _m = _measure_pattern1[ rythm_symmetry[rythm_symmetry_idx][jj] ];
    var _measure = [];
    for (var _n=0; _n<_m.length; _n++) {
      //rythm1.push( _m[_n] );
      _measure.push( _m[_n] );
    }
    rythm1.push(_measure);

  }

  //console.log("rythm0:", rythm0);
  //console.log("rythm1:", rythm1);

  var drum_beat = fs.encodeBeat(fs.drumBeat['four_on_the_floor']);

  var root_note_idx = _irnd(12);
  var root_note_name = fs.noteName[ root_note_idx ];

  // transition from one mode to another?
  //
  var song_mode = ["lydian", "aeolian"];

  // Get the chord progression for the mode of our choice
  //
  var mode_chord = fs.musicalModeChord[song_mode[1]];
  var mode_chord4 = fs.musicalModeChord4[song_mode[1]];

  // Get list of major chords for chord progression below.
  // Also save the index lookup from major chords back to the
  // original chord list.
  //
  var mode_maj_chord_idx_map = {};
  var mode_maj_chord = [];
  for (var i=0; i<mode_chord.length; i++) {
    if (mode_chord[i].type == "maj") {
      mode_maj_chord_idx_map[mode_maj_chord.length] = i;
      mode_maj_chord.push(mode_chord[i]);
    }
  }

  var chord_prog_idx = [];

  // basic chord progression:
  // * 4 bars
  // * root chord to start
  // * any two chord transitions
  // * end on major chord
  //
  var chord_prog = [];
  chord_prog_idx.push(0);
  chord_prog.push(mode_chord[0]);
  for (var i=1; i<3; i++) {
    var r = _irnd(mode_chord.length);
    chord_prog_idx.push(r);
    chord_prog.push( mode_chord[r] );
  }
  var r = _irnd(mode_maj_chord.length);
  chord_prog_idx.push(r);
  chord_prog.push( mode_maj_chord[r] );


  // playing with 7th chords for arp
  //
  var arp_chord = [];
  arp_chord.push( mode_chord4[0] );
  for (var i=0; i<(chord_prog.length-1); i++) {
    arp_chord.push( mode_chord4[i] );
  }
  var idx = mode_maj_chord_idx_map[ chord_prog_idx[ chord_prog_idx.length-1 ] ];
  arp_chord.push( mode_chord4[idx] );

  var arp_chord_note = [];
  var arp_chord_note_dt = [];
  for (var i=0; i<arp_chord.length; i++) {
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push( 1.0 / rythm_rescale );
    }
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push( 1.0 / rythm_rescale );
    }
  }


  // arp
  //

  // simple hill ( _/-\_ )
  //

  var arp_note_occ = [];
  for (var ii=0; ii<24; ii++) { arp_note_occ.push(0); }
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      arp_note_occ[ chord_prog[ii].chord[jj] ] = 1;
    }
  }
  var arp_note = [];
  for (var ii=0; ii<arp_note_occ.length; ii++) {
    if (arp_note_occ[ii] == 1) {
      arp_note.push(ii);
    }
  }

  // mirror the arp, permute all but first note,
  // then restrict to only
  // 8 notes
  //
  var x = _mirror(arp_note);
  //x = _permute(x, 1, arp_note.length-1);
  var arp_prog =  [];
  var n_arp = 8;
  for (var prev=-1, ii=0; ii<x.length; ii++) {
    var idx = Math.floor( n_arp * ii / x.length );
    if (idx<=prev) { continue; }
    arp_prog.push(x[ii]);
    prev = idx;
  }

  // play with permuting arp...
  //
  for (var ii=1; ii<arp_prog.length; ii++) {
    var nt = arp_prog[ii];
    var p = ii + Math.floor( Math.random() * (arp_prog.length - ii) );
    arp_prog[ii] = arp_prog[p];
    arp_prog[p] = nt;
  }

  // create melody by choosing random two notes from
  // each bar of chord progression
  //

  var melody0_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);

    console.log("//m0...", ii, "bar_notes:", bar_notes);

    for (var jj=0; jj<rythm0[ii].length; jj++) {
      melody0_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm0[ii][jj] } );
    }
  }

  var melody1_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);
    for (var jj=0; jj<rythm1[ii].length; jj++) {
      melody1_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm1[ii][jj] } );
    }
  }


  var _song_structure = [ [''] ];

  //**************************
  //**************************
  //**************************
  //**************************
  //**************************
  // print gibber output
  //

  var use_str_note = false;

  var s;
  var note_name = [];
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "4" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "5" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "6" ); }


  //var bass_instrument = { "type":"PolySynth", "preset":"stringPad", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4};
  var bass_instrument = { "type":"PolySynth", "preset":"cry", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"brass", "loudness":1, "decay":4};

  //var arp_instrument = {"type":"FM", "preset":"bass"};
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":0.8, "decay":0.12}; // **
  var arp_instrument = {"type":"Monosynth", "preset":"bass", "loudness":0.8, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":0.8, "decay":0.12}; // **

  // having some trouble...
  // lead, lead2, dark, short.dry,
  // easy, easyfx, jump,
  // chords, bass, bass2
  //
  // short, arpy, shinybass2,
  // dirty, bass2 (?),
  // 
  // looks like loudness > 1 might screw things up
  //
  //var melody0_instrument = {"type":"FM", "preset":"brass"};

  // ones I like...
  //var melody0_instrument = {"type":"Monosynth", "preset":"short.dry"};
  //var melody0_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"lead", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dirty", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"pluckedEcho", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dark", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass", "loudness":2, "decay":0.95}; // **
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"easy", "loudness":1, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass2", "loudness":2, "decay":0.95}; // **
  var melody0_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":1.5, "decay":0.95}; // **
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass.muted", "loudness":4, "decay":1.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"short", "loudness":1, "decay":0.95};

  // oof, shinybass2 has some problems, as does lead
  // short hight notes hvae problems.
  // on further investigation, it happens with many instruments when the notes get 'too high'.
  // For notes in the range of a7 (say), there starts to be significant slowdown.
  // For example, the following has troubles:
  // Clock.bpm=180;
  // Theory.mode = "chromatic";
  // Theory.root = "a4";
  // m1 = Monosynth("bass", {"decay":0.25,"loudness": 2});
  // m1.note.seq( [ 16, 16, 12, 14, 14, 14, 24, 14, 14, 14, 14, 14, 14 ], [ 0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25] );
  //
  // note that adjusting to loudness of 1 looks to fix the issue
  //

  //var melody1_instrument = {"type":"Monosynth", "preset":"bass", "loudness":2, "decay":0.95}; // **
  var melody1_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":1.5, "decay":0.95}; // **

  // change melody decay rate based on max note length
  //
  var min_dt = 0.95;
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (min_dt > melody0_info[ii].dur) {
      min_dt = melody0_info[ii].dur;
    }
  }
  melody0_instrument.decay = min_dt;

  min_dt = 0.95;
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (min_dt > melody1_info[ii].dur) {
      min_dt = melody1_info[ii].dur;
    }
  }
  melody1_instrument.decay = min_dt;


  console.log("");
  console.log('Gibber.clear();');
  console.log("Clock.bpm=180;");
  console.log('Theory.mode = "chromatic";');
  console.log("// root_note_idx", root_note_idx);
  console.log('Theory.root = "' + note_name[root_note_idx] + '";');
  console.log('sv = Bus2("spaceverb");');

  // simple drums for now
  console.log("// simple drums");
  console.log('/*');
  console.log('* kik = Kick("tight");');
  console.log('* kik.gain = 2;');
  console.log('* kik.connect(sv, 0.5);');
  console.log('* kik.trigger.seq( 1, Euclid(2,4)) ;');
  console.log('* */;');
  console.log('e = EDrums().connect( sv, .1 );');
  console.log('e.tidal("kd <cp kd cp kd>");');
  console.log('e.kick.gain = 2.5;');
  console.log('e.kick.decay = .995;');
  console.log('e.kick.frequency = 60;');


  console.log("// chord progression");
  s = 'bass = ' + bass_instrument.type + '("' + bass_instrument.preset + '", {"decay":' + bass_instrument.decay.toString() + ', "maxVoices":4, "loudness":' + bass_instrument.loudness.toString() + '});\n';
  s += 'bass.connect(sv, .35);\n';
  s += "bass.chord.seq( [";
  for (var ii=0; ii<chord_prog.length; ii++) {
    if (ii > 0) { s+= ','; }
    s += ' [';
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      if ((jj)>0) { s += ","; }
      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]] + '"';
      } else{
        //var _n = root_note_idx + chord_prog[ii].chord[jj];
        var _n = chord_prog[ii].chord[jj];
        s += ' ' + _n.toString() + ' ';
      }
    }
    s += ' ]';
  }
  s += "], 4);";
  console.log(s);

  console.log("// arp progression");
  s = 'a = ' + arp_instrument.type + '("' + arp_instrument.preset + '", {"decay":' + arp_instrument.decay.toString() + ',"loudness":' + arp_instrument.loudness.toString() + '});\n';
  s += 'a.connect(sv, 0.5);\n';
  s += "a.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii]] + '"';
    } else {
      //var _n = root_note_idx + arp_prog[ii] ;
      var _n = arp_prog[ii] ;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' 0.125';
  }
  s += "]);";
  console.log(s);

  //---
  // melody 0
  //---

  console.log("// melody0");

  s = 'm0 = ' + melody0_instrument.type + '("' + melody0_instrument.preset + '", {"decay":' + melody0_instrument.decay.toString() + ',"loudness":' + melody0_instrument.loudness.toString() + '});\n';
  s += 'm0.connect(sv, 0.5);\n';
  s += 'm0.note.seq( [';
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + melody0_info[ii].note].toUpperCase() + '"';
    } else {
      //var _n = root_note_idx + melody0_info[ii].note;
      var _n = melody0_info[ii].note;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += " ], [ ";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody0_info[ii].dur.toString();
  }
  s += "] );";
  console.log(s);


  //---
  // melody 1
  //---

  console.log(" ");
  console.log("// melody1");


  s = 'm1 = ' + melody1_instrument.type + '("' + melody1_instrument.preset + '", {"decay":' + melody1_instrument.decay.toString() + ',"loudness": ' + melody1_instrument.loudness.toString() + '});\n';
  s += 'm1.connect(sv, 0.5);\n';
  s += 'm1.note.seq( [';
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + melody1_info[ii].note].toUpperCase() + '"';
    } else {
      //var _n = root_note_idx + melody1_info[ii].note;
      var _n = melody1_info[ii].note;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += " ], [ ";
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody1_info[ii].dur.toString();
  }
  s += "] );";
  console.log(s);

  console.log("m0.gain.fade(m0.gain.value, 0, 0.01);");
  console.log("m1.gain.fade(m1.gain.value, 0, 0.01);");

  console.log("");
  console.log("m0.gain.fade(m0.gain.value, 0.2, 0.1);");
  console.log("m1.gain.fade(m1.gain.value, 0, 0.1);");

  console.log("");
  console.log("m0.gain.fade(m0.gain.value, 0, 0.1);");
  console.log("m1.gain.fade(m1.gain.value, 0.2, 0.1);");

}


function _alg_v_1_3() {

  //var bpm = 180;
  var bpm = 200;
  var rythm_rescale = 4.0;

  var fs = new FamiliarSynths();

  var rythm_symmetry = [
    [0, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 1]
  ];
  var rythm0 = [], rythm1 = [],
      rythm_lib = [];

  // random rythms...
  //
  //var beat_quantize = 0.125;
  var beat_quantize = 0.25;

  //var pareto_m = 0.125, pareto_alpha = 2.5;
  //var pareto_m = 0.2, pareto_alpha = 2.95;
  var pareto_m = 0.1, pareto_alpha = 1.25;

  // measure patterns hold the two measures,
  // each randomely generated (4 below, but only 2 are used).
  // They symmetry above is used to give some structure
  // to the 4 bar measure so it doesn't sound completely random.
  //
  var _measure_pattern0 = [],
      _measure_pattern1 = [];
  for (var ii=0; ii<4; ii++) {
    var beat_sum = 0.0;
    var _measure = [];
    for (var jj=0; jj<16; jj++) {
      var dt = _quantize( stoch.pareto(pareto_m, pareto_alpha), beat_quantize ) + beat_quantize;
      if ((beat_sum+dt) >= 1.0) {
        _measure.push(1.0 - beat_sum);
        break;
      }
      else {
        _measure.push(dt);
      }
      beat_sum += dt;
    }
    _measure_pattern0.push(_measure);

    beat_sum = 0.0;
    _measure = [];
    for (var jj=0; jj<16; jj++) {
      var dt = _quantize( stoch.pareto(pareto_m, pareto_alpha), beat_quantize ) + beat_quantize;
      if ((beat_sum+dt) >= 1.0) {
        _measure.push(1.0 - beat_sum);
        break;
      }
      else {
        _measure.push(dt);
      }
      beat_sum += dt;
    }
    _measure_pattern1.push(_measure);
  }


  // pick the melody timing 'symmetry' and create the two
  // rythms for both melodies.
  //

  var rythm_symmetry_idx = _irnd(rythm_symmetry.length);

  console.log("// sym:", rythm_symmetry[rythm_symmetry_idx]);

  for (var jj=0; jj<4; jj++) {

    var _m = _measure_pattern0[ rythm_symmetry[rythm_symmetry_idx][jj] ];
    var _measure = [];
    for (var _n=0; _n<_m.length; _n++) {
      _measure.push( _m[_n] );
    }
    rythm0.push(_measure);
  }

  rythm_symmetry_idx = _irnd(rythm_symmetry.length);

  console.log("// sym:", rythm_symmetry[rythm_symmetry_idx]);

  for (var jj=0; jj<4; jj++) {

    var _m = _measure_pattern1[ rythm_symmetry[rythm_symmetry_idx][jj] ];
    var _measure = [];
    for (var _n=0; _n<_m.length; _n++) {
      _measure.push( _m[_n] );
    }
    rythm1.push(_measure);

  }


  var root_note_idx = _irnd(12);
  var root_note_name = fs.noteName[ root_note_idx ];

  // transition from one mode to another?
  //
  var song_mode = ["lydian", "aeolian"];

  // Get the chord progression for the mode of our choice
  //
  var mode_chord = fs.musicalModeChord[song_mode[1]];
  var mode_chord4 = fs.musicalModeChord4[song_mode[1]];

  // Get list of major chords for chord progression below.
  // Also save the index lookup from major chords back to the
  // original chord list.
  //
  var mode_maj_chord_idx_map = {};
  var mode_maj_chord = [];
  for (var i=0; i<mode_chord.length; i++) {
    if (mode_chord[i].type == "maj") {
      mode_maj_chord_idx_map[mode_maj_chord.length] = i;
      mode_maj_chord.push(mode_chord[i]);
    }
  }

  var chord_prog_idx = [];

  // basic chord progression:
  // * 4 bars
  // * root chord to start
  // * any two chord transitions
  // * end on major chord
  //
  var chord_prog = [];
  chord_prog_idx.push(0);
  chord_prog.push(mode_chord[0]);
  for (var i=1; i<3; i++) {
    var r = _irnd(mode_chord.length);
    chord_prog_idx.push(r);
    chord_prog.push( mode_chord[r] );
  }
  var r = _irnd(mode_maj_chord.length);
  chord_prog_idx.push(r);
  chord_prog.push( mode_maj_chord[r] );


  // playing with 7th chords for arp
  //
  var arp_chord = [];
  arp_chord.push( mode_chord4[0] );
  for (var i=0; i<(chord_prog.length-1); i++) {
    arp_chord.push( mode_chord4[i] );
  }
  var idx = mode_maj_chord_idx_map[ chord_prog_idx[ chord_prog_idx.length-1 ] ];
  arp_chord.push( mode_chord4[idx] );

  var arp_chord_note = [];
  var arp_chord_note_dt = [];
  for (var i=0; i<arp_chord.length; i++) {
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push( 1.0 / rythm_rescale );
    }
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push( 1.0 / rythm_rescale );
    }
  }


  // arp
  //

  // simple hill ( _/-\_ )
  //

  var arp_note_occ = [];
  for (var ii=0; ii<24; ii++) { arp_note_occ.push(0); }
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      arp_note_occ[ chord_prog[ii].chord[jj] ] = 1;
    }
  }
  var arp_note = [];
  for (var ii=0; ii<arp_note_occ.length; ii++) {
    if (arp_note_occ[ii] == 1) {
      //arp_note.push(ii);
      arp_note.push(ii);
    }
  }

  // mirror the arp, permute all but first note,
  // then restrict to only
  // 8 notes
  //
  var x = _mirror(arp_note);
  //x = _permute(x, 1, arp_note.length-1);
  var arp_prog =  [];
  var n_arp = 8;
  for (var prev=-1, ii=0; ii<x.length; ii++) {
    var idx = Math.floor( n_arp * ii / x.length );
    if (idx<=prev) { continue; }
    arp_prog.push(x[ii]);
    prev = idx;
  }

  // play with permuting arp...
  //
  var permute_arp = true;
  if (permute_arp) {
    for (var ii=1; ii<arp_prog.length; ii++) {
      var nt = arp_prog[ii];
      var p = ii + Math.floor( Math.random() * (arp_prog.length - ii) );
      arp_prog[ii] = arp_prog[p];
      arp_prog[p] = nt;
    }
  }

  // create melody by choosing random two notes from
  // each bar of chord progression
  //

  var melody0_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);

    console.log("//m0...", ii, "bar_notes:", bar_notes);

    for (var jj=0; jj<rythm0[ii].length; jj++) {
      melody0_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm0[ii][jj] } );
    }
  }

  var melody1_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);
    for (var jj=0; jj<rythm1[ii].length; jj++) {
      melody1_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm1[ii][jj] } );
    }
  }


  var _song_structure = [ [''] ];

  //**************************
  //**************************
  //**************************
  //**************************
  //**************************
  // print gibber output
  //

  var use_str_note = false;

  var s;
  var note_name = [];
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "3" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "4" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "5" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "6" ); }


  var bass_choice = [
    { "type":"PolySynth", "preset":"stringPad", "loudness":1, "decay":4},
    { "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4},
    { "type":"PolySynth", "preset":"cry", "loudness":1, "decay":4},
    { "type":"PolySynth", "preset":"brass", "loudness":1, "decay":4}
  ];
  //var bass_instrument = { "type":"PolySynth", "preset":"stringPad", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"cry", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"brass", "loudness":1, "decay":4};
  var bass_instrument = bass_choice[ _irnd(bass_choice.length) ];

  //var arp_instrument = {"type":"FM", "preset":"bass"};
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":0.8, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":1.2, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":1.2, "decay":0.12}; // **
  var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":3, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":0.8, "decay":0.12}; // **

  // ones I like...
  //var melody0_instrument = {"type":"Monosynth", "preset":"short.dry"};
  //var melody0_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"lead", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dirty", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"pluckedEcho", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dark", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass", "loudness":2, "decay":0.95}; // **
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"easy", "loudness":1, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass2", "loudness":2, "decay":0.95}; // **


  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":2, "decay":0.95}; // **
  var melody0_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95}; // **

  //var melody0_instrument = {"type":"Monosynth", "preset":"bass.muted", "loudness":4, "decay":1.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"short", "loudness":1, "decay":0.95};

  // oof, shinybass2 has some problems, as does lead
  // short hight notes hvae problems.
  // on further investigation, it happens with many instruments when the notes get 'too high'.
  // For notes in the range of a7 (say), there starts to be significant slowdown.
  // For example, the following has troubles:
  // Clock.bpm=180;
  // Theory.mode = "chromatic";
  // Theory.root = "a4";
  // m1 = Monosynth("bass", {"decay":0.25,"loudness": 2});
  // m1.note.seq( [ 16, 16, 12, 14, 14, 14, 24, 14, 14, 14, 14, 14, 14 ], [ 0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25] );
  //
  // note that adjusting to loudness of 1 looks to fix the issue
  //

  //var melody1_instrument = {"type":"Monosynth", "preset":"bass", "loudness":2, "decay":0.95}; // **
  //var melody1_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":1.5, "decay":0.95}; // **
  var melody1_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95}; // **

  // change melody decay rate based on max note length
  //
  var min_dt = 0.95;
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (min_dt > melody0_info[ii].dur) {
      min_dt = melody0_info[ii].dur;
    }
  }
  melody0_instrument.decay = min_dt;

  min_dt = 0.95;
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (min_dt > melody1_info[ii].dur) {
      min_dt = melody1_info[ii].dur;
    }
  }
  melody1_instrument.decay = min_dt;


  console.log("");
  console.log('Gibber.clear();');
  console.log("Clock.bpm=", bpm, ";");
  console.log('Theory.mode = "chromatic";');
  console.log("// root_note_idx", root_note_idx);
  console.log('Theory.root = "' + note_name[root_note_idx] + '";');
  console.log('sv = Bus2("spaceverb");');

  // simple drums for now
  console.log("// simple drums");
  console.log('/*');
  console.log('* kik = Kick("tight");');
  console.log('* kik.gain = 2;');
  console.log('* kik.connect(sv, 0.5);');
  console.log('* kik.trigger.seq( 1, Euclid(2,4)) ;');
  console.log('* */;');
  console.log('e = EDrums().connect( sv, .1 );');
  console.log('e.tidal("kd <cp kd cp kd>");');
  console.log('e.kick.gain = 2.5;');
  console.log('e.kick.decay = .995;');
  console.log('e.kick.frequency = 60;');


  console.log("// chord progression");
  s = 'bass = ' + bass_instrument.type + '("' + bass_instrument.preset + '", {"decay":' + bass_instrument.decay.toString() + ', "maxVoices":4, "loudness":' + bass_instrument.loudness.toString() + '});\n';
  s += 'bass.connect(sv, .35);\n';
  s += "bass.chord.seq( [";
  for (var ii=0; ii<chord_prog.length; ii++) {
    if (ii > 0) { s+= ','; }
    s += ' [';
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      if ((jj)>0) { s += ","; }
      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]] + '"';
      } else{
        //var _n = root_note_idx + chord_prog[ii].chord[jj];
        var _n = chord_prog[ii].chord[jj];
        //var _n = chord_prog[ii].chord[jj] - 12;
        s += ' ' + _n.toString() + ' ';
      }
    }
    s += ' ]';
  }
  s += "], 1);";
  console.log(s);

  // arp 0

  console.log("// arp progression");
  s = 'a = ' + arp_instrument.type + '("' + arp_instrument.preset + '", ' +
      ' {"decay":' + arp_instrument.decay.toString() + ',"loudness":' + arp_instrument.loudness.toString() + '});\n';
  s += 'a.connect(sv, 0.5);\n';
  s += "a.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii]] + '"';
    } else {
      //var _n = root_note_idx + arp_prog[ii] ;
      var _n = arp_prog[ii] ;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' 0.125';
  }
  s += "]);";
  console.log(s);

  // arp 0

  console.log("// arp octave++ progression");
  s = 'a_u = ' + arp_instrument.type + '("' + arp_instrument.preset + '", ' +
      ' {"decay":' + arp_instrument.decay.toString() + ',"loudness":' + arp_instrument.loudness.toString() + '});\n';
  s += 'a_u.connect(sv, 0.5);\n';
  s += "a_u.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii] + 12] + '"';
    } else {
      //var _n = root_note_idx + arp_prog[ii] ;
      var _n = arp_prog[ii] + 12;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' 0.125';
  }
  s += "]);";
  console.log(s);

  //---
  // melody 0
  //---

  console.log("// melody0");

  s = 'm0 = ' + melody0_instrument.type + '("' + melody0_instrument.preset + '", {"decay":' + melody0_instrument.decay.toString() + ',"loudness":' + melody0_instrument.loudness.toString() + '});\n';
  s += 'm0.connect(sv, 0.5);\n';
  s += 'm0.note.seq( [';
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + melody0_info[ii].note].toUpperCase() + '"';
    } else {
      //var _n = root_note_idx + melody0_info[ii].note;
      var _n = melody0_info[ii].note;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += " ], [ ";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody0_info[ii].dur.toString();
  }
  s += "] );";
  console.log(s);

  s = 'm0_u = ' + melody0_instrument.type + '("' + melody0_instrument.preset + '", {"decay":' + melody0_instrument.decay.toString() + ',"loudness":' + melody0_instrument.loudness.toString() + '});\n';
  s += 'm0_u.connect(sv, 0.5);\n';
  s += 'm0_u.note.seq( [';
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + melody0_info[ii].note + 12].toUpperCase() + '"';
    } else {
      //var _n = root_note_idx + melody0_info[ii].note;
      var _n = melody0_info[ii].note + 12;
      _n %= 24;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += " ], [ ";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody0_info[ii].dur.toString();
  }
  s += "] );";
  console.log(s);


  //---
  // melody 1
  //---

  console.log(" ");
  console.log("// melody1");


  s = 'm1 = ' + melody1_instrument.type + '("' + melody1_instrument.preset + '", {"decay":' + melody1_instrument.decay.toString() + ',"loudness": ' + melody1_instrument.loudness.toString() + '});\n';
  s += 'm1.connect(sv, 0.5);\n';
  s += 'm1.note.seq( [';
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + melody1_info[ii].note].toUpperCase() + '"';
    } else {
      //var _n = root_note_idx + melody1_info[ii].note;
      var _n = melody1_info[ii].note;
      _n %= 24;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += " ], [ ";
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody1_info[ii].dur.toString();
  }
  s += "] );";
  console.log(s);

  s = 'm1_u = ' + melody1_instrument.type + '("' + melody1_instrument.preset + '", {"decay":' + melody1_instrument.decay.toString() + ',"loudness": ' + melody1_instrument.loudness.toString() + '});\n';
  s += 'm1_u.connect(sv, 0.5);\n';
  s += 'm1_u.note.seq( [';
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + melody1_info[ii].note + 12].toUpperCase() + '"';
    } else {
      //var _n = root_note_idx + melody1_info[ii].note;
      var _n = melody1_info[ii].note + 12;
      _n %= 24;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += " ], [ ";
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody1_info[ii].dur.toString();
  }
  s += "] );";
  console.log(s);

  console.log("m0.gain = 0;");
  console.log("m0_u.gain = 0;");
  console.log("m1.gain = 0;");
  console.log("m1_u.gain = 0;");
  console.log("a.gain = 0;");
  console.log("a_u.gain = 0;");
  console.log("bass.gain = 0;");
  console.log("e.gain = 0;");


  var beat_ms = 60*1000 / bpm;
  var measure_ms = 4*4*beat_ms;
  var wait_unit_ms = 4*measure_ms;
  var fudge = 50;

  var _quarter = 1;
  var _half = 2;
  var _full = 4;
  var _song_t = 0;

  console.log(" ");
  _song_t += _half;
  console.log("future( _a => { _a.gain = 0.2; }, ", _song_t, ", {_a:a});");

  _song_t += _half;
  console.log("bass.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  _song_t += _quarter;
  console.log("a_u.gain.fade ( 0.0, 0.1, 1, ", _song_t, ");");

  _song_t += _half;
  console.log("a_u.gain.fade ( 0.1, 0.0, 1, ", _song_t, ");");

  _song_t += _quarter;
  console.log("e.gain.fade   ( 0.0, 1.0, 1, ", _song_t, ");");

  _song_t += _full;
  console.log("future( _m0 => { _m0.gain = 0.2; } , ", _song_t, ", {_m0:m0});");

  _song_t += _full;
  console.log("future( _m0 => { _m0.gain = 0.0; } , ", _song_t, ", {_m0:m0});");
  console.log("future( _m1 => { _m1.gain = 0.2; } , ", _song_t, ", {_m1:m1});");

  _song_t += _full;
  console.log("future( _m1 => { _m1.gain = 0.0; } , ", _song_t, ", {_m1:m1});");
  console.log("a_u.gain.fade( 0.0, 0.2, 2, ", _song_t, ");");

  _song_t += _quarter;
  console.log("m0.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");
  console.log("m0_u.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  _song_t += _quarter;
  console.log("m1.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");
  console.log("m1_u.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  _song_t += _half;
  console.log("bass.gain.fade(0.2, 0.0, 4, ", _song_t, ");");

  _song_t += _quarter;
  console.log("future( _m0   => { _m0.gain   = 0.0; } , ", _song_t, ", { _m0   : m0   });");
  console.log("future( _m0_u => { _m0_u.gain = 0.0; } , ", _song_t, ", { _m0_u : m0_u });");

  _song_t += _quarter;
  console.log("future( _m1   => { _m1.gain   = 0.0; } , ", _song_t, ", { _m1   : m1   });");
  console.log("future( _m1_u => { _m1_u.gain = 0.0; } , ", _song_t, ", { _m1_u : m1_u });");

  _song_t += _quarter;
  console.log("future( _a    => { _a.gain    = 0.0; } , ", _song_t, ", { _a    : a    });");
  console.log("future( _a_u  => { _a_u.gain  = 0.0; } , ", _song_t, ", { _a_u  : a_u  });");

  _song_t += _quarter;
  console.log("e.gain.fade( 1.0, 0.0, 0.24, ", _song_t, ");");

}

function _alg_v_1_4() {

  var bpm = 100;
  var rythm_rescale = 8.0;

  var fs = new FamiliarSynths();
  var arp_dt = 0.5 / rythm_rescale;

  var rythm_symmetry = [
    [0, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 1]
  ];
  var rythm_lib = [];
  var melody_count = 4;
  var melody_info = [];


  // random rythms...
  //
  //var beat_quantize = 0.125;
  var beat_quantize = 0.25;

  //var pareto_m = 0.125, pareto_alpha = 2.5;
  //var pareto_m = 0.2, pareto_alpha = 2.95;
  var pareto_m = 0.1, pareto_alpha = 1.25;

  // measure patterns hold the two measures,
  // each randomely generated (4 below, but only 2 are used).
  // They symmetry above is used to give some structure
  // to the 4 bar measure so it doesn't sound completely random.
  //
  var _measure_pattern = [];
  for (var _measure_pattern_idx=0; _measure_pattern_idx < melody_count; _measure_pattern_idx++) {
    for (var ii=0; ii<4; ii++) {

      _measure_pattern.push([]);

      var beat_sum = 0.0;
      var _measure = [];
      for (var jj=0; jj<16; jj++) {
        var dt = _quantize( stoch.pareto(pareto_m, pareto_alpha), beat_quantize ) + beat_quantize;
        if ((beat_sum+dt) >= 1.0) {
          _measure.push(1.0 - beat_sum);
          break;
        }
        else {
          _measure.push(dt);
        }
        beat_sum += dt;
      }
      _measure_pattern[_measure_pattern_idx].push(_measure);
    }

  }

  // pick the melody timing 'symmetry' and create the two
  // rythms for both melodies.
  //

  for (var _measure_idx=0; _measure_idx < melody_count; _measure_idx++) {

    rythm_lib.push([]);

    var rythm_symmetry_idx = _irnd(rythm_symmetry.length);

    console.log("// sym:", rythm_symmetry[rythm_symmetry_idx]);

    for (var jj=0; jj<4; jj++) {

      var _m = _measure_pattern[_measure_idx][ rythm_symmetry[rythm_symmetry_idx][jj] ];
      var _measure = [];
      for (var _n=0; _n<_m.length; _n++) {
        _measure.push( _m[_n] );
      }
      rythm_lib[_measure_idx].push(_measure);
    }

  }



  var root_note_idx = _irnd(12);
  var root_note_name = fs.noteName[ root_note_idx ];

  // transition from one mode to another?
  //
  var song_mode = ["lydian", "aeolian"];

  // Get the chord progression for the mode of our choice
  //
  var mode_chord = fs.musicalModeChord[song_mode[1]];
  var mode_chord4 = fs.musicalModeChord4[song_mode[1]];

  // Get list of major chords for chord progression below.
  // Also save the index lookup from major chords back to the
  // original chord list.
  //
  var mode_maj_chord_idx_map = {};
  var mode_maj_chord = [];
  for (var i=0; i<mode_chord.length; i++) {
    if (mode_chord[i].type == "maj") {
      mode_maj_chord_idx_map[mode_maj_chord.length] = i;
      mode_maj_chord.push(mode_chord[i]);
    }
  }

  var chord_prog_idx = [];

  // basic chord progression:
  // * 4 bars
  // * root chord to start
  // * any two chord transitions
  // * end on major chord
  //
  var chord_prog = [];
  chord_prog_idx.push(0);
  chord_prog.push(mode_chord[0]);
  for (var i=1; i<3; i++) {
    var r = _irnd(mode_chord.length);
    chord_prog_idx.push(r);
    chord_prog.push( mode_chord[r] );
  }
  var r = _irnd(mode_maj_chord.length);
  chord_prog_idx.push(r);
  chord_prog.push( mode_maj_chord[r] );


  // playing with 7th chords for arp
  //
  var arp_chord = [];
  arp_chord.push( mode_chord4[0] );
  for (var i=0; i<(chord_prog.length-1); i++) {
    arp_chord.push( mode_chord4[i] );
  }
  var idx = mode_maj_chord_idx_map[ chord_prog_idx[ chord_prog_idx.length-1 ] ];
  arp_chord.push( mode_chord4[idx] );

  var arp_chord_note = [];
  var arp_chord_note_dt = [];
  for (var i=0; i<arp_chord.length; i++) {
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      //arp_chord_note_dt.push( 1.0 / rythm_rescale );
      arp_chord_note_dt.push( 0.5 / rythm_rescale );
    }
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      //arp_chord_note_dt.push( 1.0 / rythm_rescale );
      arp_chord_note_dt.push( 0.5 / rythm_rescale );
    }
  }


  // arp
  //

  // simple hill ( _/-\_ )
  //

  var arp_octave = 1;
  var arp_note_occ = [];
  for (var ii=0; ii<24; ii++) { arp_note_occ.push(0); }
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      arp_note_occ[ chord_prog[ii].chord[jj] ] = 1;
    }
  }
  var arp_note = [];
  for (var ii=0; ii<arp_note_occ.length; ii++) {
    if (arp_note_occ[ii] == 1) {
      arp_note.push(ii + 12*arp_octave);
    }
  }

  // mirror the arp, permute all but first note,
  // then restrict to only
  // 8 notes
  //
  var x = _mirror(arp_note);
  //x = _permute(x, 1, arp_note.length-1);
  var arp_prog =  [];
  var n_arp = 8;
  for (var prev=-1, ii=0; ii<x.length; ii++) {
    var idx = Math.floor( n_arp * ii / x.length );
    if (idx<=prev) { continue; }
    arp_prog.push(x[ii]);
    prev = idx;
  }

  // play with permuting arp...
  //
  var permute_arp = true;
  if (permute_arp) {
    for (var ii=1; ii<arp_prog.length; ii++) {
      var nt = arp_prog[ii];
      var p = ii + Math.floor( Math.random() * (arp_prog.length - ii) );
      arp_prog[ii] = arp_prog[p];
      arp_prog[p] = nt;
    }
  }

  // create melody by choosing random two notes from
  // each bar of chord progression
  //

  for (_melody_idx=0; _melody_idx<melody_count; _melody_idx++) {

    melody_info.push([]);

    for (var ii=0; ii<chord_prog.length; ii++) {
      var bar_notes = _apick(chord_prog[ii].chord, 2);

      console.log("//m", _melody_idx, "...", ii, "bar_notes:", bar_notes);

      for (var jj=0; jj<rythm_lib[_melody_idx][ii].length; jj++) {
        melody_info[_melody_idx].push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm_lib[_melody_idx][ii][jj] } );
      }
    }

  }


  var _song_structure = [ [''] ];

  //**************************
  //**************************
  //**************************
  //**************************
  //**************************
  // print gibber output
  //

  var use_str_note = false;

  var s;
  var note_name = [];
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "3" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "4" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "5" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "6" ); }


  var bass_choice = [
    { "type":"PolySynth", "preset":"stringPad", "loudness":0.5, "decay":1},
    //{ "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4},
    { "type":"PolySynth", "preset":"cry", "loudness":0.5, "decay":1},
    { "type":"PolySynth", "preset":"brass", "loudness":0.5, "decay":1}
  ];
  //var bass_instrument = { "type":"PolySynth", "preset":"stringPad", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"cry", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"brass", "loudness":1, "decay":4};
  var bass_instrument = bass_choice[ _irnd(bass_choice.length) ];

  //var arp_instrument = {"type":"FM", "preset":"bass"};
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":0.8, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":1.2, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":1.2, "decay":0.12}; // **
  var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":2, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":0.8, "decay":0.12}; // **

  // ones I like...
  //var melody0_instrument = {"type":"Monosynth", "preset":"short.dry"};
  //var melody0_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"lead", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dirty", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"pluckedEcho", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dark", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass", "loudness":2, "decay":0.95}; // **
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"easy", "loudness":1, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass2", "loudness":2, "decay":0.95}; // **


  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":2, "decay":0.95}; // **
  var melody_instrument = [
    {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95}
  ];

  //var melody0_instrument = {"type":"Monosynth", "preset":"bass.muted", "loudness":4, "decay":1.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"short", "loudness":1, "decay":0.95};

  // change melody decay rate based on max note length
  //
  for (var _melody_idx = 0; _melody_idx < melody_count; _melody_idx++) {
    var min_dt = 0.95;
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (min_dt > melody_info[_melody_idx][ii].dur) {
        min_dt = melody_info[_melody_idx][ii].dur;
      }
    }
    melody_instrument[_melody_idx].decay = min_dt;
  }


  console.log("");
  console.log('Gibber.clear();');
  console.log("Clock.bpm=", bpm, ";");
  console.log('Theory.mode = "chromatic";');
  console.log("// root_note_idx", root_note_idx);
  console.log('Theory.root = "' + note_name[root_note_idx] + '";');
  console.log('sv = Bus2("spaceverb");');

  // simple drums for now
  console.log("// simple drums");
  console.log('e = EDrums().connect( sv, .1 );');
  console.log('e.tidal("[ kd <cp kd cp kd> ]");');
  console.log('e.kick.gain = 2.5;');
  console.log('e.kick.decay = .995;');
  console.log('e.kick.frequency = 60;');


  console.log("// chord progression");
  s = 'bass = ' + bass_instrument.type + 
    '("' + 
    bass_instrument.preset + 
    '", {"decay":' + bass_instrument.decay.toString() + 
    ', "maxVoices":4, "loudness":' + bass_instrument.loudness.toString() + '}).connect(sv,0.35);\n';
  //s += 'bass.connect(sv, .35);\n';
  s += "bass.chord.seq( [";
  for (var ii=0; ii<chord_prog.length; ii++) {
    if (ii > 0) { s+= ','; }
    s += ' [';
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      if ((jj)>0) { s += ","; }
      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]] + '"';
      } else{
        var _n = chord_prog[ii].chord[jj];
        s += ' ' + _n.toString() + ' ';
      }
    }
    s += ' ]';
  }
  s += "], 1);";
  console.log(s);

  // arp 0

  console.log("// arp progression");
  s = 'a = ' + arp_instrument.type + '("' + arp_instrument.preset + '", ' +
      ' {"decay":' + arp_instrument.decay.toString() + ',"loudness":' + arp_instrument.loudness.toString() + '}).connect(sv,0.5);\n';
  //s += 'a.connect(sv, 0.5);\n';
  s += "a.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii]] + '"';
    } else {
      var _n = arp_prog[ii] ;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    //s += ' 0.125';
    s += ' ' + arp_dt;
  }
  s += "]);";
  console.log(s);

  // arp 0

  console.log("// arp octave++ progression");
  s = 'a_u = ' + arp_instrument.type + '("' + arp_instrument.preset + '", ' +
      ' {"decay":' + arp_instrument.decay.toString() + ',"loudness":' + arp_instrument.loudness.toString() + '}).connect(sv,0.5);\n';
  //s += 'a_u.connect(sv, 0.5);\n';
  s += "a_u.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii] + 12] + '"';
    } else {
      //var _n = root_note_idx + arp_prog[ii] ;
      var _n = arp_prog[ii] + 12;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    //s += ' 0.125';
    s += ' ' + arp_dt;
  }
  s += "]);";
  console.log(s);

  //---
  // melody 0
  //---

  for (var _melody_idx = 0; _melody_idx < melody_count; _melody_idx++) {

    var instrument_var = "m" + _melody_idx;

    console.log("// melody", _melody_idx);

    s = instrument_var + ' = ' + melody_instrument[_melody_idx].type +
      '("' + melody_instrument[_melody_idx].preset + 
          '", {"decay":' + melody_instrument[_melody_idx].decay.toString() + ',"loudness":' + melody_instrument[_melody_idx].loudness.toString() + '}).connect(sv,0.5);\n';
    //s += instrument_var + '.connect(sv, 0.5);\n';
    s += instrument_var + '.note.seq( [';
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }

      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + melody_info[_melody_idx][ii].note].toUpperCase() + '"';
      } else {
        //var _n = root_note_idx + melody_info[_melody_idx][ii].note;
        var _n = melody_info[_melody_idx][ii].note;
        s += ' ' + _n.toString() + ' ';
      }

    }
    s += " ], [ ";
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }
      s += ' ' + melody_info[_melody_idx][ii].dur.toString();
    }
    s += "] );";
    console.log(s);

    s = instrument_var + '_u = ' +
      melody_instrument[_melody_idx].type +
      '("' + melody_instrument[_melody_idx].preset + '", {"decay":' + melody_instrument[_melody_idx].decay.toString() + ',"loudness":' + melody_instrument[_melody_idx].loudness.toString() + '});\n';
    s += instrument_var + '_u.connect(sv, 0.5);\n';
    s += instrument_var + '_u.note.seq( [';
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }

      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + melody_info[_melody_idx][ii].note + 12].toUpperCase() + '"';
      } else {
        //var _n = root_note_idx + melody_info[_melody_idx][ii].note;
        var _n = melody_info[_melody_idx][ii].note + 12;
        _n %= 24;
        s += ' ' + _n.toString() + ' ';
      }

    }
    s += " ], [ ";
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }
      s += ' ' + melody_info[_melody_idx][ii].dur.toString();
    }
    s += "] );";
    console.log(s);

  }


  var gain_str = "";
  for (var _melody_idx=0; _melody_idx < melody_count; _melody_idx++) {
    var instrument_var = "m" + _melody_idx;
    gain_str += " " + instrument_var + ".gain = 0;";
    gain_str += " " + instrument_var + "_u.gain = 0;";
  }
  gain_str += " a.gain = 0;";
  gain_str += " a_u.gain = 0;";
  gain_str += " bass.gain = 0;";
  gain_str += " e.gain = 0;";
  console.log(gain_str);


  var beat_ms = 60*1000 / bpm;
  var measure_ms = 4*4*beat_ms;
  var wait_unit_ms = 4*measure_ms;
  var fudge = 50;

  var _quarter = 1;
  var _half = 2;
  var _full = 4;
  var _song_t = 0;

  console.log(" ");
  _song_t += _half;
  console.log("future( _a => { _a.gain = 0.2; }, ", _song_t, ", {_a:a});");

  _song_t += _half;
  console.log("bass.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  _song_t += _quarter;
  console.log("a_u.gain.fade ( 0.0, 0.1, 1, ", _song_t, ");");

  _song_t += _half;
  console.log("a_u.gain.fade ( 0.1, 0.0, 1, ", _song_t, ");");

  _song_t += _quarter;
  console.log("e.gain.fade   ( 0.0, 1.0, 1, ", _song_t, ");");

  _song_t += _full;
  console.log("future( _m0 => { _m0.gain = 0.2; } , ", _song_t, ", {_m0:m0});");

  //_song_t += _half + _quarter;
  _song_t += 3*_full;
  console.log("future( _m0 => { _m0.gain = 0.0; } , ", _song_t, ", {_m0:m0});");
  console.log("future( _m1 => { _m1.gain = 0.2; } , ", _song_t, ", {_m1:m1});");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m1 => { _m1.gain = 0.0; } , ", _song_t, ", {_m1:m1});");
  console.log("future( _m2 => { _m2.gain = 0.2; } , ", _song_t, ", {_m2:m2});");

  //_song_t += _half + _quarter;
  _song_t += 3*_full;
  console.log("future( _m2 => { _m2.gain = 0.0; } , ", _song_t, ", {_m2:m2});");
  console.log("future( _m3 => { _m3.gain = 0.2; } , ", _song_t, ", {_m3:m3});");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m3 => { _m3.gain = 0.0; } , ", _song_t, ", {_m3:m3});");

  console.log("a_u.gain.fade( 0.0, 0.2, 2, ", _song_t, ");");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("m0.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");
  console.log("m0_u.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("m1.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");
  console.log("m1_u.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  //_song_t += _half;
  _song_t += 2*_full;
  console.log("bass.gain.fade(0.2, 0.0, 4, ", _song_t, ");");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m0   => { _m0.gain   = 0.0; } , ", _song_t, ", { _m0   : m0   });");
  console.log("future( _m0_u => { _m0_u.gain = 0.0; } , ", _song_t, ", { _m0_u : m0_u });");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m1   => { _m1.gain   = 0.0; } , ", _song_t, ", { _m1   : m1   });");
  console.log("future( _m1_u => { _m1_u.gain = 0.0; } , ", _song_t, ", { _m1_u : m1_u });");

  _song_t += _quarter;
  console.log("future( _a    => { _a.gain    = 0.0; } , ", _song_t, ", { _a    : a    });");
  console.log("future( _a_u  => { _a_u.gain  = 0.0; } , ", _song_t, ", { _a_u  : a_u  });");

  _song_t += _quarter;
  //console.log("future( _e    => { _e.gain    = 0.0; } , ", _song_t, ", { _e    : e    });");
  console.log("e.gain.fade( 1.0, 0.0, 0.24, ", _song_t, ");");

}

function _alg_v_1_5() {

  var bpm = 100;
  var rythm_rescale = 8.0;

  var fs = new FamiliarSynths();
  var arp_dt = 0.5 / rythm_rescale;

  var rythm_symmetry = [
    [0, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 1]
  ];
  var rythm_lib = [];
  var melody_count = 4;
  var melody_info = [];


  // random rythms...
  //
  //var beat_quantize = 0.125;
  var beat_quantize = 0.25;

  //var pareto_m = 0.125, pareto_alpha = 2.5;
  //var pareto_m = 0.2, pareto_alpha = 2.95;
  var pareto_m = 0.1, pareto_alpha = 1.25;

  // measure patterns hold the two measures,
  // each randomely generated (4 below, but only 2 are used).
  // They symmetry above is used to give some structure
  // to the 4 bar measure so it doesn't sound completely random.
  //
  var _measure_pattern = [];
  for (var _measure_pattern_idx=0; _measure_pattern_idx < melody_count; _measure_pattern_idx++) {
    for (var ii=0; ii<4; ii++) {

      _measure_pattern.push([]);

      var beat_sum = 0.0;
      var _measure = [];
      for (var jj=0; jj<16; jj++) {
        var dt = _quantize( stoch.pareto(pareto_m, pareto_alpha), beat_quantize ) + beat_quantize;
        if ((beat_sum+dt) >= 1.0) {
          _measure.push(1.0 - beat_sum);
          break;
        }
        else {
          _measure.push(dt);
        }
        beat_sum += dt;
      }
      _measure_pattern[_measure_pattern_idx].push(_measure);
    }

  }

  // pick the melody timing 'symmetry' and create the two
  // rythms for both melodies.
  //

  for (var _measure_idx=0; _measure_idx < melody_count; _measure_idx++) {

    rythm_lib.push([]);

    var rythm_symmetry_idx = _irnd(rythm_symmetry.length);

    console.log("// sym:", rythm_symmetry[rythm_symmetry_idx]);

    for (var jj=0; jj<4; jj++) {

      var _m = _measure_pattern[_measure_idx][ rythm_symmetry[rythm_symmetry_idx][jj] ];
      var _measure = [];
      for (var _n=0; _n<_m.length; _n++) {
        _measure.push( _m[_n] );
      }
      rythm_lib[_measure_idx].push(_measure);
    }

  }



  var root_note_idx = _irnd(12);
  var root_note_name = fs.noteName[ root_note_idx ];

  // transition from one mode to another?
  //
  var song_mode = ["lydian", "aeolian"];

  // Get the chord progression for the mode of our choice
  //
  var mode_chord = fs.musicalModeChord[song_mode[1]];
  var mode_chord4 = fs.musicalModeChord4[song_mode[1]];

  // Get list of major chords for chord progression below.
  // Also save the index lookup from major chords back to the
  // original chord list.
  //
  var mode_maj_chord_idx_map = {};
  var mode_maj_chord = [];
  for (var i=0; i<mode_chord.length; i++) {
    if (mode_chord[i].type == "maj") {
      mode_maj_chord_idx_map[mode_maj_chord.length] = i;
      mode_maj_chord.push(mode_chord[i]);
    }
  }

  var chord_prog_idx = [];

  // basic chord progression:
  // * 4 bars
  // * root chord to start
  // * any two chord transitions
  // * end on major chord
  //
  var chord_prog = [];
  chord_prog_idx.push(0);
  chord_prog.push(mode_chord[0]);
  for (var i=1; i<3; i++) {
    var r = _irnd(mode_chord.length);
    chord_prog_idx.push(r);
    chord_prog.push( mode_chord[r] );
  }
  var r = _irnd(mode_maj_chord.length);
  chord_prog_idx.push(r);
  chord_prog.push( mode_maj_chord[r] );


  // playing with 7th chords for arp
  //
  var arp_chord = [];
  arp_chord.push( mode_chord4[0] );
  for (var i=0; i<(chord_prog.length-1); i++) {
    arp_chord.push( mode_chord4[i] );
  }
  var idx = mode_maj_chord_idx_map[ chord_prog_idx[ chord_prog_idx.length-1 ] ];
  arp_chord.push( mode_chord4[idx] );

  var arp_chord_note = [];
  var arp_chord_note_dt = [];
  for (var i=0; i<arp_chord.length; i++) {
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      //arp_chord_note_dt.push( 1.0 / rythm_rescale );
      arp_chord_note_dt.push( 0.5 / rythm_rescale );
    }
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      //arp_chord_note_dt.push( 1.0 / rythm_rescale );
      arp_chord_note_dt.push( 0.5 / rythm_rescale );
    }
  }


  // arp
  //

  // simple hill ( _/-\_ )
  //

  var arp_octave = 1;
  var arp_note_occ = [];
  for (var ii=0; ii<24; ii++) { arp_note_occ.push(0); }
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      arp_note_occ[ chord_prog[ii].chord[jj] ] = 1;
    }
  }
  var arp_note = [];
  for (var ii=0; ii<arp_note_occ.length; ii++) {
    if (arp_note_occ[ii] == 1) {
      arp_note.push(ii + 12*arp_octave);
    }
  }

  // mirror the arp, permute all but first note,
  // then restrict to only
  // 8 notes
  //
  var x = _mirror(arp_note);
  //x = _permute(x, 1, arp_note.length-1);
  var arp_prog =  [];
  var n_arp = 8;
  for (var prev=-1, ii=0; ii<x.length; ii++) {
    var idx = Math.floor( n_arp * ii / x.length );
    if (idx<=prev) { continue; }
    arp_prog.push(x[ii]);
    prev = idx;
  }

  // play with permuting arp...
  //
  var permute_arp = true;
  if (permute_arp) {
    for (var ii=1; ii<arp_prog.length; ii++) {
      var nt = arp_prog[ii];
      var p = ii + Math.floor( Math.random() * (arp_prog.length - ii) );
      arp_prog[ii] = arp_prog[p];
      arp_prog[p] = nt;
    }
  }

  // create melody by choosing random two notes from
  // each bar of chord progression
  //

  for (_melody_idx=0; _melody_idx<melody_count; _melody_idx++) {

    melody_info.push([]);

    for (var ii=0; ii<chord_prog.length; ii++) {
      var bar_notes = _apick(chord_prog[ii].chord, 2);

      console.log("//m", _melody_idx, "...", ii, "bar_notes:", bar_notes);

      for (var jj=0; jj<rythm_lib[_melody_idx][ii].length; jj++) {
        melody_info[_melody_idx].push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm_lib[_melody_idx][ii][jj] } );
      }
    }

  }


  var _song_structure = [ [''] ];

  //**************************
  //**************************
  //**************************
  //**************************
  //**************************
  // print gibber output
  //

  var use_str_note = false;

  var s;
  var note_name = [];
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "3" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "4" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "5" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "6" ); }


  var bass_choice = [
    { "type":"PolySynth", "preset":"stringPad", "loudness":0.5, "decay":1},
    //{ "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4},
    { "type":"PolySynth", "preset":"cry", "loudness":0.5, "decay":1},
    { "type":"PolySynth", "preset":"brass", "loudness":0.5, "decay":1}
  ];
  //var bass_instrument = { "type":"PolySynth", "preset":"stringPad", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"cry", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"brass", "loudness":1, "decay":4};
  var bass_instrument = bass_choice[ _irnd(bass_choice.length) ];

  //var arp_instrument = {"type":"FM", "preset":"bass"};
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":0.8, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":1.2, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":1.2, "decay":0.12}; // **
  var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":2, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":0.8, "decay":0.12}; // **

  // ones I like...
  //var melody0_instrument = {"type":"Monosynth", "preset":"short.dry"};
  //var melody0_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"lead", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dirty", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"pluckedEcho", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dark", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass", "loudness":2, "decay":0.95}; // **
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"easy", "loudness":1, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass2", "loudness":2, "decay":0.95}; // **


  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":2, "decay":0.95}; // **
  var melody_instrument = [
    {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95}
  ];

  //var melody0_instrument = {"type":"Monosynth", "preset":"bass.muted", "loudness":4, "decay":1.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"short", "loudness":1, "decay":0.95};

  // change melody decay rate based on max note length
  //
  for (var _melody_idx = 0; _melody_idx < melody_count; _melody_idx++) {
    var min_dt = 0.95;
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (min_dt > melody_info[_melody_idx][ii].dur) {
        min_dt = melody_info[_melody_idx][ii].dur;
      }
    }
    melody_instrument[_melody_idx].decay = min_dt;
  }


  console.log("");
  console.log('Gibber.clear();');
  console.log("Clock.bpm=", bpm, ";");
  console.log('Theory.mode = "chromatic";');
  //console.log("// root_note_idx", root_note_idx);
  console.log('Theory.root = "' + note_name[root_note_idx] + '";');
  console.log('sv = Bus2("spaceverb");');

  // simple drums for now
  //console.log("// simple drums");
  console.log('e = EDrums().connect( sv, .1 );');
  console.log('e.tidal("[ kd <cp kd cp kd> ]");');
  console.log('e.kick.gain = 2.5;');
  console.log('e.kick.decay = .995;');
  console.log('e.kick.frequency = 60;');


  //console.log("// chord progression");
  s = 'bass = ' + bass_instrument.type + 
    '("' + 
    bass_instrument.preset + 
    '", {"decay":' + bass_instrument.decay.toString() + 
    ', "maxVoices":4, "loudness":' + bass_instrument.loudness.toString() + '}).connect(sv,0.35);\n';
  //s += 'bass.connect(sv, .35);\n';
  s += "bass.chord.seq( [";
  for (var ii=0; ii<chord_prog.length; ii++) {
    if (ii > 0) { s+= ','; }
    s += ' [';
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      if ((jj)>0) { s += ","; }
      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]] + '"';
      } else{
        var _n = chord_prog[ii].chord[jj];
        s += ' ' + _n.toString() + ' ';
      }
    }
    s += ' ]';
  }
  s += "], 1);";
  console.log(s);

  // arp 0

  //console.log("// arp progression");
  s = 'a = ' + arp_instrument.type + '("' + arp_instrument.preset + '", ' +
      ' {"decay":' + arp_instrument.decay.toString() + ',"loudness":' + arp_instrument.loudness.toString() + '}).connect(sv,0.5);\n';
  //s += 'a.connect(sv, 0.5);\n';
  s += "a.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii]] + '"';
    } else {
      var _n = arp_prog[ii] ;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    //s += ' 0.125';
    s += ' ' + arp_dt;
  }
  s += "]);";
  console.log(s);

  // arp 0

  //console.log("// arp octave++ progression");
  s = 'a_u = ' + arp_instrument.type + '("' + arp_instrument.preset + '", ' +
      ' {"decay":' + arp_instrument.decay.toString() + ',"loudness":' + arp_instrument.loudness.toString() + '}).connect(sv,0.5);\n';
  //s += 'a_u.connect(sv, 0.5);\n';
  s += "a_u.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii] + 12] + '"';
    } else {
      //var _n = root_note_idx + arp_prog[ii] ;
      var _n = arp_prog[ii] + 12;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    //s += ' 0.125';
    s += ' ' + arp_dt;
  }
  s += "]);";
  console.log(s);

  //---
  // melody instruments and progressions
  //---

  for (var _melody_idx = 0; _melody_idx < melody_count; _melody_idx++) {

    var instrument_var = "m" + _melody_idx;

    //console.log("// melody", _melody_idx);

    s = instrument_var + ' = ' + melody_instrument[_melody_idx].type +
      '("' + melody_instrument[_melody_idx].preset + 
          '", {"decay":' + melody_instrument[_melody_idx].decay.toString() + ',"loudness":' + melody_instrument[_melody_idx].loudness.toString() + '}).connect(sv,0.5);\n';
    //s += instrument_var + '.connect(sv, 0.5);\n';
    s += instrument_var + '.note.seq( [';
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }

      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + melody_info[_melody_idx][ii].note].toUpperCase() + '"';
      } else {
        //var _n = root_note_idx + melody_info[_melody_idx][ii].note;
        var _n = melody_info[_melody_idx][ii].note;
        s += ' ' + _n.toString() + ' ';
      }

    }
    s += " ], [ ";
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }
      s += ' ' + melody_info[_melody_idx][ii].dur.toString();
    }
    s += "] );";
    console.log(s);

    s = instrument_var + '_u = ' +
      melody_instrument[_melody_idx].type +
      '("' + melody_instrument[_melody_idx].preset + '", {"decay":' + melody_instrument[_melody_idx].decay.toString() + ',"loudness":' + melody_instrument[_melody_idx].loudness.toString() + '});\n';
    s += instrument_var + '_u.connect(sv, 0.5);\n';
    s += instrument_var + '_u.note.seq( [';
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }

      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + melody_info[_melody_idx][ii].note + 12].toUpperCase() + '"';
      } else {
        //var _n = root_note_idx + melody_info[_melody_idx][ii].note;
        var _n = melody_info[_melody_idx][ii].note + 12;
        //_n %= 24;
        s += ' ' + _n.toString() + ' ';
      }

    }
    s += " ], [ ";
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }
      s += ' ' + melody_info[_melody_idx][ii].dur.toString();
    }
    s += "] );";
    console.log(s);

  }


  var gain_str = "";
  for (var _melody_idx=0; _melody_idx < melody_count; _melody_idx++) {
    var instrument_var = "m" + _melody_idx;
    gain_str += " " + instrument_var + ".gain = 0;";
    gain_str += " " + instrument_var + "_u.gain = 0;";
  }
  gain_str += " a.gain = 0;";
  gain_str += " a_u.gain = 0;";
  gain_str += " bass.gain = 0;";
  gain_str += " e.gain = 0;";
  console.log(gain_str);


  var beat_ms = 60*1000 / bpm;
  var measure_ms = 4*4*beat_ms;
  var wait_unit_ms = 4*measure_ms;
  var fudge = 50;

  var _quarter = 1;
  var _half = 2;
  var _full = 4;
  var _song_t = 0;

  // . |    - nop
  // [0-9]  - fade in over # measures
  // !      - decrease immediately
  // ;      - fade out over 1 measure
  // :      - fade out over 2 measures
  //
  instrument_schedule = {
    "a"   : "2... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... !... .... ",
    "a_u" : ".2.: .... .... .... | .... .... .... .... | .... .... .... .... | 4... .... .... .... | .... .... !... .... ",
    "bass": ".... 4... .... .... | .... .... .... .... | .... .... .... .... | .... .... .... .... | .... !... .... .... ",

    "m0"  : ".... .... .... .... | 0... .... .... !... | .... .... .... .... | 1... .... .... !... | .... .... .... .... ",
    "m0_u": ".... .... .... .... | .... .... .... .... | .... .... .... .... | .1.. .... .... !... | .... .... .... .... ",

    "m1"  : ".... .... .... .... | .... .... .... 0... | !... .... .... .... | .... .... .... 0... | !... .... .... .... ",
    "m1_u": ".... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... .... 0... | !... .... .... .... ",

    "m2"  : ".... .... .... .... | .... .... .... .... | 0... .... .... !... | 1... .... .... !... | .... .... .... .... ",
    "m2_u": ".... .... .... .... | .... .... .... .... | .... .... .... .... | .1.. .... .... !... | .... .... .... .... ",

    "m3"  : ".... .... .... .... | .... .... .... .... | .... .... .... 0... | !... .... .... 0... | !... .... .... .... ",
    "m3_u": ".... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... .... 0... | !... .... .... .... ",

    "e"   : ".... .... 0... .... | .... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... ..!. .... "
  };

  var instrument_gain = {
    "a"   : 0.2, "a_u" : 0.2,
    "m0"  : 0.2, "m0_u": 0.2,
    "m1"  : 0.2, "m1_u": 0.2,
    "m2"  : 0.2, "m2_u": 0.2,
    "m3"  : 0.2, "m3_u": 0.2,
    "bass": 0.2,
    "e"   : 1.0
  }

  var _regex = /[ |]/g;
  for (var instr_var in instrument_schedule) {
    var s = instrument_schedule[instr_var];
    s = s.replace(_regex, '');

    var _g = instrument_gain[instr_var];

    _song_t = 0;
    var _m = "";
    for (var ii=0; ii<s.length; ii++) {
      if (s[ii] == '.') { continue; }
      if (_m = s[ii].match(/[0-9]/)) {
        var delay = parseInt(_m[0]);
        if (delay==0) {
          console.log("future( _" + instr_var + " => { _" + instr_var + ".gain = " + _g + "; }, " + ii + ", {_" + instr_var + ":" + instr_var + "});");
        }
        else {
          console.log(instr_var + ".gain.fade( 0.0, " + _g + ", " + delay + ", " + ii + ");");
        }
      }
      else if (_m = s[ii].match(/!/)) {
        console.log("future( _" + instr_var + " => { _" + instr_var + ".gain = 0.0; }, " + ii + ", {_" + instr_var + ":" + instr_var + "});");
      }
      else if (_m = s[ii].match(/;/)) {
          console.log(instr_var + ".gain.fade( " + _g + ", 0.0, 1, " + ii + ");");
      }
      else if (_m = s[ii].match(/:/)) {
          console.log(instr_var + ".gain.fade( " + _g + ", 0.0, 2, " + ii + ");");
      }
    }

  }

  return;

  _song_t = 0;

  console.log(" ");
  _song_t += _half;
  console.log("future( _a => { _a.gain = 0.2; }, ", _song_t, ", {_a:a});");

  _song_t += _half;
  console.log("bass.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  _song_t += _quarter;
  console.log("a_u.gain.fade ( 0.0, 0.1, 1, ", _song_t, ");");

  _song_t += _half;
  console.log("a_u.gain.fade ( 0.1, 0.0, 1, ", _song_t, ");");

  _song_t += _quarter;
  console.log("e.gain.fade   ( 0.0, 1.0, 1, ", _song_t, ");");

  _song_t += _full;
  console.log("future( _m0 => { _m0.gain = 0.2; } , ", _song_t, ", {_m0:m0});");

  //_song_t += _half + _quarter;
  _song_t += 3*_full;
  console.log("future( _m0 => { _m0.gain = 0.0; } , ", _song_t, ", {_m0:m0});");
  console.log("future( _m1 => { _m1.gain = 0.2; } , ", _song_t, ", {_m1:m1});");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m1 => { _m1.gain = 0.0; } , ", _song_t, ", {_m1:m1});");
  console.log("future( _m2 => { _m2.gain = 0.2; } , ", _song_t, ", {_m2:m2});");

  //_song_t += _half + _quarter;
  _song_t += 3*_full;
  console.log("future( _m2 => { _m2.gain = 0.0; } , ", _song_t, ", {_m2:m2});");
  console.log("future( _m3 => { _m3.gain = 0.2; } , ", _song_t, ", {_m3:m3});");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m3 => { _m3.gain = 0.0; } , ", _song_t, ", {_m3:m3});");

  console.log("a_u.gain.fade( 0.0, 0.2, 2, ", _song_t, ");");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("m0.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");
  console.log("m0_u.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("m1.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");
  console.log("m1_u.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  //_song_t += _half;
  _song_t += 2*_full;
  console.log("bass.gain.fade(0.2, 0.0, 4, ", _song_t, ");");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m0   => { _m0.gain   = 0.0; } , ", _song_t, ", { _m0   : m0   });");
  console.log("future( _m0_u => { _m0_u.gain = 0.0; } , ", _song_t, ", { _m0_u : m0_u });");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m1   => { _m1.gain   = 0.0; } , ", _song_t, ", { _m1   : m1   });");
  console.log("future( _m1_u => { _m1_u.gain = 0.0; } , ", _song_t, ", { _m1_u : m1_u });");

  _song_t += _quarter;
  console.log("future( _a    => { _a.gain    = 0.0; } , ", _song_t, ", { _a    : a    });");
  console.log("future( _a_u  => { _a_u.gain  = 0.0; } , ", _song_t, ", { _a_u  : a_u  });");

  _song_t += _quarter;
  //console.log("future( _e    => { _e.gain    = 0.0; } , ", _song_t, ", { _e    : e    });");
  console.log("e.gain.fade( 1.0, 0.0, 0.24, ", _song_t, ");");

}

function _alg_v_1_6() {

  var bpm = 100;
  var rythm_rescale = 8.0;

  var fs = new FamiliarSynths();
  var arp_dt = 0.5 / rythm_rescale;



  var rythm_symmetry = [
    [0, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 1]
  ];
  var rythm_lib = [];
  var melody_count = 4;
  var melody_info = [];


  // random rythms...
  //
  //var beat_quantize = 0.125;
  var beat_quantize = 0.25;

  //var pareto_m = 0.125, pareto_alpha = 2.5;
  //var pareto_m = 0.2, pareto_alpha = 2.95;
  var pareto_m = 0.1, pareto_alpha = 1.25;

  // measure patterns hold the two measures,
  // each randomely generated (4 below, but only 2 are used).
  // They symmetry above is used to give some structure
  // to the 4 bar measure so it doesn't sound completely random.
  //
  var _measure_pattern = [];
  for (var _measure_pattern_idx=0; _measure_pattern_idx < melody_count; _measure_pattern_idx++) {
    for (var ii=0; ii<4; ii++) {

      _measure_pattern.push([]);

      var beat_sum = 0.0;
      var _measure = [];
      for (var jj=0; jj<16; jj++) {
        var dt = _quantize( stoch.pareto(pareto_m, pareto_alpha), beat_quantize ) + beat_quantize;
        if ((beat_sum+dt) >= 1.0) {
          _measure.push(1.0 - beat_sum);
          break;
        }
        else {
          _measure.push(dt);
        }
        beat_sum += dt;
      }
      _measure_pattern[_measure_pattern_idx].push(_measure);
    }

  }

  // pick the melody timing 'symmetry' and create the two
  // rythms for both melodies.
  //

  for (var _measure_idx=0; _measure_idx < melody_count; _measure_idx++) {

    rythm_lib.push([]);

    var rythm_symmetry_idx = _irnd(rythm_symmetry.length);

    console.log("// sym:", rythm_symmetry[rythm_symmetry_idx]);

    for (var jj=0; jj<4; jj++) {

      var _m = _measure_pattern[_measure_idx][ rythm_symmetry[rythm_symmetry_idx][jj] ];
      var _measure = [];
      for (var _n=0; _n<_m.length; _n++) {
        _measure.push( _m[_n] );
      }
      rythm_lib[_measure_idx].push(_measure);
    }

  }



  var root_note_idx = _irnd(12);
  var root_note_name = fs.noteName[ root_note_idx ];

  // transition from one mode to another?
  //
  var song_mode = ["lydian", "aeolian"];

  // Get the chord progression for the mode of our choice
  //
  var mode_chord = fs.musicalModeChord[song_mode[1]];
  var mode_chord4 = fs.musicalModeChord4[song_mode[1]];

  // Get list of major chords for chord progression below.
  // Also save the index lookup from major chords back to the
  // original chord list.
  //
  var mode_maj_chord_idx_map = {};
  var mode_maj_chord = [];
  for (var i=0; i<mode_chord.length; i++) {
    if (mode_chord[i].type == "maj") {
      mode_maj_chord_idx_map[mode_maj_chord.length] = i;
      mode_maj_chord.push(mode_chord[i]);
    }
  }

  var chord_prog_idx = [];

  // basic chord progression:
  // * 4 bars
  // * root chord to start
  // * any two chord transitions
  // * end on major chord
  //
  var chord_prog = [];
  chord_prog_idx.push(0);
  chord_prog.push(mode_chord[0]);
  for (var i=1; i<3; i++) {
    var r = _irnd(mode_chord.length);
    chord_prog_idx.push(r);
    chord_prog.push( mode_chord[r] );
  }
  var r = _irnd(mode_maj_chord.length);
  chord_prog_idx.push(r);
  chord_prog.push( mode_maj_chord[r] );


  // playing with 7th chords for arp
  //
  var arp_chord = [];
  arp_chord.push( mode_chord4[0] );
  for (var i=0; i<(chord_prog.length-1); i++) {
    arp_chord.push( mode_chord4[i] );
  }
  var idx = mode_maj_chord_idx_map[ chord_prog_idx[ chord_prog_idx.length-1 ] ];
  arp_chord.push( mode_chord4[idx] );

  var arp_chord_note = [];
  var arp_chord_note_dt = [];
  for (var i=0; i<arp_chord.length; i++) {
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      //arp_chord_note_dt.push( 1.0 / rythm_rescale );
      arp_chord_note_dt.push( 0.5 / rythm_rescale );
    }
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      //arp_chord_note_dt.push( 1.0 / rythm_rescale );
      arp_chord_note_dt.push( 0.5 / rythm_rescale );
    }
  }


  // arp
  //

  // simple hill ( _/-\_ )
  //

  var arp_octave = 1;
  var arp_note_occ = [];
  for (var ii=0; ii<24; ii++) { arp_note_occ.push(0); }
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      arp_note_occ[ chord_prog[ii].chord[jj] ] = 1;
    }
  }
  var arp_note = [];
  for (var ii=0; ii<arp_note_occ.length; ii++) {
    if (arp_note_occ[ii] == 1) {
      arp_note.push(ii + 12*arp_octave);
    }
  }

  // mirror the arp, permute all but first note,
  // then restrict to only
  // 8 notes
  //
  var x = _mirror(arp_note);
  //x = _permute(x, 1, arp_note.length-1);
  var arp_prog =  [];
  var n_arp = 8;
  for (var prev=-1, ii=0; ii<x.length; ii++) {
    var idx = Math.floor( n_arp * ii / x.length );
    if (idx<=prev) { continue; }
    arp_prog.push(x[ii]);
    prev = idx;
  }

  // play with permuting arp...
  //
  var permute_arp = true;
  if (permute_arp) {
    for (var ii=1; ii<arp_prog.length; ii++) {
      var nt = arp_prog[ii];
      var p = ii + Math.floor( Math.random() * (arp_prog.length - ii) );
      arp_prog[ii] = arp_prog[p];
      arp_prog[p] = nt;
    }
  }

  // create melody by choosing random two notes from
  // each bar of chord progression
  //

  for (_melody_idx=0; _melody_idx<melody_count; _melody_idx++) {

    melody_info.push([]);

    for (var ii=0; ii<chord_prog.length; ii++) {
      var bar_notes = _apick(chord_prog[ii].chord, 2);

      console.log("//m", _melody_idx, "...", ii, "bar_notes:", bar_notes);

      for (var jj=0; jj<rythm_lib[_melody_idx][ii].length; jj++) {
        melody_info[_melody_idx].push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm_lib[_melody_idx][ii][jj] } );
      }
    }

  }


  var _song_structure = [ [''] ];

  //**************************
  //**************************
  //**************************
  //**************************
  //**************************
  // print gibber output
  //

  var use_str_note = false;

  var s;
  var note_name = [];
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "3" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "4" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "5" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "6" ); }


  var bass_choice = [
    { "type":"PolyMono", "preset":"dirty", "loudness":0.5, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"pluckEcho", "loudness":0.5, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"bassPad", "loudness":0.5, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"dark", "loudness":0.5, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"bass", "loudness":0.5, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"bass2", "loudness":0.5, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"edgy", "loudness":0.5, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"shinybass2", "loudness":0.5, "decay":1, "cutoff":0.3},
    { "type":"PolyMono", "preset":"shinybass", "loudness":0.5, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"bass.muted", "loudness":0.5, "decay":1, "cutoff":0.2},
    { "type":"PolyMono", "preset":"short", "loudness":0.5, "decay":1, "cutoff":0.2},
    { "type":"PolySynth", "preset":"stringPad", "loudness":0.5, "decay":1},
    //{ "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4},
    { "type":"PolySynth", "preset":"cry", "loudness":0.5, "decay":1},
    { "type":"PolySynth", "preset":"brass", "loudness":0.5, "decay":1}
  ];
  //var bass_instrument = { "type":"PolySynth", "preset":"stringPad", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"cry", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"brass", "loudness":1, "decay":4};
  var bass_instrument = bass_choice[ _irnd(bass_choice.length) ];

  //var arp_instrument = {"type":"FM", "preset":"bass"};
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":0.8, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":1.2, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":1.2, "decay":0.12}; // **
  var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":2, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":0.8, "decay":0.12}; // **

  // ones I like...
  //var melody0_instrument = {"type":"Monosynth", "preset":"short.dry"};
  //var melody0_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"lead", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dirty", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"pluckedEcho", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"dark", "loudness":1, "decay":0.5};
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass", "loudness":2, "decay":0.95}; // **
  //var melody0_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"easy", "loudness":1, "decay":0.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass2", "loudness":2, "decay":0.95}; // **


  //var melody0_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":2, "decay":0.95}; // **
  var melody_instrument = [
    {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"bass2", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"arpy", "loudness":2, "decay":0.95}
  ];

  //var melody0_instrument = {"type":"Monosynth", "preset":"bass.muted", "loudness":4, "decay":1.95};
  //var melody0_instrument = {"type":"Monosynth", "preset":"short", "loudness":1, "decay":0.95};

  // change melody decay rate based on max note length
  //
  for (var _melody_idx = 0; _melody_idx < melody_count; _melody_idx++) {
    var min_dt = 0.95;
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (min_dt > melody_info[_melody_idx][ii].dur) {
        min_dt = melody_info[_melody_idx][ii].dur;
      }
    }
    melody_instrument[_melody_idx].decay = min_dt;
  }


  console.log("");
  console.log('Gibber.clear();');
  console.log("Clock.bpm=", bpm, ";");
  console.log('Theory.mode = "chromatic";');
  //console.log("// root_note_idx", root_note_idx);
  console.log('Theory.root = "' + note_name[root_note_idx] + '";');
  console.log('sv = Bus2("spaceverb");');

  // simple drums for now
  //console.log("// simple drums");
  console.log('e = EDrums().connect( sv, .3 );');
  //console.log('e.tidal("[ kd <cp kd cp kd> ]");');
  console.log('e.tidal("[ {kd,ch} ~ ch ~ ch ~ ch ~    {sd,<ch oh>} ~ ch ~ ch ~ ch ~     {kd,ch} ~ <ch oh> ~ {ch,<~ cp>} ~ {ch,<~ cp>} ~     {sd,ch} ~ {ch,<~ cp>} ~ {ch,<~ cp>} ~ {ch,<~ kd>} ~ ]")');
  console.log('e.kick.gain = 1;');
  console.log('e.kick.decay = .995;');
  console.log('e.kick.frequency = 60;');




  //console.log("// chord progression");
  s = 'bass = ' + bass_instrument.type + 
    '("' + 
    bass_instrument.preset + 
    '", {"decay":' + bass_instrument.decay.toString() + 
    ', "maxVoices":4, "loudness":' + bass_instrument.loudness.toString() + ', "cutoff":' + bass_instrument.cutoff.toString() + '}).connect(sv,0.35);\n';
  //s += 'bass.connect(sv, .35);\n';
  s += "bass.chord.seq( [";
  for (var ii=0; ii<chord_prog.length; ii++) {
    if (ii > 0) { s+= ','; }
    s += ' [';
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      if ((jj)>0) { s += ","; }
      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]] + '"';
      } else{
        var _n = chord_prog[ii].chord[jj];
        s += ' ' + _n.toString() + ' ';
      }
    }
    s += ' ]';
  }
  s += "], 1);";
  console.log(s);

  // arp 0

  //console.log("// arp progression");
  s = 'a = ' + arp_instrument.type + '("' + arp_instrument.preset + '", ' +
      ' {"decay":' + arp_instrument.decay.toString() +
        ',"loudness":' + arp_instrument.loudness.toString() + '}).connect(sv,0.5);\n';
  //s += 'a.connect(sv, 0.5);\n';
  s += "a.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii]] + '"';
    } else {
      var _n = arp_prog[ii] ;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    //s += ' 0.125';
    s += ' ' + arp_dt;
  }
  s += "]);";
  console.log(s);

  // arp 0

  //console.log("// arp octave++ progression");
  s = 'a_u = ' + arp_instrument.type + '("' + arp_instrument.preset + '", ' +
      ' {"decay":' + arp_instrument.decay.toString() + 
        ',"loudness":' + arp_instrument.loudness.toString() + 
          '}).connect(sv,0.5);\n';
  //s += 'a_u.connect(sv, 0.5);\n';
  s += "a_u.note.seq( [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }

    if (use_str_note) {
      s += ' "' + note_name[root_note_idx + arp_prog[ii] + 12] + '"';
    } else {
      //var _n = root_note_idx + arp_prog[ii] ;
      var _n = arp_prog[ii] + 12;
      s += ' ' + _n.toString() + ' ';
    }

  }
  s += "], [";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    //s += ' 0.125';
    s += ' ' + arp_dt;
  }
  s += "]);";
  console.log(s);

  //---
  // melody instruments and progressions
  //---

  for (var _melody_idx = 0; _melody_idx < melody_count; _melody_idx++) {

    var instrument_var = "m" + _melody_idx;

    //console.log("// melody", _melody_idx);

    s = instrument_var + ' = ' + melody_instrument[_melody_idx].type +
      '("' + melody_instrument[_melody_idx].preset + 
          '", {"decay":' + melody_instrument[_melody_idx].decay.toString() + ',"loudness":' + melody_instrument[_melody_idx].loudness.toString() + '}).connect(sv,0.5);\n';
    //s += instrument_var + '.connect(sv, 0.5);\n';
    s += instrument_var + '.note.seq( [';
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }

      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + melody_info[_melody_idx][ii].note].toUpperCase() + '"';
      } else {
        //var _n = root_note_idx + melody_info[_melody_idx][ii].note;
        var _n = melody_info[_melody_idx][ii].note;
        s += ' ' + _n.toString() + ' ';
      }

    }
    s += " ], [ ";
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }
      s += ' ' + melody_info[_melody_idx][ii].dur.toString();
    }
    s += "] );";
    console.log(s);

    s = instrument_var + '_u = ' +
      melody_instrument[_melody_idx].type +
      '("' + melody_instrument[_melody_idx].preset + '", {"decay":' + melody_instrument[_melody_idx].decay.toString() + ',"loudness":' + melody_instrument[_melody_idx].loudness.toString() + '});\n';
    s += instrument_var + '_u.connect(sv, 0.5);\n';
    s += instrument_var + '_u.note.seq( [';
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }

      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + melody_info[_melody_idx][ii].note + 12].toUpperCase() + '"';
      } else {
        //var _n = root_note_idx + melody_info[_melody_idx][ii].note;
        var _n = melody_info[_melody_idx][ii].note + 12;
        //_n %= 24;
        s += ' ' + _n.toString() + ' ';
      }

    }
    s += " ], [ ";
    for (var ii=0; ii<melody_info[_melody_idx].length; ii++) {
      if (ii>0) { s += ","; }
      s += ' ' + melody_info[_melody_idx][ii].dur.toString();
    }
    s += "] );";
    console.log(s);

  }


  var gain_str = "";
  for (var _melody_idx=0; _melody_idx < melody_count; _melody_idx++) {
    var instrument_var = "m" + _melody_idx;
    gain_str += " " + instrument_var + ".gain = 0;";
    gain_str += " " + instrument_var + "_u.gain = 0;";
  }
  gain_str += " a.gain = 0;";
  gain_str += " a_u.gain = 0;";
  gain_str += " bass.gain = 0;";
  gain_str += " e.gain = 0;";
  console.log(gain_str);


  var beat_ms = 60*1000 / bpm;
  var measure_ms = 4*4*beat_ms;
  var wait_unit_ms = 4*measure_ms;
  var fudge = 50;

  var _quarter = 1;
  var _half = 2;
  var _full = 4;
  var _song_t = 0;

  // . |    - nop
  // [0-9]  - fade in over # measures
  // !      - decrease immediately
  // ;      - fade out over 1 measure
  // :      - fade out over 2 measures
  //
  instrument_schedule = {
    "a"   : "2... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... !... .... ",
    "a_u" : ".2.: .... .... .... | .... .... .... .... | .... .... .... .... | 4... .... .... .... | .... .... !... .... ",
    "bass": ".... 4... .... .... | .... .... .... .... | .... .... .... .... | .... .... .... .... | .... !... .... .... ",

    "m0"  : ".... .... .... .... | 0... .... .... !... | .... .... .... .... | 1... .... .... !... | .... .... .... .... ",
    "m0_u": ".... .... .... .... | .... .... .... .... | .... .... .... .... | .1.. .... .... !... | .... .... .... .... ",

    "m1"  : ".... .... .... .... | .... .... .... 0... | !... .... .... .... | .... .... .... 0... | !... .... .... .... ",
    "m1_u": ".... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... .... 0... | !... .... .... .... ",

    "m2"  : ".... .... .... .... | .... .... .... .... | 0... .... .... !... | 1... .... .... !... | .... .... .... .... ",
    "m2_u": ".... .... .... .... | .... .... .... .... | .... .... .... .... | .1.. .... .... !... | .... .... .... .... ",

    "m3"  : ".... .... .... .... | .... .... .... .... | .... .... .... 0... | !... .... .... 0... | !... .... .... .... ",
    "m3_u": ".... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... .... 0... | !... .... .... .... ",

    "e"   : ".... .... 0... .... | .... .... .... .... | .... .... .... .... | .... .... .... .... | .... .... ..!. .... "
  };

  var instrument_gain = {
    "a"   : 0.2, "a_u" : 0.2,
    "m0"  : 0.2, "m0_u": 0.2,
    "m1"  : 0.2, "m1_u": 0.2,
    "m2"  : 0.2, "m2_u": 0.2,
    "m3"  : 0.2, "m3_u": 0.2,
    "bass": 0.2,
    "e"   : 1.0
  }

  console.log("a.cutoff.fade( 0.1, 0.5, 2, 2);");
  console.log("future( _a => { a.cutoff = 1.0; }, 4, {_a:a});");

  var _regex = /[ |]/g;
  for (var instr_var in instrument_schedule) {
    var s = instrument_schedule[instr_var];
    s = s.replace(_regex, '');

    var _g = instrument_gain[instr_var];

    _song_t = 0;
    var _m = "";
    for (var ii=0; ii<s.length; ii++) {
      if (s[ii] == '.') { continue; }
      if (_m = s[ii].match(/[0-9]/)) {
        var delay = parseInt(_m[0]);
        if (delay==0) {
          console.log("future( _" + instr_var + " => { _" + instr_var + ".gain = " + _g + "; }, " + ii + ", {_" + instr_var + ":" + instr_var + "});");
        }
        else {
          console.log(instr_var + ".gain.fade( 0.0, " + _g + ", " + delay + ", " + ii + ");");
        }
      }
      else if (_m = s[ii].match(/!/)) {
        console.log("future( _" + instr_var + " => { _" + instr_var + ".gain = 0.0; }, " + ii + ", {_" + instr_var + ":" + instr_var + "});");
      }
      else if (_m = s[ii].match(/;/)) {
          console.log(instr_var + ".gain.fade( " + _g + ", 0.0, 1, " + ii + ");");
      }
      else if (_m = s[ii].match(/:/)) {
          console.log(instr_var + ".gain.fade( " + _g + ", 0.0, 2, " + ii + ");");
      }
    }

  }

  return;

  _song_t = 0;

  console.log(" ");
  _song_t += _half;
  console.log("future( _a => { _a.gain = 0.2; }, ", _song_t, ", {_a:a});");

  _song_t += _half;
  console.log("bass.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  _song_t += _quarter;
  console.log("a_u.gain.fade ( 0.0, 0.1, 1, ", _song_t, ");");

  _song_t += _half;
  console.log("a_u.gain.fade ( 0.1, 0.0, 1, ", _song_t, ");");

  _song_t += _quarter;
  console.log("e.gain.fade   ( 0.0, 1.0, 1, ", _song_t, ");");

  _song_t += _full;
  console.log("future( _m0 => { _m0.gain = 0.2; } , ", _song_t, ", {_m0:m0});");

  //_song_t += _half + _quarter;
  _song_t += 3*_full;
  console.log("future( _m0 => { _m0.gain = 0.0; } , ", _song_t, ", {_m0:m0});");
  console.log("future( _m1 => { _m1.gain = 0.2; } , ", _song_t, ", {_m1:m1});");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m1 => { _m1.gain = 0.0; } , ", _song_t, ", {_m1:m1});");
  console.log("future( _m2 => { _m2.gain = 0.2; } , ", _song_t, ", {_m2:m2});");

  //_song_t += _half + _quarter;
  _song_t += 3*_full;
  console.log("future( _m2 => { _m2.gain = 0.0; } , ", _song_t, ", {_m2:m2});");
  console.log("future( _m3 => { _m3.gain = 0.2; } , ", _song_t, ", {_m3:m3});");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m3 => { _m3.gain = 0.0; } , ", _song_t, ", {_m3:m3});");

  console.log("a_u.gain.fade( 0.0, 0.2, 2, ", _song_t, ");");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("m0.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");
  console.log("m0_u.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("m1.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");
  console.log("m1_u.gain.fade( 0.0, 0.2, 4, ", _song_t, ");");

  //_song_t += _half;
  _song_t += 2*_full;
  console.log("bass.gain.fade(0.2, 0.0, 4, ", _song_t, ");");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m0   => { _m0.gain   = 0.0; } , ", _song_t, ", { _m0   : m0   });");
  console.log("future( _m0_u => { _m0_u.gain = 0.0; } , ", _song_t, ", { _m0_u : m0_u });");

  //_song_t += _quarter;
  _song_t += _full;
  console.log("future( _m1   => { _m1.gain   = 0.0; } , ", _song_t, ", { _m1   : m1   });");
  console.log("future( _m1_u => { _m1_u.gain = 0.0; } , ", _song_t, ", { _m1_u : m1_u });");

  _song_t += _quarter;
  console.log("future( _a    => { _a.gain    = 0.0; } , ", _song_t, ", { _a    : a    });");
  console.log("future( _a_u  => { _a_u.gain  = 0.0; } , ", _song_t, ", { _a_u  : a_u  });");

  _song_t += _quarter;
  //console.log("future( _e    => { _e.gain    = 0.0; } , ", _song_t, ", { _e    : e    });");
  console.log("e.gain.fade( 1.0, 0.0, 0.24, ", _song_t, ");");

}

//-------------------
//-------------------
//-------------------

function _list_mode_chords() {
  var fs = new FamiliarSynths();

  console.log("| mode | 1 | 2 | 3 | 4 | 5 | 6 | 7 |");
  console.log("|---|---|---|---|---|---|---|---|");
  for (var ii=0; ii<fs.musicalModeList.length; ii++) {
    var _row = [];
    var mode = fs.musicalModeList[ii];
    var chords = fs.musicalModeChord[mode];

    _row.push(mode);
    for (var jj=0; jj<chords.length; jj++) {
      //console.log( chords[jj]);

      _row.push( "`" + chords[jj].name + "` `[" + chords[jj].chord.join(",") + "]`" );
    }
    //console.log(mode, chords);
    //
    console.log("| " + _row.join(" | ") + " |")
  }

}

// assume units of 4 bar lengths
//
// a0, a1 - arps
// m0, m1 - melody
// b0, b1 - bass
// d0, d1 - drums
// p0, p1 - pads
//
// a0 -> +m0 -> +d0 -> +b0 -a0 -m0 -b0 + b1 -> -b1 +m0 +b0 -> +a0 -> +p0 -> -a0
//
//
function _alg_v_0_0() {
  var rythm_opt = [
    [ [2, 2], [1, 1, 1, 1], [2,2], [1, 1, 1, 1] ],
    [ [3, 1], [2, 2], [3, 1], [2, 2] ],
    [ [1, 0.5, 0.5, 1, 1 ], [1, 0.5, 0.5, 1, 1 ], [1, 0.5, 0.5, 1, 1 ],  [4] ],
    [ [1, 1, 0.5, 0.5, 0.5, 0.5], [1, 1, 0.5, 0.5, 0.5, 0.5], [1, 1, 0.5, 0.5, 0.5, 0.5], [1, 1, 0.5, 0.5, 0.5, 0.5] ],
    [ [1, 1, 0.5, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5, 1, 1], [ 0.5, 0.5, 0.5, 0.5, 1, 1], [1, 1, 0.5, 0.5, 0.5, 0.5] ]
  ];
  var rythm_opt_idx = _irnd(rythm_opt.length);
  var fs = new FamiliarSynths();

  var root_note_idx = _irnd(12);
  var root_note_name = fs.noteName[ root_note_idx ];

  // transition from one mode to another?
  //
  var song_mode = ["lydian", "aeolian"];

  // Get the chord progression for the mode of our choice
  //
  var mode_chord = fs.musicalModeChord[song_mode[1]];
  var mode_chord4 = fs.musicalModeChord4[song_mode[1]];

  // Get list of major chords for chord progression below.
  // Also save the index lookup from major chords back to the
  // original chord list.
  //
  var mode_maj_chord_idx_map = {};
  var mode_maj_chord = [];
  for (var i=0; i<mode_chord.length; i++) {
    if (mode_chord[i].type == "maj") {
      mode_maj_chord_idx_map[mode_maj_chord.length] = i;
      mode_maj_chord.push(mode_chord[i]);
    }
  }

  var chord_prog_idx = [];

  // basic chord progression:
  // * 4 bars
  // * root chord to start
  // * any two chord transitions
  // * end on major chord
  //
  var chord_prog = [];
  chord_prog_idx.push(0);
  chord_prog.push(mode_chord[0]);
  for (var i=1; i<3; i++) {
    var r = _irnd(mode_chord.length);
    chord_prog_idx.push(r);
    chord_prog.push( mode_chord[r] );
  }
  var r = _irnd(mode_maj_chord.length);
  chord_prog_idx.push(r);
  chord_prog.push( mode_maj_chord[r] );


  // playing with 7th chords for arp
  //
  var arp_chord = [];
  arp_chord.push( mode_chord4[0] );
  for (var i=0; i<(chord_prog.length-1); i++) {
    arp_chord.push( mode_chord4[i] );
  }
  var idx = mode_maj_chord_idx_map[ chord_prog_idx[ chord_prog_idx.length-1 ] ];
  arp_chord.push( mode_chord4[idx] );

  var arp_chord_note = [];
  var arp_chord_note_dt = [];
  for (var i=0; i<arp_chord.length; i++) {
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push(0.5);
    }
    for (var j=0; j<arp_chord[i].chord.length; j++) {
      arp_chord_note.push(arp_chord[i].chord[j]);
      arp_chord_note_dt.push(0.5);
    }
  }


  // arp
  //

  // simple hill ( _/-\_ )
  //

  var arp_note_occ = [];
  for (var ii=0; ii<24; ii++) { arp_note_occ.push(0); }
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      arp_note_occ[ chord_prog[ii].chord[jj] ] = 1;
    }
  }
  var arp_note = [];
  for (var ii=0; ii<arp_note_occ.length; ii++) {
    if (arp_note_occ[ii] == 1) {
      arp_note.push(ii);
    }
  }

  // mirror the arp, permute all but first note,
  // then restrict to only
  // 8 notes
  //
  var x = _mirror(arp_note);
  //x = _permute(x, 1, arp_note.length-1);
  var arp_prog =  [];
  var n_arp = 8;
  for (var prev=-1, ii=0; ii<x.length; ii++) {
    var idx = Math.floor( n_arp * ii / x.length );
    if (idx<=prev) { continue; }
    arp_prog.push(x[ii]);
    prev = idx;
  }

  // play with permuting arp...
  //
  for (var ii=1; ii<arp_prog.length; ii++) {
    var nt = arp_prog[ii];
    var p = ii + Math.floor( Math.random() * (arp_prog.length - ii) );
    arp_prog[ii] = arp_prog[p];
    arp_prog[p] = nt;
  }

  // create melody by choosing random two notes from
  // each bar of chord progression
  //

  var melody0_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);
    rythm = rythm_opt[ rythm_opt_idx ][ii];
    for (var jj=0; jj<rythm.length; jj++) {
      melody0_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm[jj] } );
    }
  }

  var rythm1_opt_idx = _irnd(rythm_opt.length);
  var melody1_info = [];
  for (var ii=0; ii<chord_prog.length; ii++) {
    var bar_notes = _apick(chord_prog[ii].chord, 2);
    //rythm = [ 1, 1, 1, 1 ];

    rythm = rythm_opt[ rythm1_opt_idx ][ii];
    console.log(bar_notes, bar_notes.length, _irnd(bar_notes.length), bar_notes[_irnd(bar_notes.length)]);
    for (var jj=0; jj<rythm.length; jj++) {
      melody1_info.push( { "note": bar_notes[_irnd(bar_notes.length)], "dur": rythm[jj] } );
    }
  }





  // print sonic-pi output
  //
  var s;
  var note_name = [];
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "4" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "5" ); }
  for (var ii=0; ii<12; ii++) { note_name.push( fs.noteName[ii] + "6" ); }

  s = "chord_prog = (ring";
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
      if ((ii+jj)>0) { s += ","; }
      s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]].toUpperCase() + '"';
    }
  }
  s += ")";
  console.log(s);

  s = "chord_prog_rep = (ring";
  for (var ii=0; ii<chord_prog.length; ii++) {
    for (var rr=0; rr<4; rr++) {
      for (var jj=0; jj<chord_prog[ii].chord.length; jj++) {
        if ((ii+jj+rr)>0) { s += ","; }
        s += ' "' + note_name[root_note_idx + chord_prog[ii].chord[jj]].toUpperCase() + '"';
      }
    }
  }
  s += ")";
  console.log(s);

  s = "arp_chord_prog = (ring";
  for (var ii=0; ii<arp_chord_note.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' "' + note_name[root_note_idx + arp_chord_note[ii]].toUpperCase() + '"';
  }
  s += ")";
  console.log(s);

  s = "arp_chord_prog_dt = (ring";
  for (var ii=0; ii<arp_chord_note_dt.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + arp_chord_note_dt[ii];
  }
  s += ")";
  console.log(s);


  s = "melody = (ring";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' "' + note_name[root_note_idx + melody0_info[ii].note].toUpperCase() + '"';
  }
  s += ")";
  console.log(s);

  s = "melody_s = (ring";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    var _n = note_name[root_note_idx + melody0_info[ii].note].toUpperCase();
    _n = _n.replace(/#/, 's');
    //s += ' :' + note_name[root_note_idx + melody0_info[ii].note].toUpperCase() + '';
    s += ' :' +_n; 
  }
  s += ")";
  console.log(s);

  s = "melody1 = (ring";
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' "' + note_name[root_note_idx + melody1_info[ii].note].toUpperCase() + '"';
  }
  s += ")";
  console.log(s);

  s = "melody_dt = (ring";
  for (var ii=0; ii<melody0_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody0_info[ii].dur.toString();
  }
  s += ")";
  console.log(s);

  s = "melody1_dt = (ring";
  for (var ii=0; ii<melody1_info.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' ' + melody1_info[ii].dur.toString();
  }
  s += ")";
  console.log(s);

  s = "arp = (ring";
  for (var ii=0; ii<arp_prog.length; ii++) {
    if (ii>0) { s += ","; }
    s += ' "' + note_name[root_note_idx + arp_prog[ii]].toUpperCase() + '"';
  }
  s += ")";

  console.log(s);

  console.log(root_note_name, root_note_idx);
  console.log(chord_prog);
  console.log(arp_chord);
  //console.log(arp_note, arp_note.length, x, x.length, arp_prog, arp_prog.length);
  console.log(arp_prog);
}

function _list_mode_chords() {
  var fs = new FamiliarSynths();

  console.log("| mode | 1 | 2 | 3 | 4 | 5 | 6 | 7 |");
  console.log("|---|---|---|---|---|---|---|---|");
  for (var ii=0; ii<fs.musicalModeList.length; ii++) {
    var _row = [];
    var mode = fs.musicalModeList[ii];
    var chords = fs.musicalModeChord[mode];

    _row.push(mode);
    for (var jj=0; jj<chords.length; jj++) {
      //console.log( chords[jj]);

      _row.push( "`" + chords[jj].name + "` `[" + chords[jj].chord.join(",") + "]`" );
    }
    //console.log(mode, chords);
    //
    console.log("| " + _row.join(" | ") + " |")
  }
}

function _main() {
  var fs = new FamiliarSynths();

  var song_mode = ["lydian", "aeolian"];

  var mode_chord = fs.musicalModeChord[song_mode[1]];
  var mode_chord4 = fs.musicalModeChord4[song_mode[1]];

  for (var ii=0; ii<mode_chord4.length; ii++) {
    console.log(mode_chord4[ii]);
  }



  return;
  var fs_bass = new FamiliarSynths();
  var fs_arp = new FamiliarSynths();

  var ok_data = ok();

  //var tune = custom_tune();

  var tune = force_tune();
  var midi_bass_tune = fs_bass.convertToMIDI(tune.bass);
  var midi_arp_tune = fs_arp.convertToMIDI(tune.arp);
}

function _sonic_pi_beat(x) {
  var s = "";
  for (var ii=0; ii<x.length; ii++) {
    if (ii>0) { s += ", "; }
    s += x[ii].toString();
  }
  console.log("drum = (ring " + s + ")");
}

//_main();

//_alg_v_0_0();
//_alg_v_1_0();
//_alg_v_1_1();
//_alg_v_1_2();
//_alg_v_1_3();
//_alg_v_1_4();
//_alg_v_1_5();
_alg_v_1_6();


/// testing drum beat stuff

//_list_mode_chords();

//var fs = new FamiliarSynths();
//console.log(fs.drumBeat['four_on_the_floor']);
//var x = fs.encodeBeat(fs.drumBeat['four_on_the_floor']);

//_sonic_pi_beat(x);
//console.log(x);


