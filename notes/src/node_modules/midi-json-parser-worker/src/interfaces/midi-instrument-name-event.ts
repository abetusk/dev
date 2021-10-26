import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiInstrumentNameEvent extends IMidiMetaEvent {
    instrumentName: string;
}
