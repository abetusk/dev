import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiTrackNameEvent extends IMidiMetaEvent {
    trackName: string;
}
