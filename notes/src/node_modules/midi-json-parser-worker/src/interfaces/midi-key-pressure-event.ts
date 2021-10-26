import { IMidiStatusEvent } from './midi-status-event';

export interface IMidiKeyPressureEvent extends IMidiStatusEvent {
    keyPressure: {
        pressure: number;
    };
}
