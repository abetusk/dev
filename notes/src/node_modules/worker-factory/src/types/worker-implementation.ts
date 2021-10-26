import { IWorkerDefinition } from '../interfaces';
import { TMessageReceiver } from './message-receiver';

export type TWorkerImplementation<T extends IWorkerDefinition> = {
    [P in keyof T]: TMessageReceiver<T[P]>;
};
