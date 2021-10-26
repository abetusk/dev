import { IDefaultWorkerDefinition, IWorkerDefinition } from '../interfaces';

export type TWorkerDefinition<T extends IWorkerDefinition> = T & IDefaultWorkerDefinition;
