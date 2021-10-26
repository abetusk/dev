import { TWorkerImplementation, createWorker } from 'worker-factory';
import { IMidiJsonParserWorkerCustomDefinition } from './interfaces';
import { parseArrayBuffer } from './midi-file-parser';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

createWorker<IMidiJsonParserWorkerCustomDefinition>(self, <TWorkerImplementation<IMidiJsonParserWorkerCustomDefinition>>{
    parse: ({ arrayBuffer }) => {
        const midiFile = parseArrayBuffer(arrayBuffer);

        return { result: midiFile };
    }
});
