import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiSequencerSpecificEvent extends IMidiMetaEvent {
    sequencerSpecificData: string;
}
