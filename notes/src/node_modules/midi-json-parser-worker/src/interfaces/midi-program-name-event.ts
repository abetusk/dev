import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiProgramNameEvent extends IMidiMetaEvent {
    programName: string;
}
