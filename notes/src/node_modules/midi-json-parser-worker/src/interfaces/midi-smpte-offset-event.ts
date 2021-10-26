import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiSmpteOffsetEvent extends IMidiMetaEvent {
    smpteOffset: {
        frame: number;

        frameRate: number;

        hour: number;

        minutes: number;

        seconds: number;

        subFrame: number;
    };
}
