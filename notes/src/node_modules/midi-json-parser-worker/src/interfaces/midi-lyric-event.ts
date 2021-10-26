import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiLyricEvent extends IMidiMetaEvent {
    lyric: string;
}
