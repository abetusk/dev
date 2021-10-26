import { createBroker } from 'broker-factory';
import { IMidiFile, TMidiJsonParserWorkerDefinition } from 'midi-json-parser-worker';
import { IMidiJsonParserBrokerDefinition } from './interfaces';
import { TMidiJsonParserBrokerLoader, TMidiJsonParserBrokerWrapper } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

export const wrap: TMidiJsonParserBrokerWrapper = createBroker<IMidiJsonParserBrokerDefinition, TMidiJsonParserWorkerDefinition>({
    parseArrayBuffer: ({ call }) => {
        return async (arrayBuffer: ArrayBuffer): Promise<IMidiFile> => {
            return call('parse', { arrayBuffer }, [arrayBuffer]);
        };
    }
});

export const load: TMidiJsonParserBrokerLoader = (url: string) => {
    const worker = new Worker(url);

    return wrap(worker);
};
