import { generateUniqueNumber } from 'fast-unique-numbers';
import { isMessagePort } from './guards/message-port';
import { extendBrokerImplementation } from './helpers/extend-broker-implementation';
/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';
const ONGOING_REQUESTS = new WeakMap();
const createOrGetOngoingRequests = (sender) => {
    if (ONGOING_REQUESTS.has(sender)) {
        // @todo TypeScript needs to be convinced that has() works as expected.
        return ONGOING_REQUESTS.get(sender);
    }
    const ongoingRequests = new Map();
    ONGOING_REQUESTS.set(sender, ongoingRequests);
    return ongoingRequests;
};
export const createBroker = (brokerImplementation) => {
    const fullBrokerImplementation = extendBrokerImplementation(brokerImplementation);
    return (sender) => {
        const ongoingRequests = createOrGetOngoingRequests(sender);
        sender.addEventListener('message', (({ data: message }) => {
            const { id } = message;
            if (id !== null && ongoingRequests.has(id)) {
                const { reject, resolve } = ongoingRequests.get(id);
                ongoingRequests.delete(id);
                if (message.error === undefined) {
                    resolve(message.result);
                }
                else {
                    reject(new Error(message.error.message));
                }
            }
        }));
        if (isMessagePort(sender)) {
            sender.start();
        }
        const call = (method, params = null, transferables = []) => {
            return new Promise((resolve, reject) => {
                const id = generateUniqueNumber(ongoingRequests);
                ongoingRequests.set(id, { reject, resolve });
                if (params === null) {
                    sender.postMessage({ id, method }, transferables);
                }
                else {
                    sender.postMessage({ id, method, params }, transferables);
                }
            });
        };
        const notify = (method, params, transferables = []) => {
            sender.postMessage({ id: null, method, params }, transferables);
        };
        let functions = {};
        for (const [key, handler] of Object.entries(fullBrokerImplementation)) {
            functions = { ...functions, [key]: handler({ call, notify }) };
        }
        return { ...functions };
    };
};
//# sourceMappingURL=module.js.map