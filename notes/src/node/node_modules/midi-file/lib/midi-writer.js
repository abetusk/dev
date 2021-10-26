// data should be the same type of format returned by parseMidi
// for maximum compatibililty, returns an array of byte values, suitable for conversion to Buffer, Uint8Array, etc.

// opts:
// - running              reuse previous eventTypeByte when possible, to compress file
// - useByte9ForNoteOff   use 0x09 for noteOff when velocity is zero

function writeMidi(data, opts) {
  if (typeof data !== 'object')
    throw 'Invalid MIDI data'

  opts = opts || {}

  var header = data.header || {}
  var tracks = data.tracks || []
  var i, len = tracks.length

  var w = new Writer()
  writeHeader(w, header, len)

  for (i=0; i < len; i++) {
    writeTrack(w, tracks[i], opts)
  }

  return w.buffer
}

function writeHeader(w, header, numTracks) {
  var format = header.format == null ? 1 : header.format

  var timeDivision = 128
  if (header.timeDivision) {
    timeDivision = header.timeDivision
  } else if (header.ticksPerFrame && header.framesPerSecond) {
    timeDivision = (-(header.framesPerSecond & 0xFF) << 8) | (header.ticksPerFrame & 0xFF)
  } else if (header.ticksPerBeat) {
    timeDivision = header.ticksPerBeat & 0x7FFF
  }

  var h = new Writer()
  h.writeUInt16(format)
  h.writeUInt16(numTracks)
  h.writeUInt16(timeDivision)

  w.writeChunk('MThd', h.buffer)
}

function writeTrack(w, track, opts) {
  var t = new Writer()
  var i, len = track.length
  var eventTypeByte = null
  for (i=0; i < len; i++) {
    // Reuse last eventTypeByte when opts.running is set, or event.running is explicitly set on it.
    // parseMidi will set event.running for each event, so that we can get an exact copy by default.
    // Explicitly set opts.running to false, to override event.running and never reuse last eventTypeByte.
    if (opts.running === false || !opts.running && !track[i].running) eventTypeByte = null

    eventTypeByte = writeEvent(t, track[i], eventTypeByte, opts.useByte9ForNoteOff)
  }
  w.writeChunk('MTrk', t.buffer)
}

function writeEvent(w, event, lastEventTypeByte, useByte9ForNoteOff) {
  var type = event.type
  var deltaTime = event.deltaTime
  var text = event.text || ''
  var data = event.data || []
  var eventTypeByte = null
  w.writeVarInt(deltaTime)

  switch (type) {
    // meta events
    case 'sequenceNumber':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x00)
      w.writeVarInt(2)
      w.writeUInt16(event.number)
      break;

    case 'text':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x01)
      w.writeVarInt(text.length)
      w.writeString(text)
      break;

    case 'copyrightNotice':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x02)
      w.writeVarInt(text.length)
      w.writeString(text)
      break;

    case 'trackName':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x03)
      w.writeVarInt(text.length)
      w.writeString(text)
      break;

    case 'instrumentName':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x04)
      w.writeVarInt(text.length)
      w.writeString(text)
      break;

    case 'lyrics':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x05)
      w.writeVarInt(text.length)
      w.writeString(text)
      break;

    case 'marker':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x06)
      w.writeVarInt(text.length)
      w.writeString(text)
      break;

    case 'cuePoint':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x07)
      w.writeVarInt(text.length)
      w.writeString(text)
      break;

    case 'channelPrefix':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x20)
      w.writeVarInt(1)
      w.writeUInt8(event.channel)
      break;

    case 'portPrefix':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x21)
      w.writeVarInt(1)
      w.writeUInt8(event.port)
      break;

    case 'endOfTrack':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x2F)
      w.writeVarInt(0)
      break;

    case 'setTempo':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x51)
      w.writeVarInt(3)
      w.writeUInt24(event.microsecondsPerBeat)
      break;

    case 'smpteOffset':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x54)
      w.writeVarInt(5)
      var FRAME_RATES = { 24: 0x00, 25: 0x20, 29: 0x40, 30: 0x60 }
      var hourByte = (event.hour & 0x1F) | FRAME_RATES[event.frameRate]
      w.writeUInt8(hourByte)
      w.writeUInt8(event.min)
      w.writeUInt8(event.sec)
      w.writeUInt8(event.frame)
      w.writeUInt8(event.subFrame)
      break;

    case 'timeSignature':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x58)
      w.writeVarInt(4)
      w.writeUInt8(event.numerator)
      var denominator = Math.floor((Math.log(event.denominator) / Math.LN2)) & 0xFF
      w.writeUInt8(denominator)
      w.writeUInt8(event.metronome)
      w.writeUInt8(event.thirtyseconds || 8)
      break;

    case 'keySignature':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x59)
      w.writeVarInt(2)
      w.writeInt8(event.key)
      w.writeUInt8(event.scale)
      break;

    case 'sequencerSpecific':
      w.writeUInt8(0xFF)
      w.writeUInt8(0x7F)
      w.writeVarInt(data.length)
      w.writeBytes(data)
      break;

    case 'unknownMeta':
      if (event.metatypeByte != null) {
        w.writeUInt8(0xFF)
        w.writeUInt8(event.metatypeByte)
        w.writeVarInt(data.length)
        w.writeBytes(data)
      }
      break;

    // system-exclusive
    case 'sysEx':
      w.writeUInt8(0xF0)
      w.writeVarInt(data.length)
      w.writeBytes(data)
      break;

    case 'endSysEx':
      w.writeUInt8(0xF7)
      w.writeVarInt(data.length)
      w.writeBytes(data)
      break;

    // channel events
    case 'noteOff':
      // Use 0x90 when opts.useByte9ForNoteOff is set and velocity is zero, or when event.byte9 is explicitly set on it.
      // parseMidi will set event.byte9 for each event, so that we can get an exact copy by default.
      // Explicitly set opts.useByte9ForNoteOff to false, to override event.byte9 and always use 0x80 for noteOff events.
      var noteByte = ((useByte9ForNoteOff !== false && event.byte9) || (useByte9ForNoteOff && event.velocity == 0)) ? 0x90 : 0x80

      eventTypeByte = noteByte | event.channel
      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)
      w.writeUInt8(event.noteNumber)
      w.writeUInt8(event.velocity)
      break;

    case 'noteOn':
      eventTypeByte = 0x90 | event.channel
      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)
      w.writeUInt8(event.noteNumber)
      w.writeUInt8(event.velocity)
      break;

    case 'noteAftertouch':
      eventTypeByte = 0xA0 | event.channel
      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)
      w.writeUInt8(event.noteNumber)
      w.writeUInt8(event.amount)
      break;

    case 'controller':
      eventTypeByte = 0xB0 | event.channel
      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)
      w.writeUInt8(event.controllerType)
      w.writeUInt8(event.value)
      break;

    case 'programChange':
      eventTypeByte = 0xC0 | event.channel
      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)
      w.writeUInt8(event.programNumber)
      break;

    case 'channelAftertouch':
      eventTypeByte = 0xD0 | event.channel
      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)
      w.writeUInt8(event.amount)
      break;

    case 'pitchBend':
      eventTypeByte = 0xE0 | event.channel
      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)
      var value14 = 0x2000 + event.value
      var lsb14 = (value14 & 0x7F)
      var msb14 = (value14 >> 7) & 0x7F
      w.writeUInt8(lsb14)
      w.writeUInt8(msb14)
    break;

    default:
      throw 'Unrecognized event type: ' + type
  }
  return eventTypeByte
}


function Writer() {
  this.buffer = []
}

Writer.prototype.writeUInt8 = function(v) {
  this.buffer.push(v & 0xFF)
}
Writer.prototype.writeInt8 = Writer.prototype.writeUInt8

Writer.prototype.writeUInt16 = function(v) {
  var b0 = (v >> 8) & 0xFF,
      b1 = v & 0xFF

  this.writeUInt8(b0)
  this.writeUInt8(b1)
}
Writer.prototype.writeInt16 = Writer.prototype.writeUInt16

Writer.prototype.writeUInt24 = function(v) {
  var b0 = (v >> 16) & 0xFF,
      b1 = (v >> 8) & 0xFF,
      b2 = v & 0xFF

  this.writeUInt8(b0)
  this.writeUInt8(b1)
  this.writeUInt8(b2)
}
Writer.prototype.writeInt24 = Writer.prototype.writeUInt24

Writer.prototype.writeUInt32 = function(v) {
  var b0 = (v >> 24) & 0xFF,
      b1 = (v >> 16) & 0xFF,
      b2 = (v >> 8) & 0xFF,
      b3 = v & 0xFF

  this.writeUInt8(b0)
  this.writeUInt8(b1)
  this.writeUInt8(b2)
  this.writeUInt8(b3)
}
Writer.prototype.writeInt32 = Writer.prototype.writeUInt32


Writer.prototype.writeBytes = function(arr) {
  this.buffer = this.buffer.concat(Array.prototype.slice.call(arr, 0))
}

Writer.prototype.writeString = function(str) {
  var i, len = str.length, arr = []
  for (i=0; i < len; i++) {
    arr.push(str.codePointAt(i))
  }
  this.writeBytes(arr)
}

Writer.prototype.writeVarInt = function(v) {
  if (v < 0) throw "Cannot write negative variable-length integer"

  if (v <= 0x7F) {
    this.writeUInt8(v)
  } else {
    var i = v
    var bytes = []
    bytes.push(i & 0x7F)
    i >>= 7
    while (i) {
      var b = i & 0x7F | 0x80
      bytes.push(b)
      i >>= 7
    }
    this.writeBytes(bytes.reverse())
  }
}

Writer.prototype.writeChunk = function(id, data) {
  this.writeString(id)
  this.writeUInt32(data.length)
  this.writeBytes(data)
}

module.exports = writeMidi
