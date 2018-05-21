
function forgotten_tears_synth() {
  var poly_synth = new Tone.PolySynth(2, Tone.MonoSynth);

  poly_synth.set({
    "envelope"  : { "attack"  : 0.5, "decay"  : 0.05 , "sustain"  : 1.0 , "release"  : 0.45 },
    "oscillator": { "type":"sawtooth" },
    "filter" : { "Q"  : 1 , "type" : "lowpass" , "frequency": 3000, "rolloff"  : -24 },
    "filterEnvelope" : {
      "attack" : 0.005 , "decay" : 0.86 , "sustain" : 0.0 , "release" : 0.56 ,
      "baseFrequency" : 200 , "octaves" : 8, "exponent" : 30
    }

  });

  poly_synth.voices[0].frequency.value = "C3";

  poly_synth.voices[1].detune.value = 5;
  poly_synth.voices[1].frequency.value = "C3";

  var lfo = [];

  // I guess it adds to the frequency?
  //
  lfo.push(new Tone.LFO(1, -2, 2));
  lfo.push(new Tone.LFO(1.25, -1,1));

  lfo[0].connect(poly_synth.voices[0].oscillator.frequency);
  lfo[1].connect(poly_synth.voices[1].oscillator.frequency);

  lfo[0].start();
  lfo[1].start();

  var delay = new Tone.FeedbackDelay(0.4);

  var reverb = new Tone.JCReverb(0.4);
  reverb.wet.value = 0.25;

  var gain = new Tone.Gain();
  gain.gain.value = 0.50;

  var compressor = new Tone.Compressor();

  var fin_gain = new Tone.Gain();
  fin_gain.gain.value = 0.25;

  poly_synth.chain(delay, reverb, gain, compressor, fin_gain);
  fin_gain.toMaster();

  return {
    "compressor":compressor,
    "reverb":reverb,
    "pre_gain":gain,
    "gain":fin_gain,
    "synth": poly_synth,
    "lfo" : lfo,
    "triggerAttackRelease": (function(a) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
    } })(poly_synth)
  };
}

function play_forgotten_tears() {
  octave = 4;

  var note     = [ "e4", "f#4", "c#4",  "b3",    "",
                   "e4", "f#4",  "a4", "g#4", "f#4", "g#4", "",
                   "b4", "c#5", "a#4", "f#4",  "a4",  "e5" ];
  var note_dur = [    1,    1,      2,     3,     2,
                      2,    1,      2,   0.5,   0.5,     2,  2,
                      2,    1,      2,     1,     2,     3  ];

  var tune=[];
  for (var ii=0; ii<note.length; ii++) {
    tune.push([note[ii], note_dur[ii]]);
  }
  
  var synth_bank = [],
      synth_bank_max = 2;
  for (var ii=0; ii<synth_bank_max; ii++) {
    synth_bank.push(forgotten_tears_synth());
  }

  var sched_id = [];

  var cur_dt = 0;
  var bank_idx=0;
  for (var ii=0; ii<tune.length; ii++) {
    if (tune[ii][0] == "") { cur_dt += tune[ii][1]; continue; }

    var sid =
      Tone.Transport.scheduleOnce( (function(syn, note, note_dt) {
        return function(t) { syn.triggerAttackRelease([note, note], note_dt, t); };
      })(synth_bank[bank_idx], tune[ii][0], tune[ii][1]), cur_dt);

    sched_id.push(sid);

    cur_dt += tune[ii][1];
    bank_idx  = (bank_idx+1)%synth_bank.length;
  }


  Tone.Transport.start();

  return sched_id;
}


//----------
//----------
//----------

function bell_synth() {
  var synth = new Tone.MonoSynth();

  synth.set({
    "frequency" : "C4",
    "detune" : 0 ,
    "oscillator" : {
      "type" : "sine"
    },
    "filter" : {
      "Q" : 1,
      "frequency" : 500,
      "type" : "lowpass",
      "rolloff" : -24
    },
    "envelope" : {
      "attack" : 0.05,
      "decay" : 0.0,
      "sustain" : 1.0,
			//"releaseCurve": "exponential"
      "release" : 2
    }  ,
    "filterEnvelope" : {
      "attack" : 0.05,
      "decay" : 0.0,
      "sustain" : 1.0,
      "release" : 2,
      "baseFrequency" : 200,
      "octaves" : 7,
      "exponent" : 2
    }
  });

	var gain = new Tone.Gain();
  gain.gain.value = 0.125;

  synth.chain(gain);
  gain.toMaster();

  return {
    "gain":gain,
    "synth":synth,
    "triggerAttackRelease": (function(a) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
    } })(synth)
  };

}


//----------
//----------
//----------

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

//arp
//
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
  synth_gain.gain.value = 0.155;
  //synth_gain.gain.value = 0.25;

  var synth_delay = new Tone.FeedbackDelay(0.08135);
  synth_delay.delayTime.value = 0.1;

  //var synth_reverb = new Tone.JCReverb();
  //synth_reverb.roomSize.value = 0.125;
  //synth_reverb.wet.value = 0.13;

  var synth_reverb = new Tone.Freeverb();
  //synth_reverb.roomSize.value = 0.125;
  //synth_reverb.wet.value = 0.33;

  synth_reverb.roomSize.value = 0.25;
  synth_reverb.wet.value = 0.33;

  var synth_chorus = new Tone.Chorus();
  synth_chorus.delayTime = 3;

  var fin_gain = new Tone.Gain();
  fin_gain.gain.value = 1.0;

  poly_synth.chain(synth_chorus, synth_reverb, synth_gain, fin_gain);
  fin_gain.toMaster();

  var x = {
    "synth":poly_synth,
    "pre-gain":synth_gain,
    "gain":fin_gain,
    "reverb":synth_reverb,
    "chorus":synth_chorus,
    "delay":synth_delay,
    "triggerAttackRelease": (function(a) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
    } })(poly_synth)
  };

  //return poly_synth;
  return x;
}

function stranger_synth_0c() {

  var poly_synth = new Tone.PolySynth(3, Tone.MonoSynth);

  poly_synth.set({
    "envelope"  : { "attack"  : 0.15, "decay"  : 0.015 , "sustain"  : 1.0 , "release"  : 0.9 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.85},
    "filter" : { "Q"  : 0 , "type" : "lowpass" , "frequency": 4000, "rolloff"  : -12},
    "filterEnvelope" : {
      "attack" : 0.15, "decay" : 0.015, "sustain" : 1.0 , "release" : 0.93 ,
      "baseFrequency" : 200 , "octaves" : 1, "exponent" : 10
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
  synth_gain.gain.value = 0.25;
  //synth_gain.gain.value = 0.25;

  var synth_delay = new Tone.FeedbackDelay(0.14);
  //synth_delay.delayTime.value = 0.08;

  //var synth_reverb = new Tone.Freeverb();
  //synth_reverb.roomSize.value = 0.125;
  //synth_reverb.wet.value = 0.33;
  var synth_reverb = new Tone.JCReverb(0.14);
  synth_reverb.wet.value = 0.25;


  var synth_chorus = new Tone.Chorus();
  synth_chorus.delayTime = 3;

  var compressor = new Tone.Compressor();

  var fin_gain = new Tone.Gain();
  fin_gain.gain.value = 1.0;

  //poly_synth.chain(synth_delay, synth_reverb, synth_chorus, synth_gain, compressor, fin_gain);
  poly_synth.chain(synth_gain, synth_delay, synth_reverb, compressor, fin_gain);
  //poly_synth.chain(synth_delay, synth_chorus, synth_reverb, synth_gain);
  fin_gain.toMaster();

  var x = {
    "synth":poly_synth,
    "pre-gain":synth_gain,
    "compressor":compressor,
    "gain":fin_gain,
    "reverb":synth_reverb,
    "chorus":synth_chorus,
    "delay":synth_delay,
    "triggerAttackRelease": (function(a) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
    } })(poly_synth)
  };

  return x;
}

//arp
//
function gsynth_0() {

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
  synth_gain.gain.value = 0.155;
  //synth_gain.gain.value = 0.25;

  var synth_delay = new Tone.FeedbackDelay(0.08135);
  synth_delay.delayTime.value = 0.1;

  //var synth_reverb = new Tone.JCReverb();
  //synth_reverb.roomSize.value = 0.125;
  //synth_reverb.wet.value = 0.13;

  var synth_reverb = new Tone.Freeverb();
  //synth_reverb.roomSize.value = 0.125;
  //synth_reverb.wet.value = 0.33;

  synth_reverb.roomSize.value = 0.25;
  synth_reverb.wet.value = 0.33;

  var synth_chorus = new Tone.Chorus();
  synth_chorus.delayTime = 3;

  //poly_synth.chain(synth_delay, synth_reverb, synth_chorus, synth_gain);
  poly_synth.chain(synth_chorus, synth_reverb, synth_gain);
  //poly_synth.chain(synth_gain);
  synth_gain.toMaster();

  var x = {
    "synth":poly_synth,
    "gain":synth_gain,
    "reverb":synth_reverb,
    "chorus":synth_chorus,
    "delay":synth_delay,
    "triggerAttackRelease": (function(a) { return function(n,l,t,v) {
      a.triggerAttackRelease(n,l,t,v);
    } })(poly_synth)
  };

  //return poly_synth;
  return x;
}

//--------------
//--------------
//--------------
//--------------


// bass
//
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

  poly_synth.set({
    "envelope"  : { "attack"  : 0.125 , "decay"  : 0.5 , "sustain"  : 0.95, "release"  : 0.6 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.5},
    "filter" : { "Q"  : 0, "type" : "lowpass" , "rolloff"  : -12, "frequency": 2000},
    "filterEnvelope" : {
      "attack" : 0.5 , "decay" : 0.72 , "sustain" : 0.95 , "release" : 1.0 ,
      "baseFrequency" : 200 , "octaves" : 0 , "exponent" : 30
    }
  });

  poly_synth.voices[0].oscillator.modulationFrequency.value = 0.5;
  
  poly_synth.voices[1].detune.value = -5;
  poly_synth.voices[1].oscillator.modulationFrequency.value = 0.25;

  poly_synth.voices[2].detune.value = 21;
  poly_synth.voices[2].oscillator.modulationFrequency.value = 0.75;

  //----

  var synth_reverb = new Tone.Freeverb();
  synth_reverb.roomSize.value = 0.15;
  synth_reverb.wet.value = 0.25;

  var synth_chorus = new Tone.Chorus();

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

function stranger_synth_1c() {
  var poly_synth = new Tone.PolySynth(3, Tone.MonoSynth);

  poly_synth.set({
    "envelope"  : { "attack"  : 0.25 , "decay"  : 0.5 , "sustain"  : 0.95, "release"  : 1.6 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.5},
    "filter" : { "Q"  : 0, "type" : "lowpass" , "rolloff"  : -12, "frequency": 2000},
    "filterEnvelope" : {
      "attack" : 0.125 , "decay" : 0.72 , "sustain" : 0.95 , "release" : 1.0 ,
      "baseFrequency" : 200 , "octaves" : 0 , "exponent" : 30
    }
  });

  poly_synth.voices[0].oscillator.modulationFrequency.value = 0.5;
  
  poly_synth.voices[1].detune.value = -5;
  poly_synth.voices[1].oscillator.modulationFrequency.value = 0.25;

  poly_synth.voices[2].detune.value = 21;
  poly_synth.voices[2].oscillator.modulationFrequency.value = 0.75;

  //----

  //var synth_reverb = new Tone.Freeverb();
  //synth_reverb.roomSize.value = 0.15;
  //synth_reverb.wet.value = 0.25;

  var delay = new Tone.FeedbackDelay(0.4);
  var synth_reverb = new Tone.JCReverb(0.4);
  synth_reverb.wet.value = 0.35;

  var synth_chorus = new Tone.Chorus();

  var synth_gain = new Tone.Gain();
  synth_gain.gain.value = 0.25;

  var fin_gain = new Tone.Gain();
  fin_gain.gain.value = 1.0;

  var compressor = new Tone.Compressor();

  //poly_synth.chain(delay, synth_reverb, synth_chorus, synth_gain, compressor, fin_gain);
  poly_synth.chain(delay, synth_reverb, synth_gain, compressor, fin_gain);
  fin_gain.toMaster();

  //----

  var x = {
    "delay":delay,
    "synth":poly_synth,
    "pre-gain": synth_gain,
    "gain":fin_gain,
    "reverb":synth_reverb,
    "compressor":compressor,
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
    "gain": gain,
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

  var sched_id = [];

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

    var sid =
      Tone.Transport.scheduleOnce( (function(syn, nt, note_dur, v) {
          return function(t) {
            syn.triggerAttackRelease(nt, note_dur, t, v);
          }
        })(synth, note, fudge*track[ii].duration, track[ii].velocity),
        track[ii].time);

    sched_id.push(sid);
  }

  Tone.Transport.start();

  return  sched_id;

}

function play_midi_tar(synth, midi_tune, t0) {
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

  Tone.Transport.start();
}

function play_sampled(instrument, fs_notes) {
  var idx=0;

  for (var ii=0; ii<fs_notes.length; ii++) {
    instrument[idx].player.start(Tone.now() + fs_notes[ii].t);
    idx = (idx+1)%instrument.length;
  }

}

function playtune(instruments, tune) {


  if (typeof tune.bass !== "undefined") {
    play_midi(instruments.bass, tune.bass.midi);
  }

  if (typeof tune.arp !== "undefined") {
    play_midi(instruments.arp, tune.arp.midi);
  }

  var idx=0;
  if (typeof tune.drum !== "undefined") {

    play_sampled(instruments.kick, tune.drum.kick);
    play_sampled(instruments.snare, tune.drum.snare);
    play_sampled(instruments.hihat, tune.drum.hihat);
    play_sampled(instruments.clap, tune.drum.clap);
    play_sampled(instruments.closedhat, tune.drum.closedhat);

    /*
    idx=0;
    for (var ii=0; ii<tune.drum.snare.length; ii++) {
      instruments.snare[0].start(Tone.now() + tune.drum.snare[ii].t);
      idx = (idx+1)%instruments.kick.length;
    }

    for (var ii=0; ii<tune.drum.hihat.length; ii++) {
      instruments.hihat[0].start(Tone.now() + tune.drum.hihat[ii].t);
    }

    for (var ii=0; ii<tune.drum.clap.length; ii++) {
      instruments.clap[0].start(Tone.now() + tune.drum.clap[ii].t);
    }

    for (var ii=0; ii<tune.drum.closedhat.length; ii++) {
      instruments.closedhat[0].start(Tone.now() + tune.drum.closedhat[ii].t);
    }
    */

  }


}

function setup_drum(url, volume) {
  volume = ((typeof volume === "undefined") ? 1 : volume);
  var gain = new Tone.Gain();
  var player = new Tone.Player({ "url":url, "loop":false});

  gain.gain.value = volume;

  player.chain(gain);
  gain.toMaster();

  return {
    "player": player,
    "gain": gain
  };
}

var drum_url = {
  "kick": [
    //"./data/drum/kick/91682__zinzan-101__jd-kick.wav",
    //"./data/drum/kick/260537__soneproject__electribe-kicks-slice-59.wav",
    "./data/drum/kick/260484__soneproject__electribe-kicks-slice-b0.wav"
  ],

  "snare": [
    "./data/drum/snare/422444__akustika__bdr-104.wav"
  ],

  "hihat": [
    "./data/drum/hi_hat/404894__gnuoctathorpe__hihat-5.wav"
  ],

  "clap": [
    "./data/drum/clap/208875__adammusic18__hand-clap.wav"
  ],

  "closedhat": [
    "./data/drum/closed_hat/250530__waveplay__hi-hat.wav"
  ]

};

function uiSlider_cb(instrument, type, value) {
  var synth = {};

  if      (instrument == "arp") { synth = instruments.arp; }
  else if (instrument == "bass") { synth = instruments.bass; }
  else if (instrument == "lead") { synth = instruments.lead; }
  else if (instrument == "kick")      { instruments.kick[0].gain.gain.value = value; return; }
  else if (instrument == "hihat")     { instruments.hihat[0].gain.gain.value = value; return; }
  else if (instrument == "closedhat") { instruments.closedhat[0].gain.gain.value = value; return; }
  else if (instrument == "snare")     { instruments.snare[0].gain.gain.value = value; return; }
  else if (instrument == "clap")      { instruments.clap[0].gain.gain.value = value; return; }
  else {
    console.log("unknown instrument", instrument);
    return;
  }

  if (type == "gain") {
    synth.gain.gain.value = value;
  }
  else if (type == "filter") {
    synth.synth.set({"filter":{"frequency":value}});
  }
  else if (type == "amplitude-decay") {
    synth.synth.set({"envelope":{"decay":value}});
  }

}

function uiSliderGet(instrument, type) {
  var synth = {};

  if      (instrument == "arp") { synth = instruments.arp; }
  else if (instrument == "bass") { synth = instruments.bass; }
  else if (instrument == "lead") { synth = instruments.lead; }
  else if (instrument == "kick")      { return instruments.kick[0].gain.gain.value ; }
  else if (instrument == "hihat")     { return instruments.hihat[0].gain.gain.value ; }
  else if (instrument == "closedhat") { return instruments.closedhat[0].gain.gain.value ; }
  else if (instrument == "snare")     { return instruments.snare[0].gain.gain.value ; }
  else if (instrument == "clap")      { return instruments.clap[0].gain.gain.value ; }
  else {
    console.log("unknown instrument", instrument);
    return;
  }

  var type_parts = type.split("-");

  if (type == "gain") {
    return synth.gain.gain.value;
  }
  else if (type == "filter") {
    var jo = synth.synth.get("filter");

    if ("filter" in jo) {
      if ("frequency" in jo.filter) {
        return jo.filter.frequency;
      }
    }
  }

  else if (type_parts[0]== "amplitude") {

    var subtype = ["attack", "decay", "sustain", "release"];
    for (var ii=0; ii<subtype.length; ii++) {

      if (type_parts[1] == subtype[ii]) {
        var jo = synth.synth.get("envelope");
        if (("envelope" in jo) && (subtype[ii] in jo.envelope)) {
          return jo.envelope[subtype[ii]];
        }

      }
    }

  }

  else if (type_parts[0] == "frequency") {
    var subtype = ["attack", "decay", "sustain", "release"];
    for (var ii=0; ii<subtype.length; ii++) {

      if (type_parts[1] == subtype[ii]) {
        var jo = synth.synth.get("filterEnvelope");
        if (("filterEnvelope" in jo) && (subtype[ii] in jo.filterEnvelope)) {
          return jo.filterEnvelope[subtype[ii]];
        }

      }
    }

  }

  return;
}

//playtune(instruments, ok_data);

//playtune(instruments, tune);

//playit(s0, s1, midi_arp_tune, midi_bass_tune, tune.arp_filt_sched, tune.bass_filt_sched, 3)


var kick = [],
    snare = [],
    hihat = [],
    closedhat = [],
    clap = [];

for (var ii=0; ii<drum_url.kick.length; ii++) { kick.push( setup_drum(drum_url.kick[ii]) ); }
for (var ii=0; ii<drum_url.snare.length; ii++) { snare.push( setup_drum(drum_url.snare[ii]) ); }
for (var ii=0; ii<drum_url.hihat.length; ii++) { hihat.push( setup_drum(drum_url.hihat[ii]) ); }
for (var ii=0; ii<drum_url.closedhat.length; ii++) { closedhat.push( setup_drum(drum_url.closedhat[ii]) ); }
for (var ii=0; ii<drum_url.clap.length; ii++) { clap.push( setup_drum(drum_url.clap[ii]) ); }

var s0 = stranger_synth_0();
var s0b = stranger_synth_0b();
var s0c = stranger_synth_0c();
//var s1 = stranger_synth_1();
var s1b = stranger_synth_1b();
var s1c = stranger_synth_1c();
var s2 = stranger_synth_2();
//stephen_things(s0, notes);

function tune_init(instruments) {
  instruments.arp.synth.set({"filter":{"frequency":500}});
  instruments.arp.gain.gain.value = 0.125;
}

var instruments = {
  "bass" : s1c,
  "arp": s0b,
  "lead": s2,
  "kick":kick,
  "snare":snare,
  "clap":clap,
  "hihat":hihat,
  "closedhat":closedhat
};

tune_init(instruments);

