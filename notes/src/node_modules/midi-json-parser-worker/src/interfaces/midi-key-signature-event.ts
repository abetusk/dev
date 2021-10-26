import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiKeySignatureEvent extends IMidiMetaEvent {
    keySignature: {
        key: number;

        scale: number;
    };
}
