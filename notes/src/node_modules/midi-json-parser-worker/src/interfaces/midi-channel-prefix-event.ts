import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiChannelPrefixEvent extends IMidiMetaEvent {
    channelPrefix: number;
}
