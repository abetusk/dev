import { IMidiStatusEvent } from './midi-status-event';

export interface IMidiControlChangeEvent extends IMidiStatusEvent {
    controlChange: {
        type: number;

        value: number;
    };
}
