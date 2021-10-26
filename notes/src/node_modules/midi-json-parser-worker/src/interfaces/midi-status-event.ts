import { IValueMap } from 'worker-factory';

export interface IMidiStatusEvent extends IValueMap {
    channel: number;

    delta: number;
}
