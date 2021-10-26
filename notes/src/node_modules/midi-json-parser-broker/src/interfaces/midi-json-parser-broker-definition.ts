import { IBrokerDefinition } from 'broker-factory';
import { IMidiFile } from 'midi-json-parser-worker';

export interface IMidiJsonParserBrokerDefinition extends IBrokerDefinition {
    parseArrayBuffer(arrayBuffer: ArrayBuffer): Promise<IMidiFile>;
}
