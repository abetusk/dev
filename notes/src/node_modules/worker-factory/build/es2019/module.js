import { createMessageHandler } from './helpers/create-message-handler';
import { extendWorkerImplementation } from './helpers/extend-worker-implementation';
import { isSupportingTransferables } from './helpers/is-supporting-transferables';
/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';
export const createWorker = (receiver, workerImplementation, isSupportedFunction = () => true) => {
    const fullWorkerImplementation = extendWorkerImplementation(createWorker, workerImplementation, isSupportedFunction);
    const messageHandler = createMessageHandler(receiver, fullWorkerImplementation);
    receiver.addEventListener('message', messageHandler);
    return () => receiver.removeEventListener('message', messageHandler);
};
export { isSupportingTransferables as isSupported };
//# sourceMappingURL=module.js.map