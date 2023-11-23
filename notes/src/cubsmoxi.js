
var example_melody = {
  "beats_per_measure" : 5,
  "tune": [ {"note":"c4", "dur":1},
            {"note":"c4", "dur":1},
            {"note":"c4", "dur":1},
            {"note":"c4", "dur":2} ],
  "tune_only": true
};

var example_melody1 = {
  "beats_per_measure" : 5,
  "tune": [
    {"note":"c4", "dur":1},
    {"note":"c4", "dur":1},
    {"note":"c4", "dur":1},
    {"note":"c4", "dur":2},
    {"note":"a4", "dur":1},
    {"note":"c4", "dur":1},
    {"note":"d4", "dur":1},
    {"note":"c4", "dur":2}
  ],
  "tune_only": true
};

//----

function newMelody() {
  var m = {};
  m["beats_per_measure"] = 4;
  m["tune_only"] = true;
  m["tune"] = [];
  return m;
}


//----

function normalize_note(note) {
  note = ((typeof note === "undefined") ? "  ": note);
  if (note == "") { return "  "; }
  if (note == " ") { return "  "; }
  if (note.length == 1) { return note + "4"; }
  return note.substr(0,2);
}

//----

function discritize_tune(tune, beats_per_measure, resolution) {
  beats_per_measure = ((typeof beats_per_measure === "undefined") ? 4 : beats_per_measure);
  resolution = ((typeof resolution === "undefined") ? 32 : resolution);

  var da = [];
  var note = "";

  for (var i=0; i<tune.length; i++) {
    note = normalize_note(tune[i].note);

    var m = resolution*tune[i].dur
    for (var j=0; j<m; j++) {
      if (j==0) {
        da.push(note + "s");
      }
      else if (j==(m-1)) {
        da.push(note + ";");
      }
      else {
        da.push(note + ".");
      }
    }
  }

  return da;
}

//----

function _irand(n, m) {
  if (typeof(m) === "undefined") {
    n = ((typeof(n) === "undefined") ? 1 : n);
    return Math.floor(Math.random()*n);
  }
  return Math.floor(Math.random()*(m-n)) + n;
}

//----

function check_rhythm(M, rhythms, beats_per_measure, resolution) {
  resolution = ((typeof resolution === "undefined") ? 1 : resolution);
  beats_per_measure = ((typeof beats_per_measure === "undefined") ? 4 : beats_per_measure);

  var stride = beats_per_measure * resolution;
  var dtune = discritize_tune(M.tune, beats_per_measure, resolution);
  var vrs = [];
  
  // beat token for simplicity of comparison
  //
  for (var ii=0; ii<rhythms.length; ii++) {
    var cur = [];
    for (var jj=0; jj<rhythms[ii].length; jj++) {
      var n = Math.abs(rhythms[ii][jj]);

      cur.push('s');
      for (var x=1; x<(n-1); x++) {
        cur.push('.');
      }
      if (n>1) { cur.push(';'); }
    }
    vrs.push(cur);
  }

  // check valid rhythms
  //
  for (var _s=0; _s<dtune.length; _s += stride) {
    var found = 0;
    for (var r_idx=0; r_idx < vrs.length; r_idx++) {
      var ii=0;
      for (ii=0; ii<stride; ii++) {
        if (dtune[_s+ii][2] != vrs[r_idx][ii]) { break; }
      }
      if (ii==stride) { found=1; break; }
    }
    if (found==0) { return -1; }
  }

  return 0;
}

//----

function dtune_measure_repetition_count(dtune, stride) {
  var nmeasure = dtune.length / stride;

  var map = {};

  for (var ii=0; ii<nmeasure; ii++) {
    var key = dtune.slice(ii*stride, ii*stride+stride).join("");
    if (key in map) { map[key] += 1; }
    else { map[key] = 0; }
  }

  var n_rep=0;
  for (var key in map) {
    n_rep += map[key];
  }
  return n_rep;

  // check for repeated measure
  //
  var n_rep = 0;
  for (var ii=0; ii<nmeasure; ii++) {
    for (var jj=(ii+1); jj<nmeasure; jj++) {
      var _str0 = dtune.slice(ii*stride, ii*stride+stride).join("");
      var _str1 = dtune.slice(jj*stride, jj*stride+stride).join("");

      if (_str0 != _str1) { continue; }
      n_rep += 1;
    }
  }

  return n_rep;
}

//----

function melody_to_sonicpi(m) {
  var dt = 0.25;
  console.log("use_synth :dsaw");
  console.log("dt =", dt);

  for (var i=0; i<m.tune.length; i++) {
    if (normalize_note(m.tune[i].note)!="  ") {
      console.log("play :" + m.tune[i].note);
    }
    console.log("sleep " + m.tune[i].dur*dt);
  }
}

function general_rule(m) {

  // melody start and end on tonic
  //
  var n = m.tune.length;
  if (m.tune_only) {
    if (m.tune[0].note != m.tune[n-1].note) { return -1; }
  }

  // do not exceed major 10th
  //
  var min=-1, max=-1, x=0;
  for (var i=0; i<n; i++) {
    x = parseInt(m.tune[i].note[1]);
    if (min<0) { min = x; }
    if (max<0) { max = x; }

    if (x < min) { min = x; }
    if (x > max) { max = x; }
  }
  if ((max - min) > 10) { return -1; }

  // rhythm?
  //


}

function general_rule_score(m) {

  let score = {
    "rule3" : { "description": "start and end on tonic", "val": 0 },
    "rule4" : { "description": "do not exceed major 10th", "val": 0 }
  };

  let n = m.tune.length;
  if (n==0) { return score; }
  if (m.tune[0].note == m.tune[n-1].note) {
    score["rule3"].val = 1;
  }

  let min_note = -1,
      max_note = -1;
  for (let i=0; i<n; i++) {
    let inote = note2midi( m.tune[i].note );

    if (min_note<0) { min_note = inote; }
    if (max_note<0) { max_note = intoe; }

    if (min_note > inote) { min_note = inote; }
    if (max_note < inote) { max_note = inote; }
  }

  if ((max_note - min_note) <= 10) {
    score["rule4"].val = 1;
  }


}



function _play() {
  var res = 4;
  var x = discritize_tune(example_melody1.tune, 5, 4);
  var str = "";
  for (var i=0; i<x.length; i++) {
    if ((i%(res*5))==0) {
      console.log(str);
      console.log("---");
      str = "";
    }
    else if ((i%(res))==0) {
      str += " |";
    }

    str += " " + x[i];
    
  }
  if (str.length>0) { console.log(str); }
  console.log("---");
k}

function distinct_notes(m) {
  var h = {};
  var distinct = 0;

  for (var i=0; i<m.tune.length; i++) {
    if (! (m.tune[i].note in h)) {
      h[m.tune[i].note] = 0;
      distinct += 1;
    }
    h[m.tune[i].note] += 1;
  }

  return distinct;
};

//-------------
//-------------
//-------------

function ex_1_1(m) {
  var score=0;

  var valid_notes = [ "e4", "g4", "a4", "b4" ];
  var valid_rhythm = [1,1,1,2];
  var note_map = { "e4":1, "g4":1, "a4":1, "b4":1 };

  var n_measure = 6;

  // must repeat at least one measure
  //
  var measure_repeat = 1;

  var tot_dur = 0;

  // check rhythms match and notes match
  //
  var t=0;
  var n = m.tune.length;
  var r_idx = 0;
  var tot_dur = 0;

  for (var idx=0; idx<n; idx++) {
    r_idx = valid_rhythm[ idx % valid_rhythm.length ];
    if (r_idx != m.tune[idx].dur) {
      score = -1;
      break;
    }
    tot_dur += m.tune[idx].dur;
  }

  var rep = 0;
  var nmeasure = m.tune.length / 4;
  var _n = valid_rhythm.length;
  for (var i=0; i<nmeasure; i++) {
    for (var j=i+1; j<nmeasure; j++) {

      var k=0; 
      for (k=0; k<valid_rhythm.length; k++) {
        if ((m.tune[i*_n + k].note != m.tune[j*_n + k].note) ||
            (m.tune[i*_n + k].dur  != m.tune[j*_n + k].dur)) { break; }
      }
      if (k==valid_rhythm.length) { rep++; }

    }
  }

  if (rep > 0) { score++; }

  return score;
}

function ex_1_1_sample() {
  var valid_notes = [ "e4", "g4", "a4", "b4" ];
  var valid_rhythm = [1,1,1,2];
  var note_map = { "e4":1, "g4":1, "a4":1, "b4":1 };

  var nmeasure = 6;
  var beats_per_measure = 5;
  var beats = [1,1,1,2];

  var tune = [];

  for (var i=0; i<nmeasure; i++) {

    var beat = 0, beat_idx=0;
    while (beat < beats_per_measure) {

      var note = valid_notes[ Math.floor(Math.random()*valid_notes.length) ];

      tune.push( { "note":note, "dur": beats[beat_idx] } );
      beat += beats[beat_idx];
      beat_idx++;

    }

  }

  var n = tune.length;
  for (var i=0; i<4; i++) {
    tune[ n-4+i ].note = tune[i].note;
  }
  tune[0].note = valid_notes[0];
  tune[n-1].note = valid_notes[0];

  var m = newMelody();
  m.beats_per_meausre = beats_per_measure;
  m.tune = tune;

  var score = ex_1_1(m);

  console.log("## score:", score);
  melody_to_sonicpi(m);
}

ex_1_1_sample();

//-------------
//-------------
//-------------


function ex_1_2(m) {
  var valid_notes = ["f4", "a4", "b4", "c4", "f5", "a5", "b5", "c5"];
  var valid_rhythms = [[1,1,1,1,2,2],[2,2,1,1,2]];
  var vrs = [['s', 's', 's', 's', 's', ';', 's', ';'],['s',';','s',';','s','s','s',';']];
  var beats_per_measure = 8;
  var note_map = {};

  var score = 0;

  var nmeasure = 6;

  var stride = beats_per_measure * 1;
  var dtune = discritize_tune(m.tune, beats_per_measure, 1);
  var m = dtune.length;
  var vrs_idx = [0,0];

  // note map for easy reference
  //
  for (var i=0; i<valid_notes.length; i++) {
    note_map[valid_notes[i]] = 1;
  }

  // check valid notes
  //
  for (var _s=0; _s<dtune.length; _s ++) {
    var note = normalize_note(dtune[_s].substr(0,2));
    if (!(note in note_map)) { return -1; }
  }

  // check valid rhythms
  //
  for (var _s=0; _s<dtune.length; _s += stride) {
    var found = 0;
    for (var r_idx=0; r_idx < vrs.length; r_idx++) {
      var ii=0;
      for (ii=0; ii<stride; ii++) {
        if (dtune[_s+ii][2] != vrs[r_idx][ii]) { break; }
      }
      if (ii==stride) { found=1; break; }
    }
    if (found==0) { return -1; }
  }

  var _actual_measure = dtune.length / stride;
  if (_actual_measure != nmeasure) { return -1; }

  // check for repeated measure
  //
  var has_rep = 0;
  for (var ii=0; ii<nmeasure; ii++) {
    for (var jj=(ii+1); jj<nmeasure; jj++) {
      var _str0 = dtune.slice(ii*stride, ii*stride+stride).join("");
      var _str1 = dtune.slice(jj*stride, jj*stride+stride).join("");

      if (_str0 != _str1) { continue; }
      has_rep = 1;
      break;
    }
    if (has_rep==1)  { break ;}
  }

  score = 0 + has_rep;

  //console.log(dtune);
  return score;
}

function ex_1_2_sample() {
  var valid_notes = ["f4", "a4", "b4", "c4", "f5", "a5", "b5", "c5"];
  var valid_rhythms = [[1,1,1,1,2,2],[2,2,1,1,2]];
  var beats_per_measure = 8;
  var note_map = {};
  var _a = [];
  var nmeasure = 6;

  // construct melody object
  //
  var _M = newMelody();
  _M.beats_per_measure = beats_per_measure;

  // note map for easy lookup
  //
  for (var i=0; i<valid_notes.length; i++) {
    note_map[valid_notes[i]] = 1;
  }

  // repeate a measure randomely (just one)
  //
  for (var ii=0; ii<nmeasure; ii++) { _a.push(ii); }
  for (var ii=0; ii<2; ii++) {
    var p = _irand(ii, _a.length);
    var _t = _a[ii];
    _a[ii] = _a[p];
    _a[p] = _t;
  }

  if (_a[0] > _a[1]) {
    var _t = _a[0];
    _a[0] = _a[1];
    _a[1] = _t;
  }

  //console.log("## gen rep", _a[0], _a[1]);

  var _start_idx = [];

  for (var ii=0; ii<nmeasure; ii++) {
    var ridx = Math.floor(Math.random()*2);

    _start_idx.push(_M.tune.length);

    // if it's our repeat measure, repeat it
    //
    if (_a[1] == ii) {
      var _s = _start_idx[_a[0]];
      var _e = _start_idx[_a[0]+1];
      var _n = _e - _s;
      for (var _i=0; _i<_n; _i++) {
        _M.tune.push( { "note": _M.tune[_s + _i].note, "dur": _M.tune[_s + _i].dur, "x":_a[0]} );
      }

    }

    // else proceed as normal and add a random tune
    //
    else {
      for (var jj=0; jj<valid_rhythms[ridx].length; jj++) {
        var note = valid_notes[ _irand(valid_notes.length) ];
        _M.tune.push( { "note": note, "dur": valid_rhythms[ridx][jj] } );
      }
    }
      
  }

  var score = ex_1_2(_M);

  console.log("##", score);
  melody_to_sonicpi(_M);

}


//ex_1_2_sample(example_melody);

//-------------
//-------------
//-------------


function ex_1_3(M) {
  var valid_note_seq = ["d4", "a4", "f4", "e4", "c4"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,4],[-2,2,2,2]];
  var vrs = [['s', ';', 's', 's', 's', '.', '.', ';'],['s',';','s',';','s',';','s',';']];

  var nmeasure = [6,10];

  var vrs_idx = [];
  for (var i=0; i<valid_rhythm.length; i++) { vrs_idx.push(0); }

  var stride = beats_per_measure * 1;
  var dtune = discritize_tune(M.tune, beats_per_measure, 1);
  var m = dtune.length;

  // Check measure length in range
  //
  var _actual_measure = dtune.length / stride;
  if ((_actual_measure < nmeasure[0]) ||
      (_actual_measure > nmeasure[1])) {
    return -1;
  }

  // check valid rhythms
  //
  for (var _s=0; _s<dtune.length; _s += stride) {
    var found = 0;
    for (var r_idx=0; r_idx < vrs.length; r_idx++) {
      var ii=0;
      for (ii=0; ii<stride; ii++) {
        if (dtune[_s+ii][2] != vrs[r_idx][ii]) { break; }
      }
      if (ii==stride) { found=1; break; }
    }
    if (found==0) { return -1; }
  }

  // check valid note progression
  //
  var seq_idx = 0, seq_idx_prv = 0;
  var seq_n = valid_note_seq.length;
  for (var ii=0; ii < M.tune.length; ii++) {

    var note = normalize_note(M.tune[ii].note);
    if (note == valid_note_seq[seq_idx]) {
      seq_idx = (seq_idx+1) % seq_n;
      seq_idx_prv = (seq_idx + (seq_n-1)) % seq_n;
    }
    else if ((note == valid_note_seq[seq_idx_prv]) || (note == "  ")) {
      // still ok
    }
    else {
      return -1;
    }

  }

  score = 0;

  return score;

}


function ex_1_3_sample() {

  var valid_note_seq = ["d4", "a4", "f4", "e4", "c4"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,4],[-2,2,2,2]];
  var nmeasure = [6,10];

  var m = _irand(nmeasure[0], nmeasure[1]+1);

  var _M = newMelody();
  _M.beats_per_measure = beats_per_measure;

  var note_idx = 0;
  for (var ii=0; ii<m; ii++) {

    var r_idx = _irand(valid_rhythm.length);
    for (var jj=0; jj<valid_rhythm[r_idx].length; jj++) {

      var note = "  ";
      if (valid_rhythm[r_idx][jj] > 0) {
        note = valid_note_seq[note_idx];
        var ndel = _irand(2);
        note_idx = (note_idx + ndel) % valid_note_seq.length;
      }

      _M.tune.push({"note":note, "dur":Math.abs(valid_rhythm[r_idx][jj])});

    }

  }

  var score = ex_1_3(_M);

  console.log("# nmeasure:", m, ", score:", score);;
  console.log(_M.tune);
  melody_to_sonicpi(_M);

}

//ex_1_3_sample();

//-------------
//-------------
//-------------


function ex_1_4(M) {
  var valid_notes = ["c4", "d4", "e4", "f4", "g4", "a4", "b4", "c5"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,4]];
  var vrs = [['s',';','s','s','s','.','.',';']];
  var measure_rep = [1,3];
  var measure_range = [6,6];

  var vrs_idx = [];
  for (var i=0; i<valid_rhythm.length; i++) { vrs_idx.push(0); }

  var stride = beats_per_measure * 1;
  var dtune = discritize_tune(M.tune, beats_per_measure, 1);
  var m = dtune.length;

  // Check measure length in range
  //
  var _actual_measure = dtune.length / stride;
  if ((_actual_measure < measure_range[0]) ||
      (_actual_measure > measure_range[1])) {
    return -1;
  }

  if (check_rhythm(M, valid_rhythm, beats_per_measure, 1)!=0) {
    return -1;
  }

  var start_note = normalize_note(M.tune[0].note);
  var end_note = normalize_note(M.tune[ M.tune.length-1 ].note);
  if (start_note != end_note) {
    return -1;
  }

  var ret = 0;
  var n_rep = dtune_measure_repetition_count(dtune, stride);
  if ((n_rep >= measure_rep[0]) &&
      (n_rep <= measure_rep[1])) { ret += n_rep; }
  else if (n_rep > measure_rep[1]) { ret += measure_rep[1]; }

  return ret;
}

function ex_1_4_sample() {
  var valid_notes = ["c4", "d4", "e4", "f4", "g4", "a4", "b4", "c5"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,4]];
  var measure_rep = [1,3];
  var measure_range = [6,6];

  var nmeasure = _irand(measure_range[0], measure_range[1]+1);
  var nrep = _irand(measure_rep[0], measure_rep[1]+1);

  var meas = [];

  var M = newMelody();
  M.beats_per_measure = beats_per_measure;

  // use pigeonhole to get repetitions
  //
  var nmeaslib = nmeasure - nrep;
  var meas_lib = [];

  for (var ii=0; ii<nmeaslib; ii++) {
    var meas = [];
    var r_idx = _irand(valid_rhythm.length);
    for (var jj=0; jj<valid_rhythm[r_idx].length; jj++) {
      var note = valid_notes[_irand(valid_notes.length)];
      var dur = valid_rhythm[r_idx][jj];
      meas.push({ "note":note, "dur":dur });
    }

    // force c4 as root of first measure, c4 as end of last measure.
    // assume first measure is meas_lib[0] and last measure is
    // meas_lib[ n-1 ].
    //

    if (ii==0) { meas[0].note = valid_notes[0]; }
    if (ii==(nmeaslib-1)) { meas[ meas.length-1 ].note = valid_notes[0]; }

    meas_lib.push(meas);
  }

  for (var ii=0; ii<nmeasure; ii++) {
    var m_idx = _irand(meas_lib.length);
    if (ii==0) { m_idx=0; }
    if (ii==(nmeasure-1)) { m_idx = meas_lib.length-1; }

    for (var jj=0; jj<meas_lib[m_idx].length; jj++) {
      M.tune.push( meas_lib[m_idx][jj] );
    }
  }

  var score = ex_1_4(M);
  console.log("# exercise 1.4 score", score);
  melody_to_sonicpi(M);


}

//ex_1_4_sample();

//-------------
//-------------
//-------------


function ex_1_5(M) {
  var valid_notes = ["d4", "e4", "f4", "g4", "a4", "b4", "c5", "d5"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,4]];
  var vrs = [['s',';','s','s','s','.','.',';']];
  var measure_rep = [1,3];
  var measure_range = [6,8];

  var vrs_idx = [];
  for (var i=0; i<valid_rhythm.length; i++) { vrs_idx.push(0); }

  var stride = beats_per_measure * 1;
  var dtune = discritize_tune(M.tune, beats_per_measure, 1);
  var m = dtune.length;

  // Check measure length in range
  //
  var _actual_measure = dtune.length / stride;
  if ((_actual_measure < measure_range[0]) ||
      (_actual_measure > measure_range[1])) {
    return -1;
  }

  if (check_rhythm(M, valid_rhythm, beats_per_measure, 1)!=0) {
    return -1;
  }

  var start_note = normalize_note(M.tune[0].note);
  var end_note = normalize_note(M.tune[ M.tune.length-1 ].note);
  if (start_note != end_note) {
    return -1;
  }

  if (start_note != valid_notes[0]) { return -1; }
  if (end_note != valid_notes[0]) { return -1; }

  var ret = 0;
  var n_rep = dtune_measure_repetition_count(dtune, stride);
  if ((n_rep >= measure_rep[0]) &&
      (n_rep <= measure_rep[1])) { ret += n_rep; }
  else if (n_rep > measure_rep[1]) { ret += measure_rep[1]; }

  return ret;
}

function ex_1_5_sample() {
  var valid_notes = ["d4", "e4", "f4", "g4", "a4", "b4", "c5", "d5"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,4]];
  var measure_rep = [1,3];
  var measure_range = [6,6];

  var nmeasure = _irand(measure_range[0], measure_range[1]+1);
  var nrep = _irand(measure_rep[0], measure_rep[1]+1);

  var meas = [];

  var M = newMelody();
  M.beats_per_measure = beats_per_measure;

  // use pigeonhole to get repetitions
  //
  var nmeaslib = nmeasure - nrep;
  var meas_lib = [];

  for (var ii=0; ii<nmeaslib; ii++) {
    var meas = [];
    var r_idx = _irand(valid_rhythm.length);
    for (var jj=0; jj<valid_rhythm[r_idx].length; jj++) {
      var note = valid_notes[_irand(valid_notes.length)];
      var dur = valid_rhythm[r_idx][jj];
      meas.push({ "note":note, "dur":dur });
    }

    // force c4 as root of first measure, c4 as end of last measure.
    // assume first measure is meas_lib[0] and last measure is
    // meas_lib[ n-1 ].
    //

    if (ii==0) { meas[0].note = valid_notes[0]; }
    if (ii==(nmeaslib-1)) { meas[ meas.length-1 ].note = valid_notes[0]; }

    meas_lib.push(meas);
  }

  for (var ii=0; ii<nmeasure; ii++) {
    var m_idx = _irand(meas_lib.length);
    if (ii==0) { m_idx=0; }
    if (ii==(nmeasure-1)) { m_idx = meas_lib.length-1; }

    for (var jj=0; jj<meas_lib[m_idx].length; jj++) {
      M.tune.push( meas_lib[m_idx][jj] );
    }
  }

  var score = ex_1_5(M);
  console.log("# exercise 1.5 score", score);
  melody_to_sonicpi(M);


}

//ex_1_5_sample();

//-------------
//-------------
//-------------


function ex_1_6(M) {
  var valid_notes = ["e4", "f4", "g4", "a4", "b4", "c5", "d5", "e5"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,2,2], [2,2,4] ];
  var vrs = [
    ['s',';','s','s','s',';','s',';'],
    ['s',';','s',';','s','.','.',';']
  ];
  var measure_rep = [1,3];
  var measure_range = [6,8];

  var vrs_idx = [];
  for (var i=0; i<valid_rhythm.length; i++) { vrs_idx.push(0); }

  var stride = beats_per_measure * 1;
  var dtune = discritize_tune(M.tune, beats_per_measure, 1);
  var m = dtune.length;

  // Check measure length in range
  //
  var _actual_measure = dtune.length / stride;
  if ((_actual_measure < measure_range[0]) ||
      (_actual_measure > measure_range[1])) {
    return -1;
  }

  if (check_rhythm(M, valid_rhythm, beats_per_measure, 1)!=0) {
    return -1;
  }

  var start_note = normalize_note(M.tune[0].note);
  var end_note = normalize_note(M.tune[ M.tune.length-1 ].note);
  if (start_note != end_note) {
    return -1;
  }

  if (start_note != valid_notes[0]) { return -1; }
  if (end_note != valid_notes[0]) { return -1; }

  var ret = 0;
  var n_rep = dtune_measure_repetition_count(dtune, stride);
  if ((n_rep >= measure_rep[0]) &&
      (n_rep <= measure_rep[1])) { ret += n_rep; }
  else if (n_rep > measure_rep[1]) { ret += measure_rep[1]; }

  return ret;
}

function ex_1_6_sample() {
  var valid_notes = ["e4", "f4", "g4", "a4", "b4", "c5", "d5", "e5"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,2,2], [2,2,4]];
  var measure_rep = [1,3];
  var measure_range = [6,10];

  var nmeasure = _irand(measure_range[0], measure_range[1]+1);
  var nrep = _irand(measure_rep[0], measure_rep[1]+1);

  var meas = [];

  var M = newMelody();
  M.beats_per_measure = beats_per_measure;

  // use pigeonhole to get repetitions
  //
  var nmeaslib = nmeasure - nrep;
  var meas_lib = [];

  for (var ii=0; ii<nmeaslib; ii++) {
    var meas = [];
    var r_idx = _irand(valid_rhythm.length);
    for (var jj=0; jj<valid_rhythm[r_idx].length; jj++) {
      var note = valid_notes[_irand(valid_notes.length)];
      var dur = valid_rhythm[r_idx][jj];
      meas.push({ "note":note, "dur":dur });
    }

    if (ii==0) { meas[0].note = valid_notes[0]; }
    if (ii==(nmeaslib-1)) { meas[ meas.length-1 ].note = valid_notes[0]; }

    meas_lib.push(meas);
  }

  for (var ii=0; ii<nmeasure; ii++) {
    var m_idx = _irand(meas_lib.length);
    if (ii==0) { m_idx=0; }
    if (ii==(nmeasure-1)) { m_idx = meas_lib.length-1; }

    for (var jj=0; jj<meas_lib[m_idx].length; jj++) {
      M.tune.push( meas_lib[m_idx][jj] );
    }
  }

  var score = ex_1_6(M);
  console.log("# exercise 1.6 score", score);
  melody_to_sonicpi(M);


}

//ex_1_6_sample();

//-------------
//-------------
//-------------


// wip.
// percussive
// disallow beats:
//   - full measure note
//   - '' . . .
//   - '' , , ,
//   - . . ''
//   - , , , , ''
// no full measure pause
// balance long and shor tin a measure
//
function ex_1_7(M) {
  /*
  var valid_notes = ["c4"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,2,2], [2,2,4] ];
  var vrs = [
    ['s',';','s','s','s',';','s',';'],
    ['s',';','s',';','s','.','.',';']
  ];
  var measure_rep = [1,3];
  var measure_range = [8,12];

  var vrs_idx = [];
  for (var i=0; i<valid_rhythm.length; i++) { vrs_idx.push(0); }

  var stride = beats_per_measure * 1;
  var dtune = discritize_tune(M.tune, beats_per_measure, 1);
  var m = dtune.length;

  // Check measure length in range
  //
  var _actual_measure = dtune.length / stride;
  if ((_actual_measure < measure_range[0]) ||
      (_actual_measure > measure_range[1])) {
    return -1;
  }

  if (check_rhythm(M, valid_rhythm, beats_per_measure, 1)!=0) {
    return -1;
  }

  var ret = 0;
  var n_rep = dtune_measure_repetition_count(dtune, stride);
  if ((n_rep >= measure_rep[0]) &&
      (n_rep <= measure_rep[1])) { ret += n_rep; }
  else if (n_rep > measure_rep[1]) { ret += measure_rep[1]; }

  return ret;
  */
  return -1;
}

function ex_1_7_sample() {
  /*
  var valid_notes = ["e4", "f4", "g4", "a4", "b4", "c5", "d5", "e5"];
  var beats_per_measure = 8;
  var valid_rhythm = [[2,1,1,2,2], [2,2,4]];
  var measure_rep = [1,3];
  var measure_range = [6,10];

  var nmeasure = _irand(measure_range[0], measure_range[1]+1);
  var nrep = _irand(measure_rep[0], measure_rep[1]+1);

  var meas = [];

  var M = newMelody();
  M.beats_per_measure = beats_per_measure;

  // use pigeonhole to get repetitions
  //
  var nmeaslib = nmeasure - nrep;
  var meas_lib = [];

  for (var ii=0; ii<nmeaslib; ii++) {
    var meas = [];
    var r_idx = _irand(valid_rhythm.length);
    for (var jj=0; jj<valid_rhythm[r_idx].length; jj++) {
      var note = valid_notes[_irand(valid_notes.length)];
      var dur = valid_rhythm[r_idx][jj];
      meas.push({ "note":note, "dur":dur });
    }

    if (ii==0) { meas[0].note = valid_notes[0]; }
    if (ii==(nmeaslib-1)) { meas[ meas.length-1 ].note = valid_notes[0]; }

    meas_lib.push(meas);
  }

  for (var ii=0; ii<nmeasure; ii++) {
    var m_idx = _irand(meas_lib.length);
    if (ii==0) { m_idx=0; }
    if (ii==(nmeasure-1)) { m_idx = meas_lib.length-1; }

    for (var jj=0; jj<meas_lib[m_idx].length; jj++) {
      M.tune.push( meas_lib[m_idx][jj] );
    }
  }

  var score = ex_1_6(M);
  console.log("# exercise 1.6 score", score);
  melody_to_sonicpi(M);

  */
}

//ex_1_7_sample();



//-------------
//-------------
//-------------


function ex_2_1(M) {
  var diatonic_chords = [
    ["c4", "e4", "g4"],
    ["d4", "f4", "a4"],
    ["e4", "g4", "b4"],
    ["f4", "a4", "c5"],
    ["g4", "b4", "d5"],
    ["a4", "c5", "e5"],
    ["b4", "d5", "f5"]  ];

  // fmin, a g#min, db, bmin
}

function ex_2_1_sample() {
}

//ex_2_1_sample();


