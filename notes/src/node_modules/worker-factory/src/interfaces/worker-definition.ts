import { TMessage } from '../types';

export interface IWorkerDefinition {
    [method: string]: TMessage;
}
