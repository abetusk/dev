import { IMidiStatusEvent } from './midi-status-event';

export interface IMidiChannelPressureEvent extends IMidiStatusEvent {
    channelPressure: {
        noteNumber: number;

        pressure: number;
    };
}
