import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiEndOfTrackEvent extends IMidiMetaEvent {
    endOfTrack: boolean;
}
