import { IMidiStatusEvent } from './midi-status-event';

export interface IMidiNoteOffEvent extends IMidiStatusEvent {
    noteOff: {
        noteNumber: number;

        velocity: number;
    };
}
