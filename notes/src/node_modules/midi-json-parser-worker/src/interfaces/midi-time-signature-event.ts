import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiTimeSignatureEvent extends IMidiMetaEvent {
    timeSignature: {
        denominator: number;

        metronome: number;

        numerator: number;

        thirtyseconds: number;
    };
}
