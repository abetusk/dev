
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

function _irand(n, m) {
  if (typeof(m) === "undefined") {
    n = ((typeof(n) === "undefined") ? 1 : n);
    return Math.floor(Math.random()*n);
  }
  return Math.floor(Math.random()*(m-n)) + n;
}

function newMelody() {
  var m = {};
  m["beats_per_measure"] = 4;
  m["tune_only"] = true;
  m["tune"] = [];
  return m;
}

function melody_to_sonicpi(m) {
  var dt = 0.25;
  console.log("use_synth :dsaw");
  console.log("dt =", dt);

  for (var i=0; i<m.tune.length; i++) {
    console.log("play :" + m.tune[i].note);
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

function normalize_note(note) {
  note = ((typeof note === "undefined") ? "  ": note);
  if (note == "") { return "  "; }
  if (note == " ") { return "  "; }
  if (note.length == 1) { return note + "4"; }
  return note.substr(0,2);
}

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

  console.log("##", score);
  melody_to_sonicpi(m);
}

////ex_1_1_sample();

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

  // not map for easy lookup
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


