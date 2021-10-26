import { TWorkerMessage } from 'worker-factory';

export interface IWorkerEvent extends Event {
    data: TWorkerMessage;
}
