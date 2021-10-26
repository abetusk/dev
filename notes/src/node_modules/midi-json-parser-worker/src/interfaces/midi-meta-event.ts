import { IValueMap } from 'worker-factory';

export interface IMidiMetaEvent extends IValueMap {
    delta: number;
}
