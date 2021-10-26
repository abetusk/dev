import { IWorkerDefinition } from 'worker-factory';
import { IBrokerActions, IBrokerDefinition } from '../interfaces';

export type TBrokerImplementation<T extends IBrokerDefinition, U extends IWorkerDefinition> = {
    [P in keyof T]: (actions: IBrokerActions<U>) => T[P];
};
