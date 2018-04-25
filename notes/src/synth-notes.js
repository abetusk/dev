var g_data2 = {};

function stranger_synth_0() {
  var config = {
    "synth": [

      { 
        "frequency" : "C4", "detune" : 0,
        "oscillator" : { "type"  : "pwm", "modulationFrequency" : 0.5 },
        "filter" : { "Q"  : 6 , "type" : "lowpass" , "rolloff"  : -24 },
        "envelope"  : { "attack"  : 0.15 , "decay"  : 0.1 , "sustain"  : 0.9 , "release"  : 1 },
        "filterEnvelope" : {
          "attack" : 0.06 , "decay" : 0.2 , "sustain" : 0.5 , "release" : 2 ,
          "baseFrequency" : 200 , "octaves" : 7 , "exponent" : 2
        }
      },

      { 
        "frequency" : "C3", "detune" : 21,
        "oscillator" : { "type"  : "pwm", "modulationFrequency" : 0.25 },
        "filter" : { "Q"  : 6 , "type" : "lowpass" , "rolloff"  : -24 },
        "envelope"  : { "attack"  : 0.15 , "decay"  : 0.1 , "sustain"  : 0.9 , "release"  : 1 },
        "filterEnvelope" : {
          "attack" : 0.06 , "decay" : 0.2 , "sustain" : 0.5 , "release" : 2 ,
          "baseFrequency" : 200 , "octaves" : 7 , "exponent" : 2
        }
      }

    ]
  };

  var poly_synth = new Tone.PolySynth(2, Tone.MonoSynth);

  poly_synth.set({
    "envelope"  : { "attack"  : 0.005, "decay"  : 0.35 , "sustain"  : 0.0 , "release"  : 0.45 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.85},
    "filter" : { "Q"  : 1 , "type" : "lowpass" , "frequency": 6000, "rolloff"  : -24 },
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
  synth_gain.gain.value = 0.25;

  //DEBUG
  g_data2["synth"] = poly_synth;
  g_data2["gain"] = synth_gain;
  poly_synth.connect(synth_gain);
  synth_gain.toMaster();


  //return synth;

}

function stranger_synth_1() {

  var config = {
    "synth": [

      { 
        "frequency" : "C4", "detune" : 0,
        "oscillator" : { "type"  : "pwm", "modulationFrequency" : 0.5 },
        "filter" : { "Q"  : 6 , "type" : "lowpass" , "rolloff"  : -24 },
        "envelope"  : { "attack"  : 0.15 , "decay"  : 0.1 , "sustain"  : 0.9 , "release"  : 1 },
        "filterEnvelope" : {
          "attack" : 0.06 , "decay" : 0.2 , "sustain" : 0.5 , "release" : 2 ,
          "baseFrequency" : 200 , "octaves" : 7 , "exponent" : 2
        }
      },

      { 
        "frequency" : "C4", "detune" : -15,
        "oscillator" : { "type"  : "pwm", "modulationFrequency" : 0.25 },
        "filter" : { "Q"  : 6 , "type" : "lowpass" , "rolloff"  : -24 },
        "envelope"  : { "attack"  : 0.15 , "decay"  : 0.1 , "sustain"  : 0.9 , "release"  : 1 },
        "filterEnvelope" : {
          "attack" : 0.06 , "decay" : 0.2 , "sustain" : 0.5 , "release" : 2 ,
          "baseFrequency" : 200 , "octaves" : 7 , "exponent" : 2
        }
      },

      { 
        "frequency" : "C4", "detune" : 15,
        "oscillator" : { "type"  : "pwm", "modulationFrequency" : 0.75 },
        "filter" : { "Q"  : 6 , "type" : "lowpass" , "rolloff"  : -24 },
        "envelope"  : { "attack"  : 0.15 , "decay"  : 0.1 , "sustain"  : 0.9 , "release"  : 1 },
        "filterEnvelope" : {
          "attack" : 0.06 , "decay" : 0.2 , "sustain" : 0.5 , "release" : 2 ,
          "baseFrequency" : 200 , "octaves" : 7 , "exponent" : 2
        }
      }

    ]
  };


  var poly_synth = new Tone.PolySynth(3, Tone.MonoSynth);

  poly_synth.set({
    "envelope"  : { "attack"  : 0.5 , "decay"  : 0.5 , "sustain"  : 0.95, "release"  : 0.6 },
    "oscillator": { "type":"pwm", "modulationFrequency":0.5},
    "filter" : { "Q"  : 0, "type" : "lowpass" , "rolloff"  : -12, "frequency": 30},
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

  var synth_gain = new Tone.Gain();
  synth_gain.gain.value = 0.125;


  var synth_reverb = new Tone.Freeverb();
  synth_reverb.roomSize.value = 0.15;
  synth_reverb.wet.value = 0.25;

	poly_synth.chain(synth_gain, synth_reverb);
	synth_reverb.toMaster();


  g_data["synth"] = poly_synth;
  g_data["gain"] = synth_gain;
  g_data["reverb"] = synth_reverb;

}

function stephen_things_arp(now) {
  var t = 10;
  //var now = 2;

  now = ((typeof now === "undefined") ? Tone.now() : now);

  var synth = g_data2.synth;

  //var scale = 1.33;
  var scale = 0.5;
  var notedur = 1/16;

  console.log("!!!!");

  for (var rep=0; rep<10; rep++) {

    var note = ["c2", "e2", "g2", "b2", "c3", "b2", "g2", "e2"];
    var now = 3;

    for (var ii=0; ii<20; ii++) {
      for (var jj=0; jj<note.length; jj++) {
        if (note[jj] == "") { continue; }
        synth.triggerAttackRelease([note[jj], note[jj]], notedur, now + scale*(ii + jj/note.length), 1);
      }

    }

  }
}


stranger_synth_0();
stephen_things_arp(Tone.now() + 2);



