import {
    IMidiChannelPressureEvent,
    IMidiControlChangeEvent,
    IMidiKeyPressureEvent,
    IMidiNoteOffEvent,
    IMidiNoteOnEvent,
    IMidiPitchBendEvent,
    IMidiProgramChangeEvent,
    IMidiSysexEvent
} from '../interfaces';

export type TMidiStatusEvent =
    | IMidiChannelPressureEvent
    | IMidiControlChangeEvent
    | IMidiKeyPressureEvent
    | IMidiNoteOffEvent
    | IMidiNoteOnEvent
    | IMidiPitchBendEvent
    | IMidiProgramChangeEvent
    | IMidiSysexEvent;
