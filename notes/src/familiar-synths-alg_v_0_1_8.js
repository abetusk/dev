function v_0_1_8(famsynth) {
  var fs = famsynth;

  //var fs = new FamiliarSynths();
  var bpm_choice = [80, 90, 100, 120];
  var rythm_symmetry = [
    [0, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 1]
  ];

  var mode_choice = [ "ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian" ];
  //var mode_choice = [ "phrygian", "lydian", "aeolian" ];

  var arp_dt = 0.5 / rythm_rescale;
  var rythm_rescale = 8.0;

  var song_form = [
    [
      { "name": "intro", "length": 4},
      { "name": "verse", "length": 8},
      { "name": "pre-chorus", "length": 8},
      { "name": "chorus", "length": 8},
      { "name": "verse", "length": 8},
      { "name": "pre-chorus", "length": 8},
      { "name": "chorus", "length": 8},
      { "name": "bridge", "length": 8},
      { "name": "chorus", "length": 16},
      { "name": "outro", "length": 4}
    ],
    [
      { "name": "intro", "length": 4},
      { "name": "verse", "length": 16},
      { "name": "pre-chorus", "length": 4},
      { "name": "chorus", "length": 8},
      { "name": "verse", "length": 8},
      { "name": "pre-chorus", "length": 4},
      { "name": "chorus", "length": 8},
      { "name": "bridge", "length": 8},
      { "name": "chorus", "length": 8},
      { "name": "outro", "length": 8}
    ],

  ];

  var root_note_idx = fs._irnd(12);

  var _eps = 0.01;
  var song_option = {
    "structure" : [ "intro", "verse", "pre-chorus", "chorus", "verse", "pre-chorus", "chorus", "bridge", "chorus", "outro" ],

    "bpm" : bpm_choice[ fs._irnd(bpm_choice.length) ],

    "root_note_idx": root_note_idx,
    "root_note" : fs.noteName[ root_note_idx ],



    // key change
    // - can just be a whole or half step (octave) up
    // - can go up during half way
    //
    "modulation" : false,

    "intro" : {
      "length": [4]
    },

    "verse" : {

      //"mode":"lydian",
      "mode": mode_choice[ fs._irnd(mode_choice.length) ],

      "length" : [8, 8],

      // stem, stem-, stem+, ?
      //
      "motif" : "none",

      "range_ub":  6,
      "range_lb": -12,

      "tempo" : {
        //"symmetry": [0,1,1,0],
        "symmetry": rythm_symmetry[ fs._irnd(rythm_symmetry.length) ],
        "pareto_m" : 0.25/4 - _eps,
        "pareto_alpha" : 1.05,
        "beat_quantize": 0.25/2,
        "invert" : true
      }
    },

    "pre-chorus": {
      "length":[8, 8]
    },

    "chorus": {
      //"mode":"lydian",
      "mode": mode_choice[ fs._irnd(mode_choice.length) ],

      "range_ub":  6,
      "range_lb": -12,



      "length" : [8, 8, 16],
      "tempo" : {
        //"symmetry": [0,1,0,1],
        "symmetry": rythm_symmetry[ fs._irnd(rythm_symmetry.length) ],
        "pareto_m" : 0.25/2 - _eps,
        "pareto_alpha" : 0.75,
        "beat_quantize": 0.25/2,
        "invert" : false
      }
    },

    "bridge": {
      //"mode":"lydian",
      "mode": mode_choice[ fs._irnd(mode_choice.length) ],

      "length" : [8],

      "range_ub":  6,
      "range_lb": -12,


      "tempo" : {
        //"symmetry":[0,0,0,1],
        "symmetry": rythm_symmetry[ fs._irnd(rythm_symmetry.length) ],
        "pareto_m" : 0.25/2 - _eps,
        "pareto_alpha" : 1.0,
        "beat_quantize": 0.25/2,
        "invert" : false
      }
    },

    "outro": {
      "length":[4]
    }

  };

  var song_info = {

    "option" : song_option,

    "part": {

      "intro": { "config": {} },
      "outro":{ "config":{} },
      "verse":{ "config":{} },
      "pre-chorus":{ "config": {} },
      "chorus":{ "config":{} },
      "bridge":{ "config":{} }
    }
  };


  // construct beat 'library' for each relevant section
  //
  var song_part = [ "chorus", "verse", "bridge" ];
  for (var _idx = 0; _idx < song_part.length; _idx++) {
    var _part = song_part[_idx];
    var measure_lib = [];

    for (var ii=0; ii<4; ii++) {
      var _m = fs._mk_beat_measure( song_option[_part].tempo.pareto_m,
                                 song_option[_part].tempo.pareto_alpha,
                                 song_option[_part].tempo.beat_quantize );
      measure_lib.push(_m);
    }

    song_info.part[_part].config["measure_lib"] = measure_lib;
  }

  // use the symmetry to allocate beats for each section
  //
  for (var _idx = 0; _idx < song_part.length; _idx++) {
    var _part = song_part[_idx];

    var sym = song_option[_part].tempo.symmetry;

    song_info.part[_part].config["symmetry"] = sym;
    song_info.part[_part]["beat"] = [];

    for (var _sec=0; _sec<song_option[_part].length.length; _sec++) {
      var beat_sched = [];
      for (var _midx=0; _midx<song_option[_part].length[_sec]; _midx++) {
        var _lib = song_info.part[_part].config["measure_lib"];
        var _meas = _lib[ sym[_midx % (sym.length)] ];
        beat_sched.push.apply(beat_sched, _meas);
      }
      song_info.part[_part].beat.push(beat_sched);
    }

  }

  // fill in song_info with root note,
  // melody beats and melody notes
  //

  var root_note_idx = fs._irnd(12);
  var root_note_name = fs.noteName[ root_note_idx ];

  for (var _part_idx = 0; _part_idx < song_part.length; _part_idx++) {
    var _part = song_part[_part_idx];

    var melody_count = 4;

    //var song_mode = "aeolian";
    var song_mode = song_info.option[_part].mode;
    var mode_chord = fs.musicalModeChord[song_mode];
    var mode_chord4 = fs.musicalModeChord4[song_mode];

    console.log("//", song_mode);


    song_info.part[_part].root_note_idx     = root_note_idx;
    song_info.part[_part].root_note         = root_note_name;
    song_info.part[_part].mode              = song_mode;
    song_info.part[_part].chord             = mode_chord;
    song_info.part[_part].chord4            = mode_chord4;

    var rythm_pattern = [];
    var rythm_symmetry = song_info.part[_part].config["symmetry"];
    var _measure_pattern = song_info.part[_part].config["measure_lib"];

    // construct melody tempo
    //
    for (var jj=0; jj<4; jj++) {

      var _m = _measure_pattern[ rythm_symmetry[jj] ];
      var _measure = [];
      for (var _n=0; _n<_m.length; _n++) {
        _measure.push( _m[_n] );
      }
      rythm_pattern.push(_measure);
    }

    song_info.part[_part].melody_rythm = rythm_pattern;


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
      var r = fs._irnd(mode_chord.length);
      chord_prog_idx.push(r);
      chord_prog.push( mode_chord[r] );
    }

    var r = fs._irnd(mode_maj_chord.length);
    chord_prog_idx.push(r);
    chord_prog.push( mode_maj_chord[r] );

    song_info.part[_part]["chord_progression"] = chord_prog;


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

    // simple hill ( _/\_ )
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
    var x = fs._mirror(arp_note);
    //x = fs._permute(x, 1, arp_note.length-1);
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
        var p = ii + Math.floor( fs._drnd() * (arp_prog.length - ii) );
        arp_prog[ii] = arp_prog[p];
        arp_prog[p] = nt;
      }
    }

    song_info.part[_part]["arp_progression"] = arp_prog;
    song_info.part[_part]["arp_progression_dt"] = 0.0625;


    var _melody_ub = song_info.option[_part].range_ub;
    var _melody_lb = song_info.option[_part].range_lb;
    var _melody_dn = _melody_ub - _melody_lb;

    // create melody by choosing random two notes from
    // each bar of chord progression
    //
    //
    var melody_info = [];
    for (var ii=0; ii<rythm_pattern.length; ii++) {
      var bar_notes = fs._apick(chord_prog[ii].chord, 2);

      //console.log("melody, chord:", chord_prog[ii].chord, ", _apick:", bar_notes);

      for (var jj=0; jj<rythm_pattern[ii].length; jj++) {
        var _note = bar_notes[fs._irnd(bar_notes.length)];
        if (_note >= _melody_ub) { _note -= 12; }
        if (_note <= _melody_lb) { _note += 12; }
        melody_info.push( { "note": _note, "dur": rythm_pattern[ii][jj] } );
      }
    }

    song_info.part[_part].melody_info = melody_info;

  }

  //**************************

  //console.log( JSON.stringify(song_info, null, 2) );

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


  //var _bass_loud = 0.95;
  var _bass_loud = 1.25;
  var bass_choice = [
    { "type":"PolyMono", "preset":"dirty", "loudness":_bass_loud, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"pluckEcho", "loudness":_bass_loud, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"bassPad", "loudness":_bass_loud, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"dark", "loudness":_bass_loud, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"bass", "loudness":_bass_loud, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"bass2", "loudness":_bass_loud, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"edgy", "loudness":_bass_loud, "decay":1, "cutoff":0.1},
    //{ "type":"PolyMono", "preset":"shinybass2", "loudness":_bass_loud, "decay":1, "cutoff":0.3},
    { "type":"PolyMono", "preset":"shinybass", "loudness":_bass_loud, "decay":1, "cutoff":0.1},
    { "type":"PolyMono", "preset":"bass.muted", "loudness":_bass_loud, "decay":1, "cutoff":0.2},
    { "type":"PolyMono", "preset":"short", "loudness":_bass_loud, "decay":1, "cutoff":0.2},
    { "type":"PolySynth", "preset":"stringPad", "loudness":_bass_loud, "decay":1, "cutoff":0.2},
    //{ "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4},
    //{ "type":"PolySynth", "preset":"cry", "loudness":_bass_loud, "decay":1, "cutoff":0.2},
    { "type":"PolySynth", "preset":"brass", "loudness":_bass_loud, "decay":1, "cutoff":0.2}
  ];
  //var bass_instrument = { "type":"PolySynth", "preset":"stringPad", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"rhodes", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"cry", "loudness":2, "decay":4};
  //var bass_instrument = { "type":"PolySynth", "preset":"brass", "loudness":1, "decay":4};
  //var bass_instrument = bass_choice[ fs._irnd(bass_choice.length) ];
  var bass_instrument = {
    "verse": bass_choice[ fs._irnd(bass_choice.length) ],
    "chorus": bass_choice[ fs._irnd(bass_choice.length) ],
    "bridge": bass_choice[ fs._irnd(bass_choice.length) ]
  }

  var arp_choice = [
    //{"type":"Monosynth", "preset":"bass2", "loudness":0.8, "decay":0.12},
    //{"type":"Monosynth", "preset":"shinybass2", "loudness":2, "decay":0.12}, // has troubles
    {"type":"Monosynth", "preset":"shinybass", "loudness":1.2, "decay":0.12},
    {"type":"Monosynth", "preset":"arpy", "loudness":1.0, "decay":0.12}
  ];

  //var arp_instrument = {"type":"FM", "preset":"bass"};
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":0.8, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"bass2", "loudness":1.2, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":1.2, "decay":0.12}; // **
  //var arp_instrument = {"type":"Monosynth", "preset":"arpy", "loudness":0.8, "decay":0.12}; // **

  // ***
  //var arp_instrument = {"type":"Monosynth", "preset":"shinybass", "loudness":2, "decay":0.12}; // **
  //var arp_instrument = arp_choice[ fs._irnd(arp_choice.length) ];
  var arp_instrument = {
    "verse": arp_choice[ fs._irnd(arp_choice.length) ],
    "chorus":arp_choice[ fs._irnd(arp_choice.length) ],
    "bridge":arp_choice[ fs._irnd(arp_choice.length) ]
  }

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


  var melody_choice = [
    //{"type":"Monosynth", "preset":"shinybass2", "loudness":2, "decay":0.95},
    //{"type":"Monosynth", "preset":"shinybass", "loudness":2, "decay":0.95},
    {"type":"Monosynth", "preset":"easy", "loudness":1.25, "decay":0.95},
    //{"type":"Monosynth", "preset":"bass", "loudness":2, "decay":0.95}, // having some troubles (b3 + 27)
    {"type":"Monosynth", "preset":"bass2", "loudness":1.25, "decay":0.95},
    //{"type":"Monosynth", "preset":"dark", "loudness":1, "decay":0.5},
    {"type":"Monosynth", "preset":"arpy", "loudness":1.25, "decay":0.95}
  ];

  var melody_instrument = {
    "verse" : melody_choice[ fs._irnd(melody_choice.length) ],
    "chorus" : melody_choice[ fs._irnd(melody_choice.length) ],
    "bridge" : melody_choice[ fs._irnd(melody_choice.length) ]
  };

  var bpm = song_info.option.bpm;

  console.log("");
  console.log('Gibber.clear();');
  console.log("Clock.bpm=", bpm, ";");
  console.log('Theory.mode = "chromatic";');
  //console.log("// root_note_idx", root_note_idx);
  console.log('Theory.root = "' + note_name[root_note_idx] + '";');
  console.log('sv = Bus2("spaceverb");');

  var drum_pattern = [
    {
      "oh" :  ".... x...",
      "ch" :  "x.x. x.x.",
      "sd" :  ".... x...",
      "kd" :  "x..."
    },
    {
      //"oh" :  ".... .... x... ....  .... .... x... ....    .... .... x... ....  .... .... x... ....",
      "oh" :  ".... x...   .... x...   .... x...   .... x... ",
      "ch" :  "x.x. x.x. ..x. x.x.  x.x. x.x. ..x. x.x.    x.x. x.x. ..x. x.x.  x.x. x.x. ..x. x.x.",
      "sd" :  ".... x... .... x...  .... x... .... x...    .... x... .... x...  .... x... .... x...",
      "kd" :  "x... .... x... ....  x... .... x... ....    x... .... x... ....  x... .... x... ...."
    },
    {
      "oh" :  ".... .... .... ....  .... .... .... .x..    .... .... .... ....  .... .... .... .x..",
      "ch" :  "x.x. x.x. ..x. x.x.  x.x. x.x. ..x. x.x.    x.x. x.x. ..x. x.x.  x.x. x.x. ..x. x.x.",
      "sd" :  ".... x... .... x...  .... x... .... x...    .... x... .... x...  .... x... .... x...",
      "kd" :  "x... .... x... ....  x... .... x... ....    x... .... x... ....  x... .... x... ....",
      "tl" :  ".... .... .... ....  .... .... .... ....    .... .... .... ....  .... x... .x.. x.x."
    }
  ];

  //console.log( _mk_simple_tidal(drum_pattern[1]) );
  //return;

  var tidal_drum_pattern_lib = [
    "[ {kd,ch} ~ ch ~ ch ~ ch ~    {sd,<ch oh>} ~ ch      ~ ch ~ ch ~     {kd,ch} ~ <ch oh> ~ {ch,<~ cp>} ~ {ch,<~ cp>} ~     {sd,ch} ~ {ch,<~ cp>} ~ {ch,<~ cp>} ~ {ch,<~ kd>} ~ ]",
    "[ {kd,ch} ~ ch ~ ch ~ ch ~    {sd,ch}      ~ {ch,kd} ~ ch ~ ch ~     ch      ~ kd      ~ ch          ~ sd          ~     {sd,ch} ~ {ch,<~ cp>} ~ {ch,<~ cp>} ~ {ch,<~ kd>} ~ ]"
  ];

  // if the kick is on every other beat of an 16 long tidal sequence,
  // this reproduces the bpm (tap tempo kick = bpm).
  //
  var drum_code = {
    "oh": { "instrument" : "Hat({decay:0.5, gain:0.3})", "loudness": 0.25, "dt" : 0.125 },
    "ch": { "instrument": "Hat({decay:0.1, gain:0.3})", "loudness" : 0.25 , "dt" : 0.0625 },
    "sd": { "instrument": "Snare()", "loudness" : 0.25 , "dt" : 0.0625 },
    "kd": { "instrument" : "Kick()", "loudness" : 1.0 , "dt" : 0.125 , "extra" : "kd.gain = 1; kd.decay=0.995; kd.frequency=60;" },
    "cp": { "instrument" : "Clap()", "loudness" : 0.25 , "dt" : 0.0625 },
    "td": { "instrument" : "Tom()", "loudness" : 1.0, "dt" : 0.0625 }
  };



  var _drum_sched = drum_pattern[0];
  for (var instr_drum in _drum_sched) {
    var _note_seq = _drum_sched[instr_drum].replace(/ /g, '').replace(/\./g, '0').replace(/x/g, '1').split('').map( _x => (parseInt(_x) ? drum_code[instr_drum].loudness : 0)  );
    console.log(instr_drum + " = " + drum_code[instr_drum].instrument + ".connect(sv, 0.3)");
    console.log(instr_drum + ".trigger.seq(" + JSON.stringify(_note_seq) + ", " + drum_code[instr_drum].dt   + ");");

    if ("extra" in drum_code[instr_drum]) {
      console.log(drum_code[instr_drum].extra);
    }
  }

  //console.log("kd = Kick().connect(sv, 0.3);");
  //console.log("kd.trigger.seq( [1], 0.5););



  // Declare the instrument variables with various parameters and effects hooked up.
  // Save variable naems in `var_names` for later use in scheduling.
  //
  // There is an instrument for each of the `verse`, `chorus` and `bridge`
  // part.
  //

  var parts = [ "verse", "chorus", "bridge" ];
  var var_names = [ ];
  for (var _part_idx=0; _part_idx < parts.length; _part_idx++) {
    var _part = parts[_part_idx];


    // bass/chord progression
    //

    var var_name = "bass_" + _part;
    var_names.push(var_name);

    var chord_prog = song_info.part[_part].chord_progression;

    //console.log("// chord progression");
    var s = var_name + ' = ' + bass_instrument[_part].type +
      '("' +
      bass_instrument[_part].preset +
      '", {"decay":' + bass_instrument[_part].decay.toString() +
      ', "maxVoices":4, "loudness":' + bass_instrument[_part].loudness.toString() + ', "cutoff":' + bass_instrument[_part].cutoff.toString() + '}).connect(sv,0.35);\n';

    s += var_name + ".chord.seq( [";
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
    var _part = parts[_part_idx];

    var var_name = "arp_" + _part;
    var_names.push(var_name);

    var arp_prog = song_info.part[_part].arp_progression;
    var arp_dt = song_info.part[_part].arp_progression_dt;

    //console.log("// arp progression");
    s = var_name + ' = ' + arp_instrument[_part].type + '("' + arp_instrument[_part].preset + '", ' +
        ' {"decay":' + arp_instrument[_part].decay.toString() +
          ',"loudness":' + arp_instrument[_part].loudness.toString() + '}).connect(sv,0.5);\n';
    //s += 'a.connect(sv, 0.5);\n';
    s += var_name +  ".note.seq( [";
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


    // arp 1
    // higher octave arp
    //

    var_name += "_u";
    var_names.push(var_name);

    //console.log("// arp octave++ progression");
    s = var_name + ' = ' + arp_instrument[_part].type + '("' + arp_instrument[_part].preset + '", ' +
        ' {"decay":' + arp_instrument[_part].decay.toString() +
          ',"loudness":' + arp_instrument[_part].loudness.toString() +
            '}).connect(sv,0.5);\n';
    //s += 'a_u.connect(sv, 0.5);\n';
    s += var_name + ".note.seq( [";
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

    var _part = parts[_part_idx];

    var var_name = "melody_" + _part;
    var_names.push(var_name);

    var arp_prog = song_info.part[_part].melody_progression;
    var melody_info = song_info.part[_part].melody_info;

    var melody_count = melody_info.length;

    s = var_name + ' = ' + melody_instrument[_part].type +
      '("' + melody_instrument[_part].preset +
          '", {"decay":' + melody_instrument[_part].decay.toString() + ',"loudness":' + melody_instrument[_part].loudness.toString() + '}).connect(sv,0.5);\n';
    s += var_name + '.note.seq( [';
    for (var ii=0; ii<melody_info.length; ii++) {
      if (ii>0) { s += ","; }

      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + melody_info[ii].note].toUpperCase() + '"';
      } else {
        var _n = melody_info[ii].note;
        s += ' ' + _n.toString() + ' ';
      }

    }
    s += " ], [ ";
    for (var ii=0; ii<melody_info.length; ii++) {
      if (ii>0) { s += ","; }
      s += ' ' + melody_info[ii].dur.toString();
    }
    s += "] );";
    console.log(s);

    // higher octave meldoy instrument
    //

    var_name += "_u";
    var_names.push(var_name);

    s = var_name + ' = ' +
      melody_instrument[_part].type +
      '("' + melody_instrument[_part].preset + '", {"decay":' + melody_instrument[_part].decay.toString() + ',"loudness":' + melody_instrument[_part].loudness.toString() + '});\n';
    s += var_name + '.connect(sv, 0.5);\n';
    s += var_name + '.note.seq( [';
    for (var ii=0; ii<melody_info.length; ii++) {
      if (ii>0) { s += ","; }

      if (use_str_note) {
        s += ' "' + note_name[root_note_idx + melody_info[ii].note + 12].toUpperCase() + '"';
      } else {
        var _n = melody_info[ii].note + 12;
        //_n %= 24;
        s += ' ' + _n.toString() + ' ';
      }

    }
    s += " ], [ ";
    for (var ii=0; ii<melody_info.length; ii++) {
      if (ii>0) { s += ","; }
      s += ' ' + melody_info[ii].dur.toString();
    }
    s += "] );";
    console.log(s);


    console.log(" ");

  }

  for (var ii=0; ii<var_names.length; ii++) {
    console.log( var_names[ii] + ".gain = 0;");
  }

  // create "sechedule" pattern,
  // simplified character string of when instruments fade in/out
  // and at what volume.
  //
  //

  // . |    - nop
  // [0-9]  - fade in over # measures
  // !      - decrease immediately
  // ;      - fade out over 1 measure
  // :      - fade out over 2 measures
  //
  var instrument_schedule = {};

  var _quarter = 1;
  var _half = 2;
  var _full = 4;
  var _song_t = 0;

  var _part_idx = {};
  var instr_active = {};
  for (var song_part_idx=0; song_part_idx < song_info.option.structure.length; song_part_idx++) {
    var _part = song_info.option.structure[song_part_idx];
    _part_idx[_part] = 0;
  }

  for (var ii=0; ii<var_names.length; ii++) {
    instr_active[var_names[ii]] = false;
    instrument_schedule[var_names[ii]] = "";
  }
  for (var song_part_idx=0; song_part_idx < song_info.option.structure.length; song_part_idx++) {
    var _part = song_info.option.structure[song_part_idx];

    var _n_measure = song_info.option[_part].length[ _part_idx[_part] ];

    if (_part == "intro") {

      for (var ii=0; ii<var_names.length; ii++) {
        var var_instr = var_names[ii];

        if (var_instr.match(/arp_verse/)) {
          instr_active[var_instr] = true;
          instrument_schedule[var_instr] += " " + _n_measure + ".".repeat(_n_measure-1);
        }
        else {
          instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
        }
      }

    }
    else if (_part == "pre-chorus") {

      for (var ii=0; ii<var_names.length; ii++) {
        var var_instr = var_names[ii];

        if (var_instr.match(/melody_verse/)) {
          if (instr_active[var_instr]) {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure/2) + "!" + ".".repeat((_n_measure/2)-1);
            //instrument_schedule[var_instr] += " :" + ".".repeat(_n_measure-1);
            //instrument_schedule[var_instr] += " :" + ".".repeat(_n_measure-1);
          }
          else {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
          }
          instr_active[var_instr] = false;
        }
        else if (var_instr.match(/bass_verse/)) {
          if (instr_active[var_instr]) {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure - 2) + ":" + ".".repeat(1);
          }
          else {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
          }
          instr_active[var_instr] = false;
        }

        else if (var_instr.match(/arp_verse/)) {
          if (instr_active[var_instr]) {
            //instrument_schedule[var_instr] += " :" + ".".repeat(_n_measure-1);
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure - 2) + ":" + ".".repeat(1);
          }
          else {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
          }
          instr_active[var_instr] = false;
        }

        else {
          instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
        }

      }



    }
    else if (_part == "verse") {
      for (var ii=0; ii<var_names.length; ii++) {
        var var_instr = var_names[ii];

        if ( var_instr.match( /_verse/) ) {
          if (!instr_active[var_instr]) {
            instrument_schedule[var_instr] += " 0" + ".".repeat(_n_measure-1);
          }
          else {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
          }
          instr_active[var_instr] = true;

        }
        else {

          if (instr_active[var_instr]) {
            instrument_schedule[var_instr] += " !" + ".".repeat(_n_measure-1);
          }
          else {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
          }
          instr_active[var_instr] = false;

        }

      }

    }
    else if (_part == "chorus") {

      for (var ii=0; ii<var_names.length; ii++) {
        var var_instr = var_names[ii];

        if ( var_instr.match( /_chorus/) ) {
          if (!instr_active[var_instr]) {
            instrument_schedule[var_instr] += " 0" + ".".repeat(_n_measure-1);
          }
          else {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
          }
          instr_active[var_instr] = true;
        }
        else {

          if (instr_active[var_instr]) {
            instrument_schedule[var_instr] += " !" + ".".repeat(_n_measure-1);
          }
          else {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
          }
          instr_active[var_instr] = false;

        }

      }

    }
    else if (_part == "bridge") {

      for (var ii=0; ii<var_names.length; ii++) {
        var var_instr = var_names[ii];

        if ( var_instr.match( /_bridge/) ) {
          if (!instr_active[var_instr]) {
            instrument_schedule[var_instr] += " 0" + ".".repeat(_n_measure-1);
          }
          else {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
          }
          instr_active[var_instr] = true;
        }
        else {


          if (instr_active[var_instr]) {
            instrument_schedule[var_instr] += " !" + ".".repeat(_n_measure-1);
          }
          else {
            instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
          }
          instr_active[var_instr] = false;

        }

      }

    }
    else if (_part == "outro") {

      for (var ii=0; ii<var_names.length; ii++) {
        var var_instr = var_names[ii];

        if (instr_active[var_instr]) {
          instrument_schedule[var_instr] += " !" + ".".repeat(_n_measure-1);
        }
        else {
          instrument_schedule[var_instr] += " " + ".".repeat(_n_measure);
        }

      }

    }


  }


  for (var key in instrument_schedule) {
    console.log("//", key, " ".repeat(16-key.length), "|", instrument_schedule[key]);
  }

  var instrument_gain = {};
  for (var key in instrument_schedule) {
    instrument_gain[key] = 0.2;
  }

  //console.log("a.cutoff.fade( 0.1, 0.5, 2, 2);");
  //console.log("future( _a => { _a.cutoff = 1.0; }, 4, {_a:a});");

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

}




exports.v_0_1_8 = v_0_1_8;
