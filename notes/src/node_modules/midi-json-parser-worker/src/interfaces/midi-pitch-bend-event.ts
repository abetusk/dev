import { IMidiStatusEvent } from './midi-status-event';

export interface IMidiPitchBendEvent extends IMidiStatusEvent {
    pitchBend: number;
}
