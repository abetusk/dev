import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiMarkerEvent extends IMidiMetaEvent {
    marker: string;
}
