import { generateUniqueNumber } from 'fast-unique-numbers';
import { IDefaultWorkerDefinition, IReceiver, IWorkerDefinition } from '../interfaces';
import { TDestroyWorkerFunction, TWorkerImplementation } from '../types';
import { renderUnknownPortIdError } from './error-renderers';
import { isSupportingTransferables } from './is-supporting-transferables';

const DESTROY_WORKER_FUNCTIONS: Map<number, TDestroyWorkerFunction> = new Map();

export const extendWorkerImplementation = <T extends IWorkerDefinition>(
    createWorker: (receiver: IReceiver, workerImplementation: TWorkerImplementation<T>) => TDestroyWorkerFunction,
    partialWorkerImplementation: TWorkerImplementation<T>,
    isSupportedFunction: () => boolean | Promise<boolean>
): TWorkerImplementation<T> & TWorkerImplementation<IDefaultWorkerDefinition> => ({
    ...partialWorkerImplementation,
    connect: ({ port }) => {
        port.start();

        const destroyWorker = createWorker(port, partialWorkerImplementation);
        const portId = generateUniqueNumber(DESTROY_WORKER_FUNCTIONS);

        DESTROY_WORKER_FUNCTIONS.set(portId, () => {
            destroyWorker();
            port.close();
            DESTROY_WORKER_FUNCTIONS.delete(portId);
        });

        return { result: portId };
    },
    disconnect: ({ portId }) => {
        const destroyWorker = DESTROY_WORKER_FUNCTIONS.get(portId);

        if (destroyWorker === undefined) {
            throw renderUnknownPortIdError({ portId: portId.toString() });
        }

        destroyWorker();

        return { result: null };
    },
    isSupported: async () => {
        const isSelfSupported = await isSupportingTransferables();

        if (isSelfSupported) {
            const result = isSupportedFunction();
            const synchronousResult = result instanceof Promise ? await result : result;

            return { result: synchronousResult };
        }

        return { result: false };
    }
});
