

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

  this.musicalMode = {
    "aeolian":[0,+2,+3,+5,+7,+8,+10],
    "locrian": [0,+1,+3,+5,+6,+8,+10],
    "ionian":  [0,+2,+4,+5,+7,+9,+11],
    "dorian":  [0,+2,+3,+5,+7,+9,+10],
    "phyrgian": [0,+1,+3,+5,+7,+8,+10],
    "lydian":  [0,+2,+4,+6,+7,+9,+11] ,
    "mixolydian":  [0,+2,+4,+5,+7,+9,+10]
  };

  this.chord = {
    "major" : [0,4,7],
    "minor": [0,3,7],
    "augmented":[0,4,8],
    "diminished":[0,3,6],
    "major7":[0,4,7,11]
  };

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

var fs_bass = new FamiliarSynths();
var fs_arp = new FamiliarSynths();

var ok_data = ok();

//var tune = custom_tune();

var tune = force_tune();
var midi_bass_tune = fs_bass.convertToMIDI(tune.bass);
var midi_arp_tune = fs_arp.convertToMIDI(tune.arp);


