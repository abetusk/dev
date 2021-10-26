import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiTextEvent extends IMidiMetaEvent {
    text: string;
}
