import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiMidiPortEvent extends IMidiMetaEvent {
    midiPort: number;
}
