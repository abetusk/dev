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

  poly_synth.chain(delay, reverb, gain, compressor, fin_gain );
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

function setup_tune() {
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

  return sched_id;
}

