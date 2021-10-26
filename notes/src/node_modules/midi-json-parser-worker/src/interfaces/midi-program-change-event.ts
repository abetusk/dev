import { IMidiStatusEvent } from './midi-status-event';

export interface IMidiProgramChangeEvent extends IMidiStatusEvent {
    programChange: {
        programNumber: number;
    };
}
