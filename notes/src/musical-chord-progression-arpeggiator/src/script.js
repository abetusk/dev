console.clear();
document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});
/**
 * MusicalScale
 * generate a scale of music
 * https://codepen.io/jakealbaugh/pen/NrdEYL/
 *
 * @param key {String} 
     the root of the key. flats will be converted to sharps.
       C, C#, D, D#, E, F, F#, G, G#, A, A#, B
 * @param mode {String} 
     desired mode.
       ionian, dorian, phrygian, lydian, mixolydian, aeolian, locrian, 
     can also pass in:
       major, minor, melodic, harmonic
 *
 * @return {Object}
     _scale: scale info
     key: the scale key
     mode: the scale mode id
     notes: an array of notes
       step: index of note in key
       note: the actual note
       rel_octave: 0 || 1, in root octave or next
       triad: major, minor, diminished, or augmented triad for this note
         interval: I, ii, etc
         type: min, maj, dim, aug
         notes: array of notes in the triad
           note: the note
           rel_octave: 0 || 1 || 2, relative to key root octave
 */

class MusicalScale {
  constructor(params) {
    this.dict = this._loadDictionary();
    let errors = this._errors(params);
    if(errors) return;
    this.updateScale = this.pubUpdateScale;

    this._loadScale(params);
  };
  
  pubUpdateScale(params) {
    let errors = this._errors(params);
    if(errors) return;
    this._loadScale(params);
  };
  
  _loadScale(params) {
    // clean up the key param
    this.key = this._paramKey(params.key);
    // set the mode
    this.mode = params.mode;
    this.notes = [];
    this._scale = this.dict.scales[this._paramMode(this.mode)];
    
    // notes to cycle through
    let keys = this.dict.keys;
    // starting index for key loop
    let offset = keys.indexOf(this.key);
    for(let s = 0; s < this._scale.steps.length; s++) {
      let step = this._scale.steps[s];
      let idx = (offset + step) % keys.length;
      // relative octave. 0 = same as root, 1 = next ocave up
      let rel_octave = (offset + step) > keys.length - 1 ? 1 : 0;
      // generate the relative triads
      let triad = this._genTriad(s, idx, rel_octave, this._scale.triads[s]);
      // define the note
      let note = { step: s, note: keys[idx], rel_octave: rel_octave, triad: triad };
      // add the note
      this.notes.push(note);
    }
  };
  
  // create a chord of notes based on chord type
  _genTriad(s, offset, octave, t) {
    // get the steps for this chord type
    let steps = this.dict.triads[t];
    // instantiate the chord
    let chord = { type: t, interval: this._intervalFromType(s, t), notes: [] };
    // load the notes
    let keys = this.dict.keys;
    for(let i = 0; i < steps.length; i++) {
      let step = steps[i];
      let idx = (offset + step) % keys.length;
      // relative octave to base
      let rel_octave = (offset + step) > keys.length - 1 ? octave + 1 : octave;
      // define the note
      chord.notes.push({ note: keys[idx], rel_octave: rel_octave });
    }
    return chord;
  };
  
  // proper interval notation from the step and type
  _intervalFromType(step, type) {
    let steps = 'i ii iii iv v vi vii'.split(' ');
    let s = steps[step];
    switch(type) {
      case 'maj':
        s = s.toUpperCase(); break;
      case 'min':
        s = s; break;
      case 'aug':
        s = s.toUpperCase() + '+'; break;
      case 'dim':
        s = s + '°'; break;
    }
    return s;
  };
  
  _errors(params) {
    if(this.dict.keys.indexOf(params.key) === -1) {
      if(Object.keys(this.dict.flat_sharp).indexOf(params.key) === -1) {
        return console.error(`${params.key} is an invalid key. ${this.dict.keys.join(', ')}`);
      }
    } else if(this.dict.modes.indexOf(params.mode) === -1) {
      return console.error(`${params.mode} is an invalid mode. ${this.dict.modes.join(', ')}`);
    } else {
      return false;
    }
  };
  
  _loadDictionary() {
    return {
      keys: 'C C# D D# E F F# G G# A A# B'.split(' '),
      scales: {
        ion: {
          name: 'Ionian',
          steps: this._genSteps('W W H W W W H'),
          dominance: [3,0,1,0,2,0,1],
          triads: this._genTriads(0)
        },
        dor: {
          name: 'Dorian',
          steps: this._genSteps('W H W W W H W'),
          dominance: [3,0,1,0,2,2,1],
          triads: this._genTriads(1)
        },
        phr: {
          name: 'Phrygian',
          steps: this._genSteps('H W W W H W W'),
          dominance: [3,2,1,0,2,0,1],
          triads: this._genTriads(2)
        },
        lyd: {
          name: 'Lydian',
          steps: this._genSteps('W W W H W W H'),
          dominance: [3,0,1,2,2,0,1],
          triads: this._genTriads(3)
        },
        mix: {
          name: 'Mixolydian',
          steps: this._genSteps('W W H W W H W'),
          dominance: [3,0,1,0,2,0,2],
          triads: this._genTriads(4)
        },
        aeo: {
          name: 'Aeolian',
          steps: this._genSteps('W H W W H W W'),
          dominance: [3,0,1,0,2,0,1],
          triads: this._genTriads(5)
        },
        loc: {
          name: 'Locrian',
          steps: this._genSteps('H W W H W W W'),
          dominance: [3,0,1,0,3,0,0],
          triads: this._genTriads(6)
        },
        mel: {
          name: 'Melodic Minor',
          steps: this._genSteps('W H W W W W H'),
          dominance: [3,0,1,0,3,0,0],
          triads: 'min min aug maj maj dim dim'.split(' ')
        },
        har: {
          name: 'Harmonic Minor',
          steps: this._genSteps('W H W W H WH H'),
          dominance: [3,0,1,0,3,0,0],
          triads: 'min dim aug min maj maj dim'.split(' ')
        }
      },
      modes: [
        'ionian', 'dorian', 'phrygian', 
        'lydian', 'mixolydian', 'aeolian',
        'locrian', 'major', 'minor', 
        'melodic', 'harmonic'
      ],
      flat_sharp: {
        Cb: 'B',
        Db: 'C#',
        Eb: 'D#',
        Fb: 'E',
        Gb: 'F#',
        Ab: 'G#',
        Bb: 'A#'
      },
      triads: {
        maj: [0,4,7],
        min: [0,3,7],
        dim: [0,3,6],
        aug: [0,4,8]
      }
    };
  };
    
  _paramMode(mode) {
    return {
      minor: 'aeo',
      major: 'ion',
      ionian: 'ion',
      dorian: 'dor',
      phrygian: 'phr',
      lydian: 'lyd',
      mixolydian: 'mix',
      aeolian: 'aeo',
      locrian: 'loc',
      melodic: 'mel',
      harmonic: 'har'
    }[mode];
  };
  
  _paramKey(key) {
    if(this.dict.flat_sharp[key]) return this.dict.flat_sharp[key];
    return key;
  };

  _genTriads(offset) {
    // this is ionian, each mode bumps up one offset.
    let base = 'maj min min maj maj min dim'.split(' ');
    let triads = [];
    for(let i = 0; i < base.length; i++) {
      triads.push(base[(i + offset) % base.length]);
    }
    return triads;
  };
  
  _genSteps(steps_str) {
    let arr = steps_str.split(' ');
    let steps = [0];
    let step = 0;
    for(let i = 0; i < arr.length - 1; i++) {
      let inc = 0;
      switch(arr[i]) {
        case 'W':
          inc = 2; break;
        case 'H':
          inc = 1; break;
        case 'WH':
          inc = 3; break;
      }
      step += inc;
      steps.push(step);
    }
    return steps;
  };
};

/**
  ArpeggioPatterns
  https://codepen.io/jakealbaugh/pen/PzpzEO/
  returns arrays of arpeggio patterns for a given length of notes
  @param steps {Integer} number of steps
  @return {Object}
    patterns: {Array} of arpeggiated index patterns
 */

class ArpeggioPatterns {
  constructor(params) {
    this.steps = params.steps;
    this._loadPatterns();
    this.updatePatterns = this.pubUpdatePatterns;
  };
  
  pubUpdatePatterns(params) {
    this.steps = params.steps;
    this._loadPatterns();
  };
  
  _loadPatterns() {
    this.arr = [];
    this.patterns = [];
    for(let i = 0; i < this.steps; i++) { this.arr.push(i); }
    this._used = [];
    this.permutations = this._permute(this.arr);
    this.looped = this._loop();
    this.patterns = {
      straight: this.permutations,
      looped: this.looped
    };
  };
  
  _permute(input, permutations) {
    permutations = permutations || [];
    var i, ch;
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      this._used.push(ch);
      if (input.length === 0) {
        permutations.push(this._used.slice());
      }
      this._permute(input, permutations);
      input.splice(i, 0, ch);
      this._used.pop();
    }
    return permutations;
  };
  
  _loop() {
    let looped = [];
    for(let p = 0; p < this.permutations.length; p++) {
      let perm = this.permutations[p];
      let arr = Array.from(perm);
      for(let x = 1; x < perm.length - 1; x++) {
        arr.push(perm[perm.length - 1 - x]);
      }
      looped.push(arr);
    }
    return looped;
  };
  
};


/**
  ArpPlayer
  the main app
 */

class ArpPlayer {
  constructor(params) {
    this.container = document.querySelector('#main');
    this.aside = document.querySelector('#aside');
    this.chords = [0,2,6,3,4,2,5,1];
    this.ms_key = 'G';
    this.ms_mode = 'locrian';
    this.ap_steps = 6;
    this.ap_pattern_type = 'straight'; // || 'looped'
    this.ap_pattern_id = 0;
    this.player = {
      chord_step: 0,
      octave_base: 4,
      arp_repeat: 2,
      bass_on: false,
      triad_step: 0,
      step: 0,
      playing: false,
      bpm: 135
    };
    this.chord_count = this.chords.length;
    this._setMusicalScale();
    this._setArpeggioPatterns();
    this._drawKeyboard();
    this._drawOutput();
    this._loadChordSelector();
    this._loadBPMSelector();
    this._loadKeySelector();
    this._loadModeSelector();
    this._loadStepsSelector();
    this._loadTypeSelector();
    this._loadPatternSelector();
    this._loadSynths();
    this._loadTransport();
    
    // change tabs, pause player
    document.addEventListener('visibilitychange', () => {
      this.player.playing = true;
      this.playerToggle();
    });
    
    console.log(this.MS);
  };
  
  _loadSynths() {
    this.channel = {
      master: new Tone.Gain(0.7),
      treb: new Tone.Gain(0.7),
      bass: new Tone.Gain(0.8),
    };
    this.fx = {
      distortion: new Tone.Distortion(0.8),
      reverb: new Tone.Freeverb(0.1, 3000),
      delay: new Tone.PingPongDelay('16n', 0.1),
    };
    this.synths = {
      treb: new Tone.PolySynth(1, Tone.SimpleAM),
      bass: new Tone.DuoSynth()
    };
    
    this.synths.bass.vibratoAmount.value = 0.1;
    this.synths.bass.harmonicity.value = 1.5;
    this.synths.bass.voice0.oscillator.type = 'triangle';
    this.synths.bass.voice0.envelope.attack = 0.05;
    this.synths.bass.voice1.oscillator.type = 'triangle';
    this.synths.bass.voice1.envelope.attack = 0.05;
    
    // fx mixes
    this.fx.distortion.wet.value = 0.2;
    this.fx.reverb.wet.value = 0.2;
    this.fx.delay.wet.value = 0.3;
    // gain levels
    this.channel.master.toMaster();
    this.channel.treb.connect(this.channel.master);
    this.channel.bass.connect(this.channel.master);
    // fx chains
    this.synths.treb.chain(this.fx.delay, this.fx.reverb, this.channel.treb);
    this.synths.bass.chain(this.fx.distortion, this.channel.bass);
  };
  
  _loadTransport() {
    this.playerUpdateBPM = (e) => {
      let el = e.target;
      let bpm = el.getAttribute('data-value');
      this.player.bpm = parseInt(bpm);
      Tone.Transport.bpm.value = this.player.bpm;
      this._utilClassToggle(e.target, 'bpm-current');
    };
    
    this.playerToggle = () => {
      if(this.player.playing) {
        Tone.Transport.pause();
        this.channel.master.gain.value = 0;
        this.play_toggle.classList.remove('active');
      } else {
        Tone.Transport.start();
        this.channel.master.gain.value = 1;
        this.play_toggle.classList.add('active');
      }
      this.player.playing = !this.player.playing;
    };
    
    this.play_toggle = document.createElement('button');
    this.play_toggle.innerHTML = `<span class="play">Play</span><span class="pause">Pause</span>`;
    this.aside.appendChild(this.play_toggle);
    this.play_toggle.addEventListener('touchstart', (e) => {
      Tone.startMobile();
    });
    this.play_toggle.addEventListener('click', (e) => {
      this.playerToggle();
    });
    

    Tone.Transport.bpm.value = this.player.bpm;
    Tone.Transport.scheduleRepeat((time) => {
      let curr_chord = this.player.chord_step % this.chord_count;
      
      let prev = document.querySelector('.chord > div.active');
      if(prev) prev.classList.remove('active');
      let curr = document.querySelector(`.chord > div:nth-of-type(${curr_chord + 1})`);
      if(curr) curr.classList.add('active');

      let chord = this.MS.notes[this.chords[curr_chord]];
      
      // finding the current note
      let notes = chord.triad.notes;
      for(let i = 0; i < Math.ceil(this.ap_steps / 3); i++) {
        notes = notes.concat(notes.map((n) => { return { note: n.note, rel_octave: n.rel_octave + (i + 1)}}));
      }
      let note = notes[this.arpeggio[this.player.step % this.arpeggio.length]];

      // setting bass notes
      let bass_o = chord.rel_octave + 2;
      let bass_1 = chord.note + bass_o;
      
      // slappin da bass
      if(!this.player.bass_on) {
        this.player.bass_on = true;
        this.synths.bass.triggerAttack(bass_1, time);
        this._utilActiveNoteClassToggle([bass_1.replace('#', 'is')], 'active-b');
      }
      
      // bump the step
      this.player.step++;
      
      // changing chords
      if(this.player.step % (this.arpeggio.length * this.player.arp_repeat) === 0) {
        this.player.chord_step++;
        this.player.bass_on = false;
        this.synths.bass.triggerRelease(time);
        this.player.triad_step++;
      }
      // arpin'
      let note_ref = `${note.note}${note.rel_octave + this.player.octave_base}`;
      this._utilActiveNoteClassToggle([note_ref.replace('#', 'is')], 'active-t');
      this.synths.treb.triggerAttackRelease(note_ref, '16n', time);
    }, '16n');
  };
  
  _drawKeyboard() {
    let octaves = [2,3,4,5,6,7];
    let keyboard = document.createElement('section');
    keyboard.classList.add('keyboard');
    this.container.appendChild(keyboard);
    octaves.forEach((octave) => {
      this.MS.dict.keys.forEach((key) => {
        let el = document.createElement('div');
        let classname = key.replace('#', 'is') + octave;
        el.classList.add(classname);
        keyboard.appendChild(el);
      });
    });
  };
  
  _drawOutput() {
    this.output = document.createElement('section');
    this.output.classList.add('output');
    this.aside.appendChild(this.output);
    this._updateOutput();
  };
  
  _updateOutput() {
    this.output.innerHTML = '';
    let title = document.createElement('h1');
    title.innerHTML = 'Output';
    this.output.appendChild(title);
    let description = document.createElement('h2');
    description.innerHTML = `${this.MS.key} ${this.MS._scale.name}`;
    this.output.appendChild(description);
    this.chords.forEach((chord) => {
      let note = this.MS.notes[chord];
      let el = document.createElement('span');
      el.innerHTML = `${note.note.replace('#', '<sup>♯</sup>')} <small>${note.triad.type}</small>`;
      this.output.appendChild(el);
    });
  };
    
  _loadBPMSelector() {
    let bpm_container = document.createElement('section');
    bpm_container.classList.add('bpm');
    this.aside.appendChild(bpm_container);
    let title = document.createElement('h1');
    title.innerHTML = 'Beats Per Minute';
    bpm_container.appendChild(title);
    
    [45,60,75,90,105,120,135,150].forEach((bpm) => {
      let el = document.createElement('div');
      el.setAttribute('data-value', bpm);
      if(bpm === this.player.bpm) el.classList.add('bpm-current');
      el.innerHTML = bpm;
      el.addEventListener('click', (e) => { this.playerUpdateBPM(e); });
      bpm_container.appendChild(el);
    });
  };
  
  _loadChordSelector() {
    this.chord_container = document.createElement('section');
    this.chord_container.classList.add('chord');
    this.container.appendChild(this.chord_container);
    let title = document.createElement('h1');
    title.innerHTML = 'Chord Progression';
    this.chord_container.appendChild(title);
    
    this.msUpdateChords = (e) => {
      let el = e.target;
      let chord = el.getAttribute('data-chord');
      let value = el.getAttribute('data-value');
      this.chords[parseInt(chord)] = value;
      this._utilClassToggle(e.target, `chord-${chord}-current`);
      this._updateOutput();
    };
    
    for(let c = 0; c < this.chord_count; c++) {
      let chord_el = document.createElement('div');
      this.MS.notes.forEach((note, i) => {
        let el = document.createElement('div');
        el.setAttribute('data-value', i);
        el.setAttribute('data-chord', c);
        if(i === this.chords[c]) el.classList.add(`chord-${c}-current`);
        el.innerHTML = 'i ii iii iv v vi vii'.split(' ')[i];
        el.addEventListener('click', (e) => { this.msUpdateChords(e); });
        chord_el.appendChild(el);
      });
      this.chord_container.appendChild(chord_el);
    }
    
    this._updateChords();
  };
  
  _updateChords() {
    this.MS.notes.forEach((note, i) => {
      let updates = document.querySelectorAll(`.chord div > div:nth-child(${i + 1})`);
      for(let u = 0; u < updates.length; u++) {
        updates[u].innerHTML = note.triad.interval;
      }
    });
  };
  
  _loadKeySelector() {
    let key_container = document.createElement('section');
    key_container.classList.add('keys');
    this.container.appendChild(key_container);
    let title = document.createElement('h1');
    title.innerHTML = 'Tonic / Root';
    key_container.appendChild(title);
    
    this.MS.dict.keys.forEach((key) => {
      let el = document.createElement('div');
      el.setAttribute('data-value', key);
      if(key === this.ms_key) el.classList.add('key-current');
      el.innerHTML = key;
      el.addEventListener('click', (e) => { this.msUpdateKey(e); });
      key_container.appendChild(el);
    });
  };
  
  _loadModeSelector() {
    let mode_container = document.createElement('section');
    mode_container.classList.add('modes');
    this.container.appendChild(mode_container);
    let title = document.createElement('h1');
    title.innerHTML = 'Mode';
    mode_container.appendChild(title);
    
    this.MS.dict.modes.forEach((mode) => {
      let el = document.createElement('div');
      el.setAttribute('data-value', mode);
      if(mode === this.ms_mode) el.classList.add('mode-current');
      el.innerHTML = mode;
      el.addEventListener('click', (e) => { this.msUpdateMode(e); });
      mode_container.appendChild(el);
    });
  };
  
  _loadTypeSelector() {
    let type_container = document.createElement('section');
    type_container.classList.add('type');
    this.container.appendChild(type_container);
    let title = document.createElement('h1');
    title.innerHTML = 'Arpeggio Type';
    type_container.appendChild(title);
    
    ['straight', 'looped'].forEach((step) => {
      let el = document.createElement('div');
      el.setAttribute('data-value', step);
      if(step === this.ap_pattern_type) el.classList.add('type-current');
      el.innerHTML = step;
      el.addEventListener('click', (e) => { this.apUpdatePatternType(e); });
      type_container.appendChild(el);
    });
  };
  
  _loadStepsSelector() {
    let steps_container = document.createElement('section');
    steps_container.classList.add('steps');
    this.container.appendChild(steps_container);
    let title = document.createElement('h1');
    title.innerHTML = 'Arpeggio Steps';
    steps_container.appendChild(title);
    
    [3,4,5,6].forEach((step) => {
      let el = document.createElement('div');
      el.setAttribute('data-value', step);
      if(step === this.ap_steps) el.classList.add('step-current');
      el.innerHTML = step;
      el.addEventListener('click', (e) => { this.apUpdateSteps(e); });
      steps_container.appendChild(el);
    });
  };
  
  _loadPatternSelector() {
    this.pattern_container = document.createElement('section');
    this.pattern_container.classList.add('patterns');
    this.container.appendChild(this.pattern_container);
    this._updatePatternSelector();
  };
  
  _updatePatternSelector() {
    this.pattern_container.innerHTML = '';
    // reset if the id is over
    this.ap_pattern_id = this.ap_pattern_id > this.AP.patterns[this.ap_pattern_type].length - 1 ? 0 : this.ap_pattern_id;
    this.arpeggio = this.AP.patterns[this.ap_pattern_type][this.ap_pattern_id];
    let title = document.createElement('h1');
    title.innerHTML = 'Arpeggio Style';
    this.pattern_container.appendChild(title);
    let patterns = this.AP.patterns[this.ap_pattern_type];
    [720, 120, 24, 6].forEach((count) => { this.pattern_container.classList.remove(`patterns-${count}`); });
    this.pattern_container.classList.add(`patterns-${patterns.length}`);
    patterns.forEach((pattern, i) => {
      let el = document.createElement('div');
      el.setAttribute('data-value', i);
      if(i === this.ap_pattern_id) el.classList.add('id-current');
      el.innerHTML = pattern.join('');
      el.appendChild(this._genPatternSvg(pattern));
      el.addEventListener('click', (e) => { this.apUpdatePatternId(e); });
      this.pattern_container.appendChild(el);
    });
  };
  
  _genPatternSvg(pattern) {
    let hi = Array.from(pattern).sort()[pattern.length - 1];
    let spacing = 2;
    let svgns = 'http://www.w3.org/2000/svg';
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let width = pattern.length * spacing + (spacing);
    let height = hi + (spacing * 2);
    svg.setAttribute('height', height);
    svg.setAttribute('width', width);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    let polyline = document.createElementNS(svgns, 'polyline');
    let points = [];
    let x = spacing;
    for(let i = 0; i < pattern.length; i++) {
      let y = height - pattern[i] - spacing;
      points.push(x + ',' + y);
      x += spacing;
    }
    polyline.setAttribute('points', points.join(' '));
    svg.appendChild(polyline);
    return svg;
  };
  
  _setMusicalScale() {
    this.MS = new MusicalScale({ key: this.ms_key, mode: this.ms_mode });
    this.msUpdateKey = (e) => {
      this._utilClassToggle(e.target, 'key-current');
      this.ms_key = e.target.getAttribute('data-value'); 
      this.msUpdateScale(); 
    };
    this.msUpdateMode = (e) => {
      this._utilClassToggle(e.target, 'mode-current');
      this.ms_mode = e.target.getAttribute('data-value');
      this.msUpdateScale();
      this._updateChords();
    };
    this.msUpdateScale = () => { 
      this.MS.updateScale({ key: this.ms_key, mode: this.ms_mode }); 
      this._updateOutput();
    };
  };
  
  _setArpeggioPatterns() {
    this.AP = new ArpeggioPatterns({ steps: this.ap_steps });
    this.apUpdateSteps = (e) => { 
      this._utilClassToggle(e.target, 'step-current');
      let steps = e.target.getAttribute('data-value'); 
      this.ap_steps = parseInt(steps); 
      this.AP.updatePatterns({ steps: steps }); 
      this.apUpdate(); 
      this._updatePatternSelector();
    };
    this.apUpdatePatternType = (e) => { 
      this._utilClassToggle(e.target, 'type-current');
      this.ap_pattern_type = e.target.getAttribute('data-value'); 
      this.apUpdate(); 
      this._updatePatternSelector();
    };
    this.apUpdatePatternId = (e) => { 
      this._utilClassToggle(e.target, 'id-current');
      this.ap_pattern_id = parseInt(e.target.getAttribute('data-value'));
      this.apUpdate(); 
    };
    this.apUpdate = () => { 
      this.arpeggio = this.AP.patterns[this.ap_pattern_type][this.ap_pattern_id]; 
    };
    this.apUpdate();
  };
  
  _utilClassToggle(el, classname) {
    let curr = document.querySelectorAll('.' + classname);
    for(let i = 0; i < curr.length; i++) curr[i].classList.remove(classname);
    el.classList.add(classname);
  };
  
  /**  
  utilActiveNoteClassToggle
  removes all classnames on existing, then adds to an array of note classes
  @param note_classes {Array} [A3, B4]
  @param classname {String} 'active-treble'
 */
  _utilActiveNoteClassToggle = (note_classes, classname) => {
    let removals = document.querySelectorAll(`.${classname}`);
    for(let r = 0; r < removals.length; r++) removals[r].classList.remove(classname);
    let adds = document.querySelectorAll(note_classes.map((n) => { return `.${n}`; }).join(', '));
    for(let a = 0; a < adds.length; a++) adds[a].classList.add(classname);
  };
}

let app = new ArpPlayer();