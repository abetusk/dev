import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiCopyrightNoticeEvent extends IMidiMetaEvent {
    copyrightNotice: string;
}
