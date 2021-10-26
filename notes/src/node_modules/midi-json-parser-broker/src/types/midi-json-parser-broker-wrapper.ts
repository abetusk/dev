import { IDefaultBrokerDefinition } from 'broker-factory';
import { IMidiJsonParserBrokerDefinition } from '../interfaces';

export type TMidiJsonParserBrokerWrapper = (sender: MessagePort | Worker) => IMidiJsonParserBrokerDefinition & IDefaultBrokerDefinition;
