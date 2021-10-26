import { IDefaultBrokerDefinition } from 'broker-factory';
import { IMidiJsonParserBrokerDefinition } from '../interfaces';

export type TMidiJsonParserBrokerLoader = (url: string) => IMidiJsonParserBrokerDefinition & IDefaultBrokerDefinition;
