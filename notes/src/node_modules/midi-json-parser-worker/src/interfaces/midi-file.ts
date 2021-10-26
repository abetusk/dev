import { IValueMap } from 'worker-factory';
import { TMidiEvent } from '../types';

export interface IMidiFile extends IValueMap {
    division: number;

    format: number;

    tracks: TMidiEvent[][];
}
