import { IMidiStatusEvent } from './midi-status-event';

export interface IMidiSysexEvent extends IMidiStatusEvent {
    sysex: string;
}
