import { IWorkerDefinition } from 'worker-factory';
import { IMidiFile } from './midi-file';

export interface IMidiJsonParserWorkerCustomDefinition extends IWorkerDefinition {
    parse: {
        params: {
            arrayBuffer: ArrayBuffer;
        };

        response: {
            result: IMidiFile;
        };
    };
}
