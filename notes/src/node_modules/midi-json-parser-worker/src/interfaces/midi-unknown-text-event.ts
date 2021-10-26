import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiUnknownTextEvent extends IMidiMetaEvent {
    metaTypeByte: '0A' | '0B' | '0C' | '0D' | '0E' | '0F';

    text: string;
}
