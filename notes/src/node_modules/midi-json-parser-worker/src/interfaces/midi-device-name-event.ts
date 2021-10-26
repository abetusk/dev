import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiDeviceNameEvent extends IMidiMetaEvent {
    deviceName: string;
}
