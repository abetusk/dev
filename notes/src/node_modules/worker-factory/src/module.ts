import { createMessageHandler } from './helpers/create-message-handler';
import { extendWorkerImplementation } from './helpers/extend-worker-implementation';
import { isSupportingTransferables } from './helpers/is-supporting-transferables';
import { IReceiver, IWorkerDefinition } from './interfaces';
import { TDestroyWorkerFunction, TWorkerImplementation } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

export const createWorker = <T extends IWorkerDefinition>(
    receiver: IReceiver,
    workerImplementation: TWorkerImplementation<T>,
    isSupportedFunction: () => boolean | Promise<boolean> = () => true
): TDestroyWorkerFunction => {
    const fullWorkerImplementation = extendWorkerImplementation<T>(createWorker, workerImplementation, isSupportedFunction);
    const messageHandler = createMessageHandler(receiver, fullWorkerImplementation);

    receiver.addEventListener('message', messageHandler);

    return () => receiver.removeEventListener('message', messageHandler);
};

export { isSupportingTransferables as isSupported };
