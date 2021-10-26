import { generateUniqueNumber } from 'fast-unique-numbers';
import { IWorkerDefinition, IWorkerErrorMessage, IWorkerResultMessage } from 'worker-factory';
import { isMessagePort } from './guards/message-port';
import { extendBrokerImplementation } from './helpers/extend-broker-implementation';
import { IBrokerDefinition, IDefaultBrokerDefinition, IWorkerEvent } from './interfaces';
import { TBrokerImplementation } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const ONGOING_REQUESTS = new WeakMap<MessagePort | Worker, Map<number, { reject: Function; resolve: Function }>>();

const createOrGetOngoingRequests = (sender: MessagePort | Worker): Map<number, { reject: Function; resolve: Function }> => {
    if (ONGOING_REQUESTS.has(sender)) {
        // @todo TypeScript needs to be convinced that has() works as expected.
        return <Map<number, { reject: Function; resolve: Function }>>ONGOING_REQUESTS.get(sender);
    }

    const ongoingRequests: Map<number, { reject: Function; resolve: Function }> = new Map();

    ONGOING_REQUESTS.set(sender, ongoingRequests);

    return ongoingRequests;
};

export const createBroker = <T extends IBrokerDefinition, U extends IWorkerDefinition>(
    brokerImplementation: TBrokerImplementation<T, U>
): ((sender: MessagePort | Worker) => T & IDefaultBrokerDefinition) => {
    const fullBrokerImplementation = extendBrokerImplementation(brokerImplementation);

    return (sender: MessagePort | Worker) => {
        const ongoingRequests = createOrGetOngoingRequests(sender);

        sender.addEventListener('message', <EventListener>(({ data: message }: IWorkerEvent) => {
            const { id } = message;

            if (id !== null && ongoingRequests.has(id)) {
                const { reject, resolve } = <{ reject: Function; resolve: Function }>ongoingRequests.get(id);

                ongoingRequests.delete(id);

                if ((<IWorkerErrorMessage>message).error === undefined) {
                    resolve((<IWorkerResultMessage>message).result);
                } else {
                    reject(new Error((<IWorkerErrorMessage>message).error.message));
                }
            }
        }));

        if (isMessagePort(sender)) {
            sender.start();
        }

        const call = <V extends keyof U>(method: V, params: U[V]['params'] = null, transferables: U[V]['transferables'] = []) => {
            return new Promise<U[V]['response']['result']>((resolve, reject) => {
                const id = generateUniqueNumber(ongoingRequests);

                ongoingRequests.set(id, { reject, resolve });

                if (params === null) {
                    sender.postMessage({ id, method }, <Transferable[]>transferables);
                } else {
                    sender.postMessage({ id, method, params }, <Transferable[]>transferables);
                }
            });
        };
        const notify = <V extends keyof U>(method: V, params: U[V]['params'], transferables: U[V]['transferables'] = []) => {
            sender.postMessage({ id: null, method, params }, <Transferable[]>transferables);
        };

        let functions: object = {};

        for (const [key, handler] of Object.entries(fullBrokerImplementation)) {
            functions = { ...functions, [key]: handler({ call, notify }) };
        }

        return <T & IDefaultBrokerDefinition>{ ...functions };
    };
};
