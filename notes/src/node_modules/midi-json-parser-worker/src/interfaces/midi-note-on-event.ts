import { IMidiStatusEvent } from './midi-status-event';

export interface IMidiNoteOnEvent extends IMidiStatusEvent {
    noteOn: {
        noteNumber: number;

        velocity: number;
    };
}
