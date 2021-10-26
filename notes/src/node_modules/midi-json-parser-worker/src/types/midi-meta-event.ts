import {
    IMidiChannelPrefixEvent,
    IMidiCopyrightNoticeEvent,
    IMidiDeviceNameEvent,
    IMidiEndOfTrackEvent,
    IMidiInstrumentNameEvent,
    IMidiKeySignatureEvent,
    IMidiLyricEvent,
    IMidiMarkerEvent,
    IMidiMidiPortEvent,
    IMidiProgramNameEvent,
    IMidiSequencerSpecificEvent,
    IMidiSetTempoEvent,
    IMidiSmpteOffsetEvent,
    IMidiTextEvent,
    IMidiTimeSignatureEvent,
    IMidiTrackNameEvent,
    IMidiUnknownTextEvent
} from '../interfaces';

export type TMidiMetaEvent =
    | IMidiChannelPrefixEvent
    | IMidiCopyrightNoticeEvent
    | IMidiDeviceNameEvent
    | IMidiEndOfTrackEvent
    | IMidiInstrumentNameEvent
    | IMidiKeySignatureEvent
    | IMidiLyricEvent
    | IMidiMarkerEvent
    | IMidiMidiPortEvent
    | IMidiProgramNameEvent
    | IMidiSequencerSpecificEvent
    | IMidiSetTempoEvent
    | IMidiSmpteOffsetEvent
    | IMidiTextEvent
    | IMidiTimeSignatureEvent
    | IMidiTrackNameEvent
    | IMidiUnknownTextEvent;
