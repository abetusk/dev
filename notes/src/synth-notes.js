function stranger_synth_0() {

  var poly_synth = new Tone.PolySynth(2, Tone.MonoSynth);

  poly_synth.set({
    "envelope"  : { "attack"  : 0.005, "decay"  : 0.35 , "sustain"  : 0.0 , "release"  : 0.45 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.85},
    "filter" : { "Q"  : 1 , "type" : "lowpass" , "frequency": 3000, "rolloff"  : -24 },
    "filterEnvelope" : {
      "attack" : 0.005 , "decay" : 0.86 , "sustain" : 0.0 , "release" : 0.56 ,
      "baseFrequency" : 200 , "octaves" : 8, "exponent" : 30
    }

  });

  poly_synth.voices[0].oscillator.modulationFrequency.value = 0.8;

  poly_synth.voices[0].frequency.value = "C3";

  poly_synth.voices[1].detune.value = 10;
  poly_synth.voices[1].oscillator.modulationFrequency.value = 0.8;
  poly_synth.voices[1].frequency.value = "C4";

  var synth_gain = new Tone.Gain();
  synth_gain.gain.value = 0.125;

  poly_synth.connect(synth_gain);
  synth_gain.toMaster();

  var x = {
    "synth":poly_synth,
    "gain":synth_gain,
    "triggerAttackRelease": (function(a) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
    } })(poly_synth)
  };

  //return poly_synth;
  return x;
}

function stranger_synth_0b() {

  var poly_synth = new Tone.PolySynth(3, Tone.MonoSynth);

  poly_synth.set({
    "envelope"  : { "attack"  : 0.005, "decay"  : 0.5 , "sustain"  : 0.0 , "release"  : 0.0 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.85},
    "filter" : { "Q"  : 0 , "type" : "lowpass" , "frequency": 9000, "rolloff"  : -12},
    "filterEnvelope" : {
      "attack" : 0.05, "decay" : 1.06 , "sustain" : 0.0 , "release" : 0.03 ,
      "baseFrequency" : 200 , "octaves" : 6, "exponent" : 30
    }

  });

  poly_synth.voices[0].oscillator.modulationFrequency.value = 0.8;
  poly_synth.voices[0].frequency.value = "C3";

  poly_synth.voices[1].detune.value = 20;
  poly_synth.voices[1].oscillator.modulationFrequency.value = 0.8;
  poly_synth.voices[1].frequency.value = "C4";

  poly_synth.voices[2].set({"oscillator":{"type":"sawtooth"}});
  poly_synth.voices[2].detune.value = -2;
  poly_synth.voices[2].frequency.value = "C4";

  var synth_gain = new Tone.Gain();
  synth_gain.gain.value = 0.125;

  var synth_delay = new Tone.FeedbackDelay(0.08135);

  //var synth_reverb = new Tone.JCReverb();
  //synth_reverb.roomSize.value = 0.125;
  //synth_reverb.wet.value = 0.13;

  var synth_reverb = new Tone.Freeverb();
  synth_reverb.roomSize.value = 0.125;
  synth_reverb.wet.value = 0.33;

  var synth_chorus = new Tone.Chorus();

  poly_synth.chain(synth_delay, synth_chorus, synth_gain);
  //poly_synth.chain(synth_gain);
  synth_gain.toMaster();

  var x = {
    "synth":poly_synth,
    "gain":synth_gain,
    "reverb":synth_reverb,
    "delay":synth_delay,
    "triggerAttackRelease": (function(a) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
    } })(poly_synth)
  };

  //return poly_synth;
  return x;
}

function stranger_synth_1() {
  var poly_synth = new Tone.PolySynth(3, Tone.MonoSynth);

  poly_synth.set({
    "envelope"  : { "attack"  : 0.5 , "decay"  : 0.5 , "sustain"  : 0.95, "release"  : 0.6 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.5},
    "filter" : { "Q"  : 0, "type" : "lowpass" , "rolloff"  : -12, "frequency": 300},
    "filterEnvelope" : {
      "attack" : 0.5 , "decay" : 0.72 , "sustain" : 0.0 , "release" : 0.0 ,
      "baseFrequency" : 200 , "octaves" : 0 , "exponent" : 30
    }

  });

  poly_synth.voices[0].oscillator.modulationFrequency.value = 0.5;
  
  poly_synth.voices[1].detune.value = -5;
  poly_synth.voices[1].oscillator.modulationFrequency.value = 0.25;

  poly_synth.voices[2].detune.value = 6;
  poly_synth.voices[2].oscillator.modulationFrequency.value = 0.75;

  //----

  var synth_reverb = new Tone.Freeverb();
  synth_reverb.roomSize.value = 0.35;
  synth_reverb.wet.value = 0.25;

  var synth_gain = new Tone.Gain();
  synth_gain.gain.value = 0.125;

	poly_synth.chain(synth_reverb, synth_gain);
	synth_gain.toMaster();

  var x = {
    "synth":poly_synth,
    "gain":synth_gain,
    "reverb":synth_reverb,
    "triggerAttackRelease": (function(a) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
    } })(poly_synth)
  };

  return x;
}

function stranger_synth_1b() {
  var poly_synth = new Tone.PolySynth(3, Tone.MonoSynth);

  /*
  poly_synth.set({
    "envelope"  : { "attack"  : 0.5 , "decay"  : 0.5 , "sustain"  : 0.95, "release"  : 0.6 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.5},
    "filter" : { "Q"  : 0, "type" : "lowpass" , "rolloff"  : -12, "frequency": 300},
    "filterEnvelope" : {
      "attack" : 0.5 , "decay" : 0.72 , "sustain" : 0.0 , "release" : 0.0 ,
      "baseFrequency" : 200 , "octaves" : 0 , "exponent" : 30
    }
  });
  */

  poly_synth.set({
    "envelope"  : { "attack"  : 0.125 , "decay"  : 0.5 , "sustain"  : 0.95, "release"  : 0.6 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.5},
    "filter" : { "Q"  : 0, "type" : "lowpass" , "rolloff"  : -12, "frequency": 2000},
    "filterEnvelope" : {
      "attack" : 0.5 , "decay" : 0.72 , "sustain" : 0.95 , "release" : 1.0 ,
      "baseFrequency" : 200 , "octaves" : 0 , "exponent" : 30
    }
  });

  /*
  poly_synth.set({
    "envelope"  : { "attack"  : 0.05 , "decay"  : 0.5 , "sustain"  : 0.8, "release"  : 0.6 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.5},
    "filter" : { "Q"  : 0, "type" : "lowpass" , "rolloff"  : -12, "frequency": 2000},
    "filterEnvelope" : {
      "attack" : 0.05 , "decay" : 1.72 , "sustain" : 0.0 , "release" : 0.0 ,
      "baseFrequency" : 200 , "octaves" : 10, "exponent" : 3 
    }
  });
  */

  poly_synth.voices[0].oscillator.modulationFrequency.value = 0.5;
  
  poly_synth.voices[1].detune.value = -5;
  poly_synth.voices[1].oscillator.modulationFrequency.value = 0.25;

  //poly_synth.voices[2].detune.value = 6;
  poly_synth.voices[2].detune.value = 21;
  poly_synth.voices[2].oscillator.modulationFrequency.value = 0.75;

  //----

  var synth_reverb = new Tone.Freeverb();
  synth_reverb.roomSize.value = 0.15;
  synth_reverb.wet.value = 0.25;

  var synth_chorus = new Tone.Chorus();
  //synth_chorus

  var synth_gain = new Tone.Gain();
  synth_gain.gain.value = 0.125;

	poly_synth.chain(synth_chorus, synth_gain);
	synth_gain.toMaster();

  var x = {
    "synth":poly_synth,
    "gain":synth_gain,
    "reverb":synth_reverb,
    "triggerAttackRelease": (function(a) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
    } })(poly_synth)
  };

  return x;
}

function noise_synth_filter() {
  var noise = new Tone.NoiseSynth();
  var filt = new Tone.Filter();
  var filt_env = new Tone.FrequencyEnvelope();

  filt_env.connect(filt.frequency);
  noise.connect(filt);
  filt.connect(Tone.Master);

  return noise;
}

function custom_noise_synth() {
  var noise_synth = new Tone.NoiseSynth();
  //var filt = new Tone.Filter({"Q":20, "frequency":1200, "type":"lowpass", "rolloff":-12, "gain":10});
  var filt = new Tone.Filter({"Q":5, "frequency":950, "type":"lowpass", "rolloff":-24,});
  //var filt_env = new Tone.FrequencyEnvelope();
  var filt_env = new Tone.FrequencyEnvelope(
    {
      "attack" : 0.025 , "decay" : 8.0 , "sustain" : 0.0 , "release" : 0.03
      ,
      "baseFrequency" : 200 , "octaves" : 5.5, "exponent" : 0 
    }
  );

  noise_synth.envelope.attach = 0.005;
  //noise_synth.envelope.decay= 3.0;
  noise_synth.envelope.decay= 8.0;
  noise_synth.envelope.sustain = 0.0;
  noise_synth.envelope.release= 0.08;
  //noise_synth.toMaster();

  filt_env.connect(filt.frequency);
  //noise_synth.connect(filt);

  var reverb = new Tone.Freeverb();
  reverb.roomSize.value = 0.35;
  reverb.wet.value = 0.25;

  var gain = new Tone.Gain();
  gain.gain.value = 0.125;

  noise_synth.chain(reverb, filt, gain);
  gain.connect(Tone.Master);

  //noise_synth.volume.value = -24;
  noise_synth.volume.value = -2;

  var x = {
    "synth":noise_synth,
    "filterEnvelope":filt_env,
    "triggerAttackRelease": (function(a,b) { return function(l,t,v) {
      a.triggerAttackRelease(l,t,v);
      b.triggerAttackRelease(l,t,v);
    } })(noise_synth, filt_env)
  };

  return x;
}

function stranger_synth_2() {
  var poly_synth = new Tone.PolySynth(4, Tone.MonoSynth);

  poly_synth.set({
    "envelope"  : { "attack"  : 0.05 , "decay"  : 8 , "sustain"  : 0.0, "release"  : 0.08 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.5},
    "filter" : { "Q"  : 0, "type" : "lowpass" , "rolloff"  : -12, "frequency": 300},
    "filterEnvelope" :{
      "attack" : 0.005 , "decay" : 8.0 , "sustain" : 0.0 , "release" : 0.03 ,
      "baseFrequency" : 200 , "octaves" : 1 , "exponent" : 0
    }

  });

  poly_synth.voices[0].frequency.value = "C4";
  poly_synth.voices[0].oscillator.modulationFrequency.value = 0.8;
  
  poly_synth.voices[0].frequency.value = "C3";
  poly_synth.voices[1].detune.value = 1;
  poly_synth.voices[1].oscillator.modulationFrequency.value = 0.6;

  poly_synth.voices[2].set({"oscillator":{"type":"fmsine", "modulationType":"sine", "modulationIndex":3 }});


  var gain = new Tone.Gain();
  gain.gain.value = 0.125;

  var reverb = new Tone.Freeverb();
  reverb.roomSize.value = 0.15;
  reverb.wet.value = 0.25;

  var chorus = new Tone.Chorus(30, 0.1);

  poly_synth.chain(reverb, chorus, gain);
  gain.toMaster();

  var noise_synth = custom_noise_synth();

  var x = {
    "synth" : poly_synth,
    "noise_synth": noise_synth,
    "triggerAttackRelease": (function(a,b) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
      b.triggerAttackRelease(l,t,v);
    } })(poly_synth, noise_synth)
  };

  return x;
}

function stephen_things(synth, notes, start_time, bpm) {
  start_time = ((typeof start_time === "undefined") ? Tone.now() : start_time);
  bpm = (( typeof bpm === "undefined") ? 360 : bpm);
  var note = ["c2", "e2", "g2", "b2", "c3", "b2", "g2", "e2"];

  if (typeof notes !== "undefined") {
    note = notes;
  }

  var bps = bpm / 60;
  var notedur = 1/16;

  var dt = 0;
  for (var jj=0; jj<note.length; jj++) {
    if (note[jj] == "") { continue; }
    synth.triggerAttackRelease([note[jj], note[jj]], notedur, start_time + dt, 1);

    dt += 1/bps;
  }

}

function x(synth, noise, note, notedur, start_time, vel) {

  notedur = ((typeof notedur === "undefined") ? 5 : notedur);
  start_time = ((typeof start_time === "undefined") ? Tone.now() : start_time);
  vel = ((typeof vel === "undefined") ? 1 : vel);
  

  synth.triggerAttackRelease(note, notedur, start_time, vel);
  noise.triggerAttackRelease(notedur, start_time, vel);
}

var arp_notes = ["c2", "e2", "g2", "b2", "c3", "b2", "g2", "e2"];
var notes = [];
for (var r=0; r<10; r++) {
  for (var ii=0; ii<arp_notes.length; ii++) {
    notes.push(arp_notes[ii]);
  }
}

function play_midi(synth, midi_tune, t0) {
  t0 = ((typeof t0 === "undefined") ? Tone.now() : t0);

  var track = midi_tune.tracks;

  var fudge = 0.98;

  for (var ii=0; ii<track.length; ii++) {
    var note = track[ii].name;
    if (synth.synth.voices.length>1) {
      note = [];
      for (var jj=0; jj<synth.synth.voices.length; jj++) {
        note.push(track[ii].name);
      }
    }
    //synth.triggerAttackRelease(track[ii].name, track[ii].duration, track[ii].time + t0, track[ii].velocity);
    //synth.triggerAttackRelease(note, fudge*track[ii].duration, track[ii].time + t0, track[ii].velocity);
    synth.triggerAttackRelease(note, fudge*track[ii].duration, track[ii].time + t0, track[ii].velocity);
  }

}

// Tone.Transport.start() must be called for this
// to work
//
function simple_filter_sweep(syn, s, e, dt) {

  syn.ff_s = 100;
  syn.ff_e = 5000;
  syn.ff_d = 100;
  syn.ff = 1000;

  var loop = new Tone.Loop(
    (function(xx) {
      return function(time) {

        xx.ff += xx.ff_d;
        if (xx.ff >= xx.ff_e) {
          xx.ff = xx.ff_e;
          xx.ff_d = -xx.ff_d;
        }
        if (xx.ff <= xx.ff_s) {
          xx.ff = xx.ff_s;
          xx.ff_d = -xx.ff_d;
        }
        xx.synth.set({"filter":{"frequency":xx.ff}});
      }
    })(syn),
    dt
  );

  loop.start(s).stop(e);
}

//Tone.Transport.start();

function playit(arp_synth, bass_synth, midi_arp, midi_bass, arp_filt_sched, bass_filt_sched, t0, init_func) {
  t0 = ((typeof t0 === "undefined") ? 0.2 : t0);
  if (init_func) { init_func(); }

  for (var ii=0; ii<arp_filt_sched.length; ii++) {

    Tone.Transport.schedule(
      (function(xx, ff) {
        return function(t) {
          xx.synth.set({"filter":{"frequency":ff}});
        };
      })(arp_synth, arp_filt_sched[ii].f),
      arp_filt_sched[ii].t
    );

    Tone.Transport.schedule(
      (function(xx, ff) {
        return function(t) {
          xx.synth.set({"filter":{"frequency":ff}});
        };
      })(bass_synth, bass_filt_sched[ii].f),
      bass_filt_sched[ii].t
    );

  }

  play_midi(arp_synth, midi_arp, Tone.now() );
  play_midi(bass_synth, midi_bass, Tone.now() );

  //Tone.Transport.schedule( function(t) {  console.log("cp0", t); }, 1);
  //Tone.Transport.schedule( function(t) {  console.log("cp1", t); }, 2);
  //Tone.Transport.schedule( function(t) {  console.log("cp2", t); }, 3);

  Tone.Transport.start();
}

var kick = [];
kick.push( new Tone.Player({ "url":"./data/drum/kick/260484__soneproject__electribe-kicks-slice-b0.wav", "loop":false}).toMaster() );
kick.push( new Tone.Player({ "url":"./data/drum/kick/260537__soneproject__electribe-kicks-slice-59.wav", "loop":false}).toMaster() );
kick.push( new Tone.Player({ "url":"./data/drum/kick/91682__zinzan-101__jd-kick.wav", "loop":false}).toMaster() );

var snare = [];
snare.push( new Tone.Player({ "url":"./data/drum/snare/422444__akustika__bdr-104.wav", "loop":false}).toMaster() );

var hihat = [];
hihat.push( new Tone.Player({ "url":"./data/drum/hi_hat/404894__gnuoctathorpe__hihat-5.wav","loop":false}).toMaster() );

var clap = [];
clap.push( new Tone.Player({ "url":"./data/drum/clap/208875__adammusic18__hand-clap.wav", "loop":false}).toMaster() );

var closedhat = [];
closedhat.push( new Tone.Player({ "url":"./data/drum/closed_hat/250530__waveplay__hi-hat.wav", "loop":false}).toMaster() );


var s0 = stranger_synth_0();
var s0b = stranger_synth_0b();
//var s1 = stranger_synth_1();
var s1b = stranger_synth_1b();
var s2 = stranger_synth_2();
//stephen_things(s0, notes);

//playit(s0, s1, midi_arp_tune, midi_bass_tune, tune.arp_filt_sched, tune.bass_filt_sched, 3)

