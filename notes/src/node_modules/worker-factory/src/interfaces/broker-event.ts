import { IBrokerMessage } from './broker-message';
import { IWorkerDefinition } from './worker-definition';

export interface IBrokerEvent<T extends IWorkerDefinition> extends Event {
    data: IBrokerMessage<T>;
}
